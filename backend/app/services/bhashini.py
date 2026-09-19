import httpx
from typing import Optional, Dict
from app.core.config import settings

class BhashiniService:
    """
    Pluggable service for Bhashini (National Language Translation Mission / Digital India).
    Provides STT (Speech-to-Text), TTS (Text-to-Speech), and NMT (Machine Translation).
    Features pass-through fallbacks when API keys are not supplied.
    """
    def __init__(self):
        self.user_id = settings.BHASHINI_USER_ID
        self.api_key = settings.BHASHINI_API_KEY
        self.pipeline_id = settings.BHASHINI_PIPELINE_ID
        self.auth_url = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
        self.compute_url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

    # Supported language mappings
    LANG_MAP = {
        "te": "Telugu (తెలుగు)",
        "hi": "Hindi (हिन्दी)",
        "en": "English",
        "kn": "Kannada (ಕನ್ನಡ)",
        "ta": "Tamil (தமிழ்)",
        "mr": "Marathi (मराठी)"
    }

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translates text between Indian languages and English."""
        if source_lang == target_lang or not text.strip():
            return text

        if self.api_key and self.user_id:
            try:
                headers = {
                    "userID": self.user_id,
                    "ulcaApiKey": self.api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "pipelineTasks": [
                        {
                            "taskType": "translation",
                            "config": {
                                "language": {
                                    "sourceLanguage": source_lang,
                                    "targetLanguage": target_lang
                                }
                            }
                        }
                    ],
                    "inputData": {
                        "input": [{"source": text}]
                    }
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(self.compute_url, json=payload, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        translated_text = data["pipelineResponse"][0]["output"][0]["target"]
                        return translated_text
            except Exception:
                pass

        # Pass-through fallback
        return text

    async def speech_to_text(self, audio_base64: str, language: str) -> str:
        """Converts base64 audio to text via Bhashini ASR."""
        if not audio_base64:
            return ""

        if self.api_key and self.user_id:
            try:
                headers = {
                    "userID": self.user_id,
                    "ulcaApiKey": self.api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "pipelineTasks": [
                        {
                            "taskType": "asr",
                            "config": {
                                "language": {"sourceLanguage": language},
                                "audioFormat": "wav",
                                "samplingRate": 16000
                            }
                        }
                    ],
                    "inputData": {
                        "audio": [{"audioContent": audio_base64}]
                    }
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(self.compute_url, json=payload, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        transcript = data["pipelineResponse"][0]["output"][0]["source"]
                        return transcript
            except Exception:
                pass

        return ""

    async def text_to_speech(self, text: str, language: str, gender: str = "female") -> Optional[str]:
        """Converts text to speech base64 audio via Bhashini TTS."""
        if not text:
            return None

        if self.api_key and self.user_id:
            try:
                headers = {
                    "userID": self.user_id,
                    "ulcaApiKey": self.api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "pipelineTasks": [
                        {
                            "taskType": "tts",
                            "config": {
                                "language": {"sourceLanguage": language},
                                "gender": gender
                            }
                        }
                    ],
                    "inputData": {
                        "input": [{"source": text}]
                    }
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(self.compute_url, json=payload, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        audio_base64 = data["pipelineResponse"][0]["audio"][0]["audioContent"]
                        return audio_base64
            except Exception:
                pass

        return None

bhashini_service = BhashiniService()
