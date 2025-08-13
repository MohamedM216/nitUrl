const db = require('../config/db');
const { toBase62 } = require('../utils/shortener');

async function createShortUrl(originalUrl) {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT uo.seq_id, us.short_code 
             FROM url_original uo
             LEFT JOIN url_short us ON uo.seq_id = us.seq_id
             WHERE uo.original_url = $1 LIMIT 1`,
            [originalUrl]
        );

        if (existing.rows.length > 0) {
            await client.query('COMMIT');
            return existing.rows[0].short_code;
        }

        const insertOriginal = await client.query(
            'INSERT INTO url_original (original_url) VALUES ($1) RETURNING seq_id',
            [originalUrl]
        );
        const seqId = insertOriginal.rows[0].seq_id;

        const shortCode = toBase62(seqId);

        await client.query(
            'INSERT INTO url_short (seq_id, short_code) VALUES ($1, $2)',
            [seqId, shortCode]
        );

        await client.query('COMMIT');
        return shortCode;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createShortUrl:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function getOriginalUrl(shortCode) {
    const result = await db.query(
        `SELECT uo.original_url
         FROM url_original uo
         JOIN url_short us ON uo.seq_id = us.seq_id
         WHERE us.short_code = $1 LIMIT 1`,
        [shortCode]
    );
    return result.rows[0]?.original_url;
}

module.exports = {
    createShortUrl,
    getOriginalUrl
};