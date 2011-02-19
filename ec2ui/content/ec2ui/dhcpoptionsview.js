var ec2ui_DhcpoptsTreeView = {
    COLNAMES:
    ['dhcpoption.id', 'dhcpoption.options', 'dhcpoption.tag'],
    imageIdRegex : new RegExp("^(dhcp-option|dopt)-"),

    getSearchText : function() {
        return document.getElementById('ec2ui.dhcpopts.search').value;
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeDhcpOptions();
        ec2ui_session.showBusyCursor(false);
    },

    invalidate : function() {
        var target = ec2ui_DhcpoptsTreeView;
        target.displayImages(target.filterImages(ec2ui_model.dhcpOptions));
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
            ec2ui_model.registerInterest(this, 'dhcpOptions');
        }
    },

    displayImages : function (imageList) {
        BaseImagesView.displayImages.call(this, imageList);
    },

    enableOrDisableItems : function() {
        var image = this.getSelectedImage();
        document.getElementById("ec2ui.dhcpopts.contextmenu").disabled = (image == null);
    },

    deleteDhcpOptions : function() {
        var opts = this.getSelectedImage();
        if (opts == null) return;

        var confirmed = confirm("Delete " + opts.id + (opts.tag == null ? '' : " [" + opts.tag + "]") + "?");
        if (!confirmed) return;

        var me = this;
        var wrap = function() { 
            me.refresh();
            me.selectByImageId(opts.id);
        }
        ec2ui_session.controller.deleteDhcpOptions(opts.id, wrap);
    },

    createDhcpOptions : function () {
        var retVal = {ok:null, opts:null}
        window.openDialog("chrome://ec2ui/content/dialog_create_dhcp_options.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function(id) {
                me.refresh();
                me.selectByImageId(id);
            }
            ec2ui_session.controller.createDhcpOptions(
                retVal.opts,
                wrap
            );

            ec2ui_session.showBusyCursor(false);
        }
    },
};

// poor-man's inheritance
ec2ui_DhcpoptsTreeView.__proto__ = BaseImagesView;

ec2ui_DhcpoptsTreeView.register();
