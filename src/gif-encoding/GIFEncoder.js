const ByteArray = require('./ByteArray');
const ByteUtil = require('./ByteUtil');


const GIFEncoder = function(width, height) {
    this.width = width;
    this.height = height;
    this.data = new ByteArray();
    this.backgroundColor = 0x00;
};

GIFEncoder.prototype.setBackgroundColor = function(color) {
    if (color > 0xFF) {
        throw new Error('Background color must be between 0x00 and 0xFF')
    }
    this.backgroundColor = color;
};

GIFEncoder.prototype.writeImage = function() {
    this.writeHeader();
    this.writeLSD();
    this.writeGCT();
};

GIfEncoder.prototype.writeHeader = function() {
    this.data.writeUTFBytes('GIF89a'); // 0x47 0x49 0x46 0x38 0x39 0x61
};

// Write Logical Screen Descriptor
GIFEncoder.prototype.writeLSD = function() {
    // Canvas size
    this.data.writeBytes(ByteUtil.getSwappedBytes16(this.width)); // Canvas width
    this.data.writeBytes(ByteUtil.getSwappedBytes16(this.height));// Canvas height

    // Global color table metadata
    let colorTableByte = 0;
    colorTableByte |= (0x1 << 7); // Global color table flag
    colorTableByte |= (0x111 << 4); // Color depth. (val+1) === color bit count. 111 is 256 colors, 000 is 1 color
    colorTableByte |= (0x1 << 3); // Sort flag. Determines whether color table is sorted by decreasing importance
    colorTableByte |= 0x111; // Size of global color table
    this.data.writeByte(colorTableByte);

    // Background color index
    this.data.writeByte(this.backgroundColor); // Color value of unspecified pixels

    // Pixel aspect ratio
    this.data.writeByte(0x00); // According to spec, if val is not 0, then aspect ratio is (val + 15) / 64
};

// Write Global Color Table
GifEncoder.prototype.writeGCT = function() {
    
};

module.exports = GIFEncoder;