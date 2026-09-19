import re
from typing import Dict, Any, Tuple

class IntentClassifier:
    """
    Classifies user message intent into:
    - 'greeting_intent': 'hi', 'hello', 'hey', 'namaste', etc.
    - 'grievance_complaint': fraud, denied loan, rejected PMFBY claim, corruption, voting denied
    - 'information_query': questions about rules, deadlines, rights, eligibility
    - 'scheme_application': how to apply, forms needed, document lists
    """
    GREETING_KEYWORDS = [
        "hi", "hello", "hey", "namaste", "namaskar", "vanakkam", "halo",
        "good morning", "good afternoon", "good evening", "how are you",
        "who are you", "what can you do", "help", "హాయ్", "నమస్కారం", "నమస్తే",
        "नमस्ते", "प्रणाम", "हेलो", "ಹಲೋ", "வணக்கம்"
    ]

    GRIEVANCE_KEYWORDS = [
        "complain", "complaint", "fraud", "corruption", "bribe", "denied", "rejected",
        "delay", "refused", "harass", "scam", "illegal", "not received", "didn't get",
        "cut money", "misappropriation", "cheated", "grievance", "not paid",
        "ఫిర్యాదు", "మోసం", "లంచం", "రాలేదు", "తిరస్కరించారు", "ఆపేశారు",
        "शिकायत", "घोटाला", "रिश्वत", "मना कर दिया", "नहीं मिला", "खारिज"
    ]

    GRIEVANCE_CATEGORIES = {
        "pmfby": "PMFBY Crop Insurance Claim Dispute",
        "insurance": "PMFBY Crop Insurance Claim Dispute",
        "crop": "PMFBY Crop Insurance Claim Dispute",
        "loan": "PACS KCC / Crop Loan Sanction Delay",
        "interest": "PACS Interest Subvention Issue",
        "fertilizer": "Fertilizer & Seed Distribution Black-Marketing",
        "urea": "Fertilizer & Seed Distribution Black-Marketing",
        "vote": "Cooperative Society Election / Voting Rights Denial",
        "election": "Cooperative Society Election / Voting Rights Denial",
        "membership": "PACS Membership Application Rejection",
        "secretary": "PACS Administrative / Secretary Misconduct",
    }

    def classify(self, text: str) -> Tuple[str, str, float]:
        clean_text = text.strip().lower()
        words = clean_text.split()

        # Check for Greeting if input is short and matches greeting tokens
        if len(words) <= 3 and any(clean_text == kw or clean_text.startswith(kw) for kw in self.GREETING_KEYWORDS):
            return "greeting_intent", "Conversational Greeting", 0.98

        # Check if text triggers grievance intent
        is_grievance = any(kw in clean_text for kw in self.GRIEVANCE_KEYWORDS)
        
        if is_grievance:
            category = "General Cooperative Governance Grievance"
            for key, cat in self.GRIEVANCE_CATEGORIES.items():
                if key in clean_text:
                    category = cat
                    break
            return "grievance_complaint", category, 0.92

        if any(w in clean_text for w in ["apply", "documents", "eligibility", "form", "register", "ఎలా దరఖాస్తు", "आवेदन"]):
            return "scheme_application", "Scheme Application Guidance", 0.88

        return "information_query", "Cooperative & Legal Knowledge", 0.95

intent_classifier = IntentClassifier()
