var ec2_AMIDetails = {
    init : function() {
        var image = window.arguments[0];
        document.getElementById("ec2ui.ami.id").value = image.id;
        document.getElementById("ec2ui.ami.location").value = image.location;
        document.getElementById("ec2ui.ami.aki").value = image.aki;
        document.getElementById("ec2ui.ami.ari").value = image.ari;
        document.getElementById("ec2ui.ami.state").value = image.state;
        document.getElementById("ec2ui.ami.ownerid").value = image.owner;
        document.getElementById("ec2ui.ami.ispublic").value = image.isPublic;
        document.getElementById("ec2ui.ami.arch").value = image.arch;
        document.getElementById("ec2ui.ami.platform").value = image.platform;
        document.getElementById("ec2ui.ami.snapshotId").value = image.snapshotId;
        document.getElementById("ec2ui.ami.tag").value = image.tag || "";
    }
}
