var ec2_LeaseOfferingDetails = {
    init : function() {
        var image = window.arguments[0];
        document.getElementById("ec2ui.offering.id").value = image.id;
        document.getElementById("ec2ui.offering.instType").value = image.instanceType;
        document.getElementById("ec2ui.offering.azone").value = image.azone;
        document.getElementById("ec2ui.offering.duration").value = image.duration;
        document.getElementById("ec2ui.offering.fixedPrice").value = image.fixedPrice;
        document.getElementById("ec2ui.offering.usagePrice").value = image.usagePrice;
        document.getElementById("ec2ui.offering.description").value = image.description;
    }
}
