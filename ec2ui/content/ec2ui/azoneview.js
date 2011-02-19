var ec2ui_AvailZoneTreeView = {
    COLNAMES : ['azone.name','azone.state'],
    treeBox : null,
    selection : null,
    arrLocalFiles : new Array(),
    zoneList : new Array(),
    registered : false,

    get rowCount() { return this.zoneList.length; },

    setTree      : function(treeBox)            { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.zoneList[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)            { return false;},
    isSeparator: function(idx)            { return false; },
    isSorted: function()                    { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        cycleHeader(
        col,
        document,
        this.COLNAMES,
        this.zoneList);
    },

    sort : function() {
        sortView(document, this.COLNAMES, this.zoneList);
    },

    selectionChanged: function() {},
    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'azones');
        }
    },

    invalidate: function() {
        this.displayZones(ec2ui_session.model.azones);
    },

    refresh: function() {
        ec2ui_session.controller.describeAvailabilityZones();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    displayZones : function (zoneList) {
        if (!zoneList) { zoneList = []; }

        this.treeBox.rowCountChanged(0, -this.zoneList.length);
        this.zoneList = zoneList;
        this.treeBox.rowCountChanged(0, this.zoneList.length);
        this.sort();
        this.selection.clearSelection();
        if (zoneList.length > 0) {
            this.selection.select(0);
        }
    }
};

ec2ui_AvailZoneTreeView.register();
