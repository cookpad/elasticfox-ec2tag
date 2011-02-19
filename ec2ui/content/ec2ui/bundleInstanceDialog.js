var ec2_InstanceBundler = {
    id : null,
    ec2ui_session : null,
    retVal : null,

    getBucketName : function() {
        return document.getElementById("ec2ui.bundleInstance.bucketName");
    },

    getPrefix : function() {
        return document.getElementById("ec2ui.bundleInstance.prefix");
    },

    bundleInstance : function() {
        this.retVal.bucketName = this.getBucketName().value.trim();
        if (!this.validateBucketName()) {
            alert ("The Bucket Name must be all lower case");
            bucketNameBox.select();
            return false;
        }

        this.retVal.prefix = this.getPrefix().value.trim();

        if (this.retVal.bucketName.length == 0 ||
            this.retVal.prefix.length == 0) {
            alert ("Please enter a name for both the S3 Bucket and the Image");
            return false;
        }

        this.retVal.ok = true;
        return true;
    },

    validateBucketName : function() {
        var bucketLower = this.retVal.bucketName.toLowerCase();

        return (bucketLower == this.retVal.bucketName);
    },

    init : function() {
        this.id = window.arguments[0];
        this.ec2ui_session = window.arguments[1];
        this.retVal = window.arguments[2];

        document.getElementById("ec2ui.bundleInstance.instanceid").value = this.id;
        if (this.retVal.bucketName) this.getBucketName().value = this.retVal.bucketName || "";
        if (this.retVal.prefix) this.getPrefix().value = this.retVal.prefix || "";
        this.getBucketName().select();
    }
}
