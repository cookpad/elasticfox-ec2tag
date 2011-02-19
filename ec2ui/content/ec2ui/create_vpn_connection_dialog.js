var ec2_VpnConnectionCreator = {
    ec2ui_session : null,
    retVal : null,

    createVpnConnection : function() {
        this.retVal.vgwid = document.getElementById("ec2ui.newvpnconnection.vgwid").value.trim();
        this.retVal.cgwid = document.getElementById("ec2ui.newvpnconnection.cgwid").value.trim();

        var vgws = this.ec2ui_session.model.getVpnGateways();
        for (var i in vgws) {
            if (vgws[i].id == this.retVal.vgwid)
                this.retVal.type = vgws[i].type;
        }

        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var vgwMenu = document.getElementById("ec2ui.newvpnconnection.vgwid");
        var vgws = this.ec2ui_session.model.getVpnGateways();
        var selectvgw = 0;
        for (var i in vgws) {
            if (vgws[i].state != "available") continue;
            vgwMenu.appendItem(vgws[i].id + (vgws[i].tag == null ? '' : " [" + vgws[i].tag + "]"), vgws[i].id);
            if (vgws[i].id == this.retVal.vgwid)
                selectvgw = i;
        }
        vgwMenu.selectedIndex = selectvgw;

        var cgwMenu = document.getElementById("ec2ui.newvpnconnection.cgwid");
        var cgws = this.ec2ui_session.model.getCustomerGateways();
        var selectcgw = 0;
        for (var i in cgws) {
            if (cgws[i].state != "available") continue;
            cgwMenu.appendItem(cgws[i].id + " (" + cgws[i].ipAddress + ")" + (cgws[i].tag == null ? '' : " [" + cgws[i].tag + "]"), cgws[i].id);
            if (cgws[i].id == this.retVal.cgwid)
                selectcgw = i;
        }
        cgwMenu.selectedIndex = selectcgw;
    }
}
