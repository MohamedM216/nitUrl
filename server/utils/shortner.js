const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num) {
    if (num === 0) return '0';
    let result = '';
    while (num > 0) {
        result = base62Chars[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

module.exports = { toBase62 };