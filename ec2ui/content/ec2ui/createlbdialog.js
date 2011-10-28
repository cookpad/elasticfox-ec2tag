var ec2_Createlb = {
    ec2ui_session : null,
    retVal : null,
    reginstanceid : new Array(),
    launch : function() {
        this.retVal.LoadBalancerName = document.getElementById("ec2ui.createlb.Name").value.trim();
	this.retVal.Protocol = document.getElementById("ec2ui.createlb.Protocol").value.trim();
        this.retVal.elbport = document.getElementById("ec2ui.createlb.elbport").value.trim();
	this.retVal.instanceport = document.getElementById("ec2ui.createlb.instanceport").value.trim();
	this.retVal.pingprotocol = document.getElementById("ec2ui.createlb.pingprotocol").value.trim();
	this.retVal.pingport = document.getElementById("ec2ui.createlb.pingport").value.trim();
	this.retVal.pingpath = document.getElementById("ec2ui.createlb.pingpath").value.trim();
        this.retVal.Interval = document.getElementById("ec2ui.createlb.Interval").value.trim();
	this.retVal.Timeout = document.getElementById("ec2ui.createlb.timeout").value.trim();
	this.retVal.HealthyThreshold = document.getElementById("ec2ui.createlb.HThreshold").value.trim();
	this.retVal.UnhealthyThreshold = document.getElementById("ec2ui.createlb.uThreshold").value.trim();
	this.retVal.placement = document.getElementById("ec2ui.createlb.availabilityzonelist").selectedItem.value;
	var listBox = document.getElementById('theList');
	var idx = 0;
	var nRowCount = listBox.getRowCount();
	
	this.retVal.Instances = "";
	for(idx = 0; idx < nRowCount; idx++)
	{
	    var cellID = "cellcheck"+idx;	    
	    var cell = document.getElementById(cellID);
	    if(cell.hasAttribute('checked','true'))
	    {
		var cellinstance = "celliid"+idx;
		var instance = document.getElementById(cellinstance);
		var reginstanceid = instance.getAttribute('label');
		this.retVal.Instances =  this.retVal.Instances + reginstanceid +",";
	    }
	}
	
	

	this.retVal.ok = true;
        return true;
    },
    
    init : function() {
        this.ec2ui_session = window.arguments[0];
        this.retVal = window.arguments[1];
	var theList = document.getElementById('theList');
        var Idx = 0;
	var Instanceid = this.ec2ui_session.model.getInstances();
        var lbinstance = this.ec2ui_session.model.getLoadbalancer();
		
        var registerid = new Array();
	
        for (var i in lbinstance){
            var Instancechk = lbinstance[i].InstanceId;
	    var instanceid = new String(Instancechk);
	    var tempArray = new Array();
	    tempArray = instanceid.split(",");
	    for(var a=0;a<tempArray.length;a++)
	    { 
		registerid.push(tempArray[a]);
	    }	    
	}
	
	for (var i in Instanceid) {
	    if(Instanceid[i].state == "running"){
		var row = document.createElement('listitem');
		var cell1 = document.createElement('listcell');
		var cell2 = document.createElement('listcell');
		var cell3 = document.createElement('listcell');
		var cell4 = document.createElement('listcell');
        
		var cellID = "cellcheck"+Idx;
		cell1.setAttribute('id',cellID);
        
		var cellinstance = "celliid"+Idx;
		cell2.setAttribute('id',cellinstance);
        
		var azoneid = "cellizone"+Idx;
		cell4.setAttribute('id',azoneid);
        
		cell1.setAttribute('type', 'checkbox');
		row.appendChild(cell1);
        
		cell2.setAttribute('label', Instanceid[i].id);
		row.appendChild(cell2);
        
		cell3.setAttribute('label',  Instanceid[i].state);
		row.appendChild(cell3);
        
		cell4.setAttribute('label',  Instanceid[i].placement.availabilityZone);
		row.appendChild(cell4);
    
		for(var a=0;a<registerid.length;a++)
		{
		   var id = registerid[a];
		   if(Instanceid[i].id == id)
		   {
		       cell1.removeAttribute('type');
		       cell2.removeAttribute('label');
		       row.setAttribute('hidden', 'true');
		   }
		}
	
		var rowID = "row"+Idx;
		row.setAttribute('id',rowID);
		theList.appendChild(row);
		Idx = Idx +1;
            }
        }
	
	var availZones = this.ec2ui_session.model.getAvailabilityZones();
  
        var availZoneMenu = document.getElementById("ec2ui.createlb.availabilityzonelist");
        for(var i in availZones) {
            availZoneMenu.appendItem(availZones[i].name, availZones[i].name);
        }
        // If the user created at least one EC2 Keypair, select it.
        availZoneMenu.selectedIndex =  0;
 	
    },
  
reg_unreg_instances : function(){
      var listBox = document.getElementById('theList');
      var selectedItem = listBox.currentIndex;
      if (selectedItem == -1) return null;
      var rowID = "row"+selectedItem;
      var row = document.getElementById(rowID);
      var cellID = "cellcheck"+selectedItem;
      var cellinstance = "celliid"+selectedItem;
      var cell = document.getElementById(cellID);
      var instance = document.getElementById(cellinstance);
      var attribute = cell.getAttribute('type');
      var reginstanceid = instance.getAttribute('label');
      
      if(cell.hasAttribute('checked','true'))
      {
          cell.setAttribute('checked','false');
          cell.removeAttribute('checked');
      }
      else
      {
           cell.setAttribute('checked','true');
      }
   
 },
    
instancedetails : function(){
	var instanceid = this.reginstanceid;
    }
}