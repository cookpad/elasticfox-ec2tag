var ec2ui_PermissionsTreeView = {
    COLNAMES : ['permission.protocol','permission.fromPort','permission.toPort','permission.groups','permission.cidrs'],
    treeBox : null,
    selection : null,
    permissionList : new Array(),

    get rowCount() { return this.permissionList.length; },

    setTree     : function(treeBox)     { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.permissionList[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)         { return false;},
    isSeparator: function(idx)         { return false; },
    isSorted: function()               { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        var perm = this.getSelectedPermission();
        cycleHeader(
            col,
            document,
            this.COLNAMES,
            this.permissionList);
        this.treeBox.invalidate();
        if (perm) {
            log(perm.id + ": Select this permission post sort");
            this.selectByPermission(perm);
        } else {
            log("The selected permission is null!");
        }
    },

    viewDetails : function(event) {
        var perm = this.getSelectedPermission();
        if (perm == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_permission_details.xul", null, "chrome,centerscreen,modal", perm);
    },

    selectByPermission : function(perm) {
        this.selection.clearSelection();
        var permStr = encodeJSONMap(perm);
        for(var i in this.permissionList) {
            var curr = encodeJSONMap(this.permissionList[i]);
            if (curr == permStr) {
                this.selection.select(i);
                this.treeBox.ensureRowIsVisible(i);
                return;
            }
        }

        // In case we don't find a match (which is probably a bug).
        this.selection.select(0);
    },

    sort : function() {
        sortView(document, this.COLNAMES, this.permissionList);
    },

    selectionChanged: function() {},
    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },

    grantPermission : function() {
        var group = ec2ui_SecurityGroupsTreeView.getSelectedGroup();
        if (group == null) return;

        retVal = {ok:null};
        window.openDialog("chrome://ec2ui/content/dialog_new_permission.xul", null, "chrome,centerscreen,modal", group, ec2ui_session, retVal);

        if (retVal.ok) {
            var me = this;
            var wrap = function() {
                if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                    ec2ui_SecurityGroupsTreeView.refresh();
                    ec2ui_SecurityGroupsTreeView.selectByName(group.name);
                }
            }

            var newPerm = retVal.newPerm;
            if (newPerm.cidrIp != null) {
                ec2ui_session.controller.authorizeSourceCIDR(
                    newPerm.groupName,
                    newPerm.ipProtocol,
                    newPerm.fromPort,
                    newPerm.toPort,
                    newPerm.cidrIp,
                    wrap
                    );
            } else {
                ec2ui_session.controller.authorizeSourceGroup(
                    newPerm.groupName,
                    newPerm.sourceSecurityGroupName,
                    newPerm.sourceSecurityGroupOwnerId,
                    wrap
                    );
            }
        }
    },

    getSelectedPermission : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.permissionList[index];
    },

    revokePermission : function() {
        var group = ec2ui_SecurityGroupsTreeView.getSelectedGroup();
        if (group == null) return;
        var perms = new Array();
        for(var i in this.permissionList) {
            if (this.selection.isSelected(i)) {
                perms.push(this.permissionList[i]);
            }
        }
        if (perms.length == 0)
            return;

        var confirmed = confirm("Revoke selected permission(s) on group "+group.name+"?");
        if (!confirmed)
            return;

        ec2ui_session.showBusyCursor(true);
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                ec2ui_SecurityGroupsTreeView.refresh();
                ec2ui_SecurityGroupsTreeView.selectByName(group.name);
            }
        }

        var permission = null;
        for (i in perms) {
            permission = perms[i];
            if (permission.ipRanges.length > 0) {
                ec2ui_session.controller.revokeSourceCIDR(
                group.name,
                permission.protocol,
                permission.fromPort,
                permission.toPort,
                permission.ipRanges[0],
                wrap
                );
            } else {
                ec2ui_session.controller.revokeSourceGroup(
                group.name,
                permission.groupTuples[0][1],
                permission.groupTuples[0][0],
                wrap
                );
            }
        }
        ec2ui_session.showBusyCursor(false);
    },

    displayPermissions : function (permissionList) {
        this.treeBox.rowCountChanged(0, -this.permissionList.length);
        this.permissionList = permissionList;
        this.treeBox.rowCountChanged(0, this.permissionList.length);
        this.sort();
        this.selection.clearSelection();
        if (permissionList.length > 0) {
            this.selection.select(0);
        }
    }
};
