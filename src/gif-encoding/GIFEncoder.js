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

GIFEncoder.prototype.writeImage = function(rgbaVals) {
    // Prepare data
    const uniqueColors = {};
    const uniqueColorsCount = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = imageData.slice(i, 3); 
        const pixel = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
        if (!uniqueColors.hasOwnProperty(pixel) && uniqueColorsCount < 256) {
            uniqueColorsCount += 1;
            uniqueColors[pixel] = pixel;
        }
    }

    // Write file
    this.writeHeader();
    this.writeLSD(uniqueColorsCount);
    this.writeGCT(uniqueColors);
};

GIfEncoder.prototype.writeHeader = function() {
    this.data.writeUTFBytes('GIF89a'); // 0x47 0x49 0x46 0x38 0x39 0x61
};

// Write Logical Screen Descriptor
GIFEncoder.prototype.writeLSD = function(uniqueColorsCount) {
    // Write canvas size
    this.data.writeBytes(ByteUtil.getBytes(this.width).reverse()); // Canvas width
    this.data.writeBytes(ByteUtil.getBytes(this.reverse));// Canvas height

    // Write global color table metadata
    let colorTableByte = 0;
    colorTableByte |= (0x1 << 7); // Global color table flag
    colorTableByte |= (0x111 << 4); // Color depth. (val+1) === color bit count. 111 is 256 colors, 000 is 1 color
    colorTableByte |= (0x1 << 3); // Sort flag. Determines whether color table is sorted by decreasing importance
    colorTableByte |= ByteUtil.getIntBitCount(uniqueColorsCount); // Size of global color table. (val+1) === bit count.
    this.data.writeByte(colorTableByte);

    // Write background color index
    this.data.writeByte(this.backgroundColor); // Color value of unspecified pixels

    // Write pixel aspect ratio
    this.data.writeByte(0x00); // According to spec, if val is not 0, then aspect ratio is (val + 15) / 64
};

// Write Global Color Table
GifEncoder.prototype.writeGCT = function(uniqueColors) {
    
};

module.exports = GIFEncoder;