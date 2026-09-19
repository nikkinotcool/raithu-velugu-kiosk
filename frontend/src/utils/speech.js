/**
 * Advanced Speech Synthesis Utility for Raithu Velugu Kiosk
 * - Dual-Engine Architecture:
 *   1. Primary: Server-side Microsoft Azure Neural TTS (Edge-TTS) producing studio-quality,
 *      100% human-like, natural broadcast speech in Telugu, Hindi, Indian English, etc.
 *   2. Fallback: Browser Web Speech API (with Neural/Natural voice scoring) for offline resilience.
 * - Touch-optimized for vertical tablet kiosks.
 */

export function getApiBase() {
  if (typeof window === 'undefined') return 'http://localhost:8000/api';
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://raithu-velugu-kiosk.onrender.com/api';
  }
  if (window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8000/api`;
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

  // 9. Cooperative Acronyms pronunciations in English
  if (lang === 'en') {
    clean = clean.replace(/\bPACS\b/g, 'Packs');
    clean = clean.replace(/\bPMFBY\b/g, 'P. M. F. B. Y.');
    clean = clean.replace(/\bMSP\b/g, 'M. S. P.');
    clean = clean.replace(/\bNCD\b/g, 'N. C. D.');
    clean = clean.replace(/\bKCC\b/g, 'K. C. C.');
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
    en: ['en-IN', 'en_IN', 'en-GB', 'en-US', 'english']
  };

  const targets = langCodeMap[lang] || langCodeMap['en'];

  let bestVoice = null;
  let highestScore = -1;

  for (const voice of voices) {
    const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
    const vName = (voice.name || '').toLowerCase();

    let score = 0;

    const matchesLang = targets.some((t) => vLang.startsWith(t.toLowerCase()) || vName.includes(t.toLowerCase()));
    if (!matchesLang) {
      if (vLang.startsWith('en-in') || vName.includes('india')) {
        score += 20;
      } else {
        continue;
      }
    } else {
      score += 50;
    }

    if (vName.includes('natural') || vName.includes('neural')) score += 40;
    if (vName.includes('google')) score += 35;
    if (vName.includes('online')) score += 30;
    if (vName.includes('premium') || vName.includes('enhanced')) score += 25;
    if (vName.includes('desktop') || vName.includes('david') || vName.includes('zira')) score -= 20;

    if (score > highestScore) {
      highestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice;
}

/**
 * Fallback to browser SpeechSynthesis if backend neural audio is unreachable
 */
function speakWithBrowserFallback({ text, language, onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError(new Error('Speech not supported on this browser'));
    return;
  }

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

  utterance.rate = 0.91;
  utterance.pitch = 1.02;
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
    }, 9000);
  };

  utterance.onend = () => {
    cleanup();
    onEnd();
  };

  utterance.onerror = (e) => {
    cleanup();
    onError(e);
  };

  setTimeout(() => {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      cleanup();
      onError(err);
    }
  }, 40);
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

  // 1. Attempt High-Fidelity Server Neural Voice (Microsoft Azure Neural via Edge-TTS)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(`${apiBase}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        language
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const audioBlob = await res.blob();
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Empty audio stream returned');
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
      // Fallback to browser synthesis if audio element fails
      speakWithBrowserFallback({ text: cleanText, language, onStart, onEnd, onError });
    };

    await audio.play();
    return;
  } catch (err) {
    console.warn('Neural TTS server stream failed, falling back to local voice engine:', err);
    // 2. Seamlessly fallback to browser Web Speech API
    speakWithBrowserFallback({ text: cleanText, language, onStart, onEnd, onError });
  }
}

/**
 * Immediately stops any ongoing speech playback (audio or speech synthesis)
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

  if (currentKeepAlive) {
    clearInterval(currentKeepAlive);
    currentKeepAlive = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
