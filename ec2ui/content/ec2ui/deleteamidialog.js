var ec2ui_AMIDeleter = {
    session : null,
    imageLoc : null,

    getProgressMeter : function() {
        if (document)
            return document.getElementById("ec2ui.delete.ami.progress");
    },

    getCurrentOperation : function() {
        if (document)
            return document.getElementById("ec2ui.delete.ami.current");
    },

    getCurrentDialog : function() {
        if (document)
            return document.getElementById("ec2ui.dialog.delete.ami");
    },

    indicateBusy : function(fShow) {
        if (fShow) {
            this.getCurrentDialog().setAttribute("wait-cursor", true);
        } else {
            this.getCurrentDialog().removeAttribute("wait-cursor");
        }
    },

    startDeletion : function() {
        var controller = this.session.controller;
        var parts = this.imageLoc.split('/');
        var sourceB = parts[0];
        var prefix = parts[1];
        // Remove the manifest.xml from the prefix
        prefix = prefix.substring(0, prefix.indexOf(".manifest.xml"));
        // Enumerate the items with prefix from source bucket
        var region = controller.getS3BucketLocation(sourceB);
        var srcKeys = controller.getS3KeyListWithPrefixInBucket(prefix,
                                                                sourceB,
                                                                region);
        var progressMet = this.getProgressMeter();
        this.getCurrentOperation().value = "Deleting AMI parts...";

        if (srcKeys != null) {
            var keyCount = srcKeys.length;
            for (var i = 0; i < keyCount; ++i) {
                controller.deleteS3KeyFromBucket(sourceB,
                                                 srcKeys[i],
                                                 region);
                progressMet.value = ((i+1)/keyCount) * 100;
            }
            this.retVal.ok = true;
        } else {
            alert ("ERROR: You can only delete an AMI that you created.");
            this.retVal.ok = false;
        }
        this.cancelDialog();
    },

    cancelDialog : function() {
        this.getCurrentDialog().cancelDialog();
    },

    startDeleteTimer : function() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        } else {
            var me = this;
            // Set the UI up to refresh just once
            this.refreshTimer = setTimeout(function() { me.startDeletion(); }, 50);
        }
    },

    init : function() {
        this.session = window.arguments[0];
        this.imageLoc = window.arguments[1];
        this.retVal = window.arguments[2];

        if (!this.session ||
            !this.imageLoc) {
            return false;
        }

        // Initialize the dialog's elements
        this.getProgressMeter().value = 0;

        this.startDeleteTimer();
    }
}
