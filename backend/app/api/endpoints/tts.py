import re
import io
import base64
import httpx
import edge_tts
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings

router = APIRouter()

# Microsoft Azure Neural Studio Voices for Indian Regional Languages
AZURE_NEURAL_VOICES = {
    "te": "te-IN-MohanNeural",               # Dignified, warm, natural Telugu male voice
    "hi": "hi-IN-MadhurNeural",              # Clear, natural Hindi male voice
    "en": "en-IN-NeerjaExpressiveNeural",    # Fluent, natural Indian English female voice
    "kn": "kn-IN-GaganNeural",               # Natural Kannada male voice
    "ta": "ta-IN-ValluvarNeural",            # Natural Tamil male voice
    "mr": "mr-IN-ManoharNeural",             # Natural Marathi male voice
}

# Sarvam AI Voice Codes & Native Conversational Speakers (Bulbul:v4-flash)
SARVAM_LANG_MAP = {
    "te": "te-IN",
    "hi": "hi-IN",
    "en": "en-IN",
    "kn": "kn-IN",
    "ta": "ta-IN",
    "mr": "mr-IN",
}

SARVAM_SPEAKERS = {
    "te": "kavitha_te_conversation",   # Authentic native conversational Telugu voice
    "hi": "aditya_hi_conversational",   # Natural conversational Hindi voice
    "en": "simran_en_conversation",     # Fluent conversational Indian English
    "ta": "vijay_ta_narration",         # Authentic Tamil voice
    "kn": "chaitra_kn_conversation",    # Authentic Kannada voice
    "mr": "ishita_mr_conversational",   # Authentic Marathi voice
}

# Acronyms that must be pronounced letter-by-letter for natural cooperative comprehension
SPELL_OUT_ABBREVIATIONS = [
    "PACS", "PMFBY", "DCCB", "ARCS", "NCD", "KCC", "DAP",
    "MSP", "RRB", "NABARD", "SHG", "FPO", "MIS", "OTP",
    "SMS", "DPI", "PRI", "PAC"
]


class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "te"


def expand_abbreviations_for_speech(text: str) -> str:
    """Spells acronyms like PACS to 'P. A. C. S.' so neural models read letter-by-letter."""
    for abbr in SPELL_OUT_ABBREVIATIONS:
        spaced = " ".join(f"{ch}." for ch in abbr)
        text = re.sub(r'\b' + re.escape(abbr) + r'\b', spaced, text)
    return text


def sanitize_text_for_speech(text: str) -> str:
    """Cleans markdown, emojis, links, tables, and special characters for natural speech."""
    if not text:
        return ""
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[\s*(ref:?)?\s*\d+\s*\]", "", text, flags=re.IGNORECASE)

    # Remove decorative unicode emojis
    emoji_regex = re.compile(
        "[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\ufe0f]+",
        flags=re.UNICODE
    )
    text = emoji_regex.sub(" ", text)

    # Clean markdown headers, bold asterisks, list markers
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\|", ", ", text)
    text = re.sub(r"[-:]{3,}", " ", text)
    text = re.sub(r"[*_~`]", "", text)
    text = re.sub(r"^\s*[-*+]\s+", ". ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", ". ", text, flags=re.MULTILINE)

    text = expand_abbreviations_for_speech(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:1200]


