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

function __tagPrompt__(tag) {
    var returnValue = {accepted:false , result:null};

    openDialog('chrome://ec2ui/content/dialog_tag.xul',
        null,
        'chrome,centerscreen,modal,width=400,height=250',
        tag,
        returnValue);

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
        tagString += ',';
        var keyValues = (tagString.match(/\s*[^,":]+\s*:\s*("(?:[^"]|"")*"|[^,]*)\s*,\s*/g) || []);

        for (var i = 0; i < keyValues.length; i++) {
            var kv = keyValues[i].split(/\s*:\s*/, 2);
            var key = (kv[0] || "").trim();
            var value = (kv[1] || "").trim();
            value = value.replace(/,\s*$/, '').trim();
            value = value.replace(/^"/, '').replace(/"$/, '').replace(/""/, '"');

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
  var rateSheets = {
    'us-east-1' : {
         't1.micro': 14.4,
         'm1.small': 61.2,
        'c1.medium': 122.4,
         'm1.large': 244.8,
        'm1.xlarge': 489.6,
        'm2.xlarge': 360.0,
       'm2.2xlarge': 720,
       'm2.4xlarge': 1440,
        'c1.xlarge': 489.6,
      'cc1.4xlarge': 1152.0,
      'cg1.4xlarge': 1512.0
    },
    'us-west-1' : {
         't1.micro': 18.0,
         'm1.small': 68.4,
        'c1.medium': 136.8,
         'm1.large': 273.6,
        'm1.xlarge': 547.2,
        'm2.xlarge': 410.4,
       'm2.2xlarge': 820.8,
       'm2.4xlarge': 1641.6,
        'c1.xlarge': 547.2
    },
    'eu-west-1' : {
         't1.micro': 18.0,
         'm1.small': 68.4,
        'c1.medium': 136.8,
         'm1.large': 273.6,
        'm1.xlarge': 547.2,
        'm2.xlarge': 410.4,
       'm2.2xlarge': 820.8,
       'm2.4xlarge': 1641.6,
        'c1.xlarge': 547.2
    },
    'ap-southeast-1' : {
         't1.micro': 18.0,
         'm1.small': 68.4,
        'c1.medium': 136.8,
         'm1.large': 273.6,
        'm1.xlarge': 547.2,
        'm2.xlarge': 410.4,
       'm2.2xlarge': 820.8,
       'm2.4xlarge': 1641.6,
        'c1.xlarge': 547.2
    },
    'ap-northeast-1' : {
         't1.micro': 19.44,
         'm1.small': 72.0,
        'c1.medium': 144.0,
         'm1.large': 288.0,
        'm1.xlarge': 576.0,
        'm2.xlarge': 432.0,
       'm2.2xlarge': 864.0,
       'm2.4xlarge': 1720.8,
        'c1.xlarge': 576.0
    }
  };

  var rateSheet = rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 100) * n);
  }

  return amount / 100;
}

function __calcWindowsMonthlyAmount__(types, endpoint) {
  var rateSheets = {
    'us-east-1' : {
         't1.micro': 21.6,
         'm1.small': 86.4,
        'c1.medium': 208.8,
         'm1.large': 345.6,
        'm1.xlarge': 691.2,
        'm2.xlarge': 446.4,
       'm2.2xlarge': 892.8,
       'm2.4xlarge': 1785.6,
        'c1.xlarge': 835.2
    },
    'us-west-1' : {
         't1.micro': 25.2,
         'm1.small': 93.6,
        'c1.medium': 223.2,
         'm1.large': 374.4,
        'm1.xlarge': 748.8,
        'm2.xlarge': 496.8,
       'm2.2xlarge': 993.6,
       'm2.4xlarge': 1987.2,
        'c1.xlarge': 892.8
    },
    'eu-west-1' : {
         't1.micro': 25.2,
         'm1.small': 86.4,
        'c1.medium': 208.8,
         'm1.large': 345.6,
        'm1.xlarge': 691.2,
        'm2.xlarge': 446.4,
       'm2.2xlarge': 892.8,
       'm2.4xlarge': 1785.6,
        'c1.xlarge': 835.2
    },
    'ap-southeast-1' : {
         't1.micro': 25.2,
         'm1.small': 86.4,
        'c1.medium': 208.8,
         'm1.large': 345.6,
        'm1.xlarge': 691.2,
        'm2.xlarge': 446.4,
       'm2.2xlarge': 892.8,
       'm2.4xlarge': 1785.6,
        'c1.xlarge': 835.2
    },
    'ap-northeast-1' : {
         't1.micro': 25.2,
         'm1.small': 86.4,
        'c1.medium': 208.8,
         'm1.large': 345.6,
        'm1.xlarge': 691.2,
        'm2.xlarge': 446.4,
       'm2.2xlarge': 892.8,
       'm2.4xlarge': 1785.6,
        'c1.xlarge': 835.2
    }
  };

  var rateSheet = rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 100) * n);
  }

  return amount / 100;
}

