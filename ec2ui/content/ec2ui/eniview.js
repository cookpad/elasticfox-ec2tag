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
        'eni.instanceId',
        'eni.instanceName',
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
                   'chrome,centerscreen,modal,width=400,height=250',
                   ec2ui_session,
                   returnValue);

        if (returnValue.accepted) {
          var me = this;

          ec2ui_session.controller.createNetworkInterface(returnValue.subnet.vpcId, returnValue.subnet.id, returnValue.privateipaddress, returnValue.description, returnValue.groups, function() {
            me.refresh();
          });
        }
    },

    deleteNetworkInterface : function () {
        var eni = this.getSelectedNetworkInterface();
        if (!eni) { return; }

        var is_delete = confirm("Delete interface " + eni.id + " (" + eni.description + ")?");
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

        var newDesc = (prompt("New description") || '').trim();
        if (!newDesc) { return; }

        var me = this;

        ec2ui_session.controller.modifyNetworkInterfaceAttribute(eni.networkInterfaceId, ["Description", newDesc], function() {
            me.refresh();
            me.selectByNetworkInterfaceId(eni.networkInterfaceId);
        });
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

        if (!searchText) {
            return networkInterfaces;
        }

        var newList = new Array();
        var patt = new RegExp(searchText, "i");

        for(var i = 0; i < networkInterfaces.length; i++) {
            var event = networkInterfaces[i]

            if (this.networkInterfaceMatchesSearch(event, patt)) {
                newList.push(event);
            }
        }

        return newList;
    },

    getSearchText: function() {
        return document.getElementById('ec2ui.eni.search').value;
    },

    networkInterfaceMatchesSearch: function(event, patt) {
        if (!event || !patt) { return false; }

        for (var i = 0; i < this.COLNAMES.length; i++) {
            var member = this.COLNAMES[i].split(".").pop();
            var text = event[member];

            if (text.match(patt)) {
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
