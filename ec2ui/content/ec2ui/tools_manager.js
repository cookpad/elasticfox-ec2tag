var ec2ui_toolsManager = {
   tools : new Array(),

   initDialog : function() {
      ec2ui_prefs.init();
      document.getElementById("ec2ui.tools.ssh.command").value = ec2ui_prefs.getSSHCommand();
      document.getElementById("ec2ui.tools.ssh.args").value = ec2ui_prefs.getSSHArgs();
      document.getElementById("ec2ui.tools.ssh.key").value = ec2ui_prefs.getSSHKeyTemplate();
      document.getElementById("ec2ui.tools.ec2.key.template").value = ec2ui_prefs.getPrivateKeyTemplate();
      document.getElementById("ec2ui.tools.ssh.user").value = ec2ui_prefs.getSSHUser();
      document.getElementById("ec2ui.tools.rdp.command").value = ec2ui_prefs.getRDPCommand();
      document.getElementById("ec2ui.tools.rdp.args").value = ec2ui_prefs.getRDPArgs();
      return true;
   },

   saveDialog : function() {
      ec2ui_prefs.setSSHCommand(document.getElementById("ec2ui.tools.ssh.command").value.toString());
      ec2ui_prefs.setSSHArgs(document.getElementById("ec2ui.tools.ssh.args").value.toString());
      ec2ui_prefs.setSSHKeyTemplate(document.getElementById("ec2ui.tools.ssh.key").value.toString());
      ec2ui_prefs.setPrivateKeyTemplate(document.getElementById("ec2ui.tools.ec2.key.template").value.toString());
      ec2ui_prefs.setSSHUser(document.getElementById("ec2ui.tools.ssh.user").value.toString());
      ec2ui_prefs.setRDPCommand(document.getElementById("ec2ui.tools.rdp.command").value.toString());
      ec2ui_prefs.setRDPArgs(document.getElementById("ec2ui.tools.rdp.args").value.toString());
      return true;
   }

}
