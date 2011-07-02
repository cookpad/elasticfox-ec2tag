var ec2_RegisterImageDialogFromSnapshot = {
    id : null,
    ec2ui_session : null,
    retVal : null,

    getAmiName : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.amiName");
    },

    getAmiDescription : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.amiDescription");
    },

    getArchitecture : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.architecture");
    },

    getKernelId : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.kernelId");
    },

    getRamdiskId : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.ramdiskId");
    },

    getDeviceName : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.deviceName");
    },

    getDeleteOnTermination : function() {
        return document.getElementById("ec2ui.registerImageFromSnapshot.deleteOnTermination");
    },

    registerImage : function() {
        this.retVal.amiName = (this.getAmiName().value || '').trim();

        var amiDescription = (this.getAmiDescription().value || '').trim();
        if (amiDescription) { this.retVal.amiDescription = amiDescription; }

        this.retVal.architecture = this.getArchitecture().selectedItem.value;

        var kernelId = (this.getKernelId().value || '').trim();
        if (kernelId) { this.retVal.kernelId = kernelId; }

        var ramdiskId = (this.getRamdiskId().value || '').trim();
        if (ramdiskId) { this.retVal.ramdiskId = ramdiskId; }

        this.retVal.deviceName = (this.getDeviceName().value || '').trim();
        this.retVal.deleteOnTermination = (!!this.getDeleteOnTermination().checked).toString();

        var regex = new RegExp("^[.0-9a-zA-Z\_\(\)\,\/\-]{3,128}$");
        if (!this.retVal.amiName.match(regex)) {
            alert ("The AMI Name is not formatted properly; it must be 3-128 characters "+
                   "in length containing alphanumerics, parantheses, commas, slashes, dashes, and underscores.");
            return false;
        }

        if (!this.retVal.deviceName) {
            alert("You must enter a device name (e.g. /dev/sda1)");
            return false;
        }

        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.id = window.arguments[0];
        this.ec2ui_session = window.arguments[1];
        this.retVal = window.arguments[2];

        document.getElementById("ec2ui.registerImageFromSnapshot.snapshotid").value = this.id;
        this.getAmiName().select();
    }
}
