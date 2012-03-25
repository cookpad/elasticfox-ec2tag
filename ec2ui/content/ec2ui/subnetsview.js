var ec2ui_SubnetTreeView = {
    COLNAMES:
    ['subnet.id', 'subnet.vpcId', 'subnet.cidr', 'subnet.state', 'subnet.availableIp', 'subnet.availabilityZone', 'subnet.tag'],
    imageIdRegex : new RegExp("^subnet-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.subnets.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeSubnets();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_SubnetTreeView;
        target.displayImages(target.filterImages(ec2ui_model.subnets));
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
            ec2ui_model.registerInterest(this, 'subnets');
        }
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.subnets.contextmenu").disabled = (image == null);
    },

    deleteSubnet : function () {
        var subnet = this.getSelectedImage();
        if (subnet == null) return;

        var confirmed = confirm("Delete " + subnet.id + " (" + subnet.cidr + ")" + (subnet.tag == null ? '' : " [" + subnet.tag + "]") + "?");
        if (!confirmed) return;

        var me = this;
        var wrap = function(id) {
            me.refresh();
            me.selectByImageId(id);
        }
        ec2ui_session.controller.deleteSubnet(subnet.id, wrap);
    },

    createSubnet : function (vpc) {
        var retVal = {ok:null, cidr:null, vpcid:vpc, az:null}
        window.openDialog("chrome://ec2ui/content/dialog_create_subnet.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.createSubnet(
                retVal.vpcid,
                retVal.cidr,
                retVal.az,
                wrap
            );

            ec2ui_session.showBusyCursor(false);
        }
    },
};

// poor-man's inheritance
ec2ui_SubnetTreeView.__proto__ = BaseImagesView;

ec2ui_SubnetTreeView.register();
