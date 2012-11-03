var ec2_DialogAttachENI = {
  onLoad: function() {
    var ec2ui_session = window.arguments[0];
    var eni = window.arguments[1];

    document.getElementById('ec2ui.attacheni.networkInterfaceId').value = eni.networkInterfaceId;

    var instances = ec2ui_session.model.getInstances();
    var list = document.getElementById('ec2ui.attacheni.instanceIds');
    var labels = [];
    var h_name_id = {};

    for (var i = 0; i < instances.length; i++) {
      var instance = instances[i];
      if (instance.subnetId != eni.subnetId) { continue; }

      var label = (instance.name || '(no name)') + '@' + instance.id;
      labels.push(label);
      h_name_id[label] = instance.id;
    }

    labels.sort();

    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      list.appendItem(label, h_name_id[label]);
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
