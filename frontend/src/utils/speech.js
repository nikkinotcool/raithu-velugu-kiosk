/**
 * Advanced Speech Synthesis Utility for Raithu Velugu Kiosk
 * - Dual-Engine Architecture:
 *   1. Primary: Server-side Microsoft Azure Studio Neural TTS (te-IN-MohanNeural / hi-IN-MadhurNeural / en-IN-NeerjaExpressiveNeural)
 *      or Sarvam AI (Bulbul:v1) producing authentic human speech with letter-by-letter acronym pronunciation.
 *   2. Secondary: Cloud-backed Neural fallback with zero 1995 robotic desktop voices.
 * - Touch-optimized for vertical tablet kiosks.
 */

import { fetchWithCloudFallback } from './apiClient';

export function getApiBase() {
  if (typeof window === 'undefined') return 'https://raithu-velugu-kiosk.onrender.com/api';
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  const h = window.location.hostname;
  const isLocal = h === 'localhost' || h.startsWith('127.') || h.startsWith('192.168.') || h.startsWith('10.');
  if (!isLocal) {
    return 'https://raithu-velugu-kiosk.onrender.com/api';
  }
  if (h !== 'localhost') {
    return `http://${h}:8000/api`;
  }
  return 'http://localhost:8000/api';
}

// Keep track of active audio element & object URL
let activeAudio = null;
let activeAudioUrl = null;
let currentKeepAlive = null;

// Voice cache for browser fallback
let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
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
 * Checks if the browser has a genuine neural/natural voice installed (e.g. Android / iOS / Edge online).
 * Rejects legacy robotic desktop voices (Microsoft David, Zira, desktop SAPI).
 */
export function getGenuineNeuralVoice(lang = 'en') {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  const langCodeMap = {
    te: ['te-IN', 'te_IN', 'telugu'],
    hi: ['hi-IN', 'hi_IN', 'hindi'],
    kn: ['kn-IN', 'kn_IN', 'kannada'],
    ta: ['ta-IN', 'ta_IN', 'tamil'],
    mr: ['mr-IN', 'mr_IN', 'marathi'],
    en: ['en-IN', 'en-GB', 'en-US']
  };

  const targets = langCodeMap[lang] || langCodeMap['en'];

  for (const voice of voices) {
    const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
    const vName = (voice.name || '').toLowerCase();

    // Disqualify robotic desktop voices
    if (vName.includes('desktop') || vName.includes('david') || vName.includes('zira') || vName.includes('sapi')) {
      continue;
    }

    const matchesLang = targets.some((t) => vLang.startsWith(t.toLowerCase()) || vName.includes(t.toLowerCase()));
    if (!matchesLang) continue;

    // Must be marked as natural, neural, or google online
    if (vName.includes('natural') || vName.includes('neural') || vName.includes('google') || vName.includes('siri')) {
      return voice;
    }
  }

  return null;
}

/**
 * High-definition Studio Neural Voice playback
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

  const apiBase = getApiBase();

  // 1. Primary: Server Neural Audio (Azure Neural Studio te-IN-MohanNeural / Sarvam AI)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const res = await fetchWithCloudFallback('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language
      }),
      signal: controller.signal
    }, apiBase);
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const audioBlob = await res.blob();
    if (!audioBlob || audioBlob.size < 500) {
      throw new Error('Empty or invalid audio stream returned');
    }

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

    audio.onerror = (err) => {
      stopSpeech();
      console.warn('Audio playback error, attempting direct stream:', err);
      playViaDirectServerStream({ text: cleanText, language, onStart, onEnd, onError });
    };

    await audio.play();
    return;
  } catch (err) {
    console.warn('Backend POST TTS failed, trying direct GET stream:', err);
    playViaDirectServerStream({ text: cleanText, language, onStart, onEnd, onError });
  }
}

/**
 * Secondary: Direct server stream via GET request
 */
async function playViaDirectServerStream({ text, language, onStart, onEnd, onError }) {
  try {
    const apiBase = getApiBase();
    const streamUrl = `${apiBase}/tts?text=${encodeURIComponent(text.slice(0, 500))}&language=${encodeURIComponent(language)}`;
    const audio = new Audio(streamUrl);
    activeAudio = audio;

    audio.onplay = onStart;
    audio.onended = () => {
      stopSpeech();
      onEnd();
    };
    audio.onerror = () => {
      stopSpeech();
      // Try genuine device neural voice if available (Android/iOS only)
      playWithDeviceNeuralIfAvailable({ text, language, onStart, onEnd, onError });
    };

    await audio.play();
  } catch (e) {
    playWithDeviceNeuralIfAvailable({ text, language, onStart, onEnd, onError });
  }
}

/**
 * Tertiary: Uses device Web Speech ONLY if genuine neural voice is installed.
 * Never uses robotic Windows Desktop voices.
 */
function playWithDeviceNeuralIfAvailable({ text, language, onStart, onEnd, onError }) {
  const neuralVoice = getGenuineNeuralVoice(language);
  if (!neuralVoice || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.info('No local neural voice available on this device; avoided robotic fallback.');
    onError(new Error('Neural voice synthesis currently initializing. Please tap Listen again in a moment.'));
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = neuralVoice;
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  utterance.onstart = onStart;
  utterance.onended = () => {
    stopSpeech();
    onEnd();
  };
  utterance.onerror = (e) => {
    stopSpeech();
    onError(e);
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    onError(err);
  }
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
    } catch {
      // Ignore
    }
    activeAudio = null;
  }

  if (activeAudioUrl) {
    try {
      URL.revokeObjectURL(activeAudioUrl);
    } catch {
      // Ignore
    }
    activeAudioUrl = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  if (currentKeepAlive) {
    clearInterval(currentKeepAlive);
    currentKeepAlive = null;
  }
}
