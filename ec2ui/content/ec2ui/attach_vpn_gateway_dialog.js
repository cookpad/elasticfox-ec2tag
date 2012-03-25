var ec2_VpnGatewayAttacher = {
    ec2ui_session : null,
    retVal : null,

    attachVpnGateway : function() {
        this.retVal.vpcid = document.getElementById("ec2ui.attachvpngateway.vpcid").value.trim();
        this.retVal.vgwid = document.getElementById("ec2ui.attachvpngateway.vgwid").value.trim();
        
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var vpcMenu = document.getElementById("ec2ui.attachvpngateway.vpcid");
        var vpcs = this.ec2ui_session.model.getVpcs();
        var selectvpc = 0;
        for (var i in vpcs) {
            vpcMenu.appendItem(vpcs[i].id + " (" + vpcs[i].cidr + ")" + (vpcs[i].tag == null ? '' : " [" + vpcs[i].tag + "]"), vpcs[i].id)
            if (vpcs[i].id == this.retVal.vpcid)
                selectvpc = i;
        }
        vpcMenu.selectedIndex = selectvpc;

        var vgwMenu = document.getElementById("ec2ui.attachvpngateway.vgwid");
        var vgws = this.ec2ui_session.model.getVpnGateways();
        var selectvgw = 0;
        for (var i in vgws) {
            vgwMenu.appendItem(vgws[i].id + (vgws[i].tag == null ? '' : " [" + vgws[i].tag + "]"), vgws[i].id);
            if (vgws[i].id == this.retVal.vgwid)
                selectvgw = i;
        }
        vgwMenu.selectedIndex = selectvgw;
    },
}
