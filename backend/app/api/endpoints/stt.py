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

# Native contextual vocabulary prompts to guide Whisper into correct script and terminology
LANGUAGE_PROMPTS = {
    "te": "నమస్కారం, రైతు వెలుగు, ప్రాథమిక వ్యవసాయ సహకార పరపతి సంఘం PACS, PMFBY పంట బీమా, 4% క్రాప్ లోన్, ఎరువులు యూరియా, డీఏపీ, రైతు భరోసా, సభ్యత్వ హక్కులు, పంట నష్టం, ఫిర్యాదు, పిటిషన్, రుణ మాఫీ.",
    "hi": "नमस्ते, रैतु वेलुगु, प्राथमिक कृषि ऋण समिति पैक्स PACS, PMFBY फसल बीमा, 4% फसली ऋण, खाद यूरिया कोटा, डीएपी, किसान अधिकार, फसल नुकसान क्लेम, शिकायत दर्ज, ऋण माफी.",
    "kn": "ರೈತು ವೆಲುಗು, ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘ PACS, PMFBY ಬೆಳೆ ವಿಮೆ, 4% ಬೆಳೆ ಸಾಲ, ರಸಗೊಬ್ಬರ ಯೂರಿಯಾ ಕೋಟಾ, ರೈತರ ಹಕ್ಕುಗಳು, ದೂರು.",
    "ta": "ரைது வெலுகு, தொடக்க வேளாண்மை கூட்டுறவு கடன் சங்கம் PACS, PMFBY பயிர் காப்பீடு, 4% பயிர் கடன், உரங்கள் யூரியா ஒதுக்கீடு, விவசாயி உரிமைகள், புகார்.",
    "mr": "रैतू वेलूगू, प्राथमिक कृषी पतसंस्था PACS, PMFBY पीक विमा, 4% पीक कर्ज, खत यूरिया कोटा, शेतकरी अधिकार, तक्रार नोंदणी.",
    "en": "Namaste, Raithu Velugu, PACS Primary Agricultural Credit Society, PMFBY crop insurance, 4% crop loan KCC, fertilizer quota urea, farmer rights, grievance complaint."
}

@router.post("/stt")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form("te")
):
    """
    Transcribes recorded audio to native text using Groq Whisper Large V3.
    Optimized with native Indic prompts for Telugu, Hindi, Kannada, Tamil, Marathi, and English.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Audio file is required.")

    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 100:
        raise HTTPException(status_code=400, detail="Audio file is empty or corrupted.")

    api_key = settings.LLM_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM_API_KEY is not configured for Speech-to-Text.")

    target_lang = LANG_MAP.get(language, "te")
    native_prompt = LANGUAGE_PROMPTS.get(target_lang, LANGUAGE_PROMPTS["en"])
    filename = file.filename or "audio.webm"
    content_type = file.content_type or "audio/webm"

    headers = {"Authorization": f"Bearer {api_key}"}
    files = {"file": (filename, audio_bytes, content_type)}

    # Primary: whisper-large-v3 with native language prompt
    data = {
        "model": "whisper-large-v3",
        "language": target_lang,
        "prompt": native_prompt,
        "temperature": 0.0
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(GROQ_AUDIO_URL, headers=headers, files=files, data=data)
            
            # Fallback to turbo model if v3 is busy or errors
            if resp.status_code != 200:
                print(f"Whisper-large-v3 status {resp.status_code}, falling back to turbo: {resp.text}")
                data["model"] = "whisper-large-v3-turbo"
                files = {"file": (filename, audio_bytes, content_type)}
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
