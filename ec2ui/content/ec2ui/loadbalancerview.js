var ec2ui_LoadbalancerTreeView = {
    COLNAMES : ['loadbalancer.LoadBalancerName','loadbalancer.CreatedTime','loadbalancer.DNSName','loadbalancer.InstanceId',
                'loadbalancer.Protocol','loadbalancer.LoadBalancerPort','loadbalancer.InstancePort',
                'loadbalancer.Interval','loadbalancer.Timeout','loadbalancer.HealthyThreshold','loadbalancer.UnhealthyThreshold',
                'loadbalancer.Target','loadbalancer.zone','loadbalancer.CookieName','loadbalancer.APolicyName',
                'loadbalancer.CookieExpirationPeriod','loadbalancer.CPolicyName'],
    treeBox : null,
    selection : null,
    loadbalancerList : new Array(),
    registered : false,

    get rowCount() { return this.loadbalancerList.length;},

    setTree      : function(treeBox)            { this.treeBox = treeBox; },
    getCellText : function(idx, column) {
        if (idx >= this.rowCount) return "";
        var member = column.id.split(".").pop();
        return this.loadbalancerList[idx][member];
    },
    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx)            { return false;},
    isSeparator: function(idx)            { return false; },
    isSorted: function()                    { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx,column) {},
    getCellValue: function(idx, column) {},
    cycleHeader: function(col) {
        var loadbalancer = this.getSelectedLoadbalancer();
        cycleHeader(
        col,
        document,
        this.COLNAMES,
        this.loadbalancerList);
        this.selectionChanged();
        this.treeBox.invalidate();
        if (loadbalancer) {
            log(loadbalancer.LoadBalancerName + ": Select this Monitor Instance post sort");
            this.selectByName(LoadBalancer.LoadBalancerName);
        } else {
            log("The selected Monitor Instance is null!");
        }
    },

    sort : function() {
        var LoadBalancer = this.getSelectedLoadbalancer();
        sortView(document, this.COLNAMES, this.loadbalancerList);
        if (LoadBalancer) this.selectByName(LoadBalancer.LoadBalancerName);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel : function(idx) { return 0; },
    
    getSelectedLoadbalancer : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) return null;
        return this.loadbalancerList[index];
    },
    
    selectByName : function(Value) {
        this.selection.clearSelection();
        for(var i in this.loadbalancerList) {
             if (this.loadbalancerList[i].LoadBalancerName == LoadBalancerName) {
                this.selection.select(i);
                this.treeBox.ensureRowIsVisible(i);
                return;
            }
        }
        this.selection.select(0);
    },
    
    selectionChanged : function() {
        var index = this.selection.currentIndex;
        if (index == -1) return;

        var loadbalancer = this.loadbalancerList[index];
        ec2ui_session.controller.describeInstanceHealth(loadbalancer.LoadBalancerName);
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'loadbalancer');
        }
    },

    invalidate: function() {
        this.displayLoadbalancer(ec2ui_session.model.loadbalancer);
    },

    refresh: function() {
        ec2ui_session.controller.describeLoadBalancers();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },
    
    deleteLoadBalancer : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var confirmed = confirm("Delete Loadbalancer "+loadbalancer.LoadBalancerName+"?");
        if (!confirmed)
            return;
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        ec2ui_session.controller.deleteLoadBalancer(loadbalancer.LoadBalancerName, wrap);     
    },
    
    viewDetails : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        window.openDialog(
            "chrome://ec2ui/content/dialog_loadbalancer_details.xul",
            null,
            "chrome,centerscreen,modal",
            loadbalancer);
    },
    
    create: function() {
        var retVal = {ok:null};
        window.openDialog(
            "chrome://ec2ui/content/dialog_create_loadbalancer.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal,
            null
           );
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
                var Zone = retVal.placement;
                ec2ui_session.controller.CreateLoadBalancer(retVal.LoadBalancerName,retVal.Protocol,retVal.elbport,retVal.instanceport,Zone);
                ec2ui_session.controller.ConfigureHealthCheck(retVal.LoadBalancerName,retVal.pingprotocol,retVal.pingport,retVal.pingpath,retVal.Interval,retVal.Timeout,retVal.HealthyThreshold,retVal.UnhealthyThreshold);
                var Instancechk = retVal.Instances;
                var newStr = Instancechk.substring(",", Instancechk.length-1);
                var instanceid = new String(newStr);
                var RegInstance = new Array();
                RegInstance = instanceid.split(",");
                for(var a=0;a<RegInstance.length;a++)
                {
                    ec2ui_session.controller.RegisterInstancesWithLoadBalancer(retVal.LoadBalancerName,RegInstance[a]);
                }
                wrap();
        }
     },
     
     ConfigureHealthCheck: function() {
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var retVal = {ok:null};
        window.openDialog(
            "chrome://ec2ui/content/dialog_configure_healthcheck.xul",
            null,
            "chrome,centerscreen,modal",
            loadbalancer,
            ec2ui_session,
            retVal            
           );
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
            ec2ui_session.controller.EditHealthCheck(loadbalancer.LoadBalancerName,retVal.Target,retVal.Interval,retVal.Timeout,retVal.HealthyThreshold,retVal.UnhealthyThreshold,wrap);
        }
    },
    
    registerinstances : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var retVal = {ok:null};
         window.openDialog(
            "chrome://ec2ui/content/dialog_register_lbinstances.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal,
            loadbalancer
            );
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
            var Instancechk = retVal.Instances;
            var newStr = Instancechk.substring(",", Instancechk.length-1);
	    var instanceid = new String(newStr);
	    var RegInstance = new Array();
	    RegInstance = instanceid.split(",");
	    for(var a=0;a<RegInstance.length;a++)
	    {
                ec2ui_session.controller.RegisterInstancesWithLoadBalancer(retVal.LoadBalancerName,RegInstance[a]);
	    }
            wrap();
        }    
    },
    
    deregisterinstances : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var retVal = {ok:null};
         window.openDialog(
            "chrome://ec2ui/content/dialog_deregister_lbinstances.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal,
            loadbalancer
            );
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
            var Instancechk = retVal.Instances;
            var newStr = Instancechk.substring(",", Instancechk.length-1);
	    var instanceid = new String(newStr);
	    var RegInstance = new Array();
	    RegInstance = instanceid.split(",");
	    for(var a=0;a<RegInstance.length;a++)
	    {    
                ec2ui_session.controller.DeregisterInstancesWithLoadBalancer(retVal.LoadBalancerName,RegInstance[a]);
            }
            wrap();
        }
    },
    
    enableazone : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var retVal = {ok:null};
        window.openDialog(
            "chrome://ec2ui/content/dialog_enable_lbazone.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal,
            loadbalancer
        );
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
            var Zonechk = retVal.Zone;
            var newStr = Zonechk.substring(",", Zonechk.length-1);
	    var zones = new String(newStr);
	    var Zone = new Array();
	    Zone = zones.split(",");
	    for(var a=0;a<Zone.length;a++)
	    {
            ec2ui_session.controller.Enableazonewithloadbalancer(retVal.LoadBalancerName,Zone[a]);
            }
            wrap();
        } 
    },
    
    disableazone : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var retVal = {ok:null};
        window.openDialog(
            "chrome://ec2ui/content/dialog_disable_lbazone.xul",
            null,
            "chrome,centerscreen,modal",
            ec2ui_session,
            retVal,
            loadbalancer
        );
         var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if (retVal.ok) {
            var Zonechk = retVal.Zone;
            var newStr = Zonechk.substring(",", Zonechk.length-1);
	    var zones = new String(newStr);
	    var Zone = new Array();
	    Zone = zones.split(",");
	    for(var a=0;a<Zone.length;a++)
	    {
                ec2ui_session.controller.Disableazonewithloadbalancer(retVal.LoadBalancerName,Zone[a]);
            }
            wrap();
        } 
        
    },
    
    copyToClipBoard : function(fieldName) {
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) {
            return;
        }

        copyToClipboard(loadbalancer[fieldName]);
    },
    
    disablestickness :function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var confirmed = confirm(ec2ui_utils.getMessageProperty("ec2ui.msg.loadbalancerview.confirm.delete")+loadbalancer.LoadBalancerName+"?");
        if (!confirmed)
            return;
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        if(loadbalancer.APolicyName == ""){
            var policy =  loadbalancer.CPolicyName;
            ec2ui_session.controller.DeleteLoadBalancerPolicy(loadbalancer.LoadBalancerName,policy, wrap); 
        }else{
            var policy = loadbalancer.APolicyName;
            ec2ui_session.controller.DeleteLoadBalancerPolicy(loadbalancer.LoadBalancerName,policy, wrap);
        }
        
    },
    
    applicationsticknesss :function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var loadbalancername = loadbalancer.LoadBalancerName;
        var cname = loadbalancer.CookieName;
        var policy = loadbalancer.APolicyName;
        if(cname){
            ec2ui_session.controller.DeleteLoadBalancerPolicy(loadbalancer.LoadBalancerName,policy);
        }
        var CookieName = prompt(ec2ui_utils.getMessageProperty("ec2ui.msg.loadbalancerview.confirm.CookieName"));
        if (CookieName == null)
            return;
        CookieName = CookieName.trim();
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        ec2ui_session.controller.CreateAppCookieSP(loadbalancername,CookieName,wrap); 
    },
    
    loadbalancerstickness :function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var loadbalancername = loadbalancer.LoadBalancerName;
        var policy = loadbalancer.CPolicyName;
        var CookieExpirationPeriod = loadbalancer.CookieExpirationPeriod;
        if(CookieExpirationPeriod){
           ec2ui_session.controller.DeleteLoadBalancerPolicy(loadbalancer.LoadBalancerName,policy);  
        }
        var CookieExpirationPeriod = prompt(ec2ui_utils.getMessageProperty("ec2ui.msg.loadbalancerview.confirm.CookieExpirationPeriod"));
        if (CookieExpirationPeriod == null)
            return;
        CookieExpirationPeriod = CookieExpirationPeriod.trim();
        var me = this;
        var wrap = function() {
            if (ec2ui_prefs.isRefreshOnChangeEnabled()) {
                me.refresh();
            }
        }
        ec2ui_session.controller.CreateLBCookieSP(loadbalancername,CookieExpirationPeriod, wrap);
    },
    
    enableOrDisableItems : function(){
        var loadbalancer = this.getSelectedLoadbalancer();
        if (loadbalancer == null) return;
        var stickness = loadbalancer.CookieExpirationPeriod;
        var astickness = loadbalancer.CookieName;
        var instances = loadbalancer.InstanceId;
        var zones = loadbalancer.zone;
        var disableazones = new Array();
        var Rzone = new String(zones);
	var zoneArray = new Array();
	zoneArray = Rzone.split(",");
	
        var index =  this.selection.currentIndex;
        document.getElementById("loadbalancer.tree.contextmenu").disabled = true;
        //For Stickness
        if(!astickness){
            document.getElementById("loadbalancer.context.appstickness").disabled = true;
        }else{
            document.getElementById("loadbalancer.context.appstickness").disabled = false;
        }
        if(!stickness){
            document.getElementById("loadbalancer.context.lbstickness").disabled = true;
        }else{
            document.getElementById("loadbalancer.context.lbstickness").disabled = false;
        }
        if(!stickness && !astickness){
            document.getElementById("loadbalancer.context.disablestickness").disabled = true;
            document.getElementById("loadbalancer.context.lbstickness").disabled = false;
            document.getElementById("loadbalancer.context.appstickness").disabled = false;
        }else {
            document.getElementById("loadbalancer.context.disablestickness").disabled = false;
        }
        //for Instances
        if(instances == ""){
            document.getElementById("loadbalancer.context.instances").disabled = true;
        }else{
            document.getElementById("loadbalancer.context.instances").disabled = false;
        }
        //for Avalibility Zones
   
	if(zoneArray.length == 1){
            document.getElementById("loadbalancer.context.zones").disabled = true;
        }else{
            document.getElementById("loadbalancer.context.zones").disabled = false;
        }
	
    
    },
    
    displayLoadbalancer : function (loadbalancerList) {
        if (!loadbalancerList) { loadbalancerList = []; }

        this.treeBox.rowCountChanged(0, -this.loadbalancerList.length);
        this.loadbalancerList = loadbalancerList;
        this.treeBox.rowCountChanged(0, this.loadbalancerList.length);
        this.sort();
        this.selection.clearSelection();
        ec2ui_InstanceHealthTreeView.displayInstanceHealth([]);
        if (loadbalancerList.length > 0) {
            this.selection.select(0);
        }
    }
};

ec2ui_LoadbalancerTreeView.register();
