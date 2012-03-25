var ec2_ENIDialogSecurityGroup = {
  securityGroupDialogOnLoad: function() {
    var eni = window.arguments[0];
    var groups = window.arguments[1];

    function isIncludedInGroupList(name) {
      var groupList = eni.groupList;

      for (var i = 0; i < groupList.length; i++) {
        if (name == groupList[i]) {
          return true;
        }
      }

      return false;
    }

    var label = document.getElementById('eni-security-group-dialog-security-group-label');
    label.value = eni.networkInterfaceId + ' (' + eni.description + ') Security Group';

    var list = document.getElementById('eni-security-group-dialog-security-group-list');
    var groupArray = [];

    for (var name in groups) {
      groupArray.push(name);
    }

    groupArray.sort();

    for (var i = 0; i < groupArray.length; i++) {
      var name = groupArray[i];
      var label = name;

      if (isIncludedInGroupList(name)) {
        label = label + ' (*)';
      }

      list.appendItem(label, name);
    }

    return true;
  },

  securityGroupDialogDoOK: function() {
    var list = document.getElementById('eni-security-group-dialog-security-group-list');

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
