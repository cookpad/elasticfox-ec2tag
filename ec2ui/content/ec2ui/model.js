// "Classes" representing objects like AMIs, Instances etc.
function Credential(name, accessKey, secretKey) {
    this.name = name;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
}

function AccountIdName(id, name) {
    this.accountid = id;
    this.displayname = name;
}

function Endpoint(name, url) {
    this.name = name;
    this.url = url;

    this.toJSONString = function() {
        var pairs = new Array();
        for (k in this) {
            if (this.hasOwnProperty(k)) {
                v = this[k];
                if (v != null && typeof v != "function") {
                    log ("adding key toJSONString: " + k);
                    pairs.push("'"+k+"':'"+v+"'");
                }
            }
        }
        return "({"+pairs.join(',')+"})";
    };

    return this;
}

function AMI(id, location, state, owner, isPublic, arch, platform, aki, ari, rootDeviceType, ownerAlias, name, description, snapshotId, tag) {
    this.id = id;
    this.location = location;
    this.state = state;
    this.owner = owner;
    this.isPublic = isPublic;
    this.arch = arch;
    this.platform = platform;
    if (tag) this.tag = tag;
    this.aki = aki;
    this.ari = ari;
    this.rootDeviceType = rootDeviceType;
    this.ownerAlias = ownerAlias;
    this.name = name;
    this.description = description;
    this.snapshotId = snapshotId;
}

function Snapshot(id, volumeId, status, startTime, progress, volumeSize, description, owner, ownerAlias, tag) {
    this.id = id;
    this.volumeId = volumeId;
    this.status = status;
    this.startTime = startTime.strftime('%Y-%m-%d %H:%M:%S');
    this.progress = progress;
    this.description = description;
    this.volumeSize = volumeSize;
    this.owner = owner;
    this.ownerAlias = ownerAlias;

    if (tag) this.tag = tag;
}

function Volume(id, size, snapshotId, zone, status, createTime, instanceId, device, attachStatus, attachTime, tag) {
    this.id = id;
    this.size = size;
    this.snapshotId = snapshotId;
    this.availabilityZone = zone;
    this.status = status;
    this.createTime = createTime.strftime('%Y-%m-%d %H:%M:%S');
    this.instanceId = instanceId;
    this.device = device;
    this.attachStatus = attachStatus;
    if (attachStatus != "") {
      this.attachTime = attachTime.strftime('%Y-%m-%d %H:%M:%S');
    }
    if (tag) this.tag = tag;
}

function Instance(resId, ownerId, groupList, instanceId, imageId, kernelId,
        ramdiskId, state, publicDnsName, privateDnsName, privateIpAddress, keyName, reason,
        amiLaunchIdx, instanceType, launchTime, placement, platform, tag, vpcId, subnetId, rootDeviceType) {
    this.resId = resId;
    this.ownerId = ownerId;
    this.groupList = groupList;
    this.id = instanceId;
    this.imageId = imageId;
    this.kernelId = kernelId;
    this.ramdiskId = ramdiskId;
    this.state = state;
    this.publicDnsName = publicDnsName;
    this.privateDnsName = privateDnsName;
    this.privateIpAddress = privateIpAddress;
    this.keyName = keyName;
    this.reason = reason;
    this.amiLaunchIdx = amiLaunchIdx;
    this.instanceType = instanceType;
    this.launchTime = launchTime;
    this.launchTimeDisp = launchTime.strftime('%Y-%m-%d %H:%M:%S');

    this.groups = this.groupList.join(', ');

    this.placement = placement;
    this.platform = platform;
    this.vpcId = vpcId;
    this.subnetId = subnetId;
    if (tag) this.tag = tag;
    this.rootDeviceType = rootDeviceType;
}

function KeyPair(name, fingerprint) {
    this.name = name;
    this.fingerprint = fingerprint;
}

function SecurityGroup(ownerId, name, description, permissions) {
    this.ownerId = ownerId;
    this.name = name;
    this.description = description;
    this.permissions = permissions;
}

