var ec2_ElasticIPDetails = {
   init : function() {
      var eip = window.arguments[0];
      document.getElementById("ec2ui.eip.address").value = eip.address;
      document.getElementById("ec2ui.eip.instanceid").value = eip.instanceid;
      document.getElementById("ec2ui.eip.tag").value = eip.tag || "";
   }
}
