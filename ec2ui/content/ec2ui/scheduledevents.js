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

    getSelectedScheduledEvents : function() {
        var events = new Array();

        for(var i in this.scheduledEventList) {
            if (this.selection.isSelected(i)) {
                events.push(this.scheduledEventList[i]);
            }
        }

        return events;
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'scheduledEvents');
        }
    },

    invalidate: function() {
      var treeView = ec2ui_ScheduledEventsTreeView;
      treeView.displayScheduledEvents(treeView.filterScheduledEvents(ec2ui_session.model.instanceStatuses));
    },

    refresh: function() {
        ec2ui_session.controller.describeInstanceStatus();
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

    filterScheduledEvents: function(scheduledEvents) {
        var searchText = this.getSearchText();

        if (!searchText) {
            return scheduledEvents;
        }

        var newList = new Array();
        var patt = new RegExp(searchText, "i");

        for(var i = 0; i < scheduledEvents.length; i++) {
            var event = scheduledEvents[i]

            if (this.scheduledeventMatchesSearch(event, patt)) {
                newList.push(event);
            }
        }

        return newList;
    },

    getSearchText: function() {
        return document.getElementById('ec2ui.scheduledevents.search').value;
    },

    scheduledeventMatchesSearch: function(event, patt) {
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
        var events = this.getSelectedScheduledEvents();

        if (events == null || events.length < 1) {
            return;
        }

        var fieldValues = [];

        for (var i = 0; i < events.length; i++) {
            fieldValues.push(events[i][fieldName]);
        }

        copyToClipboard(fieldValues.join("\n"));
    },

    selectInstance: function() {
        var scheduledEvent = this.getSelectedScheduledEvent();
        if (scheduledEvent == null) { return; }

        ec2ui_InstancesTreeView.selectByInstanceId(scheduledEvent.instanceId);
        ec2ui_InstancesTreeView.setSearchText(scheduledEvent.instanceId);
        var tabPanel = document.getElementById("ec2ui.primary.tabs");
        tabPanel.selectedIndex = 0;
    },

    displayScheduledEvents: function (scheduledEventList) {
        if (!scheduledEventList) { scheduledEventList = []; }

        this.treeBox.rowCountChanged(0, -this.scheduledEventList.length);
        this.scheduledEventList = scheduledEventList;
        this.treeBox.rowCountChanged(0, this.scheduledEventList.length);
        this.sort();
        this.selection.clearSelection();
    }
};

ec2ui_ScheduledEventsTreeView.register();