function Permission(protocol, fromPort, toPort, groupTuples, ipRanges) {
    this.protocol = protocol;
    this.fromPort = fromPort;
    this.toPort = toPort;
    this.groupTuples = groupTuples; // userId+groupName tuples
    this.ipRanges = ipRanges;           // CIDRs

    var tuples = new Array();
    for(var i in this.groupTuples) {
        tuples.push(this.groupTuples[i].join(':'));
    }
    this.groups = tuples.join(', ');
    this.cidrs = this.ipRanges.join(', ');
}

function AvailabilityZone(name, state) {
    this.name = name;
    this.state = state;
}

function AddressMapping(address, instanceid, tag) {
    this.address = address;
    this.instanceid = instanceid;
    if (tag) this.tag = tag;
}

function BundleTask(id, instanceId, state, startTime, updateTime, s3bucket, s3prefix, errorMsg) {
    this.id = id;
    this.instanceId = instanceId;
    this.state = state;
    this.startTime = startTime.strftime('%Y-%m-%d %H:%M:%S');
    this.updateTime = updateTime.strftime('%Y-%m-%d %H:%M:%S');
    this.s3bucket = s3bucket;
    this.s3prefix = s3prefix;
    this.errorMsg = errorMsg;
}

function LeaseOffering(id, type, az, duration, fPrice, uPrice, desc) {
    this.id = id;
    this.instanceType = type;
    this.azone = az;
    this.duration = duration;
    this.fixedPrice = fPrice;
    this.usagePrice = uPrice;
    this.description = desc;
}

function ReservedInstance(id, type, az, start, duration, fPrice, uPrice, count, desc, state) {
    this.id = id;
    this.instanceType = type;
    this.azone = az;
    this.startTime = start;
    this.start = start.strftime('%Y-%m-%d %H:%M:%S');
    this.duration = duration;
    this.fixedPrice = fPrice;
    this.usagePrice = uPrice;
    this.count = count;
    this.description = desc;
    this.state = state;
}

function Vpc(id, cidr, state, dhcpOptionsId, tag) {
    this.id = id;
    this.cidr = cidr;
    this.state = state;
    this.dhcpOptionsId = dhcpOptionsId;
    if (tag) this.tag = tag;
}

function Subnet(id, vpcId, cidr, state, availableIp, availabilityZone, tag) {
    this.id = id;
    this.vpcId = vpcId;
    this.cidr = cidr;
    this.state = state;
    this.availableIp = availableIp;
    this.availabilityZone = availabilityZone;
    if (tag) this.tag = tag;
}

function DhcpOptions(id, options, tag) {
    this.id = id;
    this.options = options;
    if (tag) this.tag = tag;
}

function VpnConnection(id, vgwId, cgwId, type, state, config, attachments, tag) {
    this.id = id;
    this.vgwId = vgwId;
    this.cgwId = cgwId;
    this.type = type;
    this.state = state;
    this.config = config;
    this.attachments = attachments;

    if (tag) this.tag = tag;
}

function VpnGateway(id, availabilityZone, state, type, attachments, tag) {
    this.id = id;
    this.availabilityZone = availabilityZone;
    this.state = state;
    this.type = type;
    this.attachments = attachments;

    if (tag) this.tag = tag;
}

function VpnGatewayAttachment(vpcId, vgwId, state) {
    this.vpcId = vpcId;
    this.vgwId = vgwId;
    this.state = state;
}

function CustomerGateway(id, ipAddress, bgpAsn, state, type, tag) {
    this.id = id;
    this.ipAddress = ipAddress;
    this.bgpAsn = bgpAsn;
    this.state = state;
    this.type = type;

    if (tag) this.tag = tag;
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}

