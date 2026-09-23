# 🌾 Raithu Velugu Kiosk (రైతు వెలుగు కియోస్క్)
### AI-Powered Voice & Touch Kiosk for Primary Agricultural Credit Societies (PACS)
> **Empowering Rural Indian Farmers through Multilingual AI, Financial Inclusion, and Transparent Cooperative Governance.**

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-646CFF?logo=vite)](https://frontend-alpha-lovat-73.vercel.app)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python%203.11-009688?logo=fastapi)](https://raithu-velugu-kiosk.onrender.com/api)
[![Groq](https://img.shields.io/badge/Voice%20AI-Groq%20Whisper%20Large%20V3-F55036)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Executive Summary

Under the **Ministry of Cooperation, Government of India**, Primary Agricultural Credit Societies (PACS) are undergoing comprehensive digital transformation. **Raithu Velugu Kiosk** is an accessible, voice-first public kiosk system engineered specifically for rural cooperative societies. It bridges the digital and literacy divide by enabling farmers to converse in their native mother tongue (Telugu, Hindi, English), view transparent financial passbooks, calculate interest subventions, lodge enforceable grievances, and print official cooperative receipts.

---

## 🚀 Live Deployments

- **🖥️ Kiosk Web Application**: [https://frontend-alpha-lovat-73.vercel.app](https://frontend-alpha-lovat-73.vercel.app)
- **⚡ Cloud API Server**: [https://raithu-velugu-kiosk.onrender.com/api](https://raithu-velugu-kiosk.onrender.com/api)
- **📚 Interactive API Docs (Swagger)**: [https://raithu-velugu-kiosk.onrender.com/docs](https://raithu-velugu-kiosk.onrender.com/docs)

---

## 🔑 Demonstration Credentials for Evaluators

| Role | Identifier / Mobile | Access PIN | Description |
| :--- | :--- | :--- | :--- |
| **PACS Farmer Member** | `9390336984` | `7171` | Member Profile: C. Nikhil (Kandi PACS, Sangareddy). Live passbook, 3-acre land record, subsidized Urea/DAP ledger. |
| **PACS Secretary / Officer** | `SEC-SRD-09` | `officer123` | Cooperative Secretary Portal: Live audit dashboard, statutory routing, status management, CSV report export. |

### Sample Pre-Seeded Grievance Tracking IDs:
- **`RV-GRV-20260921-UR8812`**: Fertilizer & Certified Seed Quota Denial (*Resolved*)
- **`RV-GRV-20260922-PM5541`**: PMFBY Crop Loss Claim Delay (*Under ARCS Inquiry*)
- **`RV-GRV-20260923-LN1094`**: PACS 4% Crop Loan Subvention (*Submitted - Under Review*)

---

## ✨ Key Features & Technical Innovations

### 1. 🎙️ Indic Native Voice AI (Speech-to-Text & Text-to-Speech)
- **Whisper Large V3 with Native Script Conditioning**: Audio is processed through Groq's `whisper-large-v3` injected with native vocabulary prompts (`నమస్కారం, రైతు వెలుగు, PACS, PMFBY...` for Telugu and Devanagari for Hindi). Bypasses browser-level Latin transliteration bugs to deliver 100% native Indic script transcription.
- **Multilingual TTS**: Integrated with edge neural speech synthesis to recite answers, passbook balances, and grievance confirmations in natural Indian accents.

### 2. 📖 Transparent Cooperative Passbook & Slip Printing
- Farmers can view verified shares, active KCC crop loan balances, fertilizer quota distributions, and savings accounts.
- **Printable Cooperative Slip**: Built-in printer stylesheet formats official membership slips with barcode and authorized stamp layouts ready for standard thermal kiosk receipt printers.

### 3. 🧮 Interactive KCC Interest Subvention & Scheme Calculators
- Interactive calculators for the **Govt. of India 4% / 0% Interest Subvention Scheme** (Prompt Repayment Incentive - PRI).
- Dynamic crop loan calculations based on district-approved Scale of Finance (Paddy ₹38,000/acre, Cotton ₹42,000/acre).

### 4. ⚖️ Enforceable Grievance Redressal & Statutory Routing
- Farmers can voice-lodge complaints regarding crop loss, fertilizer black-marketing, or loan delays.
- Automatically assigns unique tracking identifiers (`RV-GRV-YYYYMMDD-XXXXXX`) and maps them to statutory authorities:
  - *Assistant Registrar of Cooperative Societies (ARCS)*
  - *District Central Cooperative Bank (DCCB) Inspection Wing*
  - *District Agricultural Insurance Grievance Committee (DAIGC)*

### 5. 🛡️ Public Touchscreen Kiosk Hardening & Privacy Guard
- **Inactivity Auto-Reset Guard**: If a farmer leaves the kiosk unattended for 150 seconds, a 20-second audible countdown prompts the user before securely terminating the session and clearing sensitive financial data.
- **Dynamic On-Screen Numeric PIN Pad**: Prevents shoulder-surfing and allows easy input on large touchscreens.
- **Kiosk Fullscreen Lock**: Native browser fullscreen integration for dedicated village hardware installations.

### 6. 📊 PACS Officer Governance & Audit Export
- Authorized secretaries can monitor community grievances, update resolution statuses, and download complete UTF-8 audit reports (`PACS_Grievance_Audit_Log_YYYY-MM-DD.csv`) with full Indic language fidelity.

### 7. 🌐 High Availability & Cloud Resilience
- Frontend is powered by `apiClient.js` with dual-tier fallback: seamlessly connects to local edge servers, automatically falling back to Render cloud backend with zero user downtime or "Failed to fetch" errors.

---

## 🏗️ System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │             Village PACS Touchscreen Kiosk             │
       │   (React 18 + Vite + Tailwind/Glassmorphism Design)    │
       └──────────────┬───────────────────────────┬─────────────┘
                      │ Audio Stream              │ Member / Admin Auth
                      ▼                           ▼
       ┌───────────────────────────┐ ┌──────────────────────────┐
       │   Groq Whisper Large V3   │ │   FastAPI Backend Core   │
       │ (Indic Prompt Conditioning│ │ (SQLite/PostgreSQL +     │
       │   for Telugu & Hindi)     │ │  SQLAlchemy ORM)         │
       └──────────────┬────────────┘ └────────────┬─────────────┘
                      │ Native Text Output        │
                      └─────────────┬─────────────┘
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │               AI RAG & Governance Engine               │
       │  - Groq LLaMA 3.3 70B Versatile RAG Assistant         │
       │  - PACS By-Laws & Scheme Knowledge Base               │
       │  - Grievance Redressal & Statutory Routing Controller  │
       └────────────────────────────────────────────────────────┘
```

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/nikkinotcool/raithu-velugu-kiosk.git
cd raithu-velugu-kiosk/backend

# Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Evaluation Walkthrough Script

1. **Language Selection**:
   - On the top header, toggle between **తెలుగు (Telugu)**, **हिंदी (Hindi)**, and **English**.
   - Notice that the interface instant-translates without discarding ongoing conversations.
2. **Voice Querying (Indic)**:
   - Click the microphone icon in the chat input. Speak in Telugu: *"నాకు యూరియా ఎరువుల కోటా మరియు క్రాప్ లోన్ కావాలి"* or Hindi: *"मुझे यूरिया खाद का कोटा चाहिए"*.
   - Observe Groq Whisper Large V3 rendering high-accuracy Indic text and edge TTS responding.
3. **Member Authentication**:
   - Click **"రైతు లాగిన్ / Farmer Sign In"** at the top right.
   - Enter Mobile: `9390336984` and PIN: `7171` using the on-screen keypad.
   - View Nikhil's passbook, crop loan balance (₹85,000), subsidized fertilizer quota, and click **"Print Passbook Slip"**.
4. **Lodge Grievance & Tracking**:
   - Click **"ఫిర్యాదు నమోదు / Lodge Grievance"**. Submit a ticket.
   - Copy the tracking ID (or use `RV-GRV-20260922-PM5541`) in **"ట్రాక్ టికెట్ / Track Ticket"** to inspect live statutory routing to the District ARCS.
5. **Secretary Oversight & CSV Audit Export**:
   - Sign in as Secretary (`SEC-SRD-09` / `officer123`).
   - Open the **Admin Audit Drawer**. Filter tickets, update a status, and click **"📥 Export CSV"** to receive the official cooperative society record.

---

## 👥 Contributors & Acknowledgements

Developed for the **Smart India Hackathon (SIH)** cooperative governance challenge to bring inclusive technology to every farmer in India.