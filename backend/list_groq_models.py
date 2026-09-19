import httpx
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("LLM_API_KEY")

resp = httpx.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {key}"})
if resp.status_code == 200:
    models = resp.json().get("data", [])
    print("Available Groq Models for this key:")
    for m in models:
        print(" -", m["id"])
else:
    print("Error listing models:", resp.status_code, resp.text)
