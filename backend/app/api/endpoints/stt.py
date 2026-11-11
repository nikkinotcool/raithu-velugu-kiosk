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
    "te": "నమస్కారం, రైతు వెలుగు, ప్రాథమిక వ్యవసాయ సహకార పరపతి సంఘం, ప్యాక్స్ PACS, పిఎంఎఫ్బై PMFBY పంట నష్టం బీమా క్లెయిమ్, కేసీసీ KCC 4 శాతం క్రాప్ లోన్, యూరియా డీఏపీ DAP ఎరువుల స్టాక్ కోటా, రైతు భరోసా, మద్దతు ధర MSP, ఖాతా పాస్ బుక్, సభ్యత్వ రుసుము, ఫిర్యాదు నమోదు, అర్జీ పిటిషన్, సొసైటీ సెక్రటరీ, విచారణ, రుణ మాఫీ, కంది సంగారెడ్డి తెలంగాణ.",
    "hi": "नमस्ते, रैतु वेलुगु, प्राथमिक कृषि ऋण समिति पैक्स PACS, PMFBY फसल बीमा नुकसान क्लेम, KCC 4% फसली ऋण, खाद यूरिया कोटा, डीएपी DAP, किसान अधिकार, फसल नुकसान, शिकायत दर्ज, अर्जी, ऋण माफी, कांडी संगारेड्डी.",
    "kn": "ರೈತು ವೆಲುಗು, ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘ PACS, PMFBY ಬೆಳೆ ವಿಮೆ, KCC 4% ಬೆಳೆ ಸಾಲ, ರಸಗೊಬ್ಬರ ಯೂರಿಯಾ DAP ಕೋಟಾ, ರೈತರ ಹಕ್ಕುಗಳು, ದೂರು.",
    "ta": "ரைது வேலுகு, தொடக்க வேளாண்மை கூட்டுறவு கடன் சங்கம் PACS, PMFBY பயிர் காப்பீடு, KCC 4% பயிர் கடன், உரங்கள் யூரியா DAP ஒதுக்கீடு, விவசாயி உரிமைகள், புகார்.",
    "mr": "रैतू वेलूगू, प्राथमिक कृषी पतसंस्था PACS, PMFBY पीक विमा, KCC 4% पीक कर्ज, खत यूरिया DAP कोटा, शेतकरी अधिकार, तक्रार नोंदणी.",
    "en": "Namaste, Raithu Velugu, PACS Primary Agricultural Credit Society, PMFBY crop insurance claim, 4% crop loan KCC, fertilizer quota urea DAP, farmer rights, passbook balance, grievance complaint."
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

    target_lang = LANG_MAP.get(language, "te")
    filename = file.filename or "audio.webm"
    content_type = file.content_type or "audio/webm"

    # Tier 1: Sarvam AI Saaras:v3 (Native Indic Regional Speech Recognition)
    if settings.SARVAM_API_KEY:
        try:
            sarvam_lang = f"{target_lang}-IN" if target_lang in ["te", "hi", "kn", "ta", "mr", "en"] else "te-IN"
            sarvam_headers = {"api-subscription-key": settings.SARVAM_API_KEY}
            sarvam_files = {"file": (filename, audio_bytes, content_type)}
            sarvam_data = {"model": "saaras:v3", "language_code": sarvam_lang}
            async with httpx.AsyncClient(timeout=15.0) as client:
                sarvam_resp = await client.post(
                    "https://api.sarvam.ai/speech-to-text",
                    headers=sarvam_headers,
                    files=sarvam_files,
                    data=sarvam_data
                )
                if sarvam_resp.status_code == 200:
                    sarvam_result = sarvam_resp.json()
                    sarvam_text = sarvam_result.get("transcript", "").strip()
                    if sarvam_text:
                        return {
                            "text": sarvam_text,
                            "language": target_lang,
                            "status": "success",
                            "engine": "sarvam-saaras-v3"
                        }
        except Exception as sarvam_err:
            print(f"Sarvam STT failed, falling back to Groq Whisper: {sarvam_err}")

    # Tier 2: Groq Whisper Large V3 with Domain Indic Conditioning
    api_key = settings.LLM_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM_API_KEY is not configured for Speech-to-Text.")

    native_prompt = LANGUAGE_PROMPTS.get(target_lang, LANGUAGE_PROMPTS["en"])
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
