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
    this.writeLogicalScreenDescriptor(uniqueColorsCount);
    this.writeColorTable(uniqueColors);
    this.writeTrailer();
};

GIfEncoder.prototype.writeHeader = function() {
    this.data.writeUTFBytes('GIF89a'); // 0x47 0x49 0x46 0x38 0x39 0x61
};

GIFEncoder.prototype.writeExtensionIntroducer = function() {
    this.data.writeByte(0x21);
};

// Write Logical Screen Descriptor
GIFEncoder.prototype.writeLogicalScreenDescriptor = function(uniqueColorsCount) {
    // Write canvas size
    this.data.writeBytes(ByteUtil.getReversedBytes(this.width)); // Canvas width
    this.data.writeBytes(ByteUtil.getReversedBytes(this.height));// Canvas height

    // Write global color table metadata
    let colorTableByte = 0x0;
    colorTableByte |= ((uniqueColorsCount ? 0x1 : 0x0) << 7); // Global color table flag
    colorTableByte |= (0x111 << 4); // Color depth. (val+1) === color bit count. 111 is 256 colors, 000 is 1 color
    colorTableByte |= (0x1 << 3); // Sort flag. Determines whether color table is sorted by decreasing importance
    colorTableByte |= ByteUtil.getIntBitCount(uniqueColorsCount); // Size of global color table. (val+1) === bit count of size
    this.data.writeByte(colorTableByte);

    // Write background color index
    this.data.writeByte(this.backgroundColor); // Color value of unspecified pixels

    // Write pixel aspect ratio
    this.data.writeByte(0x00); // According to spec, if val is not 0, then aspect ratio is (val + 15) / 64
};

// Write Global Color Table
GifEncoder.prototype.writeColorTable = function(uniqueColors) {
    Object.keys(uniqueColors).forEach((uniqueColorKey) => {
        this.data.writeBytes(ByteUtil.getBytes(uniqueColors[uniqueColorKey]));
    });
};

// Write Application Extension
GifEncoder.prototype.writeApplicationExtension = function() {
}

// Write Comment Extension
GifEncoder.prototype.writeCommentExtension = function() {
}

// Write Plain Text Extension
GifEncoder.prototype.writePlainTextExtension = function() {
}

// Write Image Data
GifEncoder.prototype.writeImageData = function() {
}

// Write Local Color Table
GifEncoder.prototype.writeLocalColorTable = function() {
}

// Write Image Descriptor
GifEncoder.prototype.writeImageDescriptor = function(uniqueColorsCount) {
    // Image Descriptor label
    this.data.writeByte(0x2C);

    // Write image position and size
    this.data.writeBytes([0x0, 0x0]); // Image left position
    this.data.writeBytes([0x0, 0x0]); // Image top position
    this.data.writeBytes(ByteUtil.getReversedBytes(this.width, 2)); // Image width
    this.data.writeBytes(ByteUtil.getReversedBytes(this.height, 2)); // Image height

    // Packed field with local color table metadata and interlace flag
    const imageMetaByte = 0x0;
    imageMetaByte |= (0x0 << 7); // Local color table flag
    imageMetaByte |= (0x0 << 6); // Interlace flag
    imageMetaByte |= (0x0 << 5); // Sort flag
    imageMetaByte |= (0x00 << 3); // Reserved for future use
    imageMetaByte |= ByteUtil.getIntBitCount(uniqueColorsCount); // Size of local color table. (val+1) === bit count of size
    this.data.writeByte(imageMetaByte);
}

// Write Graphic Control Extension
GifEncoder.prototype.writeGraphicControlExtension = function() {
    this.writeExtensionIntroducer();
    this.data.writeByte(0xF9); // Graphic Control Extension Label
    // More stuff
}

// Write Trailer
GifEncoder.prototype.writeTrailer = function() {
    this.data.writeByte(0x3B);
}

module.exports = GIFEncoder;