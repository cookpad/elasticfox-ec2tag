var ec2ui_AMIsTreeView = {
    COLNAMES: ['ami.id',
               'ami.location',
               'ami.state',
               'ami.owner',
               'ami.ownerAlias',
               'ami.isPublic',
               'ami.arch',
               'ami.platform',
               'ami.rootDeviceType',
               'ami.name',
               'ami.description',
               'ami.tag',
               'ami.comment'],
    launchPermissionList : new Array(),
    imageIdRegex : regExs["all"],
    rootDeviceType : "",
    ownerDisplayFilter : "",

    enableOrDisableItems  : function (event) {
        var image = this.getSelectedImage();
        var fDisabled = (image == null);

        if (fDisabled) {
            document.getElementById("ec2ui.images.contextmenu").hidePopup();
            return;
        }

        fDisabled = !isWindows(image.platform);

        // If this is not a Windows Instance, Disable the following
        // context menu items.
        document.getElementById("amis.context.migrate").disabled = fDisabled;

        // These items apply only to AMIs
        fDisabled = !(image.id.match(regExs["ami"]));
        document.getElementById("amis.context.register").disabled = fDisabled;
        document.getElementById("amis.context.deregister").disabled = fDisabled;
        document.getElementById("amis.context.launch").disabled = fDisabled;
        document.getElementById("amis.context.delete").disabled = fDisabled;

        // These context menu items don't apply to Windows instances
        // so enable them.

        // These items don't apply to AMIs with root device type 'ebs'
        if (isEbsRootDeviceType(image.rootDeviceType)) {
            document.getElementById("amis.context.delete").disabled = true;
            document.getElementById("amis.context.deleteSnapshotAndDeregister").disabled = false;
        } else {
            document.getElementById("amis.context.deleteSnapshotAndDeregister").disabled = true;
        }

    },

    imageTypeChanged : function() {
        //document.getElementById("ec2ui.images.search").value = "";
        this.displayImagesOfType();
    },

    displayImagesOfType : function () {
        var type = document.getElementById("ec2ui_AMIsTreeView.image.type");
        // Initialize the owner display filter to the empty string
        this.ownerDisplayFilter = "";
        if (type.value == "my_ami" || type.value == "my_ami_rdt_ebs") {
            var groups = ec2ui_model.getSecurityGroups();

            if (groups) {
                var group = groups[0];
                var currentUser = ec2ui_session.lookupAccountId(group.ownerId);
                this.imageIdRegex = regExs["ami"];

                if (type.value == "my_ami")
                  this.rootDeviceType = "";
                else
                  this.rootDeviceType = "ebs";
            }
        } else if (type.value == "amzn" || type.value == "amzn_rdt_ebs") {
            this.ownerDisplayFilter = "amazon";

            if (type.value == "amzn")
              this.rootDeviceType = "";
            else
              this.rootDeviceType = "ebs";
        } else if (type.value == "rdt_ebs") {
            this.rootDeviceType = "ebs";
            this.imageIdRegex = regExs["all"];
        } else if (type.value == "rdt_is") {
            this.rootDeviceType = "instance-store";
            this.imageIdRegex = regExs["all"];
        } else {
            this.imageIdRegex = regExs[type.value];
            this.rootDeviceType = "";
        }

        var images = ec2ui_model.images;
        images = this.filterRootDevice(images);
        images = this.filterOwnerDisplay(images);

        if (currentUser) {
            images = this.filterImages(images, currentUser, this.getSearchText());
        } else {
            images = this.filterImages(images, currentUser);
        }

        this.displayImages(images);
    },

    filterRootDevice : function(images) {
        if (this.rootDeviceType == "") {
            return images;
        }

        var newList = new Array();

        for(var i in images) {
            var rdt = this.getImageDetail(images[i], "ami.rootDeviceType");
            if (rdt == this.rootDeviceType) {
                newList.push(images[i]);
            }
        }

        return newList;
    },

    filterOwnerDisplay : function(images) {
        if (this.ownerDisplayFilter == "") {
            return images;
        }

        var newList = new Array();

        for(var i in images) {
            if (images[i].ownerAlias == this.ownerDisplayFilter) {
                newList.push(images[i]);
            }
        }

        return newList;
    },

    searchChanged : function(event) {
        //document.getElementById("ec2ui_AMIsTreeView.image.type").selectedIndex = 1;
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    },

    newInstanceCallback : function(list) {
        var tag = ec2ui_AMIsTreeView.newInstanceTag;
        // Reset the saved tag
        ec2ui_AMIsTreeView.newInstance = "";
        if (tag && tag.length > 0) {
            var inst = null;
            for (var i in list) {
                inst = list[i];
                inst.tag = tag;
                ec2ui_session.setResourceTag(inst.id, tag);
                __tagging2ec2__([inst.id], ec2ui_session, tag);
            }
        }
        if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
            ec2ui_InstancesTreeView.refresh();
            ec2ui_InstancesTreeView.selectByInstanceIds(list);
            var tabPanel = document.getElementById("ec2ui.primary.tabs");
            tabPanel.selectedIndex = 0;
        }
    },

    launchNewInstances : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var retVal = {ok:null};
        this.newInstanceTag = null;

        window.openDialog(
            "chrome://ec2ui/content/dialog_new_instances.xul",
            null,
            "chrome,centerscreen,modal",
            image,
            ec2ui_session,
            retVal
            );

        if (retVal.ok) {
            this.newInstanceTag = retVal.tag || "";

            ec2ui_session.controller.runInstances(
               retVal.imageId,
               retVal.kernelId,
               retVal.ramdiskId,
               retVal.minCount,
               retVal.maxCount,
               retVal.keyName,
               retVal.securityGroups,
               retVal.userData,
               retVal.properties,
               retVal.ephemeral0,
               retVal.ephemeral1,
               retVal.ephemeral2,
               retVal.ephemeral3,
               retVal.instanceType,
               retVal.placement,
               retVal.subnetId,
               retVal.ipAddress,
               retVal.securityGroupIds,
               retVal.iamInstanceProfileArn,
               retVal.iamInstanceProfileName,
               retVal.ebsOptimized,
               retVal.assignPublicIp,
               retVal.ebsVolumeName,
               retVal.ebsVolumeSize,
               retVal.ebsVolumeType,
               retVal.ebsVolumeIops,
               this.newInstanceCallback);
        }
    },

    callRegisterImageInRegion : function(manifest, region) {
        var me = this;
        var wrap = function(x) {
            alert ("Image with Manifest: " + manifest + " was registered");
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
                me.selectByImageId(x);
            }
        }
        ec2ui_session.controller.registerImageInRegion(manifest, region, wrap);
    },

    registerNewImage : function () {
        var retVal = {ok:null,manifestPath:null};
        window.openDialog(
            "chrome://ec2ui/content/dialog_register_image.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal
            );

        if (retVal.ok) {
            var s3bucket = retVal.manifestPath.split('/')[0];
            var bucketReg = ec2ui_session.controller.getS3BucketLocation(s3bucket);
            this.callRegisterImageInRegion(retVal.manifestPath, bucketReg);
        }
    },

    deregisterImage : function (fDelete) {
        var index =  this.selection.currentIndex;
        if (index == -1) return;

        var image = this.imageList[index];

        if (fDelete == undefined) {
            fDelete = confirm("Deregister AMI "+image.id+" ("+image.location+")?");
        }

        if (!fDelete) {
            return;
        }

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        log("Deregistering image: " + image.id);
        ec2ui_session.controller.deregisterImage(image.id, wrap);
    },

    migrateImage  : function () {
        var retVal = {ok:null,sourceB:null,destB:null,prefix:null,region:null,caller:this};

        var image = this.getSelectedImage();

        if (image == null) {
            return;
        }

        if (this.currentlyMigrating &&
            this.amiBeingMigrated == image.id) {
            alert ("This AMI is currently being migrated!");
            return;
        }

        window.openDialog("chrome://ec2ui/content/dialog_migrate_ami.xul",
                          null,
                          "chrome,centerscreen,modal",
                          image,
                          ec2ui_session,
                          retVal);

        if (retVal.ok) {
            this.currentlyMigrating = true;
            this.amiBeingMigrated = image.id;

            // Reset the retVal's ok member so the object can be reused
            retVal.ok = false;

            // Finish up AMI migration with visual prompts
            window.openDialog("chrome://ec2ui/content/dialog_copy_S3_keys.xul",
                              null,
                              "chrome, dialog, centerscreen, resizable=yes",
                              ec2ui_session,
                              retVal);
        }
    },

    finishMigration : function(retVal) {
        if (retVal.ok) {
            // Register the new AMI
            var manifest = retVal.destB +"/" +  retVal.prefix + ".manifest.xml";
            log("Registering AMI with manifest: " + manifest);
            this.callRegisterImageInRegion(manifest, retVal.region);
        }
        this.currentlyMigrating = false;
        this.amiBeingMigrated = null;
    },

    deleteImage : function() {
        var image = this.getSelectedImage();

        if (image == null) {
            return;
        }

        if (this.currentlyMigrating &&
            this.amiBeingMigrated == image.id) {
            alert ("This AMI is currently being migrated. Please try *Deleting* it after the Migration.");
            return;
        }

        var msg = "Are you sure you want to delete this AMI and all its parts from S3?";
        msg = msg + " The AMI will be deregistered as well.";
        var fDelete = confirm(msg);

        if (fDelete) {
            var retVal = {ok:null};
            window.openDialog("chrome://ec2ui/content/dialog_delete_ami.xul",
                              null,
                              "chrome,centerscreen,modal",
                              ec2ui_session,
                              image.location,
                              retVal);

            if (retVal.ok) {
                // Keys have been deleted. Let's deregister this image
                this.deregisterImage(true);
            }
        }
    },

    deleteSnapshotAndDeregister : function() {
        var image = this.getSelectedImage();

        if (image == null) {
            return;
        }

        var ami = image.id;
        var snapshot = image.snapshotId;

        var msg = "Are you sure you want to delete this AMI ("+ami + " / " + image.name+") "+
                  "and the accompanying snapshot ("+snapshot+")?";
        var fDelete = confirm(msg);

        if (fDelete) {
            var me = this;
            var snap_wrap = function() {
                if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                    ec2ui_SnapshotTreeView.refresh();
                }
            }

            var dereg_wrap = function() {
                ec2ui_session.controller.deleteSnapshot(snapshot, snap_wrap);
                me.refresh();
            }

            ec2ui_session.controller.deregisterImage(ami, dereg_wrap);
        }
    },

    getLaunchPermissionsList : function() {
        return document.getElementById("ec2ui.launchpermissions.list");
    },

    getSelectedLaunchPermission : function() {
        var item = this.getLaunchPermissionsList().getSelectedItem(0);
        if (item == null) return null;
        return item.value;
    },

    selectLaunchPermissionByName : function(name) {
        var list = this.getLaunchPermissionsList();
        for(var i in this.launchPermissionList) {
            if (this.launchPermissionList[i] == name) {
                list.selectedIndex = i;
                return;
            }
        }

        // In case we don't find a match (which is probably a bug).
        list.selectedIndex = 0;
    },

    copyAccountIdToClipBoard : function(event) {
        var name = this.getSelectedLaunchPermission();
        if (name == null) return;

        copyToClipboard(name);
    },

    launchPermissionsCallback : function(list) {
        ec2ui_AMIsTreeView.displayLaunchPermissions(list);
    },

    refreshLaunchPermissions : function() {
        var image = this.getSelectedImage();
        if (image == null) return;
        if (image.state == "deregistered") return;

        ec2ui_session.controller.describeLaunchPermissions(image.id,
                                                           this.launchPermissionsCallback);
    },

    addGlobalLaunchPermission : function() {
        var image = this.getSelectedImage();
        if (image == null) return;
        this.addNamedPermission(image, "all");
    },

    addLaunchPermission : function() {
        var image = this.getSelectedImage();
        if (image == null) return;
        var name = prompt("Please provide an EC2 user ID");
        if (name == null) return;
        this.addNamedPermission(image, name);
    },

    addNamedPermission : function(image, name) {
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refreshLaunchPermissions();
                me.selectLaunchPermissionByName(name);
            }
        }
        ec2ui_session.controller.addLaunchPermission(image.id, name, wrap);
    },

    removeLaunchPermission : function() {
        var image = this.getSelectedImage();
        if (image == null) return;
        var name = this.getSelectedLaunchPermission();
        if (name == null) return;

        var confirmed = confirm("Revoke launch permissions for "+name+" on AMI "+image.id+"?");
        if (!confirmed)
            return;

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refreshLaunchPermissions();
            }
        }
        ec2ui_session.controller.revokeLaunchPermission(image.id, name, wrap);
    },

    resetLaunchPermissions : function() {
        var image = this.getSelectedImage();
        if (image == null) return;

        var confirmed = confirm("Reset launch permissions for AMI "+image.id+"?");
        if (!confirmed)
            return;

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refreshLaunchPermissions();
            }
        }
        ec2ui_session.controller.resetLaunchPermissions(image.id, wrap);
    },

    displayLaunchPermissions : function (permList) {
        this.launchPermissionList = permList;

        // Clear the list (is there a better way to do this?)
        var list = this.getLaunchPermissionsList();
        var count = list.getRowCount();
        for(var i = count-1; i >= 0; i--) {
            list.removeItemAt(i);
        }

        // Sort 'all' to the top
        permList.sort(function(x,y) {
            if (x == 'all') return -1;
            if (y == 'all') return 1;
            return x < y ? -1 : (x == y ? 0 : 1);
        });

        var perm = null;
        for(var i in permList) {
            perm = permList[i];
            list.appendItem(ec2ui_session.lookupAccountId(perm), perm);
        }
    },

    selectionChanged : function(event) {
        BaseImagesView.selectionChanged.call(this, event);

        if (ec2ui_prefs.isAutoFetchLaunchPermissionsEnabled()) {
            this.refreshLaunchPermissions();
        }
    },

    getSearchText: function() {
        return (document.getElementById('ec2ui.images.search').value || '').trim();
    },

    invalidate : function() {
        var target = ec2ui_AMIsTreeView;
        target.displayLaunchPermissions([]);
        ec2ui_session.controller.describeVpcs();
        ec2ui_session.controller.describeSubnets();
        target.displayImagesOfType();
    },
};

// poor-man's inheritance
ec2ui_AMIsTreeView.__proto__ = BaseImagesView;

ec2ui_AMIsTreeView.register();
