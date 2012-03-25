var ec2ui_VpnAttachmentTreeView = {
    COLNAMES:
    ['vpnAttachment.vgwId', 'vpnAttachment.vpcId',
     'vpnAttachment.state'],

    invalidate : function() {
        var target = ec2ui_VpnAttachmentTreeView;
        var vgw = ec2ui_VpnGatewayTreeView.getSelectedImage();
        var attachments = null;
        if (vgw != null) {
            attachments = vgw.attachments;
        }

        target.displayImages(attachments);
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
 //           ec2ui_model.registerInterest(this, 'vpnGateways');
        }
    },

    refresh : function() {
        ec2ui_VpnGatewayTreeView.refresh();
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.vpnattachments.contextmenu").disabled = (image == null);
    },

    deleteVpnAttachment : function() {
        var att = this.getSelectedImage();
        if (att == null) return;

        var confirmed = confirm("Delete attachment of " + att.vgwId + " to " + att.vpcId + "?");
        if (!confirmed) return;

        var me = this;
        var wrap = function(id) {
            me.refresh();
            me.selectByImageId(id);
        }
        ec2ui_session.controller.detachVpnGatewayFromVpc(att.vgwId, att.vpcId, wrap);
    },

    attachToVpc : function(vpcid, vgwid) {
        var retVal = {ok:null, vgwid: vgwid, vpcid: vpcid}
        window.openDialog("chrome://ec2ui/content/dialog_attach_vpn_gateway.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.attachVpnGatewayToVpc(
                retVal.vgwid,
                retVal.vpcid,
                wrap
            );

            ec2ui_session.showBusyCursor(false);
        }
    },
};

// poor-man's inheritance
ec2ui_VpnAttachmentTreeView.__proto__ = BaseImagesView;

ec2ui_VpnAttachmentTreeView.register();
