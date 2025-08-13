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

async function generateShortCode(db, url) {
    try {
        // Insert and get the auto-incremented ID
        const result = await db.query(
            'INSERT INTO urls(original_url) VALUES($1) RETURNING seq_id',
            [url]
        );
        const seqId = result.rows[0].seq_id;
        return toBase62(seqId);
    } catch (error) {
        throw new Error('Failed to generate short code');
    }
}

module.exports = { 
    toBase62,
    generateShortCode,
};