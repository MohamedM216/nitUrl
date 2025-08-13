const express = require('express');
const router = express.Router();
const urlController = require('./shortener.controller');

// Idempotent POST endpoint for creating short URLs
router.post('/shorten', urlController.shortenUrl);

// Redirect endpoint
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;