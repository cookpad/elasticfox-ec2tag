var ec2_DhcpoptsAssociator = {
    ec2ui_session : null,
    retVal : null,

    associateDhcpOptions : function() {
        this.retVal.vpcId = document.getElementById("ec2ui.associatedhcpoptions.vpcid").value.trim();
        this.retVal.dhcpOptionsId = document.getElementById("ec2ui.associatedhcpoptions.dhcpoptionsid").value.trim();
        
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];
        // Prepare vpc list
        var vpcMenu = document.getElementById("ec2ui.associatedhcpoptions.vpcid");
        var vpcs = this.ec2ui_session.model.getVpcs();
        var selvpc = 0;
        for (var i in vpcs) {
            if (vpcs[i].id == this.retVal.vpcId)
                selvpc = i;

            vpcMenu.appendItem(vpcs[i].id + " (" + vpcs[i].cidr + ")" + (vpcs[i].tag == null ? '' : " [" + vpcs[i].tag + "]"), vpcs[i].id);
        }
        vpcMenu.selectedIndex = selvpc;

        // Prepare dhcp options list
        var dhcpMenu = document.getElementById("ec2ui.associatedhcpoptions.dhcpoptionsid");
        dhcpMenu.appendItem("Default Options Set", 'default');
        var dhcpopts = this.ec2ui_session.model.getDhcpOptions();
        for (var i in dhcpopts) {
            dhcpMenu.appendItem(dhcpopts[i].id + (dhcpopts[i].tag == null ? '' : " [" + dhcpopts[i].tag + "]"), dhcpopts[i].id);
        }
        dhcpMenu.selectedIndex = 0;
    }
}
