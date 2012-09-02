var ec2_DialogNewInterface = {
  ec2ui_session : null,
  subnets : null,

  refreshSecurityGroup: function() {
    var subnetList = document.getElementById('ec2ui.newinterface.subnetids');
    var subnet = this.subnets[subnetList.selectedIndex];

    var groupList = document.getElementById('ec2ui.newinterface.securitygroup.list');

    for (var i = groupList.itemCount - 1; i >= 0; i--) {
      groupList.removeItemAt(i);
    }

    var groupNameIds = this.ec2ui_session.model.getSecurityGroupNameIds(subnet.vpcId);
    var i = 0, defidx = 0;

    for (var name in groupNameIds) {
      //if (name == 'default') {
      //  defidx = i;
      //}

      groupList.appendItem(name, name);
      i++;
    }

    //groupList.selectedIndex = defidx;

    return true;
  },

  onLoad : function() {
    this.ec2ui_session = window.arguments[0];

    this.subnets = this.ec2ui_session.model.getSubnets();
    var subnetList = document.getElementById('ec2ui.newinterface.subnetids');

    for (var i = 0; i < this.subnets.length; i++) {
      var label = this.subnets[i].cidr + " (" + this.subnets[i].id + " / " + this.subnets[i].vpcId + ")";
      subnetList.appendItem(label, this.subnets[i].id);
    }

    subnetList.selectedIndex = 0;

    return true
  },

  doOK: function() {
    var groupList = document.getElementById('ec2ui.newinterface.securitygroup.list');

    if (groupList.selectedItems.length == 0) {
      alert('Please choose one or more security groups.');
      return false;
    }

    var groups = [];

    for (var i = 0; i < groupList.selectedItems.length; i++) {
      var selected = groupList.selectedItems[i];
      groups.push(selected.value);
    }

    var subnetList = document.getElementById('ec2ui.newinterface.subnetids');
    var privateipaddress = (document.getElementById('ec2ui.newinterface.privateipaddress').value || '').trim();
    var description = (document.getElementById('ec2ui.newinterface.description').value || '').trim();

    var returnValue = window.arguments[1];
    returnValue.accepted = true;
    returnValue.subnet = this.subnets[subnetList.selectedIndex];
    returnValue.privateipaddress = privateipaddress;
    returnValue.description = description;
    returnValue.groups = groups;

    return true;
  }
}
