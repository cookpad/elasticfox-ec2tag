var BaseImagesView = {
    COLNAMES: [],
    treeBox: null,
    selection: null,
    selectedImageId: null,      // for preserving selection across filters and refreshes
    imageList : new Array(),
    registered : false,

    get rowCount() { return this.imageList.length; },

    setTree     : function(treeBox) { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        return this.getImageDetail(this.imageList[idx], column.id);
    },

    getCellProperties : function(row, col, props) {
        var shortName = col.id.split(".").pop();
        if (shortName == "state") {
            var stateName = this.imageList[row].state.replace('-','_').toLowerCase();
            var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
            props.AppendElement(aserv.getAtom("image_"+stateName));
        } else if (shortName == "isPublic") {
            var vizName = this.imageList[row].isPublic.replace('-','_').toLowerCase();
            var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
            props.AppendElement(aserv.getAtom("image_"+vizName));
        } else if (shortName == "ownerAlias" && this.imageList[row].owner == "amazon") {
            var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
            props.AppendElement(aserv.getAtom("owner_amazon"));
        }
    },

    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)         { return false;},
    isSeparator: function(idx)         { return false; },
    isSorted: function()               { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        var image = this.getSelectedImage();
        cycleHeader(
            col,
            document,
            this.COLNAMES,
            this.imageList);
        this.treeBox.invalidate();
        if (image) {
            log(image.id + ": Select this image post sort");
            this.selectByImageId(image.id);
        } else {
            log("The selected image is null!");
        }
    },

    viewDetails : function(event) {
        var image = this.getSelectedImage();
        if (image == null) return;
        window.openDialog("chrome://ec2ui/content/dialog_ami_details.xul", null, "chrome,centerscreen,modal", image);
    },

    sort : function() {
        var selected = this.getSelectedImage();
        sortView(document, this.COLNAMES, this.imageList);
        if (selected) this.selectByImageId(selected.id);
    },

    selectionChanged : function(event) {
        // preserve the id of the selected image
        // so we can reselect it later on
        var selected = this.getSelectedImage();
        if (selected) {
            this.selectedImageId = selected.id;
        }
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },

    getSelectedImage : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.imageList[index];
    },

    selectByImageId : function(imageId) {
        if (!imageId) return;

        this.selection.clearSelection();
        for(var i in this.imageList) {
            if (this.imageList[i].id == imageId) {
                log("selectByImageId ("+imageId+") selected index "+i);
                this.selection.select(i);
                this.treeBox.ensureRowIsVisible(i);
                return;
            }
        }
    },

    invalidate : function() {
        this.displayImages(this.filterImages(ec2ui_session.model.images));
    },

    notifyModelChanged : function(interest) {
        this.invalidate();
    },

    register : function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'images');
        }
    },

    refresh : function() {
        ec2ui_session.showBusyCursor(true);
        ec2ui_session.controller.describeImages(true);
        ec2ui_session.showBusyCursor(false);
    },

    filterImages : function(imageList, searchText) {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        if (!imageList) {
            return null;
        }

        if (!searchText) {
            searchText = this.getSearchText();
        }

        var newList = new Array();
        var img = null;
        var patt = new RegExp(searchText, "i");
        for(var i in imageList) {
            img = imageList[i];
            if (img.id.match(this.imageIdRegex) &&
                this.imageMatchesSearch(img, patt)) {
                newList.push(img);
            }
        }
        return newList;
    },

    imageMatchesSearch: function(image, patt) {
        if (patt.source.length == 0) return true;

        for (var i = 0; i < this.COLNAMES.length; i++) {
            var text = this.getImageDetail(image, this.COLNAMES[i]);
            if (text.match(patt)) {
                return true;
            }
        }

        return false;
    },

    displayImages : function (imageList) {
        if (imageList == null) {
            imageList = [];
        }

        this.treeBox.rowCountChanged(0, -this.imageList.length);
        this.imageList = imageList;
        this.treeBox.rowCountChanged(0, this.imageList.length);
        this.sort();

        // reselect old selection
        if (this.selectedImageId) {
            this.selectByImageId(this.selectedImageId);
        } else {
            this.selection.clearSelection();
        }
    },

    tag : function(event) {
        var res = this.getSelectedImage();

        if (res) {
            tagResource(res, ec2ui_session);
            this.selectByImageId(res.id);
        }
    },

    startRefreshTimer : function(tab, refreshFunc) {
        log("Starting Refresh Timer");
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        if (tab && tab.length > 0) {
            ec2ui_session.addTabToRefreshList(tab);
        }
        // Set the UI up to refresh every so often
        this.refreshTimer = setTimeout(refreshFunc, 10000);
    },

    stopRefreshTimer : function(tab) {
        log("Stopping Refresh Timer");
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            if (tab) {
                ec2ui_session.removeTabFromRefreshList(tab);
            }
        }
    },

    getImageDetail : function(image, column) {
        var shortName = column.split(".").pop();
        if (shortName == "owner") {
            return ec2ui_session.lookupAccountId(image.owner);
        }
        return image[shortName] || "";
    },

    copyToClipBoard : function(fieldName) {
        var image = this.getSelectedImage();

        copyToClipboard(image[fieldName]);
    }
};
