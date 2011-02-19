/*
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/javascript-base64.html
 *
 */

// I'm using this even though there's a base64 implementation in sha1.js
// because it doesn't seem to deal with strings of odd-length and the 5 minutes
// I've spent looking at it doesn't suggest anything obvious. I have no immediate
// desire to debug someone else's base64 implementation, if you do knock yourself
// out :-)
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var chr1g, chr2g, chr3g;
        var i = 0;

        if (typeof input === 'string') {
            input = toByteArray(input);
        }

        while (i < input.length) {
            // Initialize all variables to 0
            chr1 = chr2 = chr3 = 0;
            chr1g = chr2g = chr3g = true;

            if (i < input.length)
                chr1 = input[i++];
            else
                chr1g = false;

            if (i < input.length)
                chr2 = input[i++];
            else
                chr2g = false;

            if (i < input.length)
                chr3 = input[i++];
            else
                chr3g = false;


            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (!chr2g) {
                enc3 = enc4 = 64;
            } else if (!chr3g) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            chr1 = chr2 = chr3 = 0;

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            if (i < input.length)
                enc2 = this._keyStr.indexOf(input.charAt(i++));
            if (i < input.length)
                enc3 = this._keyStr.indexOf(input.charAt(i++));
            if (i < input.length)
                enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | ((enc2 & 0x30) >> 4);
            chr2 = ((enc2 & 15) << 4) | ((enc3 & 0x3c) >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
