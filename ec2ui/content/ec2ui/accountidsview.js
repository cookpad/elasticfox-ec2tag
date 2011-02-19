var ec2ui_accountIdsTreeView = {
    COLNAMES : ['accountids.accountid','accountids.displayname'],
    treeBox: null,
    selection: null,
    accountidlist : new Array(),

    get rowCount() { return this.accountidlist.length; },
    setTree     : function(treeBox)    { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.accountidlist[idx][member];
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
            this.accountidlist);
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

    setMapping : function(mapping) {
        this.treeBox.rowCountChanged(0, -this.accountidlist.length);
        // Unpack the map into an array for display purposes
        this.accountidlist = mapping.toArray(function(k,v){return new AccountIdName(k, v)});
        this.treeBox.rowCountChanged(0, this.accountidlist.length);
        sortView(document, this.COLNAMES, this.accountidlist);
    },

    selectAccountName : function(index) {
        this.selection.select(index);
    },

    getSelectedAccount : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.accountidlist[index];
    }
};
