var ec2_VpnGatewayCreator = {
    ec2ui_session : null,
    retVal : null,

    createVpnGateway : function() {
        this.retVal.type = document.getElementById("ec2ui.newvpngateway.type").value.trim();
        this.retVal.az = document.getElementById("ec2ui.newvpngateway.az").value.trim();
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var availZoneMenu = document.getElementById("ec2ui.newvpngateway.az");
        availZoneMenu.appendItem("<any>", null);
        var availZones = this.ec2ui_session.model.getAvailabilityZones();
        for (var i in availZones) {
            availZoneMenu.appendItem(availZones[i].name + " (" + availZones[i].state + ")", availZones[i].name);
        }
        availZoneMenu.selectedIndex = 0;

        var type = document.getElementById("ec2ui.newvpngateway.type");
        type.value = "ipsec.1";
    }
}
