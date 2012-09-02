var ec2ui_ENITreeView = {
    COLNAMES : [
        'eni.networkInterfaceId',
        'eni.subnetId',
        'eni.vpcId',
        'eni.availabilityZone',
        'eni.description',
        'eni.ownerId',
        'eni.requesterManaged',
        'eni.status',
        'eni.macAddress',
        'eni.privateIpAddress',
        'eni.sourceDestCheck',
        'eni.groups',
        'eni.attachmentId',
        'eni.instanceId',
        'eni.instanceName',
        'eni.deviceIndex',
        'eni.ipAddrs',
    ],

    treeBox : null,
    selection : null,
    networkInterfaceList : new Array(),
    registered : false,

    get rowCount() { return this.networkInterfaceList.length; },

    setTree: function(treeBox) { this.treeBox = treeBox; },

    getCellText : function(idx, column) {
        if (idx >= this.rowCount) { return ""; }
        var member = column.id.split(".").pop();
        return this.networkInterfaceList[idx][member];
    },

    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx) { return false;},
    isSeparator: function(idx) { return false; },
    isSorted: function() { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx, column) {},
    getCellValue: function(idx, column) {},

    cycleHeader: function(col) {
        cycleHeader(
          col,
          document,
          this.COLNAMES,
          this.networkInterfaceList);

        this.treeBox.invalidate();
    },

    sort: function() {
        sortView(document, this.COLNAMES, this.networkInterfaceList);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel: function(idx) { return 0; },

    getSelectedNetworkInterface : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) { return null; }
        return this.networkInterfaceList[index];
    },

    createNetworkInterface : function() {
        var subnets = ec2ui_session.model.getSubnets();

        if (!subnets) {
            return;
        }

        if (subnets.length == 0) {
            alert('Please create one or more subnets.');
            return;
        }

        var returnValue = {accepted:false, result:null};

        openDialog('chrome://ec2ui/content/dialog_new_interface.xul',
                   null,
                   'chrome,centerscreen,modal',
                   ec2ui_session,
                   returnValue);

        if (returnValue.accepted) {
          var me = this;

          ec2ui_session.controller.createNetworkInterface(returnValue.subnet.vpcId, returnValue.subnet.id, returnValue.privateipaddress, returnValue.description, returnValue.groups, function() {
            me.refresh();
          });
        }
    },

    attachNetworkInterface : function() {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var returnValue = {accepted:false, result:null};

        openDialog('chrome://ec2ui/content/dialog_attach_eni.xul',
                   null,
                   'chrome,centerscreen,modal',
                   ec2ui_session,
                   eni,
                   returnValue);

        if (returnValue.accepted) {
            var me = this;

            ec2ui_session.controller.attachNetworkInterface(eni.networkInterfaceId, returnValue.instanceId, returnValue.deviceIndex, function() {
                me.refresh();
                me.selectByNetworkInterfaceId(eni.networkInterfaceId);
            });
        }
    },

    detachNetworkInterface : function(force) {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        if (!eni.attachmentId) {
            alert("Could not find Attachment ID");
            return;
        }

        var msg = null;

        if (force) {
            msg = "Force detach interface " + eni.networkInterfaceId + " (" + eni.description + ") from " + (eni.instanceName || "(no name)") + "@" + eni.instanceId +  "?";
        } else {
            msg = "Detach interface " + eni.networkInterfaceId + " (" + eni.description + ") from " + (eni.instanceName || "(no name)") + "@" + eni.instanceId +  "?";
        }

        var is_detach = confirm(msg);
        if (!is_detach) { return; }

        var me = this;

        ec2ui_session.controller.detachNetworkInterface(eni.attachmentId, force, function() {
            me.refresh();
            me.selectByNetworkInterfaceId(eni.networkInterfaceId);
        });
    },

    deleteNetworkInterface : function () {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var is_delete = confirm("Delete interface " + eni.networkInterfaceId + " (" + eni.description + ")?");
        if (!is_delete) { return; }

        var me = this;

        ec2ui_session.controller.deleteNetworkInterface(eni.networkInterfaceId, function() {
            me.refresh();
        });
    },

    changeSecurityGroup: function() {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var returnValue = {accepted:false , result:null};
        var groups = ec2ui_model.getSecurityGroupNameIds(eni.vpcId);

        openDialog('chrome://ec2ui/content/dialog_eni_security_group.xul',
                   null,
                   'chrome,centerscreen,modal',
                   eni,
                   groups,
                   returnValue);

        if (!returnValue.accepted) {
            return;
        }

        var oldGroups = [];

        for (var i = 0; i < eni.groupList.length; i++) {
          oldGroups.push(eni.groupList[i]);
        }

        oldGroups.sort();

        var newGroups = returnValue.newGroups;
        newGroups.sort();

        if (oldGroups.join() == newGroups.join()) {
            return;
        }

        var attributes = [];

        for (var i = 0; i < newGroups.length; i++) {
            var groupId = groups[newGroups[i]];

            if (groupId) {
                attributes.push(['SecurityGroupId.' + (i + 1), groupId]);
            }
        }

        var me = this;

        ec2ui_session.controller.modifyNetworkInterfaceAttributes(eni.networkInterfaceId, attributes, function() {
            me.refresh();
            me.selectByNetworkInterfaceId(eni.networkInterfaceId);
        });
    },

    changeSourceDestCheck : function() {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var msg = null;
        var value = (eni.sourceDestCheck == "true");

        if (value) {
            msg = "Change Source / Dest Check: enable -> disable ?";
        } else {
            msg = "Change Source / Dest Check: disable -> enable ?";
        }

        if (confirm(msg)) {
            var me = this;

            ec2ui_session.controller.modifyNetworkInterfaceAttribute(eni.networkInterfaceId, ["SourceDestCheck", !value], function() {
                me.refresh();
                me.selectByNetworkInterfaceId(eni.networkInterfaceId);
            });
        }
    },

    changeDescription : function() {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var newDesc = (prompt("New description", eni.description) || '').trim();
        if (!newDesc) { return; }

        var me = this;

        ec2ui_session.controller.modifyNetworkInterfaceAttribute(eni.networkInterfaceId, ["Description", newDesc], function() {
            me.refresh();
            me.selectByNetworkInterfaceId(eni.networkInterfaceId);
        });
    },

    changePrivateIpAddresses: function() {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var me = this;

        ec2ui_session.controller.describePrivateIpAddresses(eni.networkInterfaceId, function(list) {
            var returnValue = {accepted:false , addrs:null, reassign:null};

            var current_ip_addrs = new Array();

            for (var i = 0; i < list.length; i++) {
                if (list[i][1] != 'true') {
                    current_ip_addrs.push(list[i][0]);
                }
            }

            openDialog('chrome://ec2ui/content/dialog_private_ip_address.xul',
                       null,
                       'chrome,centerscreen,modal,width=400,height=250',
                       current_ip_addrs,
                       returnValue);

            if (returnValue.accepted) {
                var new_ip_addrs = (returnValue.addrs || '');
                me.updatePrivateIpAddresses(eni.networkInterfaceId, current_ip_addrs.join(","), new_ip_addrs, returnValue.reassign);
            }
        });
    },

    updatePrivateIpAddresses: function(eni_id, current_ip_addrs, new_ip_addrs, reassign) {
        function normalize(addrs) {
            var hash = new Object();
            addrs = (addrs || '').trim().split(',');

            for (var i = 0; i < addrs.length; i++) {
                var ip_addr = (addrs[i] || '').trim();
                if (ip_addr) { hash[ip_addr] = 1; }
            }

            return hash;
        }

        current_ip_addrs = normalize(current_ip_addrs);
        new_ip_addrs = normalize(new_ip_addrs);

        var assigns = new Array();
        var unassigns = new Array();

        for (var ip_addr in new_ip_addrs) {
            if (!current_ip_addrs[ip_addr]) {
                assigns.push(ip_addr);
            }
        }

        for (var ip_addr in current_ip_addrs) {
            if (!new_ip_addrs[ip_addr]) {
                unassigns.push(ip_addr);
            }
        }

        var me = this;

        var assignFunc = function() {
            if (assigns.length > 0) {
                ec2ui_session.controller.assignPrivateIpAddresses(eni_id, assigns, reassign);
            }

            me.refresh();
            me.selectByNetworkInterfaceId(eni_id);
        }

        if (unassigns.length > 0) {
            ec2ui_session.controller.unassignPrivateIpAddresses(eni_id, unassigns, assignFunc);
        } else {
            assignFunc();
        }
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'networkInterfaces');
        }
    },

    invalidate: function() {
        var treeView = ec2ui_ENITreeView;
        treeView.displayNetworkInterfaces(treeView.filterNetworkInterfaces(ec2ui_session.model.networkInterfaces));
    },

    refresh: function() {
        ec2ui_session.controller.describeNetworkInterfaces();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    searchChanged: function(event) {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    },

    filterNetworkInterfaces: function(networkInterfaces) {
        var searchText = this.getSearchText();
        var filterEth0 = document.getElementById("ec2ui.eni.noeth0").checked;

        if (!searchText && !filterEth0) {
            return networkInterfaces;
        }

        var newList = new Array();
        var patt = searchText ? new RegExp(searchText, "i") : null;

        for(var i = 0; i < networkInterfaces.length; i++) {
            var eni = networkInterfaces[i]

            if (filterEth0 && eni.deviceIndex == 0) {
                continue;
            }

            if (!patt) {
                newList.push(eni);
            } else if (this.networkInterfaceMatchesSearch(eni, patt)) {
                newList.push(eni);
            }
        }

        return newList;
    },

    getSearchText: function() {
        return document.getElementById('ec2ui.eni.search').value;
    },

    networkInterfaceMatchesSearch: function(eni, patt) {
        if (!eni || !patt) { return false; }

        for (var i = 0; i < this.COLNAMES.length; i++) {
            var member = this.COLNAMES[i].split(".").pop();
            var text = eni[member];

            if (text && text.match(patt)) {
                return true;
            }
        }

        return false;
    },

    copyToClipBoard: function(fieldName) {
        var networkInterface = this.getSelectedNetworkInterface();
        if (networkInterface == null) { return; }
        copyToClipboard(networkInterface[fieldName]);
    },

    displayNetworkInterfaces: function (networkInterfaceList) {
        if (!networkInterfaceList) { networkInterfaceList = []; }

        this.treeBox.rowCountChanged(0, -this.networkInterfaceList.length);
        this.networkInterfaceList = networkInterfaceList;
        this.treeBox.rowCountChanged(0, this.networkInterfaceList.length);
        this.sort();
        this.selection.clearSelection();
    },

    selectByNetworkInterfaceId : function(id) {
        var len = this.networkInterfaceList.length;

        for(var i = 0; i < len; ++i) {
            var eni = this.networkInterfaceList[i];

            if (eni.networkInterfaceId == id) {
                this.selection.toggleSelect(i);
                return;
            }
        }
    }
};

ec2ui_ENITreeView.register();
