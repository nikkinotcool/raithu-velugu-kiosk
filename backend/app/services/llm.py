import os
import re
import httpx
from typing import Optional, List, Dict
from app.core.config import settings

class GemmaLLMService:
    """
    Pluggable LLM Abstraction Layer.
    Supports:
    1. Groq Cloud (Ultra-fast inference via Groq models / qwen3.8-27b / gpt-oss-120b)
    2. Google AI Studio / Gemini API (Gemma models or Gemini Flash)
    3. Local Ollama (e.g. Gemma 4 / Gemma 2 local: http://localhost:11434/v1)
    4. Seamless offline expert knowledge fallback.
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
        # Build strict system prompt
        full_system_prompt = (
            "You are 'Raithu Velugu', an AI Legal and Governance Assistant for Rural Cooperative Members, "
            "Farmers, and Primary Agricultural Credit Societies (PACS) in India (Ministry of Cooperation).\n"
            "STRICT RULES:\n"
            "1. Answer clearly, accurately, and compassionately for rural farmers and PACS members.\n"
            "2. When discussing laws or schemes, cite legal sections, scheme guidelines, or official dispute provisions where applicable.\n"
            "3. If the user is just having a friendly casual chat, greeting you, or asking a general question, respond warmly, politely, and helpfully as their rural cooperative advisor.\n"
            "4. Keep the explanation concise and easy to understand on a tablet kiosk.\n"
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

        # 1. Try OpenAI-compatible / Groq Cloud / Local Ollama endpoint
        if "groq.com" in self.api_base or "11434" in self.api_base or "v1" in self.api_base or "openai" in self.api_base:
            try:
                headers = {"Authorization": f"Bearer {self.api_key or 'ollama'}", "Content-Type": "application/json"}
                url = f"{self.api_base}/chat/completions" if not self.api_base.endswith("/chat/completions") else self.api_base
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": full_system_prompt},
                        {"role": "user", "content": augmented_prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": 2048
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
                        print(f"Groq API Error {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"Groq/LLM Error: {e}")

        # 2. Try Google AI Studio / Generative Language API
        if self.api_key and "googleapis.com" in self.api_base:
            try:
                url = f"{self.api_base}/models/{self.model_name}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {"text": f"System: {full_system_prompt}\n\nUser: {augmented_prompt}"}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": temperature,
                        "maxOutputTokens": 2048
                    }
                }
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                cleaned = self._clean_response(parts[0]["text"])
                                if cleaned:
                                    return cleaned
            except Exception as e:
                print(f"Google AI Studio LLM error: {e}")

        # 3. Fallback to built-in domain knowledge engine
        return self._generate_fallback_response(prompt, context_chunks)

    def _generate_fallback_response(self, prompt: str, context_chunks: Optional[List[str]] = None) -> str:
        prompt_lower = prompt.lower()

        if "pmfby" in prompt_lower or "insurance" in prompt_lower or "crop damage" in prompt_lower:
            return (
                "**Pradhan Mantri Fasal Bima Yojana (PMFBY) Guidance:**\n\n"
                "1. **Intimation Window:** Under Section 4.2 of the PMFBY Operational Guidelines, you must report localized crop loss (inundation, hail, cyclone) within **72 hours** of the event.\n"
                "2. **Reporting Channels:** You can file the claim directly via the Crop Insurance App, call the National Crop Insurance Portal helpline (14447), or submit Form-C at your local PACS.\n"
                "3. **Premium Rates:** Farmers only pay **2%** of sum insured for Kharif crops, **1.5%** for Rabi crops, and **5%** for Commercial/Horticulture crops. The remaining premium is subsidized 50:50 by Central and State Governments.\n"
                "4. **Required Documents:** Land Record (RoR/Pahani), Sowing Certificate from Village Revenue Officer (VRO), Aadhaar Card, and Bank/PACS Passbook."
            )
        elif "pacs" in prompt_lower and ("loan" in prompt_lower or "kcc" in prompt_lower or "interest" in prompt_lower):
            return (
                "**PACS Crop Loan & Interest Subvention Scheme:**\n\n"
                "1. **Interest Subvention:** Under the Modified Interest Subvention Scheme (MISS), short-term agricultural crop loans up to ₹3,00,000 are available at an effective interest rate of **4% per annum** for farmers who repay on time (7% base rate minus 3% prompt repayment incentive).\n"
                "2. **Eligibility:** All landowning farmers and tenant farmers/oral lessees with Joint Liability Groups (JLGs) having a valid PACS membership.\n"
                "3. **Procedure at PACS:** Submit KCC application form, updated land revenue passbook (Pahani), non-encumbrance certificate, and seed/fertilizer demand slip."
            )
        elif "vote" in prompt_lower or "membership" in prompt_lower or "election" in prompt_lower or "bylaw" in prompt_lower:
            return (
                "**Cooperative Rights & Election Voting Eligibility:**\n\n"
                "1. **Right to Vote:** Under Section 19 of Model PACS Bylaws & State Cooperative Societies Act, an active member who has availed minimum society services (e.g. deposited or transacted within 3 preceding cooperative years) and attended the General Body meeting has 1 vote.\n"
                "2. **Disqualification:** Default in repaying overdue loans exceeding 12 months disqualifies a member from voting in Managing Committee elections.\n"
                "3. **Right to Information:** Every member has the right to inspect audited annual accounts, loan disbursement registers, and fertilizer stock registers during office hours."
            )
        else:
            return (
                f"**Cooperative & Legal Assistance:**\n\n"
                f"Based on your query: *\"{prompt}\"*:\n\n"
                f"- Under the National Cooperative Policy and Model PACS Bylaws, your rights and benefits are protected by the Assistant Registrar of Cooperative Societies (ARCS).\n"
                f"- If you need specific assistance regarding loan subsidies, PMFBY claim filing, or PACS committee disputes, you can also register an instant grievance ticket using our Kiosk redressal feature."
            )

llm_service = GemmaLLMService()
