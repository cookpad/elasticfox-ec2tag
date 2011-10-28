var ec2ui_EnableAzone = {
    ec2ui_session : null,
    retVal : null,
    loadbalancer : null,
    launch : function() {
        this.retVal.LoadBalancerName = document.getElementById("ec2ui.enableazone.Name").value.trim();
	var listBox = document.getElementById('Enable_Azone');
	var idx = 0;
	var nRowCount = listBox.getRowCount();
	
	this.retVal.Zone = "";
	for(idx=0;idx < nRowCount;idx++)
	{
	    var cellID = "cellcheck"+idx;	    
	    var cell = document.getElementById(cellID);
	    
	    if(cell.hasAttribute('checked','true'))
	    {
		var cellzone = "azoneid"+idx;
		
		var azone = document.getElementById(cellzone);

		var enablezone = azone.getAttribute('label');
		
		this.retVal.Zone = this.retVal.Zone + enablezone +",";
	    }
	}
	this.retVal.ok = true;
        return true;
    },
    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];
	this.loadbalancer = window.arguments[2];
	var loadbalancer = window.arguments[2];
	var loadbalancername = loadbalancer.LoadBalancerName;
	var lbZone = loadbalancer.zone;
	document.getElementById("ec2ui.enableazone.Name").value = loadbalancer.LoadBalancerName;
	var configureazone = document.getElementById('Enable_Azone');

        var Idx = 0;
	var AvailabilityZone = this.ec2ui_session.model.getAvailabilityZones();

	
	var zones = new Array();
        var Rzone = new String(lbZone);
	var zoneArray = new Array();
	zoneArray = Rzone.split(",");
	for(var a=0;a<zoneArray.length;a++)
	{ 
	    zones.push(zoneArray[a]);
	}
	        
	for (var i in AvailabilityZone) {
        
	    var row = document.createElement('listitem');
	    var cell1 = document.createElement('listcell');
	    var cell2 = document.createElement('listcell');
	    
	    var cellID = "cellcheck"+Idx;
	
	    var cellAzoneID = "azoneid"+Idx;
	            
	    cell1.setAttribute('type', 'checkbox');
	    cell1.setAttribute('id',cellID);
	    row.appendChild(cell1);
	
	    cell2.setAttribute('label', AvailabilityZone[i].name);
	    cell2.setAttribute('id',cellAzoneID);
	    row.appendChild(cell2);
        
	    for(var a=0;a<zones.length;a++)
	    {
	       var selectedzone = zones[a];
	       if(AvailabilityZone[i].name == selectedzone)
	       {
	           cell1.removeAttribute('type');
	           cell2.removeAttribute('label');
	           row.setAttribute('hidden', 'true');	
		}
	    }

	    var rowID = "row"+Idx;
	    row.setAttribute('id',rowID);
	    
	    configureazone.appendChild(row);
	
	    Idx = Idx +1;
	}
  },
  enable_disableAzone : function(){
        var listBox = document.getElementById('Enable_Azone');
	var selectedItem = listBox.currentIndex;
	if (selectedItem == -1) return null;
	var rowID = "row"+selectedItem;
	var row = document.getElementById(rowID);
	var cellID = "cellcheck"+selectedItem;
	var cell = document.getElementById(cellID);
	var attribute = cell.getAttribute('type');
	if(cell.hasAttribute('checked','true'))
	{
	    cell.setAttribute('checked','false');
	    cell.removeAttribute('checked');
	}else{
	    cell.setAttribute('checked','true');
	}
  }
   
}