/**
 * Universal Resilient Speech Synthesis Utility for Raithu Velugu Kiosk
 * - Dual-Engine Architecture:
 *   1. Primary: Server-side Studio Neural Voice (Azure Neural te-IN-MohanNeural / Sarvam Bulbul / ElevenLabs)
 *      with letter-by-letter acronym expansion for PACS, PMFBY, and KCC.
 *   2. Secondary: Instant Client Fallback via browser SpeechSynthesis with best-available voice scoring.
 *   - Guaranteed zero silence: Audio is guaranteed to play immediately on tap.
 */

import { fetchWithCloudFallback, getApiBase } from './apiClient';

// Keep track of active audio element & object URL
let activeAudio = null;
let activeAudioUrl = null;
let currentKeepAlive = null;

// Voice cache for browser fallback
let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Pre-processes conversational AI markdown to sound natural when read aloud.
 */
export function cleanTextForSpeech(text = '', lang = 'en') {
  if (!text) return '';

  let clean = text;

  // 1. Remove URLs
  clean = clean.replace(/https?:\/\/\S+/gi, '');

  // 2. Convert markdown links [Text](url) -> Text
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove citations [1], [Ref: 12]
  clean = clean.replace(/\[\s*(ref:?)?\s*\d+\s*\]/gi, '');

  // 4. Remove emojis & special decorative symbols
  clean = clean.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, ' ');
  clean = clean.replace(/[🌾🏛️🚜⚡👉⚖️📜✅❌⚠️🔹🔸📌•]/g, ' ');

  // 5. Clean markdown headers (#, ##, ###)
  clean = clean.replace(/^#{1,6}\s+/gm, '');

  // 6. Clean markdown table borders
  clean = clean.replace(/\|/g, ', ');
  clean = clean.replace(/[-:]{3,}/g, ' ');

  // 7. Clean bold, italics, backticks, strikethrough
  clean = clean.replace(/[*_~`]/g, '');

  // 8. Convert list dashes to natural sentence pauses
  clean = clean.replace(/^\s*[-*+]\s+/gm, '. ');
  clean = clean.replace(/^\s*\d+\.\s+/gm, '. ');

  // 9. Abbreviation spelling — spell acronyms with dot-spacing so voices read letter-by-letter
  const abbrs = ['PACS', 'PMFBY', 'KCC', 'DAP', 'ARCS', 'DCCB', 'NCD', 'MSP', 'RRB', 'NABARD', 'SHG', 'FPO', 'DPI', 'PRI'];
  for (const abbr of abbrs) {
    const spaced = abbr.split('').join('. ') + '.';
    clean = clean.replace(new RegExp(`\\b${abbr}\\b`, 'g'), spaced);
  }

  // 10. Collapse multiple spaces and excessive punctuation
  clean = clean.replace(/\s+/g, ' ');
  clean = clean.replace(/([.?!])\s*([.?!])+/g, '$1');

  return clean.trim();
}

/**
 * Finds the highest quality, most natural sounding local voice for the given language.
 */
export function getBestVoice(lang = 'en') {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const langCodeMap = {
    te: ['te-IN', 'te_IN', 'telugu'],
    hi: ['hi-IN', 'hi_IN', 'hindi'],
    kn: ['kn-IN', 'kn_IN', 'kannada'],
    ta: ['ta-IN', 'ta_IN', 'tamil'],
    mr: ['mr-IN', 'mr_IN', 'marathi'],
    en: ['en-IN', 'en-GB', 'en-US', 'english']
  };

  const targets = langCodeMap[lang] || langCodeMap['en'];

  let bestVoice = null;
  let highestScore = -1;

  for (const voice of voices) {
    const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
    const vName = (voice.name || '').toLowerCase();

    let score = 0;

    const matchesLang = targets.some((t) => vLang.startsWith(t.toLowerCase()) || vName.includes(t.toLowerCase()));
    if (matchesLang) {
      score += 60;
    } else if (vLang.startsWith('en-in') || vName.includes('india')) {
      score += 25;
    } else {
      score += 5;
    }

    if (vName.includes('natural') || vName.includes('neural')) score += 40;
    if (vName.includes('google')) score += 35;
    if (vName.includes('online')) score += 30;
    if (vName.includes('siri')) score += 25;

    if (score > highestScore) {
      highestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice;
}

/**
 * Client SpeechSynthesis Fallback: Speaks immediately so user never experiences silence.
 */
export function speakWithBrowserFallback({ text, language, onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError(new Error('Speech not supported on this browser'));
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(text);

  const langTagMap = {
    te: 'te-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    en: 'en-IN'
  };
  utterance.lang = langTagMap[language] || 'en-IN';

  const bestVoice = getBestVoice(language);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.rate = 0.90;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const cleanup = () => {
    if (currentKeepAlive) {
      clearInterval(currentKeepAlive);
      currentKeepAlive = null;
    }
  };

  utterance.onstart = () => {
    onStart();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    cleanup();
    currentKeepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        cleanup();
      }
    }, 8000);
  };

  utterance.onend = () => {
    cleanup();
    onEnd();
  };

  utterance.onerror = (e) => {
    cleanup();
    onError(e);
  };

  // Small delay ensures previous speech cancel is flushed
  setTimeout(() => {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      cleanup();
      onError(err);
    }
  }, 30);
}

/**
 * Universal High-Definition Speech Synthesis
 * - Tries server-side studio neural audio first.
 * - If server takes >3.5s or fails, immediately falls back to client speech so user NEVER gets silence.
 */
export async function speakMessage({
  text,
  language = 'en',
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
}) {
  stopSpeech();

  const cleanText = cleanTextForSpeech(text, language);
  if (!cleanText) {
    onEnd();
    return;
  }

  // 1. Fast attempt to synthesize Studio Neural Audio on Backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3800); // 3.8s fast timeout

    const res = await fetchWithCloudFallback('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const audioBlob = await res.blob();
      if (audioBlob && audioBlob.size > 500) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudio = audio;
        activeAudioUrl = audioUrl;

        audio.onplay = () => {
          onStart();
        };

        audio.onended = () => {
          stopSpeech();
          onEnd();
        };

        audio.onerror = () => {
          stopSpeech();
          speakWithBrowserFallback({ text: cleanText, language, onStart, onEnd, onError });
        };

        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('[Speech] Server neural audio unavailable or timed out; activating instant fallback:', err.message);
  }

  // 2. Guaranteed Instant Fallback: Speaks immediately so the user hears voice without delay
  speakWithBrowserFallback({ text: cleanText, language, onStart, onEnd, onError });
}

/**
 * Immediately stops any ongoing speech playback
 */
export function stopSpeech() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = '';
    } catch {}
    activeAudio = null;
  }

  if (activeAudioUrl) {
    try {
      URL.revokeObjectURL(activeAudioUrl);
    } catch {}
    activeAudioUrl = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  if (currentKeepAlive) {
    clearInterval(currentKeepAlive);
    currentKeepAlive = null;
  }
}
