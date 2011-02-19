// Functions to parse the EC2 RSA Private Key
// A BER object has 3 pieces
// type: (Numeric)
// Array: (Byte array)
// Value (Defined for integer)

// Expects a byte array, returns the values in hex
function parseRSAKey(bytes) {
    var location = 0;
    var key = new Object()
    // Step 1 is to remove the wrapper
    if(bytes[0] != 0x30) {
        log("Expected to find a sequence");
        log("Found: " + bytes[0].toString(16));
        return null;
    }
    location++;
    var length = parseLength(bytes, location);
    location += length.length;
    key.bytes = bytes.slice(location, length.value + location);

    // Reset to the beginning, but now walk through the key
    location = 0;
    // First up is the version
    if(key.bytes[location++] != 0x02) {
        log("Did not find version");
        return null;
    }
    if(key.bytes[location] != 1 || key.bytes[location+1] != 0) {
        log("We only understand version 0 keys.");
        return null;
    }
    location += 2;

    // Extract the modulus
    if(key.bytes[location++] != 0x02) {
        log("Did not find modulus");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.N = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract public Exponent
    if(key.bytes[location++] != 0x02) {
        log("Did not find public Exponent");
        log("Found " + key.bytes[location - 1].toString(16));
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.E = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract private Exponent
    if(key.bytes[location++] != 0x02) {
        log("Did not find private Exponent");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.D = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract prime1
    if(key.bytes[location++] != 0x02) {
        log("Did not find prime1");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.P = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract prime2
    if(key.bytes[location++] != 0x02) {
        log("Did not find prime2");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.Q = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract exponent1
    if(key.bytes[location++] != 0x02) {
        log("Did not find exponent1");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.DP = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract exponent2
    if(key.bytes[location++] != 0x02) {
        log("Did not find exponent2");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.DQ = bin2hex(key.bytes, location, length.value);
    location += length.value;

    // Extract coefficient
    if(key.bytes[location++] != 0x02) {
        log("Did not find coefficient");
        return null;
    }
    length = parseLength(key.bytes, location);
    location += length.length;
    key.C = bin2hex(key.bytes, location, length.value);
    location += length.value;

    return key;
}

// Note, this will break for excessively large values (> 2^53)
function parseLength(bytes, offset) {
    var result = new Object();
    if(bytes[offset] < 0x80) {
        result.length = 1; // The length field is only 1 byte long
        result.value = bytes[offset];
    } else {
        result.length = 1 + bytes[offset] - 0x80; // How many bytes hold the size (counting the first)
        result.value = 0;
        for(var x = 1; x < result.length ; x++) {
            result.value *= 256;
            result.value += bytes[offset + x];
        }
    }

    return result;
}

function bin2hex(bin, offset, length){
    if (offset == null) {
        offset = 0;
    }

    if (length == null) {
        length = bin.length;
    }

    var hex = "";
    var i = offset;
    var len = offset + length;

    while ( i < len ){
        var h1 = bin[i++].toString(16);
        if ( h1.length < 2 ){
            hex += "0";
        }
        hex += h1;
    }

    return hex;
}

