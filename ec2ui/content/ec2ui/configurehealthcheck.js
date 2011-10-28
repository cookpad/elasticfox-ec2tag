var ec2ui_ConfigureHealthCheck = {
    ec2ui_session : null,
    retVal : null,
    launch : function() {
        this.retVal.LoadBalancerName = document.getElementById("ec2ui.loadbalancer.LoadBalancerName").value.trim();
	this.retVal.Target = document.getElementById("ec2ui.loadbalancer.target").value.trim();
        this.retVal.Interval = document.getElementById("ec2ui.loadbalancer.Interval").value.trim();
	this.retVal.Timeout = document.getElementById("ec2ui.loadbalancer.timeout").value.trim();
	this.retVal.HealthyThreshold = document.getElementById("ec2ui.loadbalancer.HThreshold").value.trim();
	this.retVal.UnhealthyThreshold = document.getElementById("ec2ui.loadbalancer.uThreshold").value.trim();
	
	this.retVal.ok = true;
        return true;
    },
    
    init : function() {
        var loadbalancer = window.arguments[0];
        this.ec2ui_session = window.arguments[1];
        this.retVal = window.arguments[2];
        document.getElementById("ec2ui.loadbalancer.LoadBalancerName").value = loadbalancer.LoadBalancerName;
	document.getElementById("ec2ui.loadbalancer.target").value = loadbalancer.Target;
        document.getElementById("ec2ui.loadbalancer.timeout").value = loadbalancer.Timeout;
        document.getElementById("ec2ui.loadbalancer.Interval").value = loadbalancer.Interval;
        document.getElementById("ec2ui.loadbalancer.uThreshold").value = loadbalancer.UnhealthyThreshold;
        document.getElementById("ec2ui.loadbalancer.HThreshold").value = loadbalancer.HealthyThreshold;
        
    }
}