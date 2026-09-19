import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_prompts = [
    "hey! who are you and what do you do?",
    "how are you doing today?",
    "tell me a short joke about farming"
]

for p in test_prompts:
    print(f"\n==========================================")
    print(f"USER: {p}")
    resp = httpx.post("http://127.0.0.1:8000/api/chat", json={"query": p, "language": "en", "session_id": "test-chat-live"}, timeout=20.0)
    data = resp.json()
    print(f"QWEN LLM RESPONSE:\n{data.get('response')}")
    print(f"Sources Attached: {len(data.get('sources', []))}")
