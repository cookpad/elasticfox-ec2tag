var ec2_PermissionDetails = {
    init : function() {
        var perm = window.arguments[0];
        document.getElementById("ec2ui.permission.protocol").value = perm.protocol;
        document.getElementById("ec2ui.permission.fromport").value = perm.fromPort;
        document.getElementById("ec2ui.permission.toport").value = perm.toPort;
        if (perm.ipRanges.length > 0) {
            document.getElementById("ec2ui.permission.sourcecidr").value = perm.ipRanges[0];
        }
        if (perm.groupTuples.length > 0) {
            document.getElementById("ec2ui.permission.sourceusergroup").value = '('+perm.groupTuples[0].join(',')+')';
        }
    }
}