function __calcRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheets = {
    'us-east-1' : {
         'm1.small': [ 227.5,  350.0,  21.6],
         'm1.large': [ 910.0, 1400.0,  86.4],
        'm1.xlarge': [1820.0, 2800.0, 172.8],
         't1.micro': [  54.0,   82.0,  5.04],
        'm2.xlarge': [1325.0, 2000.0, 122.4],
       'm2.2xlarge': [2650.0, 4000.0, 244.8],
       'm2.4xlarge': [5300.0, 8000.0, 489.6],
        'c1.medium': [ 455.0,  700.0,  43.2],
        'c1.xlarge': [1820.0, 2800.0, 172.8],
      'cc1.4xlarge': [4290.0, 6590.0, 403.2],
      'cg1.4xlarge': [5630.0, 8650.0, 532.8],
    },
    'us-west-1' : {
         'm1.small': [ 227.5,  350.0,  28.8],
         'm1.large': [ 910.0, 1400.0, 115.2],
        'm1.xlarge': [1820.0, 2800.0, 230.4],
         't1.micro': [  54.0,   82.0,   7.2],
        'm2.xlarge': [1325.0, 2000.0, 172.8],
       'm2.2xlarge': [2650.0, 4000.0, 345.6],
       'm2.4xlarge': [5300.0, 8000.0, 691.2],
        'c1.medium': [ 455.0,  700.0,  57.6],
        'c1.xlarge': [1820.0, 2800.0, 230.4],
    },
    'eu-west-1' : {
         'm1.small': [ 227.5,  350.0,  28.8],
         'm1.large': [ 910.0, 1400.0, 115.2],
        'm1.xlarge': [1820.0, 2800.0, 230.4],
         't1.micro': [  54.0,   82.0,   7.2],
        'm2.xlarge': [1325.0, 2000.0, 172.8],
       'm2.2xlarge': [2650.0, 4000.0, 345.6],
       'm2.4xlarge': [5300.0, 8000.0, 691.2],
        'c1.medium': [ 455.0,  700.0,  57.6],
        'c1.xlarge': [1820.0, 2800.0, 230.4],
    },
    'ap-southeast-1' : {
         'm1.small': [ 227.5,  350.0,  28.8],
         'm1.large': [ 910.0, 1400.0, 115.2],
        'm1.xlarge': [1820.0, 2800.0, 230.4],
         't1.micro': [  54.0,   82.0,   7.2],
        'm2.xlarge': [1325.0, 2000.0, 172.8],
       'm2.2xlarge': [2650.0, 4000.0, 345.6],
       'm2.4xlarge': [5300.0, 8000.0, 691.2],
        'c1.medium': [ 455.0,  700.0,  57.6],
        'c1.xlarge': [1820.0, 2800.0, 230.4],
    },
    'ap-northeast-1' : {
         'm1.small': [ 239.0,  368.0,  32.4],
         'm1.large': [ 956.0, 1470.0, 129.6],
        'm1.xlarge': [1911.0, 2940.0, 259.2],
         't1.micro': [  57.0,   86.0,  7.92],
        'm2.xlarge': [1391.0, 2100.0, 194.4],
       'm2.2xlarge': [2783.0, 4200.0, 388.8],
       'm2.4xlarge': [5565.0, 8400.0, 770.4],
        'c1.medium': [ 478.0,  735.0,  64.8],
        'c1.xlarge': [1911.0, 2940.0, 259.2],
    }
  };

  var rateSheet = rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0]; }

  var amounts = [0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 100) * n)
    amounts[1] += (Math.floor(rates[1] * 100) * n)
    amounts[2] += (Math.floor(rates[2] * 100) * n)
  }

  return [amounts[0] / 100, amounts[1] / 100, amounts[2] / 100];
}

