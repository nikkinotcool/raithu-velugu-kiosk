import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

base_url = "http://127.0.0.1:8000/api"

print("--- TESTING FARMER LOGIN ---")
f_resp = httpx.post(f"{base_url}/auth/farmer-login", json={"phone_number": "9876543210", "language": "te"})
print("Status:", f_resp.status_code)
farmer_data = f_resp.json()
print("Logged in farmer:", farmer_data["user"]["full_name"], "| Role:", farmer_data["user"]["role"])
farmer_token = farmer_data["access_token"]

print("\n--- TESTING AUTH/ME WITH TOKEN ---")
me_resp = httpx.get(f"{base_url}/auth/me", headers={"Authorization": f"Bearer {farmer_token}"})
print("Auth/me Status:", me_resp.status_code)
print("Profile:", me_resp.json()["full_name"], "| PACS:", me_resp.json()["pacs_name"])

print("\n--- TESTING OFFICER LOGIN ---")
o_resp = httpx.post(f"{base_url}/auth/officer-login", json={"username_or_email": "SEC-SRD-09", "password": "officer123"})
print("Officer Status:", o_resp.status_code)
print("Officer Name:", o_resp.json()["user"]["full_name"], "| Role:", o_resp.json()["user"]["role"])
