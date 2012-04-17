// On-Demand Instances
var __calcLinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : 0.080, 'm1.medium'  : 0.160,
    'm1.large'   : 0.320, 'm1.xlarge'  : 0.640,
    't1.micro'   : 0.020, 'm2.xlarge'  : 0.450,
    'm2.2xlarge' : 0.900, 'm2.4xlarge' : 1.800,
    'c1.medium'  : 0.165, 'c1.xlarge'  : 0.660,
    'cc1.4xlarge': 1.300, 'cc2.8xlarge': 2.400,
    'cg1.4xlarge': 2.100,
  },
  'us-west-2' : {
    'm1.small'   : 0.080, 'm1.medium'  : 0.160,
    'm1.large'   : 0.320, 'm1.xlarge'  : 0.640,
    't1.micro'   : 0.020, 'm2.xlarge'  : 0.450,
    'm2.2xlarge' : 0.900, 'm2.4xlarge' : 1.800,
    'c1.medium'  : 0.165, 'c1.xlarge'  : 0.660,
  },
  'us-west-1' : {
    'm1.small'   : 0.090, 'm1.medium'  : 0.180,
    'm1.large'   : 0.360, 'm1.xlarge'  : 0.720,
    't1.micro'   : 0.025, 'm2.xlarge'  : 0.506,
    'm2.2xlarge' : 1.012, 'm2.4xlarge' : 2.024,
    'c1.medium'  : 0.186, 'c1.xlarge'  : 0.744,
  },
  'eu-west-1' : {
    'm1.small'   : 0.090, 'm1.medium'  : 0.180,
    'm1.large'   : 0.360, 'm1.xlarge'  : 0.720,
    't1.micro'   : 0.025, 'm2.xlarge'  : 0.506,
    'm2.2xlarge' : 1.012, 'm2.4xlarge' : 2.024,
    'c1.medium'  : 0.186, 'c1.xlarge'  : 0.744,
  },
  'ap-southeast-1' : {
    'm1.small'   : 0.090, 'm1.medium'  : 0.180,
    'm1.large'   : 0.360, 'm1.xlarge'  : 0.720,
    't1.micro'   : 0.025, 'm2.xlarge'  : 0.506,
    'm2.2xlarge' : 1.012, 'm2.4xlarge' : 2.024,
    'c1.medium'  : 0.186, 'c1.xlarge'  : 0.744,
  },
  'ap-northeast-1' : {
    'm1.small'   : 0.092, 'm1.medium'  : 0.184,
    'm1.large'   : 0.368, 'm1.xlarge'  : 0.736,
    't1.micro'   : 0.027, 'm2.xlarge'  : 0.518,
    'm2.2xlarge' : 1.036, 'm2.4xlarge' : 2.072,
    'c1.medium'  : 0.190, 'c1.xlarge'  : 0.760,
  },
  'sa-east-1' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.027, 'm2.xlarge'  : 0.680,
    'm2.2xlarge' : 1.360, 'm2.4xlarge' : 2.720,
    'c1.medium'  : 0.230, 'c1.xlarge'  : 0.920,
  },
};

var __calcWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.030, 'm2.xlarge'  : 0.570,
    'm2.2xlarge' : 1.140, 'm2.4xlarge' : 2.280,
    'c1.medium'  : 0.285, 'c1.xlarge'  : 1.140,
    'cc1.4xlarge': 1.610, 'cc2.8xlarge': 2.970,
    'cg1.4xlarge': 2.600,
  },
  'us-west-2' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.030, 'm2.xlarge'  : 0.570,
    'm2.2xlarge' : 1.140, 'm2.4xlarge' : 2.280,
    'c1.medium'  : 0.285, 'c1.xlarge'  : 1.140,
  },
  'us-west-1' : {
    'm1.small'   : 0.125, 'm1.medium'  : 0.250,
    'm1.large'   : 0.500, 'm1.xlarge'  : 1.000,
    't1.micro'   : 0.035, 'm2.xlarge'  : 0.626,
    'm2.2xlarge' : 1.252, 'm2.4xlarge' : 2.504,
    'c1.medium'  : 0.306, 'c1.xlarge'  : 1.224,
  },
  'eu-west-1' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.035, 'm2.xlarge'  : 0.570,
    'm2.2xlarge' : 1.140, 'm2.4xlarge' : 2.280,
    'c1.medium'  : 0.285, 'c1.xlarge'  : 1.140,
  },
  'ap-southeast-1' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.035, 'm2.xlarge'  : 0.570,
    'm2.2xlarge' : 1.140, 'm2.4xlarge' : 2.280,
    'c1.medium'  : 0.285, 'c1.xlarge'  : 1.140,
  },
  'ap-northeast-1' : {
    'm1.small'   : 0.115, 'm1.medium'  : 0.230,
    'm1.large'   : 0.460, 'm1.xlarge'  : 0.920,
    't1.micro'   : 0.035, 'm2.xlarge'  : 0.570,
    'm2.2xlarge' : 1.140, 'm2.4xlarge' : 2.280,
    'c1.medium'  : 0.285, 'c1.xlarge'  : 1.140,
  },
  'sa-east-1' : {
    'm1.small'   : 0.150, 'm1.medium'  : 0.300,
    'm1.large'   : 0.600, 'm1.xlarge'  : 1.200,
    't1.micro'   : 0.037, 'm2.xlarge'  : 0.800,
    'm2.2xlarge' : 1.600, 'm2.4xlarge' : 3.200,
    'c1.medium'  : 0.350, 'c1.xlarge'  : 1.400,
  },
};

