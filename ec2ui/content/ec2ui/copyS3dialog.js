var ec2ui_S3_KeyCopier = {
    session : null,
    srcKeys : null,
    params : null,
    fContinue : true,
    // The Total number of copy requests issued.
    // This can be different from the total # keys
    // to be copied if the user hit CANCEL

    // The total # of keys to be migrated
    totalKeys : 0,

    // The # of keys that were successfully migrated
    // The new AMI is registered only if the
    // # of keys == # of keys successfully migrated
    totalCopyComplete : 0,
    nextIdx : 0,
    xmlhttps : null,
    output : null,

    getProgressMeter : function() {
        if (document)
            return document.getElementById("ec2ui.copy.S3.progress");
    },

    getProgressOutput : function() {
        if (document)
            return document.getElementById("ec2ui.copy.S3.output");
    },

    logOutput : function(out) {
        var output = this.getProgressOutput();
        output.appendItem(out);
        output.ensureIndexIsVisible(output.getRowCount());
    },

    getCurrentOperation : function() {
        if (document)
            return document.getElementById("ec2ui.copy.S3.current");
    },

    indicateBusy : function(fShow) {
        if (fShow) {
            document.getElementById("ec2ui.dialog.copy.S3.keys").setAttribute("wait-cursor", true);
        } else {
            document.getElementById("ec2ui.dialog.copy.S3.keys").removeAttribute("wait-cursor");
        }
    },

    cancelTransfer : function() {
        var ret = true;
        // Cancel can be called:
        // 1. Prior to any copy requests being made
        // Or, 2. it can be called during the copy
        // Or, 3. it can be called after all the copies have been issued

        if (this.fContinue) {
            ret = confirm("Are you sure you want to cancel the AMI migration?");
            this.fContinue = !ret;
            this.params.ok = this.fContinue;
        }

        this.indicateBusy(this.fContinue);

        // Finish the migration of the image
        this.params.caller.finishMigration(this.params);
        return ret;
    },

    startMigration : function() {
        var params = this.params;
        var fDismiss = false;
        var currentOp = this.getCurrentOperation();
        var controller = this.session.controller;

        // Show the busy cursor
        this.indicateBusy(true);

        // Let's migrate this AMI
        // Create the bucket if it doesn't exist.
        currentOp.value = "Creating Destination Bucket: " + params.destB;
        if (controller.createS3Bucket(params.destB, params.region)) {
            // Get the created bucket's location
            this.logOutput(params.destB + ": Destination Bucket created");
            var bucketRegion = controller.getS3BucketLocation(params.destB);
            this.logOutput(
                params.destB + " - destination bucket's region is: " + bucketRegion
                );

            if (bucketRegion == params.region) {
                currentOp.value = "Retrieving Source Bucket ACLs";
                // Get the ACLs for the source bucket
                var acl = controller.getS3ACL(params.sourceB);
                this.logOutput("Source ACLs Retrieved");
                currentOp.value = "Setting ACLs on Destination Bucket";
                // Set the ACL on the destination bucket
                if (controller.setS3ACL(params.destB, "", bucketRegion, acl)) {
                    this.logOutput("Destination Bucket ACL set");
                } else {
                    this.logOutput("Could not set ACL on Destination Bucket");
                }

                currentOp.value = "Determining files/parts to Migrate...";
                // Enumerate the items with prefix from source bucket
                this.srcKeys = controller.getS3KeyListWithPrefixInBucket(params.prefix,
                                                                         params.sourceB);

                if (this.srcKeys == null) {
                    fDismiss = true;
                    this.logOutput("Could not get list of files to migrate");;
                    alert ("ERROR: Access denied to list AMI parts. You can only migrate an AMI that you created.");
                } else if (this.srcKeys.length == 0) {
                    fDismiss = true;
                    alert ("No keys to migrate. Aborting!");
                } else {
                    this.totalKeys = this.srcKeys.length;
                    this.logOutput("Number of items to migrate: " + this.totalKeys);
                    this.logOutput("Migrating Items with Prefix: " + params.prefix);
                    this.logOutput("Hit Cancel to stop.");
                    currentOp.value = "Migrating Files to Destination Bucket...";

                    // Copy the keys
                    this.seedKeyMigration();
                }
            } else {
                alert ("ERROR: The bucket could not be created in the region you specificied.");
                fDismiss = true;
            }
        } else {
            this.logOutput("Could not create Bucket: " + params.destB);
            alert("ERROR: Could not create Destination Bucket: " + params.destB);
            fDismiss = true;
        }

        if (fDismiss) {
            this.fContinue = false;
            this.params.ok = false;
            this.cancelDialog();
        }
    },

    applySourceACLOnKeys : function(keysD) {
        var params = this.params;
        var controller = this.session.controller;
        var progressMet = this.getProgressMeter();
        var step = this.xmlhttps.length;

        this.getCurrentOperation().value = "Applying Source ACL on Migrated items...";
        progressMet.value = 50;

        // Since the key names are the same,
        // we can get away with using keysD
        var acl = controller.getS3ACL(params.sourceB, keysD[0]);
        var keyCount = keysD.length;

        // Apply the source ACL on the dest object
        var curr = 0;
        while (curr < keyCount && this.fContinue) {
            if (!acl) {
                this.logOutput("ERROR: the Source ACL couldn't be retrieved!");
                break;
            } else {
                // Reuse existing xmlhttp connections
                for (var j = 0; j < step; ++j) {
                    sleep(10);
                    if (!controller.setS3ACL(params.destB,
                                             keysD[curr],
                                             params.region,
                                             acl,
                                             this.xmlhttps[j]
                                            ))
                    {
                        this.logOutput("Setting the ACL on object: " + keysD[curr] + " FAILED");
                    }
                    // Increment "curr"
                    ++curr;
                    progressMet.value = 50 + ((curr/keyCount) * 50);
                    if (curr < keyCount && this.fContinue)
                        continue;
                    else
                        break;
                }
            }
        }

        this.logOutput("Destination ACLs applied");
        progressMet.value = 100;
    },

    createConnections : function() {
        var step = this.session.preferences.getConcurrentS3Conns();
        if (!this.xmlhttps) {
            var conns = new Array(step);
            var inst = null;
            for (var j = 0; j < step; ++j) {
                conns[j] = this.session.client.newInstance();
            }

            this.xmlhttps = conns;
        }
    },

    cleanupConnections : function() {
        if (this.xmlhttps) {
            var conn = null;
            for (var i = 0; i < this.xmlhttps.length; ++i) {
                conn = this.xmlhttps[i];
                if (conn) {
                    conn.abort();
                    conn = null;
                    this.xmlhttps[i] = conn;
                }
            }
        }
    },

    finishMigration : function() {
        this.logOutput("Finishing up Migration");
        var keysD = this.session.controller.getS3KeyListWithPrefixInBucket(this.params.prefix,
                                                                           this.params.destB,
                                                                           this.params.region);
        if (keysD) {
            this.logOutput(
                "Verifying # of Keys in Source matches the # Keys in the Destination bucket"
                );
            this.logOutput(
                "# Keys Source: " + this.totalKeys + ", # Keys Dest: " + keysD.length
                );

            if (this.totalKeys == keysD.length) {
                // Apply the source ACL on the destination
                // cleanup the xmlhttps
                this.applySourceACLOnKeys(keysD);
                this.cleanupConnections();
                this.params.ok = true;
            } else {
                alert ("ERROR: All the parts of the image weren't migrated!");
                this.params.ok = false;
            }
        } else {
            this.params.ok = false;
        }
        this.fContinue = false;
        this.cancelDialog();
    },

    cancelDialog : function() {
        this.indicateBusy(false);
        document.getElementById("ec2ui.dialog.copy.S3.keys").cancelDialog();
    },

    seedKeyMigration : function() {
        var params = this.params;
        var step = this.session.preferences.getConcurrentS3Conns();
        this.nextIdx = step;

        var ret = null;
        var key = null;
        var xmlhttp = null;
        for (var i = 0; i < step && this.fContinue; ++i) {
            key = this.srcKeys[i];
            xmlhttp = this.xmlhttps[i];
            xmlhttp.key = key;
            this.migrateNextKey(key, xmlhttp);
        }
    },

    migrateNextKey : function(key, xmlhttp) {
        if (!this.fContinue) {
            return;
        }

        if (!key || !xmlhttp) {
            return;
        }

        if (key.length == 0) {
            return;
        }

        var me = this;
        var wrap = function(httpRsp) {
            me.onCompleteCopyS3Key(httpRsp);
        };

        // Initiate the next key's copy
        var ret = this.session.controller.copyS3Key(this.params.sourceB,
                                                    key,
                                                    this.params.destB,
                                                    this.params.region,
                                                    wrap,
                                                    xmlhttp
                                                   );
        var response = {xmlhttp:xmlhttp, hasErrors:false};
        switch (ret) {
        case fileCopyStatus.FILE_EXISTS:
            this.onCompleteCopyS3Key(response);
            break;
        case fileCopyStatus.FAILURE:
            response.hasErrors = true;
            this.fContinue = false;
            this.params.ok = false;
            this.onCompleteCopyS3Key(response);
            break;
        case fileCopyStatus.SUCCESS:
            // This copy request succeeded
            break;
        }
    },

    onCompleteCopyS3Key : function(response) {
        if (!this.fContinue) {
            return;
        }

        this.getProgressMeter().value = ((++this.totalCopyComplete)/this.totalKeys) * 50;
        var xmlhttp = response.xmlhttp;

        if (response.hasErrors) {
            // Update the Progress List
            this.logOutput(xmlhttp.key + ": Transfer Failed!");
        }
        xmlhttp.key = "";

        if (this.totalCopyComplete >= this.totalKeys) {
            // Pass the status of the operation to the caller
            this.finishMigration();
        } else if (this.nextIdx < this.totalKeys) {
            xmlhttp.key = this.srcKeys[this.nextIdx++];
            this.migrateNextKey(xmlhttp.key,
                                xmlhttp);
        }
    },

    startCopyTimer : function() {
        if (this.refreshTimer) {
            log("Stopping Copy Timer");
            clearTimeout(this.refreshTimer);
        } else {
            log("Starting Copy Timer");
            // Set the UI up to refresh just once
            var me = this;
            this.refreshTimer = setTimeout(function() { me.startMigration(); }, 50);
        }
    },

    init : function() {
        this.session = window.arguments[0];
        this.params = window.arguments[1];

        if (this.session == null ||
            this.params == null) {
            return false;
        }

        // Initialize the dialog's elements
        this.getProgressOutput().value = "";
        this.getProgressMeter().value = 0;

        this.currentKey = 0;
        this.totalCopyComplete = 0;
        this.createConnections();
        this.startCopyTimer();
    }
}
