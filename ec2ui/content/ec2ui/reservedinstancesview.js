var ec2ui_ReservedInstancesTreeView = {
    COLNAMES: ['rsvdInst.id',
               'rsvdInst.instanceType',
               'rsvdInst.azone',
               'rsvdInst.start',
               'rsvdInst.duration',
               'rsvdInst.fixedPrice',
               'rsvdInst.usagePrice',
               'rsvdInst.count',
               'rsvdInst.description',
               'rsvdInst.state'],
    imageIdRegex : new RegExp(".*"),

    getSearchText : function() {
        return document.getElementById('ec2ui.rsvdInst.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeReservedInstances();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_ReservedInstancesTreeView;
        target.displayImages(target.filterImages(ec2ui_model.reservedInstances));
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
            ec2ui_model.registerInterest(this, 'reservedInstances');
        }
    },

    viewDetails : function(event) {
        var image = this.getSelectedImage();
        if (image == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_reserved_instances_details.xul",
                          null,
                          "chrome,centerscreen,modal",
                          image);
    },

    displayImages : function (imageList) {
        if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
            // Determine if there are any pending operations
            if (this.pendingUpdates()) {
                this.startRefreshTimer("ec2ui_ReservedInstancesTreeView",
                                       ec2ui_ReservedInstancesTreeView.refresh);
            } else {
                this.stopRefreshTimer("ec2ui_ReservedInstancesTreeView");
            }
        } else {
            this.stopRefreshTimer("ec2ui_ReservedInstancesTreeView");
        }

        BaseImagesView.displayImages.call(this, imageList);
    },

    pendingUpdates : function() {
        // Walk the list of reservedInst to see whether the
        // state of any of them needs to be refreshed
        var list = ec2ui_session.model.reservedInstances;
        var fPending = false;

        if (list == null) {
            return fPending;
        }

        for (var i in list) {
            if (list[i].state == "payment-pending") {
                fPending = true;
                break;
            }
        }

        return fPending;
    },
};

// poor-man's inheritance
ec2ui_ReservedInstancesTreeView.__proto__ = BaseImagesView;

ec2ui_ReservedInstancesTreeView.register();
