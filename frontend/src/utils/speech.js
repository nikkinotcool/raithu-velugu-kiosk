/**
 * Advanced Speech Synthesis Utility for Raithu Velugu Kiosk
 * - Optimized for Tablet touchscreens & Kiosk hardware
 * - Prioritizes high-definition Natural / Neural / Google voices
 * - Pre-processes and cleans text to sound fluent, warm, and natural
 * - Resolves mobile Chrome / Android tablet speech cut-off and pause bugs
 */

// Voice cache
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
 * Finds the highest quality, most natural sounding voice for the given language.
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

  // Score candidate voices based on quality keywords and language match
  let bestVoice = null;
  let highestScore = -1;

  for (const voice of voices) {
    const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
    const vName = (voice.name || '').toLowerCase();

    let score = 0;

    // 1. Check language match
    const matchesLang = targets.some((t) => vLang.startsWith(t.toLowerCase()) || vName.includes(t.toLowerCase()));
    if (!matchesLang) {
      // Fallback: If no regional voice on this device, match Indian English for warm accent
      if (vLang.startsWith('en-in') || vName.includes('india')) {
        score += 20;
      } else {
        continue;
      }
    } else {
      score += 50;
    }

    // 2. High-quality neural / natural voice bonuses
    if (vName.includes('natural') || vName.includes('neural')) score += 40;
    if (vName.includes('google')) score += 35; // Google TTS voices on Android/Chrome sound great
    if (vName.includes('online')) score += 30;
    if (vName.includes('premium') || vName.includes('enhanced')) score += 25;

    // Avoid legacy robotic desktop voices if better ones exist
    if (vName.includes('desktop') || vName.includes('david') || vName.includes('zira')) score -= 20;

    if (score > highestScore) {
      highestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice;
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
 * Handles text-to-speech with safety timeouts, Android Chrome keep-alive, and natural cadence.
 */
let currentKeepAlive = null;

export function speakMessage({
  text,
  language = 'en',
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError(new Error('SpeechSynthesis not supported on this browser'));
    return () => {};
  }

  // Cancel any ongoing speech and clear keep-alive
  stopSpeech();

  const cleanText = cleanTextForSpeech(text, language);
  if (!cleanText) {
    onEnd();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set language tag
  const langTagMap = {
    te: 'te-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    en: 'en-IN'
  };
  utterance.lang = langTagMap[language] || 'en-IN';

  // Apply best natural voice
  const bestVoice = getBestVoice(language);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  // Natural warm pacing (0.91x rate prevents rushed synthetic sound)
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
    // Android Chrome bug fix: resume if paused, and periodically ping to prevent 14s cut-off
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

  // Small timeout before speak to let cancel() settle on mobile WebKit/Blink
  setTimeout(() => {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      cleanup();
      onError(err);
    }
  }, 40);

  return stopSpeech;
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (currentKeepAlive) {
      clearInterval(currentKeepAlive);
      currentKeepAlive = null;
    }
    window.speechSynthesis.cancel();
  }
}
