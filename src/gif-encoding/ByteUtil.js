module.exports = {
    getSwappedBytes16: function(num) {
        return [
            (num & 0xFF),
            ((num >> 8) & 0xFF)
        ];
    },

    swap16: function(num) {
        const swappedBytes = this.getSwappedBytes16(num);
        return (
            (swappedBytes[0] << 8)
            | swappedBytes[1]
        );
    }
}