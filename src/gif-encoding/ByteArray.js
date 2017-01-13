function ByteArray() {
    this.data = [];
};

ByteArray.prototype.getData = function() {
    return new Buffer(this.data);
}

ByteArray.prototype.flush = function() {
    this.data = [];
};

ByteArray.prototype.writeByte = function(byte) {
    this.data.push(byte);
};

ByteArray.prototype.writeBytes = function(bytes, offset=0, length) {
    const upperBound = offset + (length || bytes.length-offset);
    bytes.slice(offset, upperBound).forEach((byte) => {
        this.writeByte(byte);
    });
};

ByteArray.prototype.writeUTFBytes = function(string) {
    for (let i = 0; i < string.length; i++) {
        const byte = string.charCodeAt(i);
        if (byte > 0xFF) {
            throw new Error(`Can only write UTF bytes with values up to ${0xFF}. Attempted to write ${byte}, which represents the character "${string[i]}"`);
        }

        this.writeByte(byte);
    }
};

module.exports = ByteArray;