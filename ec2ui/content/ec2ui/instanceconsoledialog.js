var ec2_InstanceConsole = {
    init : function() {
        document.getElementById("ec2ui.console.instanceid").value = window.arguments[0];
        document.getElementById("ec2ui.console.timestamp").value = window.arguments[1];

        var output = "<no output available>";
        if (window.arguments[2] != null) {
            output = window.arguments[2];
        }
        document.getElementById("ec2ui.console.output").value = output;
    }
}
