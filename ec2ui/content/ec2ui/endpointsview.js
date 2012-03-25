var ec2ui_endpointsTreeView = {
    COLNAMES: ['endpoint.name','endpoint.url'],
    treeBox: null,
    selection: null,
    endpointlist : new Array(),

    get rowCount()                     { return this.endpointlist.length; },
    setTree     : function(treeBox)    { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.endpointlist[idx][member];
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
            this.endpointlist);
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
        this.treeBox.rowCountChanged(0, -this.endpointlist.length);
        // Unpack the map into an array for display purposes
        this.endpointlist = mapping.toArray(function(k,v){return new Endpoint(k, v.url)});
        this.treeBox.rowCountChanged(0, this.endpointlist.length);
        sortView(document, this.COLNAMES, this.endpointlist);
    },

    selectEndpointName: function(index) {
        this.selection.select(index);
    },

    getSelectedEndPoint : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.endpointlist[index];
    }
};
