var ec2_InstanceDetails = {
    init : function() {
        var session = window.arguments[0];
        var instance = window.arguments[1];
        document.getElementById("ec2ui.instance.resid").value = instance.resId;
        document.getElementById("ec2ui.instance.instanceid").value = instance.id;

        var amiLabel = session.getResourceTag(instance.imageId);
        if (amiLabel && amiLabel.length)
            amiLabel = instance.imageId + ":" + amiLabel;
        else
            amiLabel = instance.imageId;

        document.getElementById("ec2ui.instance.amiid").value = amiLabel;
        document.getElementById("ec2ui.instance.amimanifest").value = session.model.getAmiManifestForId(instance.imageId);
        document.getElementById("ec2ui.instance.akiid").value = instance.kernelId;
        document.getElementById("ec2ui.instance.ariid").value = instance.ramdiskId;
        document.getElementById("ec2ui.instance.ownerid").value = instance.ownerId;
        document.getElementById("ec2ui.instance.publicdnsname").value = instance.publicDnsName;
        document.getElementById("ec2ui.instance.privatednsname").value = instance.privateDnsName;
        document.getElementById("ec2ui.instance.privateipaddress").value = instance.privateIpAddress;
        document.getElementById("ec2ui.instance.keyname").value = instance.keyName;
        document.getElementById("ec2ui.instance.reason").value = instance.reason;
        document.getElementById("ec2ui.instance.amiLaunchIdx").value = instance.amiLaunchIdx;
        document.getElementById("ec2ui.instance.instanceType").value = instance.instanceType;
        document.getElementById("ec2ui.instance.launchTime").value = instance.launchTime.toString();
        document.getElementById("ec2ui.instance.availabilityZone").value = instance.placement.availabilityZone;
        document.getElementById("ec2ui.instance.platform").value = instance.platform;
        document.getElementById("ec2ui.instance.vpcid").value = instance.vpcId;
        document.getElementById("ec2ui.instance.subnetid").value = instance.subnetId;
        document.getElementById("ec2ui.instance.tag").value = instance.tag || "";

        var secGroups = document.getElementById("ec2ui.instance.securitygrouplist");
        for(var i in instance.groupList) {
            secGroups.appendItem(instance.groupList[i]);
        }

        var addresses = session.model.getAddresses();
        var addr = null;
        for (var i in addresses) {
            addr = addresses[i];
            if (addr.instanceid == instance.id) {
                var val = addr.address;
                if (addr.tag) val = val + ":" + addr.tag;
                document.getElementById("ec2ui.instance.eip").value = val;
                break;
            }
        }

        var volumeL = document.getElementById("ec2ui.instance.volumelist");
        // Enumerate the volumes associated with the instId
        var volumes = session.model.getVolumes();

        // If a volume is associated with this instance,
        // add it to the list
        var vol = null;
        for (var i in volumes) {
            vol = volumes[i];
            if (vol.instanceId == instance.id) {
                var val = vol.id;
                if (vol.tag) val = val + ":" + vol.tag;
                volumeL.appendItem(val);
            }
        }
    }
}