// Global model: home to things like lists of data that need to be shared (known AMIs, keypairs etc)
var ec2ui_model = {
    components      : new Array(),
    componentInterests : new Object(),

    volumes           : null,
    images            : null,
    snapshots         : null,
    instances         : null,
    keypairs          : null,
    azones            : null,
    securityGroups    : null,
    addresses         : null,
    bundleTasks       : null,
    offerings         : null,
    reservedInstances : null,
    subnets           : null,
    vpcs              : null,
    dhcpOptions       : null,
    vpnConnections    : null,
    vpnGateways       : null,
    customerGateways  : null,

    resourceMap     : {
        instances        : 0,
        volumes          : 1,
        snapshots        : 2,
        images           : 3,
        eips             : 4,
        vpcs             : 5,
        subnets          : 6,
        dhcpOptions      : 7,
        vpnConnections   : 8,
        vpnGateways      : 9,
        customerGateways : 10
    },

    amiIdManifestMap : {},

    invalidate : function() {
        // reset all lists, these will notify their associated views
        this.updateImages(null);
        this.updateInstances(null);
        this.updateKeypairs(null);
        this.updateSecurityGroups(null);
        this.updateAvailabilityZones(null);
        this.updateAddresses(null);
        this.updateVolumes(null);
        this.updateSnapshots(null);
        this.updateBundleTasks(null);
        this.updateLeaseOfferings(null);
        this.updateReservedInstances(null);
        this.updateVpcs(null);
        this.updateSubnets(null);
        this.updateDhcpOptions(null);
        this.updateVpnConnections(null);
        this.updateVpnGateways(null);
        this.updateCustomerGateways(null);
    },

    notifyComponents : function(interest) {
        var comps = this.componentInterests[interest] || [];
        for (var i in comps) {
            comps[i].notifyModelChanged(interest);
        }
    },

    registerInterest : function(component, interest) {
        if (!this.componentInterests[interest]) {
            this.componentInterests[interest] = [];
        }
        this.componentInterests[interest].push(component);
    },

    updateVpcs : function(list) {
        this.vpcs = list;
        this.notifyComponents("vpcs");
    },

    getVpcs : function() {
        if (this.vpcs == null) {
            ec2ui_session.controller.describeVpcs();
        }
        return this.vpcs;
    },

    updateSubnets : function(list) {
        this.subnets = list;
        this.notifyComponents("subnets");
    },

    getSubnets : function() {
        if (this.subnets == null) {
            ec2ui_session.controller.describeSubnets();
        }
        return this.subnets;
    },

    updateDhcpOptions : function(list) {
        this.dhcpOptions = list;
        this.notifyComponents("dhcpOptions");
    },

    getDhcpOptions : function() {
        if (this.dhcpOptions == null) {
            ec2ui_session.controller.describeDhcpOptions();
        }
        return this.dhcpOptions;
    },

    updateVpnConnections : function(list) {
        this.vpnConnections = list;
        this.notifyComponents("vpnConnections");
    },

    getVpnConnections : function() {
        if (this.vpnConnections == null) {
            ec2ui_session.controller.describeVpnConnections();
        }
        return this.vpnConnections;
    },

    updateVpnGateways : function(list) {
        this.vpnGateways = list;
        this.notifyComponents("vpnGateways");
    },

    getVpnGateways : function() {
        if (this.vpnGateways == null) {
            ec2ui_session.controller.describeVpnGateways();
        }
        return this.vpnGateways;
    },

    updateCustomerGateways : function(list) {
        this.customerGateways = list;
        this.notifyComponents("customerGateways");
    },

    getCustomerGateways : function() {
        if (this.customerGateways == null) {
            ec2ui_session.controller.describeCustomerGateways();
        }
        return this.customerGateways;
    },

    getVolumes : function() {
        if (this.volumes == null) {
            ec2ui_session.controller.describeVolumes();
        }
        return this.volumes;
    },

    updateVolumes : function(list) {
        this.volumes = list;
        this.notifyComponents("volumes");
    },

    updateSnapshots : function(list) {
        this.snapshots = list;
        this.notifyComponents("snapshots");
    },

    getSnapshots : function() {
        if (this.snapshots == null) {
            ec2ui_session.controller.describeSnapshots();
        }
        return this.snapshots;
    },

    addToAmiManifestMap : function(ami, map) {
        if (!ami) return;
        if (!map) map = this.amiIdManifestMap;
        if (ami.id.match(regExs["ami"])) {
            map[ami.id] = ami.location;
        }
    },

    updateImages : function(list) {
        this.images = list;

        var amiMap = new Object();
        if (list) {
            // Rebuild the list that maps ami-id to ami-manifest
            for (var i = 0; i < list.length; ++i) {
                var ami = list[i];
                this.addToAmiManifestMap(ami, amiMap);

                var manifest = ami.location;
                manifest = manifest.toLowerCase();
                if (ami.platform == "windows" &&
                    manifest.indexOf("winauth") >= 0) {
                    ami.platform += " authenticated";
                }
            }
        }
        this.amiIdManifestMap = amiMap;
        this.notifyComponents("images");
    },

    getImages : function() {
        if (this.images == null) {
            ec2ui_session.controller.describeImages();
        }
        return this.images;
    },

    getAmiManifestForId : function(imageId) {
        if (imageId == null)
            return "";
        return this.amiIdManifestMap[imageId] || "";
    },

    updateInstances : function(list) {
        this.instances = list;
        if (list != null) {
            for (var i = 0; i < list.length; ++i) {
                var instance = list[i];
                if (instance.platform == "windows") {
                    // Retrieve the ami manifest from the amiid
                    var manifest = this.amiIdManifestMap[instance.imageId] || "";
                    log ("Manifest requested for: " + instance.imageId + ", received: " + manifest);
                    manifest = manifest.toLowerCase();
                    if (manifest.indexOf("winauth") >= 0) {
                        // This is an authenticated Windows instance
                        instance.platform += " authenticated";
                    }
                }
            }
        }
        this.notifyComponents("instances");
    },

    getInstances : function() {
        if (this.instances == null) {
            ec2ui_session.controller.describeInstances();
        }
        return this.instances;
    },

    updateKeypairs : function(list) {
        this.keypairs = list;
        this.notifyComponents("keypairs");
    },

    getKeypairs : function() {
        if (this.keypairs == null) {
            ec2ui_session.controller.describeKeypairs();
        }
        return this.keypairs;
    },

    updateSecurityGroups : function(list) {
        this.securityGroups = list;
        this.notifyComponents("securitygroups");
    },

    getSecurityGroups : function() {
        if (this.securityGroups == null) {
            ec2ui_session.controller.describeSecurityGroups();
        }
        return this.securityGroups;
    },

    getAddresses : function() {
        if (this.addresses == null) {
            ec2ui_session.controller.describeAddresses();
        }
        return this.addresses;
    },

    updateAddresses : function(list) {
        this.addresses = list;
        this.notifyComponents("addresses");
    },

    updateAvailabilityZones : function(list) {
        this.azones = list;
        this.notifyComponents("azones");
    },

    getAvailabilityZones : function() {
        if (this.azones == null) {
            ec2ui_session.controller.describeAvailabilityZones();
        }
        return this.azones;
    },

    updateBundleTasks : function(list) {
        this.bundleTasks = list;
        this.notifyComponents("bundleTasks");
    },

    getBundleTasks : function() {
        if (this.bundleTasks == null) {
            ec2ui_session.controller.describeBundleTasks();
        }
        return this.bundleTasks;
    },

    updateLeaseOfferings : function(list) {
        this.offerings = list;
        this.notifyComponents("offerings");
    },

    getLeaseOfferings : function() {
        if (this.offerings == null) {
            ec2ui_session.controller.describeLeaseOfferings();
        }
        return this.offerings;
    },

    updateReservedInstances : function(list) {
        this.reservedInstances = list;
        this.notifyComponents("reservedInstances");
    },

    getReservedInstances : function() {
        if (this.reservedInstances == null) {
            ec2ui_session.controller.describeReservedInstances();
        }
        return this.reservedInstances;
    }
}
