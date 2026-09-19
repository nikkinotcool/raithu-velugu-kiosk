import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

payload = {
    "query": "Can a tenant farmer or lessee without land title get PACS crop loan benefits in India?",
    "language": "en",
    "session_id": "test-tenant-farmer"
}

resp = httpx.post("http://127.0.0.1:8000/api/chat", json=payload, timeout=25.0)
data = resp.json()
print("Status:", resp.status_code)
print("Intent:", data.get("intent"))
print("\n--- LIVE AI RESPONSE ---")
print(data.get("response"))
print("\n--- SOURCES ---")
for s in data.get("sources", []):
    print(f"- {s['act_or_scheme']} ({s['section']})")
