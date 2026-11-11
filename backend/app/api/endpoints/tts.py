import re
import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

GOOGLE_TTS_URL = "https://translate.google.com/translate_tts"

LANG_MAP = {
    "te": "te",
    "hi": "hi",
    "en": "en",
    "kn": "kn",
    "ta": "ta",
    "mr": "mr",
}

# Abbreviations that must be spelled letter-by-letter
SPELL_OUT_ABBREVIATIONS = [
    "PACS", "PMFBY", "DCCB", "ARCS", "NCD", "KCC", "DAP",
    "MSP", "RRB", "NABARD", "SHG", "FPO", "MIS", "OTP",
    "SMS", "DPI", "PRI", "PAC"
]


class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "te"


def expand_abbreviations_for_speech(text: str) -> str:
    """Spells acronyms like PACS to 'P. A. C. S.' so voice reads each letter cleanly."""
    for abbr in SPELL_OUT_ABBREVIATIONS:
        spaced = " ".join(f"{ch}." for ch in abbr)
        text = re.sub(r'\b' + re.escape(abbr) + r'\b', spaced, text)
    return text


def sanitize_text_for_speech(text: str) -> str:
    """Strip markdown formatting, emojis, tables, and citations for fluent human speech."""
    if not text:
        return ""
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[\s*(ref:?)?\s*\d+\s*\]", "", text, flags=re.IGNORECASE)

    # Strip emojis cleanly
    emoji_regex = re.compile(
        "[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf\ufe0f]+",
        flags=re.UNICODE
    )
    text = emoji_regex.sub(" ", text)

    # Strip markdown headers, table bars, formatting
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\|", ", ", text)
    text = re.sub(r"[-:]{3,}", " ", text)
    text = re.sub(r"[*_~`]", "", text)
    text = re.sub(r"^\s*[-*+]\s+", ". ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", ". ", text, flags=re.MULTILINE)

    text = expand_abbreviations_for_speech(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:1000]


def chunk_text(text: str, max_chars: int = 180) -> list[str]:
    """Splits text into sentence/word chunks that fit within Google TTS request limits."""
    words = text.split()
    chunks = []
    curr = []
    curr_len = 0
    for w in words:
        if curr_len + len(w) + 1 > max_chars:
            if curr:
                chunks.append(" ".join(curr))
            curr = [w]
            curr_len = len(w)
        else:
            curr.append(w)
            curr_len += len(w) + 1
    if curr:
        chunks.append(" ".join(curr))
    return chunks


async def stream_google_natural_audio(clean_text: str, target_lang: str):
    """
    Streams natural, human-sounding audio directly from Google's high-fidelity
    neural regional voice engine (Google Assistant / Translate TTS).
    Self-concatenates MP3 frames without audio artifacts or WebSocket 403 drops.
    """
    chunks = chunk_text(clean_text)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
    }

    async with httpx.AsyncClient(timeout=12.0) as client:
        for chunk in chunks:
            if not chunk.strip():
                continue
            params = {
                "ie": "UTF-8",
                "tl": target_lang,
                "client": "tw-ob",
                "q": chunk
            }
            try:
                resp = await client.get(GOOGLE_TTS_URL, params=params, headers=headers)
                if resp.status_code == 200 and len(resp.content) > 0:
                    yield resp.content
            except Exception as e:
                print(f"TTS chunk error: {e}")
                continue


@router.post("/tts")
async def generate_speech_post(req: TTSRequest):
    clean = sanitize_text_for_speech(req.text)
    if not clean:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    target_lang = LANG_MAP.get(req.language, "te")
    return StreamingResponse(
        stream_google_natural_audio(clean, target_lang),
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=speech.mp3"}
    )


@router.get("/tts")
async def generate_speech_get(
    text: str = Query(..., description="Text to synthesize"),
    language: str = Query("te", description="Language code (te, hi, en, kn, ta, mr)")
):
    clean = sanitize_text_for_speech(text)
    if not clean:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    target_lang = LANG_MAP.get(language, "te")
    return StreamingResponse(
        stream_google_natural_audio(clean, target_lang),
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=speech.mp3"}
    )
