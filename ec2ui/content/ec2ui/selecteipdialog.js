var ec2_EIPSelector = {
  ec2ui_session : null,
  instanceId : null,
  retVal : null,
  eipList : null,

  attach : function() {
    var eipMenu = document.getElementById("ec2ui.selectEIP.eip");
    var selected = eipMenu.selectedIndex;

    var eipSel = this.eipList[selected];

    if (eipSel.instanceid != null && eipSel.instanceid != '') {
        var confirmed = confirm("Address " + eipSel.address + " is already mapped to an instance, are you sure?");
        if (!confirmed) {
            return false;
        }
    }

    eipSel.instanceid = this.instanceId;

    this.retVal.ok = true;
    this.retVal.eipMap = eipSel;
    return true;
  },

  init : function() {
    this.ec2ui_session = window.arguments[0];
    this.instanceId = window.arguments[1];
    this.retVal = window.arguments[2];

    var eips = this.ec2ui_session.model.getAddresses();
    this.eipList = new Array();

    // volume id
    document.getElementById("ec2ui.selectEIP.instanceId").value = this.instanceId;
    // instances
    var eipMenu = document.getElementById("ec2ui.selectEIP.eip");
    var eip = null;
    var label = null;
    var tag = null;
    for(var i in eips) {
        eip = eips[i];
        label = eip.address;
        if (!eip.instanceid) {
            tag = eip.tag;
            if (tag && tag.length) {
                label = label + ":" + tag;
            }
            eipMenu.appendItem(label);
            this.eipList.push(eip);
        }
    }

    eipMenu.selectedIndex = 0;
  },
}
