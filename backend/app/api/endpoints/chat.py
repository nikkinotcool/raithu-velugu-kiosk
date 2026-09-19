import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.chat import ChatRequest, ChatResponse, GrievanceTicketBrief, SourceCitation
from app.services.intent import intent_classifier
from app.services.rag import rag_pipeline
from app.services.llm import llm_service
from app.services.bhashini import bhashini_service
from app.db.session import get_db
from app.db.models import Conversation, Message, Grievance

router = APIRouter()

LANGUAGE_INSTRUCTIONS = {
    "te": "CRITICAL: You MUST write your ENTIRE reply in fluent, respectful Telugu script (తెలుగు). Do NOT respond in English or Romanized Telugu. Use clear, simple rural terms.",
    "hi": "CRITICAL: You MUST write your ENTIRE reply in fluent, respectful Hindi (हिन्दी / देवनागरी लिपि). Do NOT respond in English. Use clear, respectful language suitable for a farmer.",
    "kn": "CRITICAL: You MUST write your ENTIRE reply in fluent Kannada script (ಕನ್ನಡ).",
    "ta": "CRITICAL: You MUST write your ENTIRE reply in fluent Tamil script (தமிழ்).",
    "mr": "CRITICAL: You MUST write your ENTIRE reply in fluent Marathi (मराठी).",
    "en": "Reply in clear, accessible, respectful English."
}

@router.post("/chat", response_model=ChatResponse)
async def handle_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Unified Live LLM Chat Endpoint:
    - ALL messages are processed dynamically by the live LLM (Qwen on Groq).
    - Uses native Indian script generation directly from the LLM.
    - If the query is legal/scheme-specific, RAG retrieves relevant clauses and attaches citations.
    - If the query is casual conversation or greeting, LLM responds naturally without bogus citations.
    - If the query indicates a complaint/fraud, an official grievance ticket is also registered.
    """
    raw_query = req.query.strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    user_lang = req.language or "en"
    lang_rule = LANGUAGE_INSTRUCTIONS.get(user_lang, LANGUAGE_INSTRUCTIONS["en"])

    # Step 1: For RAG keyword search, we can use English query or original query
    query_in_english = raw_query
    if user_lang != "en":
        query_in_english = await bhashini_service.translate(raw_query, source_lang=user_lang, target_lang="en")

    # Step 2: Classify Intent
    intent, category, confidence = intent_classifier.classify(query_in_english)

    grievance_ticket = None
    sources = []
    context_chunks = []
    suggested_actions = []

    # Step 3: Branching logic for Context & Grievances
    if intent == "grievance_complaint":
        tracking_id = f"RV-GRV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        routed_authority = "District Level Grievance Redressal Committee (DGRC)" if "PMFBY" in category else "Assistant Registrar of Cooperative Societies (ARCS)"

        # Save grievance to DB
        grievance_record = Grievance(
            tracking_id=tracking_id,
            category=category,
            description=raw_query,
            status="Registered & Routed",
            routed_to=routed_authority,
            complainant_name="Kiosk Farmer",
            created_at=datetime.utcnow()
        )
        db.add(grievance_record)
        db.commit()
        db.refresh(grievance_record)

        grievance_ticket = GrievanceTicketBrief(
            tracking_id=tracking_id,
            category=category,
            status="Registered & Routed",
            routed_to=routed_authority,
            created_at=datetime.utcnow().strftime("%d %b %Y, %I:%M %p")
        )

        system_instruction = (
            f"{lang_rule}\n"
            f"The user has lodged a complaint. Acknowledge that an official grievance ticket has been generated "
            f"(Tracking ID: {tracking_id}) and forwarded to {routed_authority}. "
            f"Reassure them with empathy and explain that the mandated inquiry will initiate within 7 working days."
        )
        suggested_actions = [
            "Track Grievance Status" if user_lang == "en" else "ఫిర్యాదు స్థితిని తనిఖీ చేయండి",
            "Download Receipt" if user_lang == "en" else "రసీదు డౌన్‌లోడ్ చేయండి",
            "Contact ARCS" if user_lang == "en" else "ARCS హెల్ప్‌లైన్ సంప్రదించండి"
        ]

    elif intent == "greeting_intent":
        # Conversational / Greeting: Let Qwen chat naturally without dumping legal citations
        system_instruction = (
            f"{lang_rule}\n"
            "The user is greeting you or having a casual conversation. "
            "Reply warmly, concisely, and naturally as 'Raithu Velugu' (AI Assistant for PACS & Cooperative Governance, Ministry of Cooperation). "
            "Introduce yourself briefly and ask how you can assist with farming loans, PMFBY crop insurance, or cooperative society rights."
        )
        suggested_actions = [
            "How do I claim PMFBY crop loss within 72 hours?" if user_lang == "en" else "PMFBY పంట నష్టం క్లెయిమ్ 72 గంటల్లో ఎలా చేయాలి?",
            "What are the rules for PACS 4% Crop Loan?" if user_lang == "en" else "PACS 4% క్రాప్ లోన్ నిబంధనలు ఏమిటి?",
            "What are my voting rights in PACS elections?" if user_lang == "en" else "సొసైటీ ఎన్నికల్లో ఓటు హక్కు నిబంధనలు ఏమిటి?",
            "File a complaint against PACS Secretary" if user_lang == "en" else "PACS సెక్రటరీపై ఫిర్యాదు నమోదు చేయండి"
        ]

    else:
        # Information / Legal / Scheme Query: Retrieve RAG context & citations
        context_chunks, sources = rag_pipeline.search(query_in_english, top_k=3)
        system_instruction = (
            f"{lang_rule}\n"
            "Explain clearly for an Indian rural cooperative member or farmer. "
            "Highlight key rules, interest rates, deadlines, or rights in bold. "
            "Cite the specific Section / Bye-law clause from the context."
        )
        suggested_actions = [
            "What documents are required?" if user_lang == "en" else "ఏ పత్రాలు అవసరం?",
            "How to calculate loan interest?" if user_lang == "en" else "వడ్డీ రాయితీ ఎలా లెక్కిస్తారు?",
            "File a complaint" if user_lang == "en" else "ఫిర్యాదు నమోదు చేయండి"
        ]

    # Step 4: Generate Live Response from Qwen / LLM directly
    final_response = await llm_service.generate_response(
        prompt=raw_query if user_lang != "en" else query_in_english,
        system_instruction=system_instruction,
        context_chunks=context_chunks if context_chunks else None
    )

    # Step 5: Persist session and messages in DB
    try:
        session_id = req.session_id or f"kiosk-{uuid.uuid4().hex[:8]}"
        conv = db.query(Conversation).filter(Conversation.session_id == session_id).first()
        if not conv:
            conv = Conversation(session_id=session_id, language=user_lang)
            db.add(conv)
            db.commit()
            db.refresh(conv)

        user_msg = Message(
            conversation_id=conv.id,
            role="user",
            content=raw_query,
            intent=intent
        )
        asst_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            content=final_response,
            intent=intent,
            sources_json=json.dumps([s.model_dump() for s in sources]) if sources else None
        )
        db.add_all([user_msg, asst_msg])
        db.commit()
    except Exception as e:
        print(f"DB Logging Warning: {e}")

    return ChatResponse(
        response=final_response,
        sources=sources,
        language=user_lang,
        session_id=req.session_id or "default-session",
        intent=intent,
        grievance_ticket=grievance_ticket,
        suggested_actions=suggested_actions
    )
