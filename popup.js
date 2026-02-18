/**
 * JARGON BUSTER · popup.js
 * Updated to use the new Hugging Face Router endpoint.
 */

'use strict';

// ─── DOM REFS ──────────────────────────────────────────────────────────────
const toggleSettings  = document.getElementById('toggleSettings');
const apiPanel        = document.getElementById('apiPanel');
const apiKeyInput     = document.getElementById('apiKeyInput');
const saveKeyBtn      = document.getElementById('saveKeyBtn');

const jargonInput     = document.getElementById('jargonInput');
const charCount       = document.getElementById('charCount');
const selectionBadge  = document.getElementById('selectionBadge');

const bustBtn         = document.getElementById('bustBtn');
const errorBox        = document.getElementById('errorBox');
const errorMsg        = document.getElementById('errorMsg');

const resultCard      = document.getElementById('resultCard');
const resultText      = document.getElementById('resultText');
const copyBtn         = document.getElementById('copyBtn');
const copyLabel       = document.getElementById('copyLabel');

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
// Updated Endpoint: Moving from api-inference to router.huggingface.co
const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';
const STORAGE_KEY = 'jb_hf_token';
const HARDCODED_TOKEN = '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'; 

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await autoInjectToken();
  hideSettings(); 
  await tryAutoFillSelection();
  updateCharCount();
});

// ─── API KEY MANAGEMENT ────────────────────────────────────────────────────

async function autoInjectToken() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  if (!data[STORAGE_KEY]) {
    await chrome.storage.local.set({ [STORAGE_KEY]: HARDCODED_TOKEN });
  }
}

function hideSettings() {
  if (toggleSettings) toggleSettings.style.display = 'none';
  if (apiPanel) apiPanel.style.display = 'none';
}

// ─── AUTO-FILL SELECTION ───────────────────────────────────────────────────

async function tryAutoFillSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || tab.url.startsWith('chrome://')) return;

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString().trim() || '',
    });

    const selected = results?.[0]?.result;
    if (selected) {
      jargonInput.value = selected;
      selectionBadge.classList.add('visible');
      updateCharCount();
    }
  } catch (e) {
    console.warn("Selection extraction failed:", e);
  }
}

// ─── CHAR COUNT ────────────────────────────────────────────────────────────

jargonInput.addEventListener('input', updateCharCount);

function updateCharCount() {
  const len = jargonInput.value.length;
  charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
}

// ─── CORE: BUST THE JARGON ─────────────────────────────────────────────────

bustBtn.addEventListener('click', handleBust);

async function handleBust() {
  const text = jargonInput.value.trim();
  
  if (!text || text.length < 20) {
    showError(text ? 'Text is too short for a useful summary.' : 'Please enter some text.');
    return;
  }

  const data = await chrome.storage.local.get(STORAGE_KEY);
  const token = data[STORAGE_KEY];

  setLoading(true);
  hideError();
  hideResult();

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        },
      }),
    });

    const result = await response.json();

    if (response.status === 503 || result.error?.includes('loading')) {
      showError('🔥 AI is warming up — try again in 10 seconds.');
      return;
    }

    if (!response.ok) {
      throw new Error(result.error || `Error ${response.status}`);
    }

    const summary = Array.isArray(result) ? result[0]?.summary_text : result?.summary_text;

    if (summary) {
      showResult(summary);
    } else {
      showError('The AI returned an empty response. Try a different passage.');
    }

  } catch (err) {
    showError(err.message.includes('fetch') ? 'Network error.' : err.message);
  } finally {
    setLoading(false);
  }
}

// ─── HELPERS ───────────────────────────────────────────────────────────────

function setLoading(on) {
  bustBtn.disabled = on;
  bustBtn.textContent = on ? 'Simplifying...' : 'Bust Jargon';
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.hidden = false;
}

function hideError() { errorBox.hidden = true; }

function showResult(text) {
  resultText.textContent = text;
  resultCard.hidden = false;
}

function hideResult() { resultCard.hidden = true; }

// Copy Logic
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);
  copyLabel.textContent = 'Copied!';
  setTimeout(() => { copyLabel.textContent = 'Copy'; }, 2000);
});