var ec2_SecGroupCreator = {
    ec2ui_session : null,
    retVal : null,

    createGroup : function() {
        if (!this.validateGroupName()) return false;
        if (!this.validateGroupDesc()) return false;
        this.retVal.name = document.getElementById("ec2ui.newsecgroup.name").value.trim();
        this.retVal.description = document.getElementById("ec2ui.newsecgroup.description").value.trim();
        this.retVal.enableProtocolsFor = document.getElementById("ec2ui.newsecgroup.enableprot").selectedItem.value;
        this.retVal.vpcId = document.getElementById("ec2ui.newsecgroup.vpcId").selectedItem.value;
        this.retVal.ok = true;
        return true;
    },

    validateGroupName : function() {
        var textbox = document.getElementById("ec2ui.newsecgroup.name");
        if (textbox.value.trim().length == 0) {
            alert("Please provide a group name");
            textbox.select();
            return false;
        }
        return true;
    },

    validateGroupDesc : function() {
        var textbox = document.getElementById("ec2ui.newsecgroup.description");
        if (textbox.value.trim().length == 0) {
            alert("Please provide a description");
            textbox.select();
            return false;
        }
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        var vpcs = this.ec2ui_session.model.getVpcs();
        var menulist = document.getElementById('ec2ui.newsecgroup.vpcId');

        for (var i in vpcs) {
            menulist.appendItem(vpcs[i].cidr + (vpcs[i].tag == null ? (" [" + vpcs[i].id + "]") : (" [" + vpcs[i].tag + "]")), vpcs[i].id);
        }
    }
}
