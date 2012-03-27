var ec2ui_VolumesEventsTreeView = {
    COLNAMES : [
        'volumesevents.volumeId',
        'volumesevents.availabilityZone',
        'volumesevents.eventId',
        'volumesevents.eventType',
        'volumesevents.description',
        'volumesevents.startTime',
        'volumesevents.endTime'
    ],

    treeBox : null,
    selection : null,
    volumesEventList : new Array(),
    registered : false,

    get rowCount() { return this.volumesEventList.length; },

    setTree: function(treeBox) { this.treeBox = treeBox; },

    getCellText : function(idx, column) {
        if (idx >= this.rowCount) { return ""; }
        var member = column.id.split(".").pop();
        return this.volumesEventList[idx][member];
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
          this.volumesEventList);

        this.treeBox.invalidate();
    },

    sort: function() {
        sortView(document, this.COLNAMES, this.volumesEventList);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel: function(idx) { return 0; },

    getVolumesEvent : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) { return null; }
        return this.volumesEventList[index];
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'volumesEvents');
        }
    },

    invalidate: function() {
      var treeView = ec2ui_VolumesEventsTreeView;
      treeView.displayVolumesEvents(treeView.filterVolumesEvents(ec2ui_session.model.volumeStatuses));
    },

    refresh: function() {
        ec2ui_session.controller.describeVolumeStatus();
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

    filterVolumesEvents: function(volumesEvents) {
        var searchText = this.getSearchText();

        if (!searchText) {
            return volumesEvents;
        }

        var newList = new Array();
        var patt = new RegExp(searchText, "i");

        for(var i = 0; i < volumesEvents.length; i++) {
            var event = volumesEvents[i]

            if (this.volumesEventMatchesSearch(event, patt)) {
                newList.push(event);
            }
        }

        return newList;
    },

    getSearchText: function() {
        return document.getElementById('ec2ui.volumesevents.search').value;
    },

    volumesEventMatchesSearch: function(event, patt) {
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
        var volumesEvent = this.getVolumesEvent();
        if (volumesEvent == null) { return; }
        copyToClipboard(volumesEvent[fieldName]);
    },

    displayVolumesEvents: function (volumesEventList) {
        if (!volumesEventList) { volumesEventList = []; }

        this.treeBox.rowCountChanged(0, -this.volumesEventList.length);
        this.volumesEventList = volumesEventList;
        this.treeBox.rowCountChanged(0, this.volumesEventList.length);
        this.sort();
        this.selection.clearSelection();
    }
};

ec2ui_VolumesEventsTreeView.register();
