var ec2ui_CustomerGatewayTreeView = {
    COLNAMES:
    ['customerGateway.id', 'customerGateway.ipAddress',
     'customerGateway.bgpAsn', 'customerGateway.state',
     'customerGateway.type', 'customerGateway.tag'],

    imageIdRegex : new RegExp("^cgw-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.customergateways.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeCustomerGateways();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_CustomerGatewayTreeView;
        target.displayImages(target.filterImages(ec2ui_model.customerGateways));
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
            ec2ui_model.registerInterest(this, 'customerGateways');
        }
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.customergateways.contextmenu").disabled = (image == null);
    },

    createCustomerGateway : function () {
        var retVal = {ok:null,type:null, ipaddress:null, bgpasn:null}
        window.openDialog("chrome://ec2ui/content/dialog_create_customer_gateway.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.createCustomerGateway(
                retVal.type,
                retVal.ipaddress,
                retVal.bgpasn,
                wrap
            );

            ec2ui_session.showBusyCursor(false);
        }
    },

    deleteCustomerGateway : function () {
        var cgw = this.getSelectedImage();
        if (cgw == null) return;

        var confirmed = confirm("Delete " + cgw.id + " (" + cgw.ipAddress + ")" + (cgw.tag == null ? '' : " [" + cgw.tag + "]") + "?");
        if (!confirmed) return;

        var me = this;
        var wrap = function(id) {
            me.refresh();
            me.selectByImageId(id);
        }
        ec2ui_session.controller.deleteCustomerGateway(cgw.id, wrap);
    },

    createVpnConnection : function() {
        var cgw = this.getSelectedImage();
        if (cgw == null) return;

        ec2ui_VpnConnectionTreeView.createVpnConnection(cgw.id, null);
    },
};

// poor-man's inheritance
ec2ui_CustomerGatewayTreeView.__proto__ = BaseImagesView;

ec2ui_CustomerGatewayTreeView.register();
