var ec2_LoadbalancerDetails = {
    init : function() {
        var loadbalancer = window.arguments[0];
        document.getElementById("ec2ui.loadbalancer.LoadBalancerName").value = loadbalancer.LoadBalancerName;
        document.getElementById("ec2ui.loadbalancer.CreatedTime").value = loadbalancer.CreatedTime;
        document.getElementById("ec2ui.loadbalancer.DNSName").value = loadbalancer.DNSName;
        document.getElementById("ec2ui.loadbalancer.Protocol").value = loadbalancer.Protocol;
        document.getElementById("ec2ui.loadbalancer.LoadBalancerPort").value = loadbalancer.LoadBalancerPort;
        document.getElementById("ec2ui.loadbalancer.InstancePort").value = loadbalancer.InstancePort;
        document.getElementById("ec2ui.loadbalancer.Interval").value = loadbalancer.Interval;
        document.getElementById("ec2ui.loadbalancer.Target").value = loadbalancer.Target;
        document.getElementById("ec2ui.loadbalancer.HealthyThreshold").value = loadbalancer.HealthyThreshold;
        document.getElementById("ec2ui.loadbalancer.UnhealthyThreshold").value = loadbalancer.UnhealthyThreshold;
        document.getElementById("ec2ui.loadbalancer.Timeout").value = loadbalancer.Timeout;
        document.getElementById("ec2ui.loadbalancer.Instances").value = loadbalancer.InstanceId;
        document.getElementById("ec2ui.loadbalancer.zone").value = loadbalancer.zone;
   
        
    }
}