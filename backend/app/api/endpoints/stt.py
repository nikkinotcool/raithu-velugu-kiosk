import io
import httpx
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.core.config import settings

router = APIRouter()

GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

# Supported language codes for Whisper
LANG_MAP = {
    "te": "te",
    "hi": "hi",
    "en": "en",
    "kn": "kn",
    "ta": "ta",
    "mr": "mr",
}

@router.post("/stt")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form("te")
):
    """
    Transcribes recorded audio to text using Groq Whisper Large V3 Turbo.
    Supports Telugu, Hindi, Indian English, Kannada, Tamil, Marathi.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Audio file is required.")

    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 100:
        raise HTTPException(status_code=400, detail="Audio file is empty or corrupted.")

    api_key = settings.LLM_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM_API_KEY is not configured for Speech-to-Text.")

    target_lang = LANG_MAP.get(language, "en")
    filename = file.filename or "audio.webm"
    content_type = file.content_type or "audio/webm"

    try:
        headers = {"Authorization": f"Bearer {api_key}"}
        files = {"file": (filename, audio_bytes, content_type)}
        data = {
            "model": "whisper-large-v3-turbo",
            "language": target_lang,
            "prompt": "PACS Primary Agricultural Credit Society, PMFBY crop insurance, KCC loan, Rythu Bharosa, farmer rights, fertilizer quota, cooperative election."
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(GROQ_AUDIO_URL, headers=headers, files=files, data=data)
            if resp.status_code == 200:
                result = resp.json()
                transcript = result.get("text", "").strip()
                return {
                    "text": transcript,
                    "language": target_lang,
                    "status": "success"
                }
            else:
                print(f"Groq Whisper error {resp.status_code}: {resp.text}")
                raise HTTPException(status_code=resp.status_code, detail=f"Transcription failed: {resp.text}")

    except HTTPException:
        raise
    except Exception as e:
        print(f"STT internal error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