// Reserved Instances (Light)
var __calcLightRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [  69, 0.039,  106, 0.031],
    'm1.medium'  : [ 138, 0.078,  212, 0.063],
    'm1.large'   : [ 276, 0.156,  425, 0.124],
    'm1.xlarge'  : [ 552, 0.312,  850, 0.248],
    't1.micro'   : [  23, 0.012,   35, 0.012],
    'm2.xlarge'  : [ 353, 0.220,  548, 0.175],
    'm2.2xlarge' : [ 706, 0.440, 1096, 0.350],
    'm2.4xlarge' : [1412, 0.880, 2192, 0.700],
    'c1.medium'  : [ 178, 0.100,  273, 0.088],
    'c1.xlarge'  : [ 712, 0.400, 1092, 0.352],
    'cc1.4xlarge': [1450, 0.742, 2225, 0.742],
    'cc2.8xlarge': [1762, 0.904, 2710, 0.904],
    'cg1.4xlarge': [2410, 1.234, 3700, 1.234],
  },
  'us-west-1' : {
    'm1.small'  : [  69, 0.049,  106, 0.039],
    'm1.medium' : [ 138, 0.098,  212, 0.078],
    'm1.large'  : [ 276, 0.196,  425, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850, 0.312],
    't1.micro'  : [  23, 0.015,   35, 0.015],
    'm2.xlarge' : [ 353, 0.288,  548, 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096, 0.460],
    'm2.4xlarge': [1412, 1.152, 2192, 0.920],
    'c1.medium' : [ 178, 0.125,  273, 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092, 0.440],
  },
  'us-west-2' : {
    'm1.small'  : [  69, 0.039,  106, 0.031],
    'm1.medium' : [ 138, 0.078,  212, 0.063],
    'm1.large'  : [ 276, 0.156,  425, 0.124],
    'm1.xlarge' : [ 552, 0.312,  850, 0.248],
    't1.micro'  : [  23, 0.012,   35, 0.012],
    'm2.xlarge' : [ 353, 0.220,  548, 0.175],
    'm2.2xlarge': [ 706, 0.440, 1096, 0.350],
    'm2.4xlarge': [1412, 0.880, 2192, 0.700],
    'c1.medium' : [ 178, 0.100,  273, 0.088],
    'c1.xlarge' : [ 712, 0.400, 1092, 0.352],
  },
  'eu-west-1' : {
    'm1.small'  : [  69, 0.049,  106, 0.039],
    'm1.medium' : [ 138, 0.098,  212, 0.078],
    'm1.large'  : [ 276, 0.196,  425, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850, 0.312],
    't1.micro'  : [  23, 0.015,   35, 0.015],
    'm2.xlarge' : [ 353, 0.288,  548, 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096, 0.460],
    'm2.4xlarge': [1412, 1.152, 2192, 0.920],
    'c1.medium' : [ 178, 0.125,  273, 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092, 0.440],
  },
  'ap-southeast-1' : {
    'm1.small'  : [  69, 0.049,  106, 0.039],
    'm1.medium' : [ 138, 0.098,  212, 0.078],
    'm1.large'  : [ 276, 0.196,  425, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850, 0.312],
    't1.micro'  : [  23, 0.015,   35, 0.015],
    'm2.xlarge' : [ 353, 0.288,  548, 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096, 0.460],
    'm2.4xlarge': [1412, 1.152, 2192, 0.920],
    'c1.medium' : [ 178, 0.125,  273, 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092, 0.440],
  },
  'ap-northeast-1' : {
    'm1.small'  : [  72, 0.054,  111, 0.043],
    'm1.medium' : [ 144, 0.108,  223, 0.085],
    'm1.large'  : [ 288, 0.216,  446, 0.172],
    'm1.xlarge' : [ 576, 0.432,  892, 0.344],
    't1.micro'  : [  24, 0.017,   37, 0.017],
    'm2.xlarge' : [ 373, 0.320,  575, 0.255],
    'm2.2xlarge': [ 746, 0.640, 1150, 0.510],
    'm2.4xlarge': [1492, 1.280, 2300, 1.020],
    'c1.medium' : [ 187, 0.138,  286, 0.120],
    'c1.xlarge' : [ 748, 0.550, 1144, 0.480],
  },
  'sa-east-1' : {
    'm1.small'  : [ 131, 0.070,  203, 0.055],
    'm1.medium' : [ 263, 0.135,  405, 0.110],
    'm1.large'  : [ 527, 0.270,  810, 0.220],
    'm1.xlarge' : [1053, 0.540, 1620, 0.440],
    't1.micro'  : [  31, 0.016,   47, 0.016],
    'm2.xlarge' : [ 749, 0.380, 1151, 0.308],
    'm2.2xlarge': [1485, 0.770, 2302, 0.616],
    'm2.4xlarge': [2970, 1.540, 4604, 1.232],
    'c1.medium' : [ 263, 0.135,  405, 0.118],
    'c1.xlarge' : [1053, 0.540, 1620, 0.472],
  },
};

