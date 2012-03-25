var ec2_OfferingPurchaser = {
    offering : null,
    retVal : null,

    purchase : function() {
        if (!this.validateInstanceCount()) return false;

        this.retVal.count = document.getElementById("ec2ui.purchase.offering.count").value.trim();
        this.retVal.ok = true;

        return true;
    },

    validateInstanceCount : function(fSilent) {
        var textbox = document.getElementById("ec2ui.purchase.offering.count");
        var val = parseInt(textbox.value);
        if (val <= 0 || isNaN(val)) {
            if (!fSilent) {
                alert("Number of Instances must be a positive integer");
            }
            textbox.select();
            return false;
        }
        return true;
    },

    calculateTotalCosts : function() {
        if (this.inputTimer) {
            clearTimeout(this.inputTimer);
            this.inputTimer = null;
        }

        var me = this;
        this.inputTimer = setTimeout(function() { me.updateTotals(); },
                                     100);
    },

    updateTotals : function() {
        if (this.inputTimer) {
            clearTimeout(this.inputTimer);
            this.inputTimer = null;
        }

        if (!this.validateInstanceCount(true)) return false;

        var textbox = document.getElementById("ec2ui.purchase.offering.count");
        var count = parseInt(textbox.value);

        // Set the value of total cost in the 2 textfields
        var fP = document.getElementById("ec2ui.purchase.offering.fixedPrice").value;
        fP = parseFloat(fP);

        // Multiply the fP and uP with count
        fP = fP * count;

        // Update the UX with the total costs
        document.getElementById("ec2ui.purchase.offering.totalPrice").value = fP;
    },

    init : function() {
        this.offering = window.arguments[0];
        this.retVal = window.arguments[1];

        var item = this.offering;
        document.getElementById("ec2ui.purchase.offering.id").value = item.id;
        document.getElementById("ec2ui.purchase.offering.instType").value = item.instanceType;
        document.getElementById("ec2ui.purchase.offering.azone").value = item.azone;
        document.getElementById("ec2ui.purchase.offering.duration").value = item.duration;
        document.getElementById("ec2ui.purchase.offering.description").value = item.description;
        document.getElementById("ec2ui.purchase.offering.fixedPrice").value = item.fixedPrice;
        document.getElementById("ec2ui.purchase.offering.usagePrice").value = item.usagePrice;
        document.getElementById("ec2ui.purchase.offering.count").value = this.retVal.count || "";
        this.updateTotals();

        document.getElementById("ec2ui.purchase.offering.count").select();
    },
}
