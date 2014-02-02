var ec2ui_SnapshotTreeView = {
    COLNAMES: ['snap.name', 'snap.id', 'snap.volumeId', 'snap.status', 'snap.startTime',
              'snap.progress', 'snap.volumeSize', 'snap.description', 'snap.amiId', 'snap.amiName', 'snap.owner', 'snap.ownerAlias', 'snap.tag', 'snap.comment'],
    imageIdRegex : new RegExp("^snap-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.snapshots.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeSnapshots();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_SnapshotTreeView;
        target.filterAndDisplaySnapshots();
    },

    filterAndDisplaySnapshots : function() {
        var type = document.getElementById("ec2ui_SnapshotTreeView.snapshot.type").value;
        var currentUser = null;
        if (type == "my_snapshots") {
            var groups = ec2ui_model.getSecurityGroups();

            if (groups) {
                var group = groups[0];
                var currentUser = ec2ui_session.lookupAccountId(group.ownerId);
            }
        }

        var snapshots = (ec2ui_model.snapshots || []);
        var filterAMI = document.getElementById("ec2ui.snapshots.noami").checked;

        if (filterAMI) {
          var newSnapshots = [];

          for (var i = 0; i < snapshots.length; i++) {
            var snap = snapshots[i];

            if (!(snap.amiId || '').trim()) {
              newSnapshots.push(snap);
            }
          }

          snapshots = newSnapshots;
        }

        if (currentUser) {
            snapshots = this.filterImages(snapshots, currentUser);
        }

        snapshots = this.filterImages(snapshots);

        this.displayImages(snapshots);
    },

    snapshotTypeChanged : function() {
        document.getElementById("ec2ui.snapshots.search").value = "";
        this.filterAndDisplaySnapshots();
    },

    searchChanged : function(event) {
        //document.getElementById("ec2ui_SnapshotTreeView.snapshot.type").selectedIndex = 1;
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    },

    register : function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'snapshots');
        }
    },

    viewDetails : function(event) {
        var image = this.getSelectedImage();
        if (image == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_snapshot_details.xul", null, "chrome,centerscreen,modal", image);
    },

    deleteSnapshot : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var label = image.name ? (image.name + '@' + image.id) : image.id;
        var confirmed = confirm("Delete snapshot " + label + "?");
        if (!confirmed)
            return;
        var me = this;
        var wrap = function(list) {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }

        ec2ui_session.controller.deleteSnapshot(image.id, wrap);
    },

    createVolume : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        ec2ui_VolumeTreeView.createVolume(image);
    },

    copySnapshot: function () {
        var image = this.getSelectedImage();
        if (image == null) return;

        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);

        var region_list = [];

        var endpointlist = ec2ui_session.getEndpoints();

        for (var i = 0; i < endpointlist.length; i++) {
            region_list.push(endpointlist[i].name);
        }

        var selected = {};

        var ok = prompts.select(window, "Copy this volume", "Destination region:",
                                region_list.length, region_list, selected);

        if (ok) {
            var destRegion = region_list[selected.value];

            var wrap = function(snapshotId) {
                alert("The copy to " + destRegion + " has been started.\n\n" +
                      "The SNAP ID is: " + snapshotId);
            }

            var description = "[Copied " + image.id + " from " + ec2ui_session.getActiveEndpoint().name + "]";

            ec2ui_session.controller.copySnapshot(
                image.id, destRegion, description, wrap);
        }
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);

        if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
            // Determine if there are any pending operations
            if (this.pendingUpdates()) {
                this.startRefreshTimer("ec2ui_SnapshotTreeView",
                                       ec2ui_SnapshotTreeView.refresh);
            } else {
                this.stopRefreshTimer("ec2ui_SnapshotTreeView");
            }
        } else {
            this.stopRefreshTimer("ec2ui_SnapshotTreeView");
        }
    },

    pendingUpdates : function() {
        // Walk the list of snapshots to see whether there is a volume
        // whose state needs to be refreshed
        var snaps = ec2ui_session.model.snapshots;
        var fPending = false;

        if (snaps == null) {
            return fPending;
        }

        for (var i in snaps) {
            if (snaps[i].status == "completed") {
                continue;
            }
            fPending = true;
            break;
        }

        return fPending;
    },

    showRegisterImageFromSnapshotDialog : function() {
        var retVal = {ok:null,amiName:null,amiDescription:null};
        var image = this.getSelectedImage();
        if (image == null) return;

        window.openDialog("chrome://ec2ui/content/dialog_register_image_from_snapshot.xul",
                          null,
                          "chrome,centerscreen,modal",
                          image.id,
                          ec2ui_session,
                          retVal);

        if (retVal.ok) {
            var wrap = function(id) {
                alert("A new AMI is registered.\n\n"+
                      "The AMI ID is: "+id);
            }

            ec2ui_session.controller.registerImageFromSnapshot(image.id,
                                                 retVal.amiName,
                                                 retVal.amiDescription,
                                                 retVal.architecture,
                                                 retVal.kernelId,
                                                 retVal.ramdiskId,
                                                 retVal.deviceName,
                                                 retVal.deleteOnTermination,
                                                 wrap);
        }
    },
};

// poor-man's inheritance
ec2ui_SnapshotTreeView.__proto__ = BaseImagesView;

ec2ui_SnapshotTreeView.register();
