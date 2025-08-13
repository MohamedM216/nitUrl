const urlService = require('./shortener.service');

async function shortenUrl(req, res) {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const shortCode = await urlService.createShortUrl(url);
        res.status(200).json({ shortCode });
    } catch (error) {
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
        
        res.status(200).redirect(originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    shortenUrl,
    redirectUrl
};