var __calcLightRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [  69, 0.059,  106, 0.051],
    'm1.medium'  : [ 138, 0.118,  212, 0.103],
    'm1.large'   : [ 276, 0.235,  425, 0.204],
    'm1.xlarge'  : [ 552, 0.470,  850, 0.408],
    't1.micro'   : [  23, 0.018,   35, 0.018],
    'm2.xlarge'  : [ 353, 0.290,  548, 0.245],
    'm2.2xlarge' : [ 706, 0.580, 1096, 0.490],
    'm2.4xlarge' : [1412, 1.160, 2192, 0.980],
    'c1.medium'  : [ 178, 0.165,  273, 0.153],
    'c1.xlarge'  : [ 712, 0.660, 1092, 0.612],
    'cc1.4xlarge': [1450, 0.922, 2225, 0.922],
    'cc2.8xlarge': [1762, 1.114, 2710, 1.114],
    'cg1.4xlarge': [2410, 1.534, 3700, 1.534],
  },
  'us-west-1' : {
    'm1.small'   : [  69, 0.069,  106, 0.059],
    'm1.medium'  : [ 138, 0.138,  212, 0.118],
    'm1.large'   : [ 276, 0.275,  425, 0.236],
    'm1.xlarge'  : [ 552, 0.550,  850, 0.472],
    't1.micro'   : [  23, 0.021,   35, 0.021],
    'm2.xlarge'  : [ 353, 0.368,  548, 0.310],
    'm2.2xlarge' : [ 706, 0.735, 1096, 0.620],
    'm2.4xlarge' : [1412, 1.470, 2192, 1.240],
    'c1.medium'  : [ 178, 0.190,  273, 0.175],
    'c1.xlarge'  : [ 712, 0.760, 1092, 0.700],
  },
  'us-west-2' : {
    'm1.small'  : [  69, 0.059,  106, 0.051],
    'm1.medium' : [ 138, 0.118,  212, 0.103],
    'm1.large'  : [ 276, 0.235,  425, 0.204],
    'm1.xlarge' : [ 552, 0.470,  850, 0.408],
    't1.micro'  : [  23, 0.018,   35, 0.018],
    'm2.xlarge' : [ 353, 0.290,  548, 0.245],
    'm2.2xlarge': [ 706, 0.580, 1096, 0.490],
    'm2.4xlarge': [1412, 1.160, 2192, 0.980],
    'c1.medium' : [ 178, 0.165,  273, 0.153],
    'c1.xlarge' : [ 712, 0.660, 1092, 0.612],
  },
  'eu-west-1' : {
    'm1.small'  : [  69, 0.069,  106, 0.059],
    'm1.medium' : [ 138, 0.138,  212, 0.118],
    'm1.large'  : [ 276, 0.275,  425, 0.236],
    'm1.xlarge' : [ 552, 0.550,  850, 0.472],
    't1.micro'  : [  23, 0.021,   35, 0.021],
    'm2.xlarge' : [ 353, 0.368,  548, 0.310],
    'm2.2xlarge': [ 706, 0.735, 1096, 0.620],
    'm2.4xlarge': [1412, 1.470, 2192, 1.240],
    'c1.medium' : [ 178, 0.190,  273, 0.175],
    'c1.xlarge' : [ 712, 0.760, 1092, 0.700],
  },
  'ap-southeast-1' : {
    'm1.small'  : [  69, 0.069,  106, 0.059],
    'm1.medium' : [ 138, 0.138,  212, 0.118],
    'm1.large'  : [ 276, 0.275,  425, 0.236],
    'm1.xlarge' : [ 552, 0.550,  850, 0.472],
    't1.micro'  : [  23, 0.021,   35, 0.021],
    'm2.xlarge' : [ 353, 0.368,  548, 0.310],
    'm2.2xlarge': [ 706, 0.735, 1096, 0.620],
    'm2.4xlarge': [1412, 1.470, 2192, 1.240],
    'c1.medium' : [ 178, 0.190,  273, 0.175],
    'c1.xlarge' : [ 712, 0.760, 1092, 0.700],
  },
  'ap-northeast-1' : {
    'm1.small'  : [  72, 0.076,  111, 0.065],
    'm1.medium' : [ 144, 0.153,  223, 0.130],
    'm1.large'  : [ 288, 0.305,  446, 0.260],
    'm1.xlarge' : [ 576, 0.610,  892, 0.520],
    't1.micro'  : [  24, 0.027,   37, 0.027],
    'm2.xlarge' : [ 373, 0.403,  575, 0.338],
    'm2.2xlarge': [ 746, 0.805, 1150, 0.676],
    'm2.4xlarge': [1492, 1.610, 2300, 1.352],
    'c1.medium' : [ 187, 0.208,  286, 0.193],
    'c1.xlarge' : [ 748, 0.830, 1144, 0.772],
  },
  'sa-east-1' : {
    'm1.small'  : [ 131, 0.090,  203, 0.075],
    'm1.medium' : [ 263, 0.175,  405, 0.150],
    'm1.large'  : [ 527, 0.350,  810, 0.300],
    'm1.xlarge' : [1053, 0.700, 1620, 0.600],
    't1.micro'  : [  31, 0.022,   47, 0.022],
    'm2.xlarge' : [ 749, 0.450, 1151, 0.378],
    'm2.2xlarge': [1485, 0.910, 2302, 0.756],
    'm2.4xlarge': [2970, 1.820, 4604, 1.512],
    'c1.medium' : [ 263, 0.200,  405, 0.183],
    'c1.xlarge' : [1053, 0.800, 1620, 0.732],
  },
};

// Reserved Instances (Medium)
var __calcMediumRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 160, 0.024,  250, 0.019],
    'm1.medium'  : [ 320, 0.048,  500, 0.038],
    'm1.large'   : [ 640, 0.096, 1000, 0.076],
    'm1.xlarge'  : [1280, 0.192, 2000, 0.152],
    't1.micro'   : [  54, 0.007,   82, 0.007],
    'm2.xlarge'  : [ 850, 0.133, 1283, 0.105],
    'm2.2xlarge' : [1700, 0.266, 2566, 0.210],
    'm2.4xlarge' : [3400, 0.532, 5132, 0.420],
    'c1.medium'  : [ 415, 0.060,  638, 0.053],
    'c1.xlarge'  : [1660, 0.240, 2552, 0.212],
    'cc1.4xlarge': [3286, 0.450, 5056, 0.450],
    'cc2.8xlarge': [4146, 0.540, 6378, 0.540],
    'cg1.4xlarge': [5630, 0.740, 8650, 0.740],
  },
  'us-west-1' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'us-west-2' : {
    'm1.small'  : [ 160, 0.024,  250, 0.019],
    'm1.medium' : [ 320, 0.048,  500, 0.038],
    'm1.large'  : [ 640, 0.096, 1000, 0.076],
    'm1.xlarge' : [1280, 0.192, 2000, 0.152],
    't1.micro'  : [  54, 0.007,   82, 0.007],
    'm2.xlarge' : [ 850, 0.133, 1283, 0.105],
    'm2.2xlarge': [1700, 0.266, 2566, 0.210],
    'm2.4xlarge': [3400, 0.532, 5132, 0.420],
    'c1.medium' : [ 415, 0.060,  638, 0.053],
    'c1.xlarge' : [1660, 0.240, 2552, 0.212],
  },
  'eu-west-1' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 168, 0.036,  262, 0.029],
    'm1.medium' : [ 336, 0.073,  525, 0.058],
    'm1.large'  : [ 672, 0.144, 1050, 0.116],
    'm1.xlarge' : [1344, 0.288, 2100, 0.232],
    't1.micro'  : [  57, 0.011,   86, 0.011],
    'm2.xlarge' : [ 893, 0.208, 1347, 0.165],
    'm2.2xlarge': [1786, 0.416, 2694, 0.330],
    'm2.4xlarge': [3572, 0.832, 5388, 0.660],
    'c1.medium' : [ 436, 0.090,  670, 0.080],
    'c1.xlarge' : [1744, 0.360, 2680, 0.320],
  },
  'sa-east-1' : {
    'm1.small'  : [ 307, 0.040,   473, 0.031],
    'm1.medium' : [ 614, 0.080,   945, 0.063],
    'm1.large'  : [1229, 0.160,  1890, 0.124],
    'm1.xlarge' : [2457, 0.320,  3780, 0.248],
    't1.micro'  : [  73, 0.009,   111, 0.009],
    'm2.xlarge' : [1789, 0.230,  2700, 0.183],
    'm2.2xlarge': [3578, 0.460,  5400, 0.366],
    'm2.4xlarge': [7155, 0.920, 10800, 0.732],
    'c1.medium' : [ 614, 0.080,   945, 0.070],
    'c1.xlarge' : [2457, 0.320,  3780, 0.280],
  },
};