function __calcRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheets = {
    'us-east-1' : {
         'm1.small': [ 227.5,  350.0,  36.0],
         'm1.large': [ 910.0, 1400.0, 144.0],
        'm1.xlarge': [1820.0, 2800.0, 288.0],
         't1.micro': [  54.0,   82.0,  9.36],
        'm2.xlarge': [1325.0, 2000.0, 172.8],
       'm2.2xlarge': [2650.0, 4000.0, 345.6],
       'm2.4xlarge': [5300.0, 8000.0, 691.2],
        'c1.medium': [ 455.0,  700.0,  90.0],
        'c1.xlarge': [1820.0, 2800.0, 360.0],
    },
    'us-west-1' : {
         'm1.small': [ 227.5,  350.0,  43.2],
         'm1.large': [ 910.0, 1400.0, 172.8],
        'm1.xlarge': [1820.0, 2800.0, 345.6],
         't1.micro': [  54.0,   82.0, 11.52],
        'm2.xlarge': [1325.0, 2000.0, 230.4],
       'm2.2xlarge': [2650.0, 4000.0, 460.8],
       'm2.4xlarge': [5300.0, 8000.0, 921.6],
        'c1.medium': [ 455.0,  700.0, 104.4],
        'c1.xlarge': [1820.0, 2800.0, 417.6],
    },
    'eu-west-1' : {
         'm1.small': [ 227.5,  350.0,  43.2],
         'm1.large': [ 910.0, 1400.0, 172.8],
        'm1.xlarge': [1820.0, 2800.0, 345.6],
         't1.micro': [  54.0,   82.0, 11.52],
        'm2.xlarge': [1325.0, 2000.0, 230.4],
       'm2.2xlarge': [2650.0, 4000.0, 460.8],
       'm2.4xlarge': [5300.0, 8000.0, 921.6],
        'c1.medium': [ 455.0,  700.0, 104.4],
        'c1.xlarge': [1820.0, 2800.0, 417.6],
    },
    'ap-southeast-1' : {
         'm1.small': [ 227.5,  350.0,  43.2],
         'm1.large': [ 910.0, 1400.0, 172.8],
        'm1.xlarge': [1820.0, 2800.0, 345.6],
         't1.micro': [  54.0,   82.0, 11.52],
        'm2.xlarge': [1325.0, 2000.0, 230.4],
       'm2.2xlarge': [2650.0, 4000.0, 460.8],
       'm2.4xlarge': [5300.0, 8000.0, 921.6],
        'c1.medium': [ 455.0,  700.0, 104.4],
        'c1.xlarge': [1820.0, 2800.0, 417.6],
    },
    'ap-northeast-1' : {
         'm1.small': [ 239.0,  368.0,  46.8],
         'm1.large': [ 956.0, 1470.0, 187.2],
        'm1.xlarge': [1911.0, 2940.0, 374.4],
         't1.micro': [  57.0,   86.0, 15.12],
        'm2.xlarge': [1391.0, 2100.0, 244.8],
       'm2.2xlarge': [2783.0, 4200.0, 489.6],
       'm2.4xlarge': [5565.0, 8400.0, 979.2],
        'c1.medium': [ 478.0,  735.0, 115.2],
        'c1.xlarge': [1911.0, 2940.0, 460.8],
    }
  };

  var rateSheet = rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0]; }

  var amounts = [0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 100) * n)
    amounts[1] += (Math.floor(rates[1] * 100) * n)
    amounts[2] += (Math.floor(rates[2] * 100) * n)
  }

  return [amounts[0] / 100, amounts[1] / 100, amounts[2] / 100];
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
            }
        }
    }

    var tags = new Object();
    var tagArray = new Array();

    putTagsToHash(a, tags);
    putTagsToHash(b, tags);

    for (var i in tags) {
        tagArray.push(i + ":" + tags[i]);
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

        var tag = __tagPrompt__(list[0].tag);

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
        } else if (str.indexOf("eu-west-1") >= 0 || str == "eu") {
            region = "EU-WEST-1";
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
