var ec2_KeyPairDetails = {
    init : function() {
        var keypair = window.arguments[0];
        document.getElementById("ec2ui.keypair.name").value = keypair.name;
        document.getElementById("ec2ui.keypair.fingerprint").value = keypair.fingerprint;
    }
}