var __calcMediumRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 160, 0.044,  250, 0.039],
    'm1.medium'  : [ 320, 0.088,  500, 0.078],
    'm1.large'   : [ 640, 0.175, 1000, 0.156],
    'm1.xlarge'  : [1280, 0.350, 2000, 0.312],
    't1.micro'   : [  54, 0.013,   82, 0.013],
    'm2.xlarge'  : [ 850, 0.203, 1283, 0.175],
    'm2.2xlarge' : [1700, 0.405, 2566, 0.350],
    'm2.4xlarge' : [3400, 0.810, 5132, 0.700],
    'c1.medium'  : [ 415, 0.125,  638, 0.118],
    'c1.xlarge'  : [1660, 0.500, 2552, 0.472],
    'cc1.4xlarge': [3286, 0.630, 5056, 0.630],
    'cc2.8xlarge': [4146, 0.750, 6378, 0.750],
    'cg1.4xlarge': [5630, 1.040, 8650, 1.040],
  },
  'us-west-1' : {
    'm1.small'   : [ 160, 0.051,  250, 0.045],
    'm1.medium'  : [ 320, 0.103,  500, 0.090],
    'm1.large'   : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge'  : [1280, 0.410, 2000, 0.360],
    't1.micro'   : [  54, 0.016,   82, 0.016],
    'm2.xlarge'  : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge' : [1700, 0.530, 2566, 0.456],
    'm2.4xlarge' : [3400, 1.060, 5132, 0.912],
    'c1.medium'  : [ 415, 0.145,  638, 0.135],
    'c1.xlarge'  : [1660, 0.580, 2552, 0.540],
  },
  'us-west-2' : {
    'm1.small'  : [ 160, 0.044,  250, 0.039],
    'm1.medium' : [ 320, 0.088,  500, 0.078],
    'm1.large'  : [ 640, 0.175, 1000, 0.156],
    'm1.xlarge' : [1280, 0.350, 2000, 0.312],
    't1.micro'  : [  54, 0.013,   82, 0.013],
    'm2.xlarge' : [ 850, 0.203, 1283, 0.175],
    'm2.2xlarge': [1700, 0.405, 2566, 0.350],
    'm2.4xlarge': [3400, 0.810, 5132, 0.700],
    'c1.medium' : [ 415, 0.125,  638, 0.118],
    'c1.xlarge' : [1660, 0.500, 2552, 0.472],
  },
  'eu-west-1' : {
    'm1.small'  : [ 160, 0.051,  250, 0.045],
    'm1.medium' : [ 320, 0.103,  500, 0.090],
    'm1.large'  : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge' : [1280, 0.410, 2000, 0.360],
    't1.micro'  : [  54, 0.016,   82, 0.016],
    'm2.xlarge' : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge': [1700, 0.530, 2566, 0.456],
    'm2.4xlarge': [3400, 1.060, 5132, 0.912],
    'c1.medium' : [ 415, 0.145,  638, 0.135],
    'c1.xlarge' : [1660, 0.580, 2552, 0.540],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 160, 0.051,  250, 0.045],
    'm1.medium' : [ 320, 0.103,  500, 0.090],
    'm1.large'  : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge' : [1280, 0.410, 2000, 0.360],
    't1.micro'  : [  54, 0.016,   82, 0.016],
    'm2.xlarge' : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge': [1700, 0.530, 2566, 0.456],
    'm2.4xlarge': [3400, 1.060, 5132, 0.912],
    'c1.medium' : [ 415, 0.145,  638, 0.135],
    'c1.xlarge' : [1660, 0.580, 2552, 0.540],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 168, 0.058,  262, 0.050],
    'm1.medium' : [ 336, 0.115,  525, 0.100],
    'm1.large'  : [ 672, 0.230, 1050, 0.200],
    'm1.xlarge' : [1344, 0.460, 2100, 0.400],
    't1.micro'  : [  57, 0.021,   86, 0.021],
    'm2.xlarge' : [ 893, 0.290, 1347, 0.248],
    'm2.2xlarge': [1786, 0.580, 2694, 0.496],
    'm2.4xlarge': [3572, 1.160, 5388, 0.992],
    'c1.medium' : [ 436, 0.160,  670, 0.150],
    'c1.xlarge' : [1744, 0.640, 2680, 0.600],
  },
  'sa-east-1' : {
    'm1.small'  : [ 307, 0.060,   473, 0.051],
    'm1.medium' : [ 614, 0.120,   945, 0.103],
    'm1.large'  : [1229, 0.240,  1890, 0.204],
    'm1.xlarge' : [2457, 0.480,  3780, 0.408],
    't1.micro'  : [  73, 0.015,   111, 0.015],
    'm2.xlarge' : [1789, 0.300,  2700, 0.253],
    'm2.2xlarge': [3578, 0.600,  5400, 0.506],
    'm2.4xlarge': [7155, 1.200, 10800, 1.012],
    'c1.medium' : [ 614, 0.150,   945, 0.135],
    'c1.xlarge' : [2457, 0.580,  3780, 0.540],
  },
};

