var ec2_DialogAttachENI = {
  onLoad: function() {
    var ec2ui_session = window.arguments[0];
    var eni = window.arguments[1];

    document.getElementById('ec2ui.attacheni.networkInterfaceId').value = eni.networkInterfaceId;

    var instances = ec2ui_session.model.getInstances();
    var list = document.getElementById('ec2ui.attacheni.instanceIds');

    for (var i = 0; i < instances.length; i++) {
      var instance = instances[i];
      if (instance.subnetId != eni.subnetId) { continue; }

      var label = (instance.name || '(no name)') + '@' + instance.id;
      list.appendItem(label, instance.id);
    }

    return true;
  },

  doOK: function() {
    var list = document.getElementById('ec2ui.attacheni.instanceIds');
    var instance = list.selectedItem;

    if (!instance) {
      alert('Please select instance.');
      return false;
    }

    var devidx = (document.getElementById('ec2ui.attacheni.deviceIndex').value || '').trim();

    if (!devidx) {
      alert('Please input device index.');
      return false;
    }

    if (!/^\d+$/.test(devidx)) {
      alert('Invalid device index.');
      return false;
    }

    var returnValue = window.arguments[2];
    returnValue.accepted = true;
    returnValue.instanceId = instance.value;
    returnValue.deviceIndex = devidx;

    return true;
  }
};
