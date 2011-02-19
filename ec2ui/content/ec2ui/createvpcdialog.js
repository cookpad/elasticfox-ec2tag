var ec2_VpcCreator = {
    ec2ui_session : null,
    retVal : null,

    createVpc : function() {
        this.retVal.cidr = document.getElementById("ec2ui.newvpc.cidr").value.trim();
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];
    }
}
