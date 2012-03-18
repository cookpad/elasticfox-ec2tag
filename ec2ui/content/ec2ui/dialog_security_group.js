var ec2_DialogSecurityGroup = {
  securityGroupDialogOnLoad: function() {
    var instance = window.arguments[0];
    var groups = window.arguments[1];

    function isIncludedInGroupList(name) {
      var groupList = instance.groupList;

      for (var i = 0; i < groupList.length; i++) {
        if (name == groupList[i]) {
          return true;
        }
      }

      return false;
    }

    var instanceName = instance.name || '(no name)';
    var label = document.getElementById('security-group-dialog-security-group-label');
    label.value = instanceName + '@' + instance.id + ' Security Group';

    var list = document.getElementById('security-group-dialog-security-group-list');

    for (var name in groups) {
      var label = name;

      if (isIncludedInGroupList(name)) {
        label = label + ' (*)';
      }

      list.appendItem(label, name);
    }
  },

  securityGroupDialogDoOK: function() {
    var list = document.getElementById('security-group-dialog-security-group-list');

    if (list.selectedItems.length == 0) {
      alert('Please choose one or more security groups.');
      return false;
    }

    var newGroups = [];

    for (var i = 0; i < list.selectedItems.length; i++) {
      var selected = list.selectedItems[i];
      newGroups.push(selected.value);
    }

    var returnValue = window.arguments[2];
    returnValue.accepted = true;
    returnValue.newGroups = newGroups;

    return true;
  }
};