// Reserved Instances (Heavy)
var __calcHeavyRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 195, 0.016,   300, 0.013],
    'm1.medium'  : [ 390, 0.032,   600, 0.026],
    'm1.large'   : [ 780, 0.064,  1200, 0.052],
    'm1.xlarge'  : [1560, 0.128,  2400, 0.104],
    't1.micro'   : [  62, 0.005,   100, 0.005],
    'm2.xlarge'  : [1030, 0.088,  1550, 0.070],
    'm2.2xlarge' : [2060, 0.176,  3100, 0.140],
    'm2.4xlarge' : [4120, 0.352,  6200, 0.280],
    'c1.medium'  : [ 500, 0.040,   775, 0.035],
    'c1.xlarge'  : [2000, 0.160,  3100, 0.140],
    'cc1.4xlarge': [4060, 0.297,  6300, 0.297],
    'cc2.8xlarge': [5000, 0.361,  7670, 0.361],
    'cg1.4xlarge': [6830, 0.494, 10490, 0.494],
  },
  'us-west-1' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'us-west-2' : {
    'm1.small'  : [ 195, 0.016,  300, 0.013],
    'm1.medium' : [ 390, 0.032,  600, 0.026],
    'm1.large'  : [ 780, 0.064, 1200, 0.052],
    'm1.xlarge' : [1560, 0.128, 2400, 0.104],
    't1.micro'  : [  62, 0.005,  100, 0.005],
    'm2.xlarge' : [1030, 0.088, 1550, 0.070],
    'm2.2xlarge': [2060, 0.176, 3100, 0.140],
    'm2.4xlarge': [4120, 0.352, 6200, 0.280],
    'c1.medium' : [ 500, 0.040,  775, 0.035],
    'c1.xlarge' : [2000, 0.160, 3100, 0.140],
  },
  'eu-west-1' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 205, 0.026,  315, 0.021],
    'm1.medium' : [ 410, 0.052,  630, 0.044],
    'm1.large'  : [ 820, 0.104, 1260, 0.084],
    'm1.xlarge' : [1640, 0.208, 2520, 0.168],
    't1.micro'  : [  65, 0.009,  105, 0.009],
    'm2.xlarge' : [1079, 0.163, 1628, 0.130],
    'm2.2xlarge': [2158, 0.326, 3256, 0.260],
    'm2.4xlarge': [4316, 0.652, 6512, 0.520],
    'c1.medium' : [ 530, 0.069,  814, 0.060],
    'c1.xlarge' : [2120, 0.276, 3256, 0.240],
  },
  'sa-east-1' : {
    'm1.small'  : [ 372, 0.030,   574, 0.021],
    'm1.medium' : [ 746, 0.055,  1148, 0.043],
    'm1.large'  : [1492, 0.110,  2295, 0.084],
    'm1.xlarge' : [2984, 0.220,  4590, 0.168],
    't1.micro'  : [  84, 0.007,   135, 0.007],
    'm2.xlarge' : [2160, 0.153,  3260, 0.123],
    'm2.2xlarge': [4320, 0.305,  6521, 0.246],
    'm2.4xlarge': [8640, 0.610, 13041, 0.492],
    'c1.medium' : [ 747, 0.055,  1148, 0.048],
    'c1.xlarge' : [2984, 0.220,  4590, 0.192],
  },
};

var __calcHeavyRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 195, 0.036,   300, 0.033],
    'm1.medium'  : [ 390, 0.073,   600, 0.066],
    'm1.large'   : [ 780, 0.145,  1200, 0.132],
    'm1.xlarge'  : [1560, 0.290,  2400, 0.264],
    't1.micro'   : [  62, 0.011,   100, 0.011],
    'm2.xlarge'  : [1030, 0.158,  1550, 0.140],
    'm2.2xlarge' : [2060, 0.315,  3100, 0.280],
    'm2.4xlarge' : [4120, 0.630,  6200, 0.560],
    'c1.medium'  : [ 500, 0.105,   775, 0.100],
    'c1.xlarge'  : [2000, 0.420,  3100, 0.400],
    'cc1.4xlarge': [4060, 0.477,  6300, 0.477],
    'cc2.8xlarge': [5000, 0.571,  7670, 0.571],
    'cg1.4xlarge': [6830, 0.794, 10490, 0.794],
  },
  'us-west-1' : {
    'm1.small'   : [ 195, 0.045,  300, 0.040],
    'm1.medium'  : [ 390, 0.090,  600, 0.080],
    'm1.large'   : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge'  : [1560, 0.360, 2400, 0.320],
    't1.micro'   : [  62, 0.014,  100, 0.014],
    'm2.xlarge'  : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge' : [2060, 0.455, 3100, 0.396],
    'm2.4xlarge' : [4120, 0.910, 6200, 0.792],
    'c1.medium'  : [ 500, 0.128,  775, 0.120],
    'c1.xlarge'  : [2000, 0.510, 3100, 0.480],
  },
  'us-west-2' : {
    'm1.small'  : [ 195, 0.036,  300, 0.033],
    'm1.medium' : [ 390, 0.073,  600, 0.066],
    'm1.large'  : [ 780, 0.145, 1200, 0.132],
    'm1.xlarge' : [1560, 0.290, 2400, 0.264],
    't1.micro'  : [  62, 0.011,  100, 0.011],
    'm2.xlarge' : [1030, 0.158, 1550, 0.140],
    'm2.2xlarge': [2060, 0.315, 3100, 0.280],
    'm2.4xlarge': [4120, 0.630, 6200, 0.560],
    'c1.medium' : [ 500, 0.105,  775, 0.100],
    'c1.xlarge' : [2000, 0.420, 3100, 0.400],
  },
  'eu-west-1' : {
    'm1.small'  : [ 195, 0.045,  300, 0.040],
    'm1.medium' : [ 390, 0.090,  600, 0.080],
    'm1.large'  : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge' : [1560, 0.360, 2400, 0.320],
    't1.micro'  : [  62, 0.014,  100, 0.014],
    'm2.xlarge' : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge': [2060, 0.455, 3100, 0.396],
    'm2.4xlarge': [4120, 0.910, 6200, 0.792],
    'c1.medium' : [ 500, 0.128,  775, 0.120],
    'c1.xlarge' : [2000, 0.510, 3100, 0.480],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 195, 0.045,  300, 0.040],
    'm1.medium' : [ 390, 0.090,  600, 0.080],
    'm1.large'  : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge' : [1560, 0.360, 2400, 0.320],
    't1.micro'  : [  62, 0.014,  100, 0.014],
    'm2.xlarge' : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge': [2060, 0.455, 3100, 0.396],
    'm2.4xlarge': [4120, 0.910, 6200, 0.792],
    'c1.medium' : [ 500, 0.128,  775, 0.120],
    'c1.xlarge' : [2000, 0.510, 3100, 0.480],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 205, 0.049,  315, 0.044],
    'm1.medium' : [ 410, 0.116,  630, 0.088],
    'm1.large'  : [ 820, 0.195, 1260, 0.176],
    'm1.xlarge' : [1640, 0.390, 2520, 0.352],
    't1.micro'  : [  65, 0.019,  105, 0.019],
    'm2.xlarge' : [1079, 0.248, 1628, 0.215],
    'm2.2xlarge': [2158, 0.495, 3256, 0.430],
    'm2.4xlarge': [4316, 0.990, 6512, 0.860],
    'c1.medium' : [ 530, 0.139,  814, 0.133],
    'c1.xlarge' : [2120, 0.556, 3256, 0.532],
  },
  'sa-east-1' : {
    'm1.small'  : [ 372, 0.050,  574, 0.041],
    'm1.medium' : [ 746, 0.095, 1148, 0.083],
    'm1.large'  : [1492, 0.190, 2295, 0.164],
    'm1.xlarge' : [2984, 0.380, 4590, 0.328],
    't1.micro'  : [  84, 0.013,  135, 0.013],
    'm2.xlarge' : [2160, 0.223, 3260, 0.193],
    'm2.2xlarge': [4320, 0.445, 6521, 0.386],
    'm2.4xlarge': [8640, 0.890, 13041, 0.772],
    'c1.medium' : [ 747, 0.120, 1148, 0.113],
    'c1.xlarge' : [2984, 0.480, 4590, 0.452],
  },
};

