import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

payload = {
    "query": "రైతులకు PACS లో 4% వడ్డీతో పంట రుణం ఎలా లభిస్తుంది?",
    "language": "te",
    "session_id": "test-telugu-live"
}

resp = httpx.post("http://127.0.0.1:8000/api/chat", json=payload, timeout=30.0)
print("Status:", resp.status_code)
if resp.status_code == 200:
    data = resp.json()
    print("Intent:", data.get("intent"))
    print("\n--- LIVE GROQ TELUGU RESPONSE ---")
    print(data.get("response"))
    print("\n--- SOURCES ---")
    for s in data.get("sources", []):
        print(f"- {s['act_or_scheme']} ({s['section']})")
else:
    print("Error:", resp.text)
