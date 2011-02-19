var ec2ui_credentialsTreeView = {
    COLNAMES: ['credential.name','credential.accessKey'],
    treeBox: null,
    selection: null,
    credentials : new Array(),

    get rowCount() { return this.credentials.length; },
    setTree     : function(treeBox) { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.credentials[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)         { return false;},
    isSeparator: function(idx)         { return false; },
    isSorted: function()               { return false; },
    getImageSrc: function(idx, column) { return "" ; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        cycleHeader(
            col,
            document,
            this.COLNAMES,
            this.credentials);
        this.treeBox.invalidate();
    },
    selectionChanged: function() {},
    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },

    setAccountCredentials : function(creds) {
        this.treeBox.rowCountChanged(0, -this.credentials.length);
        this.credentials = new Array();
        if (creds) {
            this.credentials = this.credentials.concat(creds);
        }
        this.treeBox.rowCountChanged(0, this.credentials.length);
        this.treeBox.invalidate();
        this.selection.clearSelection();
        sortView(document, this.COLNAMES, this.credentials);
    },

    selectAccountName : function(index) {
        this.selection.select(index);
    },

    getSelectedCredentials : function() {
        var index =  this.selection.currentIndex;

        if (index == -1) return null;
        return this.credentials[index];
    }
};
