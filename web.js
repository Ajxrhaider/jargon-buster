'use strict';

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Check if config.js loaded
    if (typeof CONFIG === 'undefined') {
        console.error("CRITICAL: config.js not found or failed to load.");
        alert("Local Error: config.js is missing from your folder.");
        return;
    }

    const jargonInput = document.getElementById('jargonInput');
    const bustBtn     = document.getElementById('bustBtn');
    const resultCard  = document.getElementById('resultCard');
    const resultText  = document.getElementById('resultText');
    const errorBox    = document.getElementById('errorBox');
    const errorMsg    = document.getElementById('errorMsg');

    const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';
    const token = CONFIG.HF_TOKEN;

    // ... rest of your bustBtn.addEventListener code ...

    if (!bustBtn) return; // Safety check

    bustBtn.addEventListener('click', async () => {
        const text = jargonInput.value.trim();
        if (!text) return;

        if (!token) {
            showError("API Token missing. Check your config.js file.");
            return;
        }

        // UI Feedback
        setLoading(true);
        if(errorBox) errorBox.classList.add('hidden');
        if(resultCard) resultCard.classList.add('hidden');

        try {
            const response = await fetch(HF_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    inputs: text,
                    parameters: { max_length: 100, min_length: 30 }
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "API Error");

            const summary = Array.isArray(result) ? result[0]?.summary_text : result?.summary_text;
            
            if (summary) {
                resultText.textContent = summary;
                resultCard.classList.remove('hidden');
            }
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        bustBtn.disabled = isLoading;
        bustBtn.innerHTML = isLoading 
            ? `<svg class="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Thinking...` 
            : `<span>Bust the Jargon</span>`;
    }

    function showError(msg) {
        if (errorMsg && errorBox) {
            errorMsg.textContent = msg;
            errorBox.classList.remove('hidden');
        } else {
            alert(msg); // Fallback
        }
    }
});