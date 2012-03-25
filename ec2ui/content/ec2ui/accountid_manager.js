var ec2ui_accountIdManager = {
    accountidmap : null,

    initDialog : function() {
        this.accountidmap = window.arguments[0];

        document.getElementById("ec2ui.accountids.view").view = ec2ui_accountIdsTreeView;
        ec2ui_accountIdsTreeView.setMapping(this.accountidmap);
        document.getElementById("ec2ui.accountids.accountid").select();
    },

    removeAccount : function() {
        var accountId = document.getElementById("ec2ui.accountids.accountid").value.trim();
        if (accountId == null || accountId == "") return;

        this.accountidmap.removeKey(accountId);
        ec2ui_accountIdsTreeView.setMapping(this.accountidmap);
    },

    saveAccount : function() {
        var accountId = document.getElementById("ec2ui.accountids.accountid").value.trim() || "";
        var displayName = document.getElementById("ec2ui.accountids.displayname").value.trim() || "";
        if (accountId.length == 0) return;
        if (displayName.length == 0) return;

        this.accountidmap.put(accountId, displayName);
        ec2ui_accountIdsTreeView.setMapping(this.accountidmap);
    },

    selectMapping : function() {
        var sel = ec2ui_accountIdsTreeView.getSelectedAccount();
        if (sel != null) {
            document.getElementById("ec2ui.accountids.accountid").value = sel.accountid;
            document.getElementById("ec2ui.accountids.displayname").value = sel.displayname;
        }
    }
}
