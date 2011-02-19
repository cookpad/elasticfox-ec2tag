var ec2ui_SnapshotTreeView = {
    COLNAMES: ['snap.id', 'snap.volumeId', 'snap.status', 'snap.startTime',
              'snap.progress', 'snap.volumeSize', 'snap.description', 'snap.owner', 'snap.ownerAlias', 'snap.tag'],
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
        if (type == "my_snapshots") {
            var groups = ec2ui_model.getSecurityGroups();
            var group = groups[0];
            var currentUser = ec2ui_session.lookupAccountId(group.ownerId);
        }

        var snapshots = ec2ui_model.snapshots;
        snapshots = this.filterImages(snapshots, currentUser);

        this.displayImages(snapshots);
    },

    snapshotTypeChanged : function() {
        document.getElementById("ec2ui.snapshots.search").value = "";
        this.filterAndDisplaySnapshots();
    },

    searchChanged : function(event) {
        document.getElementById("ec2ui_SnapshotTreeView.snapshot.type").selectedIndex = 0;
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
        var confirmed = confirm("Delete snapshot " + image.id + "?");
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
};

// poor-man's inheritance
ec2ui_SnapshotTreeView.__proto__ = BaseImagesView;

ec2ui_SnapshotTreeView.register();
