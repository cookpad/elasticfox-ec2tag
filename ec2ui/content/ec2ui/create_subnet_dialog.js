var ec2_SubnetCreator = {
    ec2ui_session : null,
    retVal : null,

    createSubnet : function() {
        this.retVal.vpcid = document.getElementById("ec2ui.newsubnet.vpcid").value.trim();
        this.retVal.cidr = document.getElementById("ec2ui.newsubnet.cidr").value.trim();
        this.retVal.az = document.getElementById("ec2ui.newsubnet.az").value.trim();
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var vpcMenu = document.getElementById("ec2ui.newsubnet.vpcid");
        var vpcs = this.ec2ui_session.model.getVpcs();
        var selectvpc = 0;
        for (var i in vpcs) {
            vpcMenu.appendItem(vpcs[i].id + " (" + vpcs[i].cidr + ") " + (vpcs[i].tag == null ? '' : " [" + vpcs[i].tag + "]"), vpcs[i].id);
            if (vpcs[i].id == this.retVal.vpcid)
                selectvpc = i;
        }
        vpcMenu.selectedIndex = selectvpc;

        var availZoneMenu = document.getElementById("ec2ui.newsubnet.az");
        availZoneMenu.appendItem("<any>", null);
        var availZones = this.ec2ui_session.model.getAvailabilityZones();
        for (var i in availZones) {
            availZoneMenu.appendItem(availZones[i].name + " (" + availZones[i].state + ")", availZones[i].name);
        }
        availZoneMenu.selectedIndex = 0;

    }
}
