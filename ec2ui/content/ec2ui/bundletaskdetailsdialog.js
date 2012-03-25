var ec2_BundleTaskDetails = {
   init : function() {
      var task = window.arguments[0];
      document.getElementById("ec2ui.bundleTask.id").value = task.id;
      document.getElementById("ec2ui.bundleTask.state").value = task.state;
      document.getElementById("ec2ui.bundleTask.startTime").value = task.startTime;
      document.getElementById("ec2ui.bundleTask.updateTime").value = task.updateTime;
      document.getElementById("ec2ui.bundleTask.s3bucket").value = task.s3bucket;
      document.getElementById("ec2ui.bundleTask.s3prefix").value = task.s3prefix;
      document.getElementById("ec2ui.bundleTask.errorMsg").value = task.errorMsg;
      document.getElementById("ec2ui.bundleTask.instanceId").value = task.instanceId;
   }
}
