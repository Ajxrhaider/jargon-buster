'use strict';

// 1. HARDCODE THE TOKEN HERE (Temporary fix to get Vercel working)
const CONFIG = {
    HF_TOKEN: "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"
};

document.addEventListener('DOMContentLoaded', () => {
    const jargonInput = document.getElementById('jargonInput');
    const bustBtn     = document.getElementById('bustBtn');
    const resultCard  = document.getElementById('resultCard');
    const resultText  = document.getElementById('resultText');
    const errorBox    = document.getElementById('errorBox');
    const errorMsg    = document.getElementById('errorMsg');

    const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';
    const token = CONFIG.HF_TOKEN;

    if (!bustBtn) {
        console.error("Button not found in HTML");
        return;
    }

    bustBtn.addEventListener('click', async () => {
        const text = jargonInput.value.trim();
        if (!text) return;

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
            if(errorMsg) errorMsg.textContent = err.message;
            if(errorBox) errorBox.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        bustBtn.disabled = isLoading;
        bustBtn.innerHTML = isLoading 
            ? `<span class="animate-spin inline-block mr-2">⏳</span> Thinking...` 
            : `<span>Bust the Jargon</span>`;
    }
});