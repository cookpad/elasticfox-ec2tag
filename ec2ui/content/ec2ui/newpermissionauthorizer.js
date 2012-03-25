var ec2_Authorizer = {
  group : null,
  unusedSecGroupsList : null,
  usedSecGroupsList : null,
  unused : new Array(),
  used : new Array(),
  ec2ui_session : null,
  retval : null,

  authorize : function() {
    // Get the group's name
    var newPerm = new Object();
    newPerm.groupName = this.group.name;

    // Determine which security tab is selected
    var tabSelected = document.getElementById("ec2ui.newpermission.tabs").selectedItem;

    switch (tabSelected.label) {
      case "External":
      {
        // Need to get the IP etc.
        var radioSel = document.getElementById("ec2ui.newpermission.hostnet.group").selectedItem.value;
        var textbox = null;
        var cidrStr = null;
        var textbox_group = null;
        var textbox_user = null;
        if (radioSel == "host") {
          textbox = document.getElementById("ec2ui.newpermission.source.host");
          if (textbox.value == "") {
            alert("Please provide a source host");
            textbox.select();
            return false;
          }
          cidrStr = textbox.value.trim();
          if (cidrStr.indexOf('/') == -1) {
            cidrStr += "/32";
          }
        } else if (radioSel == "range") {
          textbox = document.getElementById("ec2ui.newpermission.source.range");
          if (textbox.value == "") {
            alert("Please provide a source host range");
            textbox.select();
            return false;
          }
          cidrStr = textbox.value.trim();
        } else if (radioSel == "group") {
          textbox_group = document.getElementById("ec2ui.newpermission.source.group");
          textbox_user = document.getElementById("ec2ui.newpermission.source.user");
          if (!textbox_user.value || !textbox_group.value) {
            alert("Please provide a source group / user");
            return false;
          }

          newPerm.sourceSecurityGroupName = textbox_group.value;
          newPerm.sourceSecurityGroupOwnerId = textbox_user.value;
        }

        if (radioSel != "group") {
          if (!this.validateCIDR(cidrStr, textbox)) {
            return false;
          }
        }

        newPerm.cidrIp = cidrStr;
        var protocol = document.getElementById("ec2ui.newpermission.protocol").value;
        if (protocol == "other") {
          protocol = document.getElementById("ec2ui.newpermission.other").value;
          if (protocol == "tcp" || protocol == "udp") {
            // UDP/TCP
            var fromTextBox = document.getElementById("ec2ui.newpermission.fromport");
            var toTextBox   = document.getElementById("ec2ui.newpermission.toport");
            if (!this.validateMinPort(fromTextBox)) {
              return false;
            }
            newPerm.fromPort = fromTextBox.value.trim();

            if (!this.validateMaxPort(toTextBox, fromTextBox)) {
              return false;
            }
            newPerm.toPort = toTextBox.value.trim();
          } else if (protocol == "icmp") {
            // icmp
            newPerm.fromPort = document.getElementById("ec2ui.newpermission.icmptype").value.trim();
            newPerm.toPort = document.getElementById("ec2ui.newpermission.icmpcode").value.trim();
          }
        } else {
          newPerm.toPort = document.getElementById("ec2ui.newpermission.knownport").value.trim();
          newPerm.fromPort = document.getElementById("ec2ui.newpermission.knownport").value.trim();

          protocol = document.getElementById("ec2ui.newpermission.protocol.menuitem").value;
        }

        newPerm.ipProtocol = protocol;
        if (newPerm.fromPort == "0" &&
            newPerm.toPort == "65535" &&
            newPerm.cidrIp == "0.0.0.0/0") {
            var fOpen = confirm("This will effectively disable your firewall and open all ports to the world. Continue?");

            // If the user chooses to change these settings,
            // bring the dialog back in focus.
            if (!fOpen) {
                document.getElementById("ec2ui.newpermission.toport").select();
                return false;
            }
        }

        break;
      }
      /*
      case "Group":
      {
        if (!this.validateSourceUserGroup()) {
          return false;
        }

        // Need to get the user and group information
        newPerm.sourceSecurityGroupName = document.getElementById("ec2ui.newpermission.source.group").value.trim();
        newPerm.sourceSecurityGroupOwnerId = document.getElementById("ec2ui.newpermission.source.user").value.trim();

        break;
      }
      */
    }

    this.retVal.ok = true;
    this.retVal.newPerm = newPerm;
    return true;
  },

  validateMinPort : function(minTextBox) {
    var val = parseInt(minTextBox.value);
    if (val < 0 || isNaN(val)) {
      alert("Lower port range bound must be a non-negative integer");
      textbox.select();
      return false;
    }
    return true;
  },

  validateMaxPort : function(maxTextBox, minTextBox) {
    maxval = parseInt(maxTextBox.value);
    if (maxval < 0 || isNaN(maxval)) {
      alert("Upper port range bound must be a non-negative integer");
      maxTexBbox.select();
      return false;
    }
    var minval = parseInt(minTextBox.value);
    if (minval > maxval) {
      alert("Upper port range bound may not be smaller than lower bound");
      alert("Maximum value may not be smaller than minimum value");
      maxTextBox.select();
      return false;
    }
    return true;
  },

  validateCIDR : function(cidrStr, textbox) {
    var cidrre = new RegExp("^\\d+\\.\\d+\\.\\d+\\.\\d+\\/\\d+$");
    if (cidrStr.match(cidrre) == null) {
      alert("Malformed CIDR, expecting n.n.n.n/n or n.n.n.n");
      textbox.select();
      return false;
    }
    return true;
  },

  validateSourceUserGroup : function() {
    var user = document.getElementById("ec2ui.newpermission.source.user");
    if (user.value == "") {
      alert("Please provide a source user ID");
      user.select();
      return false;
    }
    var group = document.getElementById("ec2ui.newpermission.source.group");
    if (group.value == "") {
      alert("Please provide a source security group name");
      group.select();
      return false;
    }
    return true;
  },

  displayProtocolDetails : function(fDisplay) {
    if (fDisplay) {
      ec2_Authorizer.selectProtocolDataDeck(1);
      ec2_Authorizer.selectProtocolDeck(1);
    } else {
      this.selectProtocolDataDeck(0);
      this.selectProtocolDeck(0);
      var protocol = document.getElementById("ec2ui.newpermission.protocol").value;
      document.getElementById("ec2ui.newpermission.knownport").value = protPortMap[protocol];
    }
  },

  getHostAddress : function() {
    var retVal = {ipAddress:"0.0.0.0"};
    this.ec2ui_session.client.queryCheckIP("", retVal);
    var hostIP = document.getElementById("ec2ui.newpermission.source.host");
    hostIP.value = retVal.ipAddress.replace(/\s/g,'') + "/32";
    document.getElementById("ec2ui.newpermission.hostnet.group").selectedIndex = 0;
  },

  getHostNetwork : function() {
    var retVal = {ipAddress:"0.0.0.0"};
    this.ec2ui_session.client.queryCheckIP("block", retVal);
    var hostSubnet = document.getElementById("ec2ui.newpermission.source.range");
    hostSubnet.value = retVal.ipAddress.replace(/\s/g,'');
    document.getElementById("ec2ui.newpermission.hostnet.group").selectedIndex = 1;
  },

  selectProtocolDeck : function(index) {
    var deck = document.getElementById("ec2ui.newpermission.deck.protocol");
    deck.selectedIndex = index;
  },

  selectProtocolDataDeck : function(index) {
    var deck = document.getElementById("ec2ui.newpermission.deck.protocol.data");
    deck.selectedIndex = index;
  },

  init : function() {
    this.group = window.arguments[0];
    this.ec2ui_session = window.arguments[1];
    this.retVal = window.arguments[2];

    if (this.group == null) {
        return true;
    }
    var permCaption = document.getElementById("ec2ui.newpermission.add.caption");
    permCaption.label = "Add New Permission for Security Group: " + this.group.name;
    var vpcId = this.group.vpcId;
    if (!vpcId) { vpcId = null; }

    var user = document.getElementById("ec2ui.newpermission.source.user");
    user.value = this.group.ownerId;
    var groupMenu = document.getElementById("ec2ui.newpermission.source.group");
    var securityGroups = this.ec2ui_session.model.getSecurityGroups();
    var securityGroupList = [];

    for(var i in securityGroups) {
        if (securityGroups[i].vpcId != vpcId) { continue; }
        securityGroupList.push(securityGroups[i].name);
    }

    securityGroupList.sort();

    for(var i = 0; i < securityGroupList.length; i++) {
        groupMenu.appendItem(securityGroupList[i]);
    }

    groupMenu.selectedIndex = 0;

    // Initialize the Protocol Port for the selected protocol.
    var protocol = document.getElementById("ec2ui.newpermission.protocol").value;
    document.getElementById("ec2ui.newpermission.knownport").value = protPortMap[protocol];
  }
};

