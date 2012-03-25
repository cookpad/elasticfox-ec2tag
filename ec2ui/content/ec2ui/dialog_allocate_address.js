var ec2_DialogAllocateAddress = {
  allocateAddressDialogDoOK: function() {
    var returnValue = window.arguments[0];
    returnValue.accepted = true;

    var menulist = document.getElementById('allocate-address-dialog-allocate-address');
    returnValue.vpc = (menulist.selectedItem.value == 'VPC');

    return true;
  }
};
