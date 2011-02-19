var ec2ui_SecurityGroupsTreeView = {
    COLNAMES : ['securitygroup.ownerId','securitygroup.name','securitygroup.description'],
    treeBox : null,
    selection : null,
    groupList : new Array(),
    registered : false,

    get rowCount() { return this.groupList.length; },

    setTree     : function(treeBox)     { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.groupList[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)         { return false;},
    isSeparator: function(idx)         { return false; },
    isSorted: function()               { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        var sel = this.getSelectedGroup();
        cycleHeader(
            col,
            document,
            this.COLNAMES,
            this.groupList);
        this.selectionChanged();
        this.treeBox.invalidate();
        if (sel) {
            log(sel.name + ": Select this group post sort");
            this.selectByName(sel.name);
        } else {
            log("The selected group is null!");
        }
    },

    viewDetails : function(event) {
        var group = this.getSelectedGroup();
        if (group == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_securitygroup_details.xul", null, "chrome,centerscreen,modal", group);
    },

    sort : function() {
        var sel = this.getSelectedGroup();
        sortView(document, this.COLNAMES, this.groupList);
        if (sel) this.selectByName(sel.name);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },

    selectByName : function(name) {
        this.selection.clearSelection();
        for(var i in this.groupList) {
            if (this.groupList[i].name == name) {
                this.selection.select(i);
                this.treeBox.ensureRowIsVisible(i);
                return;
            }
        }

        // In case we don't find a match (which is probably a bug).
        this.selection.select(0);
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'securitygroups');
        }
    },

    invalidate: function() {
        this.displayGroups(ec2ui_session.model.securityGroups);
    },

    refresh: function() {
        ec2ui_session.controller.describeSecurityGroups();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    getSelectedGroup : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.groupList[index];
    },

    selectionChanged : function() {
        var index = this.selection.currentIndex;
        if (index == -1) return;

        var group = this.groupList[index];
        ec2ui_PermissionsTreeView.displayPermissions(group.permissions);
    },

    createNewGroup : function () {
        var retVal = {ok:null,name:null,description:null};
        window.openDialog("chrome://ec2ui/content/dialog_create_security_group.xul", null, "chrome,centerscreen,modal", ec2ui_session, retVal);

        if (retVal.ok) {
            ec2ui_session.showBusyCursor(true);
            var me = this;
            var wrap = function() {
                me.refresh();
                me.selectByName(retVal.name);
            }
            ec2ui_session.controller.createSecurityGroup(
                retVal.name,
                retVal.description,
                wrap
            );

            this.authorizeCommonProtocolsByUserRequest(retVal);
            ec2ui_session.showBusyCursor(false);
        }
    },

    authorizeCommonProtocolsByUserRequest : function(retVal) {
        var result = {ipAddress:"0.0.0.0"};
        var cidr = null;
        // Determine the CIDR for the protocol authorization request
        switch (retVal.enableProtocolsFor) {
        case "host":
            ec2ui_session.client.queryCheckIP("", result);
            cidr = result.ipAddress.trim() + "/32";
            break;
        case "network":
            ec2ui_session.client.queryCheckIP("block", result);
            cidr = result.ipAddress.trim();
            break;
        default:
            cidr = null;
            break;
        }

        // Need to authorize SSH and RDP for either this host or the network.
        if (cidr != null) {
            var wrap = function() {
                if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                    ec2ui_SecurityGroupsTreeView.refresh();
                    ec2ui_SecurityGroupsTreeView.selectByName(retVal.name);
                }
            }

            // 1st enable SSH
            ec2ui_session.controller.authorizeSourceCIDR(
                retVal.name,
                "tcp",
                protPortMap["ssh"],
                protPortMap["ssh"],
                cidr,
                null
                );

            // enable RDP and refresh the view
            ec2ui_session.controller.authorizeSourceCIDR(
                retVal.name,
                "tcp",
                protPortMap["rdp"],
                protPortMap["rdp"],
                cidr,
                wrap
                );
        } else {
            // User wants to customize the firewall...
            ec2ui_PermissionsTreeView.grantPermission();
        }
    },

    deleteSelected  : function () {
        var group = this.getSelectedGroup();
        if (group == null) return;

        var confirmed = confirm("Delete group "+group.name+"?");
        if (!confirmed)
            return;

        var me = this;
        var wrap = function() {
            me.refresh();
            me.selectByName(group.name);
        }
        ec2ui_session.controller.deleteSecurityGroup(group.name, wrap);
    },

    displayGroups : function (groupList) {
        if (!groupList) { groupList = []; }

        this.treeBox.rowCountChanged(0, -this.groupList.length);
        this.groupList = groupList;
        this.treeBox.rowCountChanged(0, this.groupList.length);
        this.sort();

        ec2ui_PermissionsTreeView.displayPermissions([]);

        if (groupList.length > 0) {
            this.selection.select(0);
        }
    }
};

ec2ui_SecurityGroupsTreeView.register();
