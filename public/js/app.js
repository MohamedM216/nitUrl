document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultContainer = document.getElementById('result-container');
    const shortUrlElement = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const qrCodeContainer = document.getElementById('qr-code-container');

    shortenBtn.addEventListener('click', shortenUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') shortenUrl();
    });

    copyBtn.addEventListener('click', copyToClipboard);

    async function shortenUrl() {
        const longUrl = urlInput.value.trim();
        
        if (!longUrl) {
            showError('Please enter a URL');
            return;
        }

        try {
            // Validate URL format
            new URL(longUrl);
            
            const response = await fetch('/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: longUrl })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            displayResult(`${window.location.origin}/${data.shortCode}`);
            generateQRCode(`${window.location.origin}/${data.shortCode}`);
        } catch (err) {
            showError(err.message);
        }
    }

    function displayResult(shortUrl) {
        errorMessage.classList.add('hidden');
        shortUrlElement.textContent = shortUrl;
        resultContainer.classList.remove('hidden');
        urlInput.value = '';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(shortUrlElement.textContent)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    }

    function generateQRCode(url) {
        // Clear previous QR code
        qrCodeContainer.innerHTML = '';
        
        // Using a simple QR code generation library (you'll need to include qrcode.js)
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrCodeContainer, {
                text: url,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
});