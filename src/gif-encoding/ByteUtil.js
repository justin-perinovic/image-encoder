module.exports = {
    getBytes: function(num) {
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

        return bytes;
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