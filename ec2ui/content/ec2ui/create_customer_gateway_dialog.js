var ec2_CustomerGatewayCreator = {
    ec2ui_session : null,
    retVal : null,

    createCustomerGateway : function() {
        this.retVal.ipaddress = document.getElementById("ec2ui.newcustomergateway.ipaddress").value.trim();
        this.retVal.bgpasn = document.getElementById("ec2ui.newcustomergateway.bgpasn").value.trim();
        this.retVal.type = document.getElementById("ec2ui.newcustomergateway.type").value.trim();
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var type = document.getElementById("ec2ui.newcustomergateway.type");
        type.value = "ipsec.1";
    }
}
