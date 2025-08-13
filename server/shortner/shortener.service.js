const db = require('../config/db');
const shortener = require('../utils/shortener');

async function createShortUrl(originalUrl) {
    try {
        // Check if URL already exists (idempotency)
        const existing = await db.query(
            'SELECT short_code FROM urls WHERE original_url = $1 LIMIT 1',
            [originalUrl]
        );
        
        if (existing.rows.length > 0) {
            return existing.rows[0].short_code;
        }
        const shortCode = await shortener.generateShortCode(db, originalUrl);
        
        await db.query(
            'UPDATE urls SET short_code = $1 WHERE seq_id = (SELECT seq_id FROM urls WHERE original_url = $2 LIMIT 1)',
            [shortCode, originalUrl]
        );
        
        return shortCode;
    } catch (error) {
        throw error;
    }
}

async function getOriginalUrl(shortCode) {
    const existing = await db.query(
        'SELECT original_url FROM urls WHERE short_code = $1 LIMIT 1',
        [shortCode]
    );
    return existing.rows[0].originalUrl;
}

module.exports = {
    createShortUrl,
    getOriginalUrl
};