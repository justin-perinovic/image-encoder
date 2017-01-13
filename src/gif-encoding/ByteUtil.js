const getBytes = function(num, minByteCount=0) {
    if (num < 0) {
        throw new Error('getBytes only supports integers >= 0');
    } else if (num > 0xFFFFFFF) {
        throw new Error(`getBytes only supports integers <= ${0xFFFFFFF}`);
    } else if (num === 0) {
        return [0];
    }


    const bytes = [];

    let workingNum = num;
    while (workingNum > 0) {
        bytes.unshift(workingNum & 0xFF);
        workingNum = workingNum >> 8;
    }

    while (bytes.length < minByteCount) {
        bytes.unshift(0x0);
    }

    return bytes;
};

module.exports = {
    getBytes: getBytes.bind(this),

    getReversedBytes: function() {
        return getBytes.apply(this, arguments).reverse();
    },

    getIntBitCount: function(num) {
        if (num < 0) {
            throw new Error('getIntBitCount only supports integers >= 0');
        } else if (num > 0xFFFFFFF) {
            throw new Error(`getIntBitCount only supports integers <= ${0xFFFFFFF}`);
        }  else if (num === 0) {
            return 1;
        }


        let bitCount = 0;

        let workingNum = num;
        while (workingNum > 0) {
            bitCount += 1;
            workingNum = workingNum >> 1;
        }

        return bitCount;
    }
}