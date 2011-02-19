var ec2_VolumeAttacher = {
  ec2ui_session : null,
  retVal : null,
  volumeId : null,

  attach : function() {
    if (!this.validateDevice()) return false;

    this.retVal.instanceId = document.getElementById("ec2ui.newattachment.instanceId").value.split(":")[0];
    this.retVal.volumeId = this.volumeId;
    this.retVal.device = document.getElementById("ec2ui.newattachment.device").value;

    this.retVal.ok = true;
    return true;
  },

  validateDevice : function() {
    var textbox = document.getElementById("ec2ui.newattachment.device");
    if (textbox.value == "") {
        alert("You must enter a device name (e.g. /dev/sdh)");
        textbox.select();
        return false;
    }
    return true;
  },

  enableOrDisableDeviceField : function() {
    var textbox = document.getElementById("ec2ui.newattachment.device");
    var instanceId = document.getElementById("ec2ui.newattachment.instanceId").value;

    // Since there is a chance that the instanceId has
    // the instance tag appended to it
    instanceId = instanceId.split(":")[0];
    var instances = this.ec2ui_session.model.getInstances();
    var fdisabled = false;
    for (var i in instances) {
        if (instances[i].id == instanceId) {
            // Is this a Windows instance
            if (instances[i].platform == 'windows') {
                fdisabled = true;
                break;
            }
        }
    }
    textbox.disabled = fdisabled;
    if (fdisabled) {
        textbox.value = "windows_device";
    } else {
        textbox.value = "";
    }
  },

  init : function() {
    this.volumeId = window.arguments[0].id;
    this.zone = window.arguments[0].availabilityZone;
    this.ec2ui_session = window.arguments[1];
    this.retVal = window.arguments[2];

    // volume id
    document.getElementById("ec2ui.newattachment.volumeId").value = this.volumeId;
    // instances
    var instanceIdMenu = document.getElementById("ec2ui.newattachment.instanceId");
    var instances = this.ec2ui_session.model.getInstances();
    for (var i in instances) {
        var zone = instances[i].placement.availabilityZone;
        if (this.zone == instances[i].placement.availabilityZone &&
            instances[i].state == "running") {
            var label = instances[i].id;
            var tag = instances[i].tag;
            if (tag && tag.length) {
                label = label + ":" +  tag;
            }
            instanceIdMenu.appendItem(label);
        }
    }
    instanceIdMenu.selectedIndex = 0;

    // Ensure that the device field is enabled or disabled as needed
    var textbox = document.getElementById("ec2ui.newattachment.device");
    if (isWindows(instances[instanceIdMenu.selectedIndex].platform)) {
        textbox.disabled = true;
        textbox.value = "windows_device";
    } else {
        textbox.disabled = false;
        textbox.value = "";
    }

    // Select the instance id menu
    instanceIdMenu.select();

    var az = document.getElementById("ec2ui.newattachment.instanceLabel");
    az.value += " [" + this.zone + "]";
  }
}
