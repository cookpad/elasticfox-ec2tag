var ec2_DhcpoptsCreator = {
    ec2ui_session : null,
    retVal : null,

    options : function() {
        return [["domain-name", "S", "Enter the host's domain name (e.g.: example.com)"],
                ["domain-name-servers", "A", "Enter up to 4 DNS server IP addresses, separated by commas"],
                ["ntp-servers", "A", "Enter up to 4 NTP server IP addresses, separated by commas"],
                ["netbios-name-servers", "A", "Enter up to 4 NetBIOS name server IP addresses, separated by commas"],
                ["netbios-node-type", "S", "Enter the NetBIOS node type (2: P-Node)"]
               ];
    },

    createDhcpOptions : function() {
        var opts = new Array();
        for(var i = 0; i < this.options().length; i++) {
            var optval = document.getElementById("ec2ui.newdhcpoptions.opt"+i).value;
            var finalval = new Array();

            if (optval != null && optval != "") {
                if (this.options()[i][1] == "A") {
                    var parts = optval.split(','); 
                    for(var j = 0; j < parts.length; j++) {
                        finalval.push(parts[j].trim());
                    }
                } else {
                    finalval.push(optval);
                }
                
                opts.push([this.options()[i][0], finalval]);
            }
        }

        this.retVal.opts = opts;
        this.retVal.ok = true;
        return true;
    },

    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];

        for(var i = 0; i < this.options().length; i++) {
            var label = document.getElementById("ec2ui.newdhcpoptions.lab"+i);
            var desc = document.getElementById("ec2ui.newdhcpoptions.desc"+i);
            label.value = this.options()[i][0];
            desc.value = this.options()[i][2];
        }
    }
}
