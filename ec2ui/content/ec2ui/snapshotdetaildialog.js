var ec2_SnapshotDetails = {
    init : function() {
        var snapshot = window.arguments[0];
        document.getElementById("ec2ui.snapshot.id").value = snapshot.id;
        document.getElementById("ec2ui.snapshot.volumeId").value = snapshot.volumeId;
        document.getElementById("ec2ui.snapshot.status").value = snapshot.status;
        document.getElementById("ec2ui.snapshot.startTime").value = snapshot.startTime;
        document.getElementById("ec2ui.snapshot.progress").value = snapshot.progress;
        document.getElementById("ec2ui.snapshot.tag").value = snapshot.tag || "";
        document.getElementById("ec2ui.snapshot.owner").value = snapshot.owner || "";
        document.getElementById("ec2ui.snapshot.ownerAlias").value = snapshot.ownerAlias || "";
        document.getElementById("ec2ui.snapshot.description").value = snapshot.description;
        document.getElementById("ec2ui.snapshot.volumeSize").value = snapshot.volumeSize;
    }
}