function generateCSVForObject(obj) {
    var pairs = new Array();
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            var v = obj[k];
            if (v != null) {
                if (typeof v === 'object') {
                    pairs.push(generateCSVForObject(v));
                } else if (typeof v != 'function') {
                    pairs.push(v);
                }
            }
        }
    }
    return pairs.join(',');
}

function sortView(document, cols, list) {
    // cols is a list of column ids. The portion after the first. must
    // be the name of the corresponding attribute of the objects in +list.
    var sortField = null;
    var ascending = null;
    for (var i in cols) {
        var col = cols[i];
        if (document.getElementById(col) != null) {
            log("col=["+col+"]");
            var direction = document.getElementById(col).getAttribute("sortDirection");
        } else {
            log("col=["+col+"] (skipped)");
        }

        if (direction && direction != "natural") {
            ascending = (direction == "ascending");
            sortField = col.slice(col.indexOf(".")+1);
            log("sortField=[" + sortField + "]");
            break;
        }
    }

    if (sortField != null) {
        var sortFunc = function(a,b) {
            var aVal = eval("a." + sortField) || "";
            var bVal = eval("b." + sortField) || "";
            var aF = parseFloat(aVal);
            // Check that:
            // 1. aF is a number
            // 2. aVal isn't a string that starts with a number
            //    eg. 123ABCD
            if (!isNaN(aF) &&
                aF.toString() == aVal) {
                // These are numbers
                aVal = aF;
                bVal = parseFloat(bVal);
            } else {
                aVal = aVal.toString().toLowerCase();
                bVal = bVal.toString().toLowerCase();
            }
            if (aVal < bVal) return ascending?-1:1;
            if (aVal > bVal) return ascending?1:-1;
            return 0;
        };
        list.sort(sortFunc);
    }
}

function cycleHeader(col, document, columnIdList, list) {
    var csd = col.element.getAttribute("sortDirection");
    var sortDirection = (csd == "ascending" || csd == "natural") ? "descending" : "ascending";
    for (var i = 0; i < col.columns.count; i++) {
        col.columns.getColumnAt(i).element.setAttribute("sortDirection", "natural");
    }
    col.element.setAttribute("sortDirection", sortDirection);
    sortView(document, columnIdList, list);
}

function getNodeValueByName(parent, nodeName) {
    var node = parent.getElementsByTagName(nodeName)[0];
    if (node == null) return "";
    return node.firstChild ? node.firstChild.nodeValue : "";
}

function methodPointer(obj, method) {
     var wrap = function(x) { obj.method(x); }
}

function trim(s) {
    return s.replace(/^\s*/, '').replace(/\s*$/, '');
}

function getProperty(name, defValue) {
    try {
        return document.getElementById('ec2ui.properties.bundle').getString(name);
    } catch(e) {
        return defValue;
    }
}

function log(msg) {
    this.consoleService = null;
    try {
        if (ec2ui_prefs.isDebugEnabled()) {
            if (this.consoleService == null) {
                this.consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
            }
            this.consoleService.logStringMessage("[ec2ui] " + msg);
        }
    } catch (e) {
    }
}

function copyToClipboard(text) {
    this.str = null;
    this.trans = null;
    this.clip = null;

    if (this.str == null) {
        this.str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    }
    this.str.data = text;

    if (this.trans == null) {
        this.trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    }
    this.trans.addDataFlavor("text/unicode");
    this.trans.setTransferData("text/unicode", this.str, text.length * 2);

    var clipid = Components.interfaces.nsIClipboard;

    if (this.clip == null) {
        this.clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
    }
    clip.setData(this.trans,null,clipid.kGlobalClipboard);
}

// With thanks to http://delete.me.uk/2005/03/iso8601.html
Date.prototype.setISO8601 = function (string) {
   var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
   var d = string.match(new RegExp(regexp));
   if (d == null) {
      this.setTime(null);
      return;
   }
   var offset = 0; var date = new Date(d[1], 0, 1);
   if (d[3]) {
      date.setMonth(d[3] - 1);
   }
   if (d[5]) {
      date.setDate(d[5]);
   }
   if (d[7]) {
      date.setHours(d[7]);
   }
   if (d[8]) {
      date.setMinutes(d[8]);
   }
   if (d[10]) {
      date.setSeconds(d[10]);
   }
   if (d[12]) {
      date.setMilliseconds(Number("0." + d[12]) * 1000);
   }
   if (d[14]) {
      offset = (Number(d[16]) * 60) + Number(d[17]);
      offset *= ((d[15] == '-') ? 1 : -1);
   }
   offset -= date.getTimezoneOffset();
   var time = (Number(date) + (offset * 60 * 1000));
   this.setTime(Number(time));
}

// Poor-man's tokeniser.
// Splits a string into tokens on spaces.
// Spaces are ignored for strings wrapped in " or '.
// To insert a " or ', wrap inside ' or ", respectively.
//   "a b" c'd e'f => [a b,cd ef]
//   "c'd" => [c'd]
function tokenise(s) {
    var tokens = [];
    var sep = ' ';
    var tok = '';

    for(var i = 0; i < s.length; i++) {
        var ch = s[i];
        if (ch == sep) {
            if (sep == ' ') {
                if (tok.length > 0) { tokens.push(tok); }
                tok = '';
            } else {
                sep = ' ';
            }
        } else if (sep == ' ' && (ch == '"' || ch == "'")) {
            sep = ch;
        } else {
            tok += ch;
        }
    }

    if (tok.length > 0) { tokens.push(tok); }

    return tokens;
}

