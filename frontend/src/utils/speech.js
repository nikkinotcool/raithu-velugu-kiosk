/**
 * Universal Resilient Speech Synthesis Utility for Raithu Velugu Kiosk
 * - Multi-Tier Architecture:
 *   1. Primary: Direct Client Sarvam AI (Bulbul:v4-flash) — ultra-fast (~1.4s), authentic native Indian voice, zero server cold-start delay.
 *   2. Secondary: Backend Neural Audio (/api/tts) — cloud-routed fallback.
 *   - Strictly ZERO robotic desktop voices (Microsoft David/Zira/SAPI are permanently disabled).
 */

import { fetchWithCloudFallback } from './apiClient';

// Sarvam AI Configuration (Universal Client Key for instant low-latency speech)
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || 'sk_mnzbvtx1_cEwhMUMBe5bHg028KFAECrUX';

const SARVAM_LANG_MAP = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  mr: 'mr-IN'
};

const SARVAM_SPEAKERS = {
  te: 'kavitha_te_conversation',   // Authentic conversational Telugu female voice
  hi: 'aditya_hi_conversational',   // Natural conversational Hindi male voice
  en: 'simran_en_conversation',     // Fluent conversational Indian English
  kn: 'chaitra_kn_conversation',    // Authentic Kannada voice
  ta: 'vijay_ta_narration',         // Authentic Tamil voice
  mr: 'ishita_mr_conversational'    // Authentic Marathi voice
};

// Keep track of active audio element & object URL
let activeAudio = null;
let activeAudioUrl = null;

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
 * Direct Client Call to Sarvam AI Bulbul:v4-flash
 * Bypasses backend entirely for ~1.4s response time with 0 cold-boot latency.
 */
async function speakWithSarvamDirect({ cleanText, language, onStart, onEnd, onError }) {
  if (!SARVAM_API_KEY) return false;

  const targetLang = SARVAM_LANG_MAP[language] || 'te-IN';
  const speaker = SARVAM_SPEAKERS[language] || 'kavitha_te_conversation';

  try {
    const res = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [cleanText.slice(0, 500)],
        target_language_code: targetLang,
        speaker: speaker,
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v4-flash'
      })
    });

    if (res.ok) {
      const data = await res.json();
      const audios = data.audios || [];
      if (audios.length > 0 && audios[0]) {
        console.log(`[Speech] Sarvam AI direct audio received successfully (${audios[0].length} base64 chars)`);
        const audio = new Audio('data:audio/wav;base64,' + audios[0]);
        activeAudio = audio;

        audio.onplay = onStart;
        audio.onended = () => {
          stopSpeech();
          onEnd();
        };
        audio.onerror = (e) => {
          console.warn('[Speech] Audio playback error:', e);
          stopSpeech();
          onError(e);
        };

        await audio.play();
        return true;
      }
    } else {
      console.warn('[Speech] Sarvam direct returned status:', res.status);
    }
  } catch (err) {
    console.warn('[Speech] Sarvam direct fetch failed, falling back to backend:', err);
  }
  return false;
}

/**
 * Universal High-Definition Speech Synthesis
 * - Tier 1: Direct Sarvam AI (1.4s speed, authentic human voice)
 * - Tier 2: Backend Cloud /tts (Azure Neural & Sarvam fallback)
 * - Strictly NO robotic desktop voices.
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

  // Tier 1: Direct Sarvam AI Bulbul:v4-flash (Fastest, zero server spin-up delay)
  const directSuccess = await speakWithSarvamDirect({
    cleanText,
    language,
    onStart,
    onEnd,
    onError
  });

  if (directSuccess) return;

  // Tier 2: Backend Cloud TTS (/api/tts)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

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
        console.log(`[Speech] Playing backend neural audio (${audioBlob.size} bytes)`);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudio = audio;
        activeAudioUrl = audioUrl;

        audio.onplay = onStart;
        audio.onended = () => {
          stopSpeech();
          onEnd();
        };
        audio.onerror = (e) => {
          console.warn('[Speech] Audio playback error:', e);
          stopSpeech();
          onError(e);
        };

        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('[Speech] Backend TTS failed:', err.message);
  }

  // If both failed, stop cleanly — NEVER play robotic desktop voices
  console.warn('[Speech] All neural voice providers unavailable. Bypassed robotic fallback.');
  onError(new Error('Audio generation is temporarily unavailable. Please try again.'));
}

/**
 * Immediately stops any ongoing speech playback
 */
export function stopSpeech() {
  if (activeAudio) {
    try {
      activeAudio.onplay = null;
      activeAudio.onended = null;
      activeAudio.onerror = null;
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.removeAttribute('src');
      activeAudio.load();
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
}
