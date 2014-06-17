var ec2_VolumeCreator = {
    ec2ui_session : null,
    retVal : null,

    create : function() {
        this.retVal.size = document.getElementById("ec2ui.newvolume.size").value.trim();
        if (this.retVal.size.length == 0) this.retVal.size = null;

        this.retVal.snapshotId = document.getElementById("ec2ui.newvolume.snapshotId").value.trim();
        if (this.retVal.snapshotId.length == 0 ||
                this.retVal.snapshotId.indexOf("<none>") == 0) {
                this.retVal.snapshotId = null;
        }

        this.retVal.zone = document.getElementById("ec2ui.newvolume.availabilityzonelist").value;

        this.retVal.volumeType = document.getElementById("ec2ui.newvolume.volumetypelist").value;

        this.retVal.iops = document.getElementById("ec2ui.newvolume.iops").value.trim();
        if (this.retVal.iops.length == 0) this.retVal.iops = null;

        this.retVal.checked = document.getElementById("ec2ui.newvolume.encrypted").checked;

        if (!this.validateSize()) return false;
        if (!this.validateIops()) return false;

        this.retVal.tag = document.getElementById("ec2ui.newvolume.tag").value.trim();
        this.retVal.ok = true;
        return true;
    },

    validateSize : function() {
        var val = (this.retVal.size != null) ? this.retVal.size : "";
        val = parseInt(val);
        var textbox = document.getElementById("ec2ui.newvolume.size");
        if ((!isNaN(val) && val < 1) || (isNaN(val) && this.retVal.snapshotId == null)) {
            alert("Size must be >= 1 if a snapshot is not selected");
            textbox.select();
            return false;
        }

        return true;
    },

    validateIops : function() {
        var val = (this.retVal.size != null) ? this.retVal.size : "";
        val = parseInt(val);
        var textbox = document.getElementById("ec2ui.newvolume.iops");
        if (!isNaN(val) && val < 1) {
            alert("IOPS must be >= 1 if a snapshot is not selected");
            textbox.select();
            return false;
        }

        return true;
    },

    init : function() {
        var srcSnap = window.arguments[0];
        this.ec2ui_session = window.arguments[1];
        this.retVal = window.arguments[2];

        // availability zones
        var availZoneMenu = document.getElementById("ec2ui.newvolume.availabilityzonelist");
        var availZones = this.ec2ui_session.model.getAvailabilityZones();
        for(var i in availZones) {
            availZoneMenu.appendItem(availZones[i].name + " (" + availZones[i].state + ")", availZones[i].name);
        }
        availZoneMenu.selectedIndex = 0;

        // snapshots
        var snapshotIdMenu = document.getElementById("ec2ui.newvolume.snapshotId");
        snapshotIdMenu.appendItem("<none>");
        var snapshots = this.ec2ui_session.model.getSnapshots();
        var snap = null;
        for(var i in snapshots) {
            snap = snapshots[i];
            //if (snap.status == "completed") {
                snapshotIdMenu.appendItem(snap.id);
                if (srcSnap &&
                    snap.id == srcSnap.id) {
                    snapshotIdMenu.selectedIndex = i;
                }
            //}
        }

        // volume types
        var volTypeMenu = document.getElementById("ec2ui.newvolume.volumetypelist");
        volTypeMenu.appendItem("standard", "standard");
        volTypeMenu.appendItem("io1", "io1");
        volTypeMenu.selectedIndex = 0;

        // To accommodate the <NONE> element added at the head of the list
        snapshotIdMenu.selectedIndex += 1;

        if (srcSnap) {
            document.getElementById("ec2ui.newvolume.tag").value = srcSnap.tag || "";
        }
    }
}
