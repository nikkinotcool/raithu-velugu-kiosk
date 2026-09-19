import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Test Greeting
resp = httpx.post("http://127.0.0.1:8000/api/chat", json={"query": "hey", "language": "en", "session_id": "test-greeting"}, timeout=10.0)
data = resp.json()
print("Greeting Intent:", data.get("intent"))
print("Greeting Sources Count (Should be 0):", len(data.get("sources", [])))
print("\nResponse:\n", data.get("response"))
