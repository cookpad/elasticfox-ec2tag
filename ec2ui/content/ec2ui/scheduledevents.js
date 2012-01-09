var ec2ui_ScheduledEventsTreeView = {
    COLNAMES : [
        'scheduledevents.instanceId',
        'scheduledevents.instanceName',
        'scheduledevents.availabilityZone',
        'scheduledevents.code',
        'scheduledevents.description',
        'scheduledevents.startTime',
        'scheduledevents.endTime'
    ],

    treeBox : null,
    selection : null,
    scheduledEventList : new Array(),
    registered : false,

    get rowCount() { return this.scheduledEventList.length; },

    setTree: function(treeBox) { this.treeBox = treeBox; },

    getCellText : function(idx, column) {
        if (idx >= this.rowCount) { return ""; }
        var member = column.id.split(".").pop();
        return this.scheduledEventList[idx][member];
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
          this.scheduledEventList);

        this.treeBox.invalidate();
    },

    sort: function() {
        sortView(document, this.COLNAMES, this.scheduledEventList);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel: function(idx) { return 0; },

    getSelectedScheduledEvent : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) { return null; }
        return this.scheduledEventList[index];
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'scheduledEvents');
        }
    },

    invalidate: function() {
        this.displayScheduledEvent(ec2ui_session.model.instanceStatuses);
    },

    refresh: function() {
        ec2ui_session.controller.describeInstanceStatus();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    copyToClipBoard: function(fieldName) {
        var scheduledEvent = this.getSelectedScheduledEvent();
        if (scheduledEvent == null) { return; }
        copyToClipboard(scheduledEvent[fieldName]);
    },

    displayScheduledEvent : function (scheduledEventList) {
        if (!scheduledEventList) { scheduledEventList = []; }

        this.treeBox.rowCountChanged(0, -this.scheduledEventList.length);
        this.scheduledEventList = scheduledEventList;
        this.treeBox.rowCountChanged(0, this.scheduledEventList.length);
        this.sort();
        this.selection.clearSelection();
    }
};

ec2ui_ScheduledEventsTreeView.register();
