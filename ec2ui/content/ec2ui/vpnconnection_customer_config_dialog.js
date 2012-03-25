var ec2_VpnConnectionCustomerConfig = {
    ec2ui_session : null,
    retVal : null,
    ec2_httpclient : null,

    viewConfig : function() {
        this.retVal.ok = true;
        this.retVal.cgwtype = document.getElementById("ec2ui.vpncustomerconfig.cgwtype").value.trim();
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];
        this.ec2_httpclient = window.arguments[2];

        var opts = this.ec2_httpclient.queryVpnConnectionStylesheets(null);
        var formats = opts.xmlDoc.evaluate("/CustomerGatewayConfigFormats/Format",
                                            opts.xmlDoc,
                                            this.ec2_httpclient.getNsResolver,
                                            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                            null);

        var cgwMenu = document.getElementById("ec2ui.vpncustomerconfig.cgwtype");

        for (var i = 0; i < formats.snapshotLength; i++) {
            var platform = this.getNodeValueByName(formats.snapshotItem(i), "Platform");
            var filename = this.getNodeValueByName(formats.snapshotItem(i), "Filename");
            var vendor = this.getNodeValueByName(formats.snapshotItem(i), "Vendor");
            var software = this.getNodeValueByName(formats.snapshotItem(i), "Software");
            cgwMenu.appendItem(vendor + " " + platform + " [" + software + "]", filename);
        }
        cgwMenu.selectedIndex = 0;
    },

    getNodeValueByName : function (parent, nodeName) {
       var node = parent.getElementsByTagName(nodeName)[0];
       if (node == null) return "";
       return node.firstChild ? node.firstChild.nodeValue : "";
    },
    
}
