var ec2ui_VpnGatewayTreeView = {
    COLNAMES:
    ['vpnGateway.id', 'vpnGateway.availabilityZone',
     'vpnGateway.state', 'vpnGateway.type', 'vpnGateway.tag'],

    imageIdRegex : new RegExp("^vgw-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.vpngateways.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeVpnGateways();
        // For the attachment call
        ec2ui_session.controller.describeVpcs();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_VpnGatewayTreeView;
        target.displayImages(target.filterImages(ec2ui_model.vpnGateways));
        ec2ui_VpnAttachmentTreeView.invalidate();
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
            ec2ui_model.registerInterest(this, 'vpnGateways');
        }
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.vpngateways.contextmenu").disabled = (image == null);
    },

    selectionChanged : function(event) {
        // preserve the id of the selected image
        // so we can reselect it later on
        var selected = this.getSelectedImage();
        if (selected) {
            this.selectedImageId = selected.id;
        }
        ec2ui_VpnAttachmentTreeView.invalidate();
    },

    createVpnGateway : function () {
        var retVal = {ok:null,type:null, az:null}
        window.openDialog("chrome://ec2ui/content/dialog_create_vpn_gateway.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.createVpnGateway(
                retVal.type,
                retVal.az,
                wrap
            );

            ec2ui_session.showBusyCursor(false);
        }
    },

    deleteVpnGateway : function () {
        var vgw = this.getSelectedImage();
        if (vgw == null) return;

        var confirmed = confirm("Delete " + vgw.id + (vgw.tag == null ? '' : " [" + vgw.tag + "]") + "?");
        if (!confirmed) return;

        var me = this;
        var wrap = function(id) {
            me.refresh();
            me.selectByImageId(id);
        }
        ec2ui_session.controller.deleteVpnGateway(vgw.id, wrap);
    },

    createVpnConnection : function() {
        var vgw = this.getSelectedImage();
        if (vgw == null) return;

        ec2ui_VpnConnectionTreeView.createVpnConnection(null, vgw.id);
    },

    attachToVpc : function() {
        var vgw = this.getSelectedImage();
        if (vgw == null) return;

        ec2ui_VpnAttachmentTreeView.attachToVpc(null, vgw.id);
    },
};

// poor-man's inheritance
ec2ui_VpnGatewayTreeView.__proto__ = BaseImagesView;

ec2ui_VpnGatewayTreeView.register();
