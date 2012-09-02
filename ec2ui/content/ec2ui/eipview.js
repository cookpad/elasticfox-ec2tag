var ec2ui_ElasticIPTreeView = {
    COLNAMES : ['eip.address','eip.allocationId','eip.instanceid','eip.instanceName','eip.networkInterfaceId','eip.domain','eip.associationId'],
    treeBox : null,
    selection : null,
    arrLocalFiles : new Array(),
    eipList : new Array(),
    registered : false,
    imageIdRegex : new RegExp("^\\d+\\.\\d+\\.\\d+\\.\\d+"),

    get rowCount() { return this.eipList.length; },

    setTree     : function(treeBox)         { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.eipList[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)         { return false;},
    isSeparator: function(idx)         { return false; },
    isSorted: function()               { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        var eip = this.getSelectedEip();
        cycleHeader(
            col,
            document,
            this.COLNAMES,
            this.eipList
            );
        if (eip) {
            log(eip.address + ": Select this eip post sort");
            this.selectByAddress(eip.address);
        } else {
            log("The selected eip is null!");
        }
    },

    sort : function() {
        var eipSel = this.getSelectedEip();
        sortView(document, this.COLNAMES, this.eipList);
        if (eipSel) this.selectByAddress(eipSel.address);
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
            ec2ui_model.registerInterest(this, 'addresses');
        }
    },

    invalidate: function() {
        var target = ec2ui_ElasticIPTreeView;
        target.displayEIPs(target.filterAddresses(ec2ui_session.model.addresses));
    },

    filterAddresses : function(addresses) {
        var searchText = (document.getElementById('ec2ui.eip.search').value || '').trim();

        if (searchText.length == 0) {
            return addresses;
        }

        var newList = new Array();
        var adrs = null;
        var patt = new RegExp(searchText, "i");

        for(var i in addresses) {
            adrs = addresses[i];

            if (patt.test(adrs.address) || patt.test(adrs.allocationId) || patt.test(adrs.instanceid)
                || patt.test(adrs.instanceName) || patt.test(adrs.domain) || patt.test(adrs.associationId)) {
                newList.push(adrs);
            }
        }

        return newList;
    },

    refresh: function() {
        ec2ui_session.controller.describeAddresses();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    viewDetails : function(event) {
        var selected = new Array();
        for(var i in this.eipList) {
          if (this.selection.isSelected(i)) {
             selected.push(this.eipList[i]);
          }
        }
        if (selected.length != 1) return;

        window.openDialog("chrome://ec2ui/content/dialog_eip_details.xul", null, "chrome,centerscreen,modal", selected[0]);
    },

    enableOrDisableItems : function() {
        var eipSel = this.getSelectedEip();
        document.getElementById("ec2ui.addresses.contextmenu").disabled = (eipSel == null);

        if (eipSel == null) return;

        var fAssociated = true;
        if (!eipSel.instanceid && !eipSel.associationId) {
            // There is no instance associated with this address
            fAssociated = false;
        }

        document.getElementById("addresses.context.disassociate").disabled = !fAssociated;
    },

    selectByAddress: function(address) {
        this.selection.clearSelection();
        for(var i in this.eipList) {
            if (this.eipList[i].address == address) {
                this.selection.select(i);
                this.treeBox.ensureRowIsVisible(i);
                return;
            }
        }

        // In case we don't find a match (which is probably a bug).
        this.selection.select(0);
    },

    getSelectedEip : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.eipList[index];
    },

    allocateAddress : function() {
        var returnValue = {accepted:false};

        window.openDialog("chrome://ec2ui/content/dialog_allocate_address.xul", null, "chrome,centerscreen,modal", returnValue);

        if (returnValue.accepted) {
            var me = this;

            var wrap = function(address) {
                if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                    me.refresh();
                    me.selectByAddress(address);
                }
            }

            ec2ui_session.controller.allocateAddress(returnValue.vpc, wrap);
        }
    },

    releaseAddress : function() {
        var eip = this.getSelectedEip();
        if (eip == null) return;
        var confirmed = confirm("Release "+eip.address+"?");
        if (!confirmed)
            return;

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        ec2ui_session.controller.releaseAddress(eip.address, eip.allocationId, wrap);
    },

    getUnassociatedInstanceIds : function(domain) {
        var instanceIds = new Array();
        var instList = ec2ui_model.getInstances();
        var i = 0;

        var inst = null;
        var tag = null;
        var id = null;
        for (i in instList) {
            inst = instList[i];

            if (domain == 'vpc') {
                if (!inst.vpcId) { continue; }
            } else {
                if (inst.vpcId) { continue; }
            }

            if (inst.state == "running") {
                id = inst.id;
                tag = __tagToName__(inst.tag);
                if (tag && tag.length) {
                    id = id + ":" +  tag;
                }
                instanceIds.push(id);
            }
        }

        var eips = {};
        var unassociated = new Array();

        i = 0;
        var eip = null;
        // Build the list of EIPs that are associated with an instance
        for (i in this.eipList) {
            eip = this.eipList[i];
            if (eip.instanceid == null ||
                eip.instanceid.length == 0) {
                continue;
            }
            eips[eip.instanceid] = eip.address;
        }

        i = 0;
        var lastItem = 0;
        var temp = null;
        var instId = null;
        for (i in instanceIds) {
            instId = instanceIds[i].split(":")[0];
            if (eips[instId]) {
                continue;
            }
            unassociated.push(instanceIds[i]);
        }

        unassociated.sort(function(a, b) {
            a = a.split(":");
            b = b.split(":");
            var tag_a = (a[1] || a[0]);
            var tag_b = (b[1] || b[0]);
            return (tag_a < tag_b) ? -1 : (tag_a > tag_b) ? 1 : 0;
        });

        return unassociated;
    },

    associateAddress : function(eip) {
        // If an elastic IP hasn't been passed in to be persisted to
        // EC2, create a mapping between the Address and Instance.
        if (eip == null) {
            eip = this.getSelectedEip();

            if (eip == null) return;

            if (eip.instanceid != null && eip.instanceid != '') {
                var confirmed = confirm("Address "+eip.address+" is already mapped to an instance, are you sure?");
                if (!confirmed)
                    return;
            }

            var instanceIds = this.getUnassociatedInstanceIds(eip.domain);

            var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                .getService(Components.interfaces.nsIPromptService);
            var selected = {};

            var result = prompts.select(
                null,
                "Associate Address with Instance",
                "Which Instance would you like to associate "+ eip.address +" with?",
                instanceIds.length,
                instanceIds,
                selected
                );

            if (!result) {
                return;
            }

            eip.instanceid = instanceIds[selected.value].split(":")[0];
        }

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
                me.selectByAddress(eip.address);
            }
        }
        ec2ui_session.controller.associateAddress(eip.address, eip.instanceid, eip.allocationId, wrap);
        return true;
    },

    associateAddressWithENI : function(eip) {
        var eni_id = null;

        if (eip == null) {
            eip = this.getSelectedEip();

            if (eip == null) return;

            if (eip.instanceid != null && eip.instanceid != '') {
                var confirmed = confirm("Address "+eip.address+" is already mapped to an instance, are you sure?");
                if (!confirmed)
                    return;
            }

            var instanceIds = this.getUnassociatedInstanceIds(eip.domain);

            var eni_id = (prompt("Network Interface ID") || '').trim();
            if (!eni_id) { return; }
        }

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
                me.selectByAddress(eip.address);
            }
        }

        ec2ui_session.controller.associateAddressWithENI(eip.address, eni_id, eip.allocationId, wrap);

        return true;
    },

    disassociateAddress : function() {
        var eip = this.getSelectedEip();
        if (eip == null) return;
        if (!eip.instanceid && !eip.associationId) return;

        var confirmed = confirm("Disassociate "+eip.address+" and instance "+eip.instanceid+"?");
        if (!confirmed)
            return;

        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        ec2ui_session.controller.disassociateAddress(eip.address, eip.associationId, wrap);
    },

    tag : function() {
        var eip = this.getSelectedEip();

        if (eip == null) {
            return;
        }

        tagResource(eip, ec2ui_session, "address");
        this.selectByAddress(eip.address);
    },

    copyToClipBoard : function(fieldName) {
        var eip = this.getSelectedEip();
        if (eip == null) {
            return;
        }

        copyToClipboard(eip[fieldName]);
    },

    copyPublicDnsToClipBoard : function(fieldName) {
        var eip = this.getSelectedEip();
        if (!eip) { return; }

        var publicDnsName = eip.instancePublicDnsName;
        if (!publicDnsName) { return; }

        copyToClipboard(publicDnsName);
    },

    displayEIPs : function (eipList) {
        if (!eipList) { eipList = []; }

        this.treeBox.rowCountChanged(0, -this.eipList.length);
        this.eipList = eipList;
        this.treeBox.rowCountChanged(0, this.eipList.length);
        this.sort();
        this.selection.clearSelection();
        if (eipList.length > 0) {
           this.selection.select(0);
        }
    },

    searchChanged : function(event) {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    }
};

ec2ui_ElasticIPTreeView.register();
