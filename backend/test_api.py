import httpx
import json

def test_api():
    base_url = "http://127.0.0.1:8000/api"
    
    # 1. Test Health
    resp = httpx.get(f"{base_url}/health")
    print("Health Status:", resp.json())
    
    # 2. Test PMFBY Info Query (RAG + Citations)
    pmfby_payload = {
        "query": "How do I report crop loss within 72 hours for PMFBY?",
        "language": "en",
        "session_id": "test-session-1"
    }
    resp = httpx.post(f"{base_url}/chat", json=pmfby_payload)
    print("\n--- PMFBY CHAT RESPONSE ---")
    data = resp.json()
    print("Intent:", data.get("intent"))
    print("Response:\n", data.get("response"))
    print("Sources Found:", len(data.get("sources", [])))
    for s in data.get("sources", []):
        print(f" -> [{s['act_or_scheme']} - {s['section']}]: {s['excerpt'][:80]}...")

    # 3. Test Grievance Intent & Automatic Ticket Generation
    grievance_payload = {
        "query": "The PACS secretary rejected my fertilizer quota and demanded a bribe. I want to file a complaint.",
        "language": "en",
        "session_id": "test-session-2"
    }
    resp = httpx.post(f"{base_url}/chat", json=grievance_payload)
    print("\n--- GRIEVANCE CHAT RESPONSE ---")
    g_data = resp.json()
    print("Intent:", g_data.get("intent"))
    print("Ticket Created:", g_data.get("grievance_ticket"))

    # 4. Test Grievance Lookup by Tracking ID
    if g_data.get("grievance_ticket"):
        tid = g_data["grievance_ticket"]["tracking_id"]
        track_resp = httpx.get(f"{base_url}/grievances/track/{tid}")
        print("\n--- TICKET TRACKING VERIFICATION ---")
        print("Tracked Ticket:", track_resp.json())

if __name__ == "__main__":
    test_api()
