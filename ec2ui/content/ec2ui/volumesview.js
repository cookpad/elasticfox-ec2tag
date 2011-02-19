function getEC2WindowsDeviceList() {
    var devlist = new Array();
    devlist["xvdg"] = "xvdg";
    devlist["xvdh"] = "xvdh";
    devlist["xvdi"] = "xvdi";
    devlist["xvdj"] = "xvdj";
    devlist["xvdk"] = "xvdk";
    devlist["xvdl"] = "xvdl";
    devlist["xvdm"] = "xvdm";
    devlist["xvdn"] = "xvdn";
    devlist["xvdo"] = "xvdo";
    devlist["xvdp"] = "xvdp";
    devlist["xvdf"] = "xvdf";
    devlist["xvde"] = "xvde";
    devlist["xvdd"] = "xvdd";
    devlist["xvdc"] = "xvdc";
    return devlist;
};

var ec2ui_VolumeTreeView = {
    COLNAMES:
    ['vol.id','vol.size','vol.snapshotId','vol.availabilityZone','vol.status',
    'vol.createTime', 'vol.instanceId', 'vol.device', 'vol.attachStatus',
    'vol.attachTime', 'vol.tag'],
    imageIdRegex : new RegExp("^vol-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.volumes.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeVolumes();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_VolumeTreeView;
        target.displayImages(target.filterImages(ec2ui_model.volumes));
    },

    searchChanged : function(event) {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    },

    register : function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'volumes');
        }
    },

    displayImages : function (imageList) {
        if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
            // Determine if there are any pending operations
            if (this.pendingUpdates()) {
                this.startRefreshTimer("",
                                       this.refresh);
            } else {
                this.stopRefreshTimer("ec2ui_VolumeTreeView");
            }
        } else {
            this.stopRefreshTimer("ec2ui_VolumeTreeView");
        }

        BaseImagesView.displayImages.call(this, imageList);
    },

    viewDetails : function(event) {
        var image = this.getSelectedImage();
        if (image == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_volume_details.xul", null, "chrome,centerscreen,modal", image);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.volumes.contextmenu").disabled = (image == null);

        if (image == null) return;

        var fAssociated = true;
        if (image.status == "available") {
            // There is no instance associated with this volume
            fAssociated = false;
        }

        // If this is not a Windows Instance, Disable the following
        // context menu items.
        document.getElementById("volumes.context.attach").disabled = fAssociated;
        document.getElementById("volumes.context.detach").disabled = !fAssociated;
        document.getElementById("volumes.context.forcedetach").disabled = !fAssociated;
    },

    createSnapshot : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var me = this;
        var wrap = function(snapId) {
            // Replicate the volume tag for this snapshot
            var tag = me.getSelectedImage().tag;
            if (tag && tag.length > 0) {
                ec2ui_session.setResourceTag(snapId, tag);
            }
            // We need to refresh so that the tag is applied to the snapshot
            ec2ui_SnapshotTreeView.refresh();
            ec2ui_SnapshotTreeView.selectByImageId(snapId);
        }
        ec2ui_session.controller.createSnapshot(image.id, wrap);
    },

    createVolume : function (snap) {
        var retVal = {ok:null};
        if (!snap) snap = null;
        window.openDialog("chrome://ec2ui/content/dialog_new_volume.xul",
                          null,
                          "chrome,centerscreen,modal",
                          snap,
                          ec2ui_session,
                          retVal);
        if (retVal.ok) {
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.createVolume(retVal.size,
                                                  retVal.snapshotId,
                                                  retVal.zone,
                                                  wrap);

            // Let's tag this volume
            if (retVal.tag) {
                var vol = this.getSelectedImage();
                if (vol) {
                    vol.tag = retVal.tag;
                    ec2ui_session.setResourceTag(vol.id, vol.tag);
                }
            }
        }

        return retVal.ok;
    },

    deleteVolume : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var confirmed = confirm("Delete volume " + image.id + "?");
        if (!confirmed)
            return;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                ec2ui_VolumeTreeView.refresh();
            }
        }
        ec2ui_session.controller.deleteVolume(image.id, wrap);
    },

    attachEBSVolume : function (volumeId, instId, device) {
         if (device == "windows_device") {
            // The device id needs to be determined
            device = this.determineWindowsDevice(instId);
        }

        log("Device Selected for instance: " + device);

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }

        ec2ui_session.controller.attachVolume(volumeId,
                                              instId,
                                              device,
                                              wrap);
    },

    attachVolume : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var retVal = {ok:null};
        while (true) {
            window.openDialog("chrome://ec2ui/content/dialog_new_attachment.xul",
                              null,
                              "chrome,centerscreen,modal",
                              image,
                              ec2ui_session,
                              retVal);
            if (retVal.ok) {
                // If this is a Windows instance,
                // the device should be windows_device
                // and the instance should be ready to use
                var instances = ec2ui_session.model.getInstances();
                var instance = null;
                for (var i in instances) {
                    instance = instances[i];
                    if (instance.id == retVal.instanceId) {
                        if (!ec2ui_InstancesTreeView.isInstanceReadyToUse(instance)) {
                            // The selected instance is not ready to
                            // use. Repeat.
                            continue;
                        }
                        if (isWindows(instance.platform)) {
                            retVal.device = "windows_device";
                        }
                        // The 2 if conditions aren't folded into 1
                        // so that we can break upon finding the instance
                        // id match.
                        break;
                    }
                }
                this.attachEBSVolume(retVal.volumeId,
                                     retVal.instanceId,
                                     retVal.device);
            }
            break;
        }
    },

    determineWindowsDevice : function (instId) {
        // Need to walk through the list of Volumes
        // If any volume is attached to this instance,
        // that device id is removed from the list of
        // possible device ids for this instance.
        var devList = getEC2WindowsDeviceList();

        // Enumerate the volumes associated with the instId
        var volumes = ec2ui_session.model.volumes;

        // If a volume is associated with this instance, mark
        // the associated device as taken
        for (var i in volumes) {
            if (volumes[i].instanceId == instId) {
                // We have a match
                log("This device " + volumes[i].device +
                    " is taken by volume: " + volumes[i].id);
                devList[volumes[i].device] = 1;
            }
        }

        for (var device in devList) {
            if (devList[device] != 1) {
                return devList[device];
            }
        }

        return "";
    },

    detachVolume : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var confirmed = confirm("Detach volume " + image.id + "?");
        if (!confirmed)
            return;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                ec2ui_VolumeTreeView.refresh();
            }
        }
        ec2ui_session.controller.detachVolume(image.id, wrap);
    },

    forceDetachVolume : function () {
        var image = this.getSelectedImage();
        if (image == null) return;
        var confirmed = confirm("Force detach volume " + image.id + "?");
        if (!confirmed)
            return;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                ec2ui_VolumeTreeView.refresh();
            }
        }
        ec2ui_session.controller.forceDetachVolume(image.id, wrap);
    },

    pendingUpdates : function() {
        /*
        // Walk the list of volumes to see whether there is a volume
        // whose state needs to be refreshed
        var volumes = ec2ui_session.model.volumes;
        var fPending = false;

        if (volumes == null) {
            return fPending;
        }

        for (var i in volumes) {
            if (volumes[i].status != "available" &&
                (volumes[i].attachStatus == "attaching" ||
                volumes[i].attachStStatus == "detaching")) {
                fPending = true;
                break;
            }
        }
        */

        return false;
    },
};

// poor-man's inheritance
ec2ui_VolumeTreeView.__proto__ = BaseImagesView;

ec2ui_VolumeTreeView.register();
