var ec2_ReservedInstancesDetails = {
    init : function() {
        var image = window.arguments[0];
        document.getElementById("ec2ui.rsvdInst.id").value = image.id;
        document.getElementById("ec2ui.rsvdInst.instType").value = image.instanceType;
        document.getElementById("ec2ui.rsvdInst.azone").value = image.azone;
        document.getElementById("ec2ui.rsvdInst.start").value = image.start;
        document.getElementById("ec2ui.rsvdInst.duration").value = image.duration;
        document.getElementById("ec2ui.rsvdInst.fixedPrice").value = image.fixedPrice;
        document.getElementById("ec2ui.rsvdInst.usagePrice").value = image.usagePrice;
        document.getElementById("ec2ui.rsvdInst.count").value = image.count;
        document.getElementById("ec2ui.rsvdInst.description").value = image.description;
        document.getElementById("ec2ui.rsvdInst.state").value = image.state;

        var now = Date.parse(new Date());
        var end = Date.parse(image.startTime.toUTCString());
        end += 1000 * parseInt(image.duration) * 365 * 24 * 60 * 60;
        var diff = (end - now)/1000;
        document.getElementById("ec2ui.rsvdInst.daysremaining").value = secondsToDays(diff);
    }
}
