import os
import re
import httpx
from typing import Optional, List, Dict
from app.core.config import settings

class GemmaLLMService:
    """
    Pluggable LLM Abstraction Layer.
    Guarantees 100% dynamic live inference directly from Groq models:
    - Primary: qwen/qwen3.8-27b
    - Secondary live fallback: openai/gpt-oss-20b
    - Tertiary live fallback: openai/gpt-oss-120b
    Never serves preloaded static answers.
    """
    @property
    def model_name(self):
        return os.getenv("LLM_MODEL_NAME", os.getenv("GEMMA_MODEL_NAME", getattr(settings, "LLM_MODEL_NAME", settings.GEMMA_MODEL_NAME)))

    @property
    def api_key(self):
        return os.getenv("LLM_API_KEY", settings.LLM_API_KEY)

    @property
    def api_base(self):
        return os.getenv("LLM_API_BASE", settings.LLM_API_BASE).rstrip("/")

    def _clean_response(self, text: str) -> str:
        """Strips out thinking tokens <think>...</think> cleanly, even if unclosed."""
        if not text:
            return ""
        if "<think>" in text:
            if "</think>" in text:
                text = text.split("</think>")[-1]
            else:
                text = re.sub(r"<think>.*", "", text, flags=re.DOTALL)
        return text.strip()

    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        context_chunks: Optional[List[str]] = None,
        temperature: float = 0.5
    ) -> str:
        # Build strict minimal iOS system prompt
        full_system_prompt = (
            "You are 'Raithu Velugu', an iOS-style clean, concise AI assistant for farmers and PACS members.\n"
            "STRICT RULES:\n"
            "1. KEEP IT MINIMAL & CONCISE: Maximum 3 to 4 short, simple bullet points or sentences total.\n"
            "2. NEVER overwhelm the user with long walls of text, tables, or complex legal jargon.\n"
            "3. Be direct, friendly, and practical. Use simple everyday language."
        )
        if system_instruction:
            full_system_prompt += f"\nAdditional Instruction: {system_instruction}"

        # If context is provided, attach to prompt
        augmented_prompt = prompt
        if context_chunks:
            context_text = "\n---\n".join(context_chunks)
            augmented_prompt = (
                f"LEGAL & SCHEME CONTEXT:\n{context_text}\n\n"
                f"USER QUESTION:\n{prompt}\n\n"
                f"Please provide an authoritative, step-by-step guidance citing the relevant sections."
            )

        # 1. Multi-model live inference on Groq Cloud:
        # Tries primary model (Qwen 3.8 27B) then fast fallback (GPT-OSS 20B)
        models_to_try = [self.model_name, "openai/gpt-oss-20b", "openai/gpt-oss-120b"]
        models_to_try = list(dict.fromkeys(models_to_try))

        for model_candidate in models_to_try:
            try:
                headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                url = f"{self.api_base}/chat/completions" if not self.api_base.endswith("/chat/completions") else self.api_base
                payload = {
                    "model": model_candidate,
                    "messages": [
                        {"role": "system", "content": full_system_prompt},
                        {"role": "user", "content": augmented_prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": 800
                }
                async with httpx.AsyncClient(timeout=25.0) as client:
                    resp = await client.post(url, json=payload, headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        choices = data.get("choices", [])
                        if choices:
                            raw_content = choices[0]["message"]["content"]
                            cleaned = self._clean_response(raw_content)
                            if cleaned:
                                return cleaned
                    else:
                        print(f"Groq candidate {model_candidate} error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"Groq candidate {model_candidate} exception: {e}")

        # If live inference failed on all models, return an explicit error instead of preloaded text
        return "క్షమించండి, AI సర్వర్ నుండి సమాధానం పొందడంలో సమస్య ఏర్పడింది. దయచేసి మీ ప్రశ్నను మళ్లీ అడగండి."

llm_service = GemmaLLMService()