Date.prototype.toISO8601String = function (format, offset) {
    /* accepted values for the format [1-6]:
       1 Year:
       YYYY (eg 1997)
       2 Year and month:
       YYYY-MM (eg 1997-07)
       3 Complete date:
       YYYY-MM-DD (eg 1997-07-16)
       4 Complete date plus hours and minutes:
       YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
       5 Complete date plus hours, minutes and seconds:
       YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
       6 Complete date plus hours, minutes, seconds and a decimal
       fraction of a second
       YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
     */
    if (!format) { var format = 6; }
    if (!offset) {
        var offset = 'Z';
        var date = this;
    } else {
        var d = offset.match(/([-+])([0-9]{2}):([0-9]{2})/);
        var offsetnum = (Number(d[2]) * 60) + Number(d[3]);
        offsetnum *= ((d[1] == '-') ? -1 : 1);
        var date = new Date(Number(Number(this) + (offsetnum * 60000)));
    }

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }

    var str = "";
    str += date.getUTCFullYear();
    if (format > 1) { str += "-" + zeropad(date.getUTCMonth() + 1); }
    if (format > 2) { str += "-" + zeropad(date.getUTCDate()); }
    if (format > 3) {
        str += "T" + zeropad(date.getUTCHours()) +
            ":" + zeropad(date.getUTCMinutes());
    }
    if (format > 5) {
        var secs = Number(date.getUTCSeconds() + "." +
            ((date.getUTCMilliseconds() < 100) ? '0' : '') +
            zeropad(date.getUTCMilliseconds()));
        str += ":" + zeropad(secs);
    } else if (format > 4) { str += ":" + zeropad(date.getUTCSeconds()); }

    if (format > 3) { str += offset; }
    return str;
}

function generateS3Policy(bucket, prefix, validity) {
    var EC2_CANNED_ACL = "ec2-bundle-read";
    var validHours = 24;
    var expiry = new Date();
    if (validity != null) {
        validHours = validity;
    }
    expiry.setTime(expiry.getTime() + validHours * 60 * 60 * 1000);

    var expiryStr = expiry.toISO8601String(5);

    return (policyStr = '{' +
        '"expiration": "' + expiryStr + '",' +
        '"conditions": [' +
        '{"bucket": "' + bucket + '"},' +
        '{"acl": "' + EC2_CANNED_ACL + '"},' +
        '["starts-with", "$key", "' + prefix + '"]' +
        ']}');
}

function toByteArray(str) {
    var bArray = new Array();

    for (var i = 0; i < str.length; ++i) {
        bArray.push(str.charCodeAt(i));
    }

    return bArray;
}

function byteArrayToString(arr) {
    return eval("String.fromCharCode(" + arr.join(",") + ")");
}

function sleep(msecs) {
    var start = new Date().getTime();

    while (true) {
        if ((new Date().getTime() - start) > msecs) {
            break;
        }
    }
}

function tagResource(res, session, attr) {
    if (!attr) attr = "id";
    var tag = prompt("Tag " + res[attr] + " with? (To untag, just clear the string)",
                     res.tag || "");
    if (tag == null)
        return;

    res.tag = tag.trim();
    session.setResourceTag(res[attr], res.tag);
}

function __tagPrompt__(tag, allowEmpty) {
    var returnValue = {accepted:false , result:null};

    openDialog('chrome://ec2ui/content/dialog_tag.xul',
        null,
        'chrome,centerscreen,modal,width=400,height=250',
        tag,
        returnValue,
        allowEmpty);

    return returnValue.accepted ? (returnValue.result || '').trim() : null;
}

function tagEC2Resource(res, session, attr) {
    if (!attr) attr = "id";

    var tag = __tagPrompt__(res.tag);

    if (tag == null)
        return;

    tag = tag.trim();
    res.tag = tag;
    __addNameTagToModel__(tag, res);
    session.setResourceTag(res[attr], res.tag);

    __tagging2ec2__([res[attr]], session, tag);
}

function __tagging2ec2__(resIds, session, tagString, disableDeleteTags) {
  var multiIds = new Array();
  var multiTags = new Array();

  try {
        var tags = new Array();
        var emptyTags = new Array();
        tagString += ',';
        var keyValues = (tagString.match(/\s*[^,":]+\s*:\s*("(?:[^"]|"")*"|[^,]*)\s*,\s*/g) || []);

        for (var i = 0; i < keyValues.length; i++) {
            var kv = keyValues[i].split(/\s*:\s*/, 2);
            var key = (kv[0] || "").trim();
            var value = (kv[1] || "").trim();
            value = value.replace(/,\s*$/, '').trim();
            value = value.replace(/^"/, '').replace(/"$/, '').replace(/""/, '"');

            if (key.length != 0 && value.length == 0) {
                emptyTags.push(key);
            }

            if (key.length == 0 || value.length == 0) {
                continue;
            }

            tags.push([key, value]);
        }

        for (var i = 0; i < resIds.length; i++) {
            var resId = resIds[i];

            for (var j = 0; j < tags.length; j++) {
                multiIds.push(resId);
            }

            multiTags = multiTags.concat(tags);
        }

        if (multiIds.length == 0) {
            multiIds = resIds;
        }

        session.controller.describeTags(resIds, function(described) {
            var delResIds = new Array();
            var delKyes = new Array();

            for (var i = 0; i < described.length; i++) {
              delResIds.push(described[i][0]);
              delKyes.push(described[i][1]);
            }

            if (!disableDeleteTags) {
                if (delResIds.length > 0 && delKyes.length > 0) {
                    session.controller.deleteTags(delResIds, delKyes);
                }
            } else if (emptyTags.length > 0 && multiIds.length > 0) {
                session.controller.deleteTags(multiIds, emptyTags);
            }

            if (multiTags.length > 0) {
                session.controller.createTags(multiIds, multiTags);
            }
        });
    } catch (e) {
        alert(e);
    }
}

function __calcLinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLinuxMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 1000) * n);
  }

  return amount * 24 * 30 / 1000;
}

function __calcWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 1000) * n);
  }

  return amount * 24 * 30 / 1000;
}

