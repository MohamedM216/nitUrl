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
            
            const response = await fetch(`http://localhost:3000/api/v1/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ url: longUrl })
            });

            if (!response) {
                throw new Error('No response from server');
            }
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { error: await response.text() };
                }
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            displayResult(`http://localhost:3000/api/v1/${data.shortCode}`);
        } catch (err) {
            console.error('Shortening error:', err);
            showError("Please enter a proper URL");
        }
    }

    function displayResult(shortUrl) {
        errorMessage.classList.add('hidden');
        // Create clickable link
        shortUrlElement.innerHTML = '';
        const link = document.createElement('a');
        link.href = shortUrl;
        link.textContent = shortUrl;
        link.target = '_blank';
        link.classList.add('short-url-link');
        
        shortUrlElement.appendChild(link);
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
});