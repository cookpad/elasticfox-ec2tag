var ec2_VolumeDetails = {
    init : function() {
        var volume = window.arguments[0];
        document.getElementById("ec2ui.volume.id").value = volume.id;
        document.getElementById("ec2ui.volume.size").value = volume.size;
        document.getElementById("ec2ui.volume.snapshotId").value = volume.snapshotId;
        document.getElementById("ec2ui.volume.availabilityZone").value = volume.availabilityZone;
        document.getElementById("ec2ui.volume.status").value = volume.status;
        document.getElementById("ec2ui.volume.createTime").value = volume.createTime;
        document.getElementById("ec2ui.volume.instanceId").value = volume.instanceId;
        document.getElementById("ec2ui.volume.device").value = volume.device;
        document.getElementById("ec2ui.volume.attachStatus").value = volume.attachStatus;
        document.getElementById("ec2ui.volume.attachTime").value = volume.attachTime || "";
        document.getElementById("ec2ui.volume.tag").value = volume.tag || "";
    }
}