function __calcLightRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLightRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcLightRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLightRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcMediumRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcMediumRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcMediumRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcMediumRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcHeavyRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcHeavyRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcHeavyRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcHeavyRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function parseHeaders(headers) {
    var headerArr = new Array();
    var arr = headers.split("\n");
    for(var i = 0; i < arr.length; i++){
        var header = arr[i];
        var parts = header.split(":");
        headerArr[parts[0]] = parts[1];
    }
    return headerArr;
}

function isWindows(platform) {
    return platform.match(ec2ui_utils.winRegex);
}

function isEbsRootDeviceType(rootDeviceType) {
    return (rootDeviceType == 'ebs');
}

function isVpc(instance) {
    return !!instance.vpcId;
}

function secondsToDays(secs) {
    var dur = parseInt(secs);
    // duration is provided in seconds. Let's convert it to years
    dur = Math.floor(dur/(60*60*24));
    return dur.toString();
}

function secondsToYears(secs) {
    var dur = parseInt(secondsToDays(secs));
    // duration is provided in days. Let's convert it to years
    dur = dur/(365);
    return dur.toString();
}

function __addNameTagToModel__(tag, model) {
    var kvs = tag.split(/\s*,\s*/);

    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i].split(/\s*:\s*/, 2);
        var key = kv[0].trim();
        var value = (kv[1] || "").trim();

        if (key == "Name") {
            model.name = value;
            return;
        }
    }

    model.name = null;
}

function __tagToName__(tag) {
    var kvs = (tag || '').split(/\s*,\s*/);

    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i].split(/\s*:\s*/, 2);
        var key = kv[0].trim();
        var value = (kv[1] || "").trim();

        if (key == "Name") {
            return value;
        }
    }

    return null;
}

function __concatTags__(a, b) {
    if (!a) { a = ""; }
    if (!b) { b = ""; }

    function putTagsToHash(tagString, hash) {
        tagString += ',';
        var kvs = (tagString.match(/\s*[^,":]+\s*:\s*("(?:[^"]|"")*"|[^,]*)\s*,\s*/g) || []);

        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i].split(/\s*:\s*/, 2);
            var key = kv[0].trim();
            var value = (kv[1] || "").trim();
            value = value.replace(/,\s*$/, '').trim();
            value = value.replace(/^"/, '').replace(/"$/, '').replace(/""/, '"');

            if (key && value) {
                if (/[,"]/.test(value)) {
                    value = value.replace(/"/g, '""');
                    value = '"' + value + '"';
                }

                hash[key] = value;
            } else if (key && !value) {
                hash[key] = null;
            }
        }
    }

    var tags = new Object();
    var tagArray = new Array();

    putTagsToHash(a, tags);
    putTagsToHash(b, tags);

    for (var i in tags) {
        if (tags[i]) {
            tagArray.push(i + ":" + tags[i]);
        }
    }

    return tagArray.join(", ");
}

var protPortMap = {
    ssh : "22",
    rdp : "3389",
    http: "80",
    https: "443",
    pop3 : "110",
    imap : "143",
    spop : "995",
    simap : "993",
    dns : "53",
    mysql : "3306",
    mssql : "1433",
    smtp : "25",
    smtps : "465",
    ldap : "389",
};

var fileCopyStatus = {
    FAILURE : 0,
    SUCCESS : 1,
    FILE_EXISTS : 2,
};

var regExs = {
    "ami" : new RegExp("^ami-[0-9a-f]{8}$"),
    "aki" : new RegExp("^aki-[0-9a-f]{8}$"),
    "ari" : new RegExp("^ari-[0-9a-f]{8}$"),
    "all" : new RegExp("^a[kmr]i-[0-9a-f]{8}$")
};

// ec2ui_utils is akin to a static class
var ec2ui_utils = {

    tagMultipleResources : function(list, session, attr) {
        if (!list || !session) return;

        if (!attr) {
            attr = "id";
        }

        var tag = __tagPrompt__(list[0].tag);

        if (tag == null) return;

        var res = null;
        tag = tag.trim();
        for (var i = 0; i < list.length; ++i) {
            res = list[i];
            res.tag = tag;
            session.setResourceTag(res[attr], res.tag);
        }
    },

    tagMultipleEC2Resources : function(list, session, attr) {
        if (!list || !session) return;

        if (!attr) {
            attr = "id";
        }

        var tag = __tagPrompt__(list[0].tag, true);

        if (!tag) return;

        var res = null;
        tag = tag.trim();
        var resIds = new Array();
        for (var i = 0; i < list.length; ++i) {
            res = list[i];
            res.tag = __concatTags__(res.tag, tag);
            __addNameTagToModel__(res.tag, res);
            session.setResourceTag(res[attr], res.tag);
            resIds.push(res[attr]);
        }

        __tagging2ec2__(resIds, session, tag, true);
    },

    winRegex : new RegExp(/^Windows/i),
    macRegex : new RegExp(/^Mac/),

    determineRegionFromString : function(str) {
        var region = "US-EAST-1";
        if (!str) {
            return region;
        }

        str = str.toLowerCase();
        // If str starts with:
        // us-east-1: region is US-EAST-1
        // us-west-1: region is US-WEST-1
        // eu-west-1: region is EU-WEST-1
        if (str.indexOf("us-west-1") >= 0) {
            region = "US-WEST-1";
        } else if (str.indexOf("us-west-2") >= 0) {
            region = "US-WEST-2";
        } else if (str.indexOf("eu-west-1") >= 0 || str == "eu") {
            region = "EU-WEST-1";
        } else if (str.indexOf("ap-southeast-1")) {
            region = "AP-SOUTHEAST-1";
        } else if (str.indexOf("ap-northeast-1")) {
            region = "AP-NORTHEAST-1";
        } else if (str.indexOf("sa-east-1")) {
            region = "SA-EAST-1";
        }

        return region;
    },
    getMessageProperty : function(key, replacements) {
        if ( !this._stringBundle ) {
            const BUNDLE_SVC = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService);
            this._stringBundle = BUNDLE_SVC.createBundle("chrome://ec2ui/locale/ec2ui.properties");
        }
        try {
            if ( !replacements )
                return this._stringBundle.GetStringFromName(key);
            else
                return this._stringBundle.formatStringFromName(key, replacements, replacements.length);
        } catch(e) {
            return "";
        }
    },
};
