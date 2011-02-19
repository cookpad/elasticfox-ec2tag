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
    return (instance.vpcId != '');
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

        var tag = prompt("Tag " + list[0][attr] + ", etc with? (To untag, just clear the string)",
                         list[0].tag || "");

        if (tag == null) return;

        var res = null;
        tag = tag.trim();
        for (var i = 0; i < list.length; ++i) {
            res = list[i];
            res.tag = tag;
            session.setResourceTag(res[attr], res.tag);
        }
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
        } else if (str.indexOf("eu-west-1") >= 0 || str == "eu") {
            region = "EU-WEST-1";
        }

        return region;
    }
};
