import httpx
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("LLM_API_KEY")

for model in ["qwen/qwen3.6-27b", "openai/gpt-oss-120b", "groq/compound"]:
    print(f"\n--- Testing Groq Model: {model} ---")
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are Raithu Velugu, a cooperative governance AI assistant."},
            {"role": "user", "content": "In 1 concise sentence, what is PACS in Indian cooperative governance?"}
        ],
        "max_tokens": 100
    }
    try:
        resp = httpx.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers, timeout=15.0)
        if resp.status_code == 200:
            print("SUCCESS with", model, ":")
            print(resp.json()["choices"][0]["message"]["content"].strip())
            break
        else:
            print("Error:", resp.text)
    except Exception as e:
        print("Request failed:", e)
