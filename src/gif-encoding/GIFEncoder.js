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
    let uniqueColorsCount = 0;
    for (let i = 0; i < rgbaVals.length; i += 4) {
        const rgb = rgbaVals.slice(i, i+3);        
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
    this.writeGraphicControlExtension();
    this.writeImageDescriptor();
    this.writeImageData();
    this.writeTrailer();
    this.end();
};

GIFEncoder.prototype.writeHeader = function() {
    this.data.writeUTFBytes('GIF89a'); // 0x47 0x49 0x46 0x38 0x39 0x61
};

GIFEncoder.prototype.writeExtensionIntroducer = function() {
    this.data.writeByte(0x21);
};

// Write Logical Screen Descriptor
GIFEncoder.prototype.writeLogicalScreenDescriptor = function(uniqueColorsCount) {
    // Write canvas size
    this.data.writeBytes(ByteUtil.getReversedBytes(this.width, 2)); // Canvas width
    this.data.writeBytes(ByteUtil.getReversedBytes(this.height, 2));// Canvas height

    // Write global color table metadata
    let colorTableByte = 0b0;
    colorTableByte |= ((uniqueColorsCount ? 0b1 : 0b0) << 7); // Global color table flag
    colorTableByte |= (0b001 << 4); // Color depth. (val+1) === color bit count. 111 is 256 colors, 000 is 1 color
    colorTableByte |= (0b0 << 3); // Sort flag. Determines whether color table is sorted by decreasing importance
    colorTableByte |= (ByteUtil.getIntBitCount(uniqueColorsCount) - 1); // Size of global color table. (val+1) === bit count of size
    this.data.writeByte(colorTableByte);

    // Write background color index
    this.data.writeByte(this.backgroundColor); // Color value of unspecified pixels

    // Write pixel aspect ratio
    this.data.writeByte(0x00); // According to spec, if val is not 0, then aspect ratio is (val + 15) / 64
};

// Write Global Color Table
GIFEncoder.prototype.writeColorTable = function(uniqueColors) {
    const uniqueColorKeys = Object.keys(uniqueColors);
    const uniqueColorsCount = uniqueColorKeys.length;
    
    // Write all unique colors to color table
    uniqueColorKeys.forEach((uniqueColorKey) => {
        this.data.writeBytes(ByteUtil.getBytes(uniqueColors[uniqueColorKey], 3));
    });

    // Fill in rest of color table with black pixels (Is this actually how this should work?)    
    const bitCount = ByteUtil.getIntBitCount(uniqueColorsCount);
    const correctTableSize = Math.pow(2, (bitCount));
    for (let i = uniqueColorsCount; i < correctTableSize; i++) {
        this.data.writeBytes([0x0, 0x0, 0x0]);
    }
};

// Write Application Extension
GIFEncoder.prototype.writeApplicationExtension = function() {
    // Only know of the NETSCAPE2.0 extension, but others could exist

    this.writeExtensionIntroducer();
    this.data.writeByte(0xFF); // Application extension label
    this.data.writeByte(0x0B); // Block size
    this.data.writeUTFBytes('NETSCAPE'); // Application identifier code
    this.writeUTFBytes('2.0'); // Application authentication code
    // Loop metadata
}

// Write Comment Extension
GIFEncoder.prototype.writeCommentExtension = function() {
}

// Write Plain Text Extension
GIFEncoder.prototype.writePlainTextExtension = function() {
    // Apparently not consistently supported. Don't use this. Good to know how to recognize it though.

}

// Write Image Data
GIFEncoder.prototype.writeImageData = function() {
    
}

// Write Local Color Table
GIFEncoder.prototype.writeLocalColorTable = function() {
}

// Write Image Descriptor
GIFEncoder.prototype.writeImageDescriptor = function(uniqueColorsCount) {
    // Image Descriptor label
    this.data.writeByte(0x2C);

    // Write image position and size
    this.data.writeBytes([0x0, 0x0]); // Image left position
    this.data.writeBytes([0x0, 0x0]); // Image top position
    this.data.writeBytes(ByteUtil.getReversedBytes(this.width, 2)); // Image width
    this.data.writeBytes(ByteUtil.getReversedBytes(this.height, 2)); // Image height

    // Packed field with local color table metadata and interlace flag
    let imageMetaByte = 0b0;
    imageMetaByte |= (0b0 << 7); // Local color table flag
    imageMetaByte |= (0b0 << 6); // Interlace flag
    imageMetaByte |= (0b0 << 5); // Sort flag
    imageMetaByte |= (0b00 << 3); // Reserved for future use
    imageMetaByte |= 0b00; // Size of local color table. (val+1) === bit count of size
    this.data.writeByte(imageMetaByte);
}

// Write Graphic Control Extension
GIFEncoder.prototype.writeGraphicControlExtension = function() {
    this.writeExtensionIntroducer();
    this.data.writeByte(0xF9); // Graphic Control Extension Label
    this.data.writeByte(0x04); // Byte size

    // Packed field
    let controlMetaByte = 0b0;
    controlMetaByte |= (0b000 << 5); // Reserved for future use
    controlMetaByte |= (0b000 << 2); // Disposal method
    controlMetaByte |= (0b0 << 1); // User input flag
    controlMetaByte |= 0b0; // Transparent color flag
    this.data.writeByte(controlMetaByte);

    this.data.writeBytes([0x0, 0x0]); // Delay time
    this.data.writeByte(0x0); // Transparent color index

    this.data.writeByte(0x0); // Block terminator
}

// Write Trailer
GIFEncoder.prototype.writeTrailer = function() {
    this.data.writeByte(0x3B);
}

module.exports = GIFEncoder;