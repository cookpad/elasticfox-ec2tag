var ec2_SecurityGroupDetails = {
    init : function() {
        var group = window.arguments[0];
        document.getElementById("ec2ui.secgroup.name").value = group.name;
        document.getElementById("ec2ui.secgroup.ownerid").value = group.ownerId;
        document.getElementById("ec2ui.secgroup.description").value = group.description;
    }
}
