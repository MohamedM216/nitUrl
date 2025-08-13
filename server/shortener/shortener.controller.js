const urlService = require('./shortener.service');

async function shortenUrl(req, res) {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const shortCode = await urlService.createShortUrl(url);
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        
        return res.status(200).json({ 
            shortCode,
            shortUrl 
        });
    } catch (error) {
        console.error('Shorten URL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function redirectUrl(req, res) {
    try {
        const { shortCode } = req.params;
        const originalUrl = await urlService.getOriginalUrl(shortCode);
        
        if (!originalUrl) {
            return res.status(404).json({ error: 'URL not found' });
        }
        
        return res.redirect(originalUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    shortenUrl,
    redirectUrl
};