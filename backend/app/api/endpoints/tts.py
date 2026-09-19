import re
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import edge_tts

router = APIRouter()

# High-fidelity Microsoft Azure Neural Voices for Indian regional languages
VOICE_MAP = {
    "te": "te-IN-MohanNeural",       # Warm, natural, dignified Telugu male voice
    "hi": "hi-IN-MadhurNeural",      # Clear, pleasant Hindi male voice
    "en": "en-IN-NeerjaNeural",      # Natural Indian English female voice
    "kn": "kn-IN-GaganNeural",       # Clear Kannada male voice
    "ta": "ta-IN-ValluvarNeural",    # Clear Tamil male voice
    "mr": "mr-IN-ManoharNeural",     # Clear Marathi male voice
}

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "te"
    gender: Optional[str] = "male"

def sanitize_text_for_speech(text: str) -> str:
    """Strip markdown formatting, emojis, tables, and citations for fluent human speech."""
    if not text:
        return ""
    # Strip URLs
    text = re.sub(r"https?://\S+", "", text)
    # Strip markdown links [label](url) -> label
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Strip markdown citations [1], [Ref: 12]
    text = re.sub(r"\[\s*(ref:?)?\s*\d+\s*\]", "", text, flags=re.IGNORECASE)
    # Strip emojis and symbols
    text = re.sub(r"[\U00010000-\U0010ffff]", " ", text)
    text = re.sub(r"[🌾🏛️🚜⚡👉⚖️📜✅❌⚠️🔹🔸📌•]", " ", text)
    # Strip markdown headers, table bars, formatting
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\|", ", ", text)
    text = re.sub(r"[-:]{3,}", " ", text)
    text = re.sub(r"[*_~`]", "", text)
    # Smooth list bullets
    text = re.sub(r"^\s*[-*+]\s+", ". ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", ". ", text, flags=re.MULTILINE)
    # Clean whitespace
    text = re.sub(r"\s+", " ", text).strip()
    # Cap at 1500 chars to ensure responsive streaming
    return text[:1500]

async def stream_neural_audio(clean_text: str, voice_name: str):
    communicate = edge_tts.Communicate(clean_text, voice_name)
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            yield chunk["data"]

@router.post("/tts")
async def generate_speech_post(req: TTSRequest):
    clean = sanitize_text_for_speech(req.text)
    if not clean:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    voice = VOICE_MAP.get(req.language, VOICE_MAP["te"])
    return StreamingResponse(
        stream_neural_audio(clean, voice),
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

    voice = VOICE_MAP.get(language, VOICE_MAP["te"])
    return StreamingResponse(
        stream_neural_audio(clean, voice),
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=speech.mp3"}
    )