async def generate_sarvam_tts(clean_text: str, language: str) -> Optional[bytes]:
    """
    Synthesizes speech using Sarvam AI (Bulbul:v4-flash) - ultra-fast native Indian speech model.
    Produces 100% human-grade, regional speech with natural pacing and authentic dialect accents.
    """
    if not settings.SARVAM_API_KEY:
        return None
    try:
        url = "https://api.sarvam.ai/text-to-speech"
        target_lang = SARVAM_LANG_MAP.get(language, "te-IN")
        speaker = SARVAM_SPEAKERS.get(language, "kavitha_te_conversation")
        headers = {
            "api-subscription-key": settings.SARVAM_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": [clean_text[:500]],
            "target_language_code": target_lang,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v4-flash"
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios:
                    return base64.b64decode(audios[0])
            else:
                print(f"Sarvam AI API error: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Sarvam AI TTS error: {e}")
    return None


async def generate_azure_edge_neural(clean_text: str, language: str) -> Optional[bytes]:
    """
    Synthesizes speech using Microsoft Azure Studio Neural Voices (te-IN-MohanNeural / hi-IN-MadhurNeural).
    """
    try:
        voice = AZURE_NEURAL_VOICES.get(language, AZURE_NEURAL_VOICES["te"])
        communicate = edge_tts.Communicate(clean_text, voice)
        audio_buffer = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.extend(chunk["data"])
        if len(audio_buffer) > 500:
            return bytes(audio_buffer)
    except Exception as e:
        print(f"Azure Edge Neural TTS error: {e}")
    return None


async def generate_google_neural_proxy(clean_text: str, language: str) -> Optional[bytes]:
    """
    Fallback: Server-side proxy for Google regional neural voice chunks.
    Ensures the browser never experiences CORS hotlinking failures.
    """
    try:
        target_lang = language if language in ["te", "hi", "kn", "ta", "mr", "en"] else "te"
        words = clean_text.split()
        chunks = []
        curr = []
        curr_len = 0
        for w in words:
            if curr_len + len(w) + 1 > 180:
                if curr:
                    chunks.append(" ".join(curr))
                curr = [w]
                curr_len = len(w)
            else:
                curr.append(w)
                curr_len += len(w) + 1
        if curr:
            chunks.append(" ".join(curr))

        audio_chunks = bytearray()
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Referer": "https://translate.google.com/"
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            for c in chunks[:5]:
                url = "https://translate.google.com/translate_tts"
                params = {"ie": "UTF-8", "tl": target_lang, "client": "tw-ob", "q": c}
                r = await client.get(url, params=params, headers=headers)
                if r.status_code == 200 and len(r.content) > 0:
                    audio_chunks.extend(r.content)

        if len(audio_chunks) > 500:
            return bytes(audio_chunks)
    except Exception as e:
        print(f"Google Proxy TTS error: {e}")
    return None


@router.post("/tts")
async def generate_speech_post(req: TTSRequest):
    """
    High-Fidelity Neural Speech Generation.
    Tier 1: Sarvam AI (Bulbul:v1) if SARVAM_API_KEY configured.
    Tier 2: Microsoft Azure Studio Neural Voices (te-IN-MohanNeural / hi-IN-MadhurNeural).
    Tier 3: Google Regional Neural Proxy (server-streamed to eliminate CORS issues).
    """
    clean = sanitize_text_for_speech(req.text)
    if not clean:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Tier 1: Sarvam AI (if key is set)
    audio = await generate_sarvam_tts(clean, req.language)

    # Tier 2: Microsoft Azure Neural Voices (Default free studio neural)
    if not audio:
        audio = await generate_azure_edge_neural(clean, req.language)

    # Tier 3: Google Regional Neural Proxy
    if not audio:
        audio = await generate_google_neural_proxy(clean, req.language)

    if not audio or len(audio) == 0:
        raise HTTPException(status_code=500, detail="Failed to synthesize neural audio.")

    media_type = "audio/wav" if audio[:4] == b"RIFF" else "audio/mpeg"

    return Response(
        content=audio,
        media_type=media_type,
        headers={
            "Content-Type": media_type,
            "Content-Length": str(len(audio)),
            "Cache-Control": "public, max-age=86400",
            "Accept-Ranges": "bytes"
        }
    )


@router.get("/tts")
async def generate_speech_get(
    text: str = Query(..., description="Text to synthesize"),
    language: Optional[str] = Query("te", description="Language code")
):
    req = TTSRequest(text=text, language=language)
    return await generate_speech_post(req)
