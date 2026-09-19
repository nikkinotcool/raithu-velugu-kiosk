import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import QuickPrompts from './components/QuickPrompts';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import GrievanceTrackerModal from './components/GrievanceTrackerModal';
import GrievancesSection from './components/GrievancesSection';
import AccountSection from './components/AccountSection';
import AdminDrawer from './components/AdminDrawer';
import SignInPage from './components/SignInPage';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? `http://${window.location.hostname}:8000/api` : 'http://localhost:8000/api');

const WELCOME_MESSAGES = {
  te: 'నమస్కారం! నేను **రైతు వెలుగు** — PACS సహకార సంఘాలు, చట్టపరమైన హక్కులు, PMFBY పంట బీమా మరియు ప్రభుత్వ పథకాల AI సహాయకుడిని. మీకు ఏ సమాచారం కావాలి?',
  hi: 'नमस्ते! मैं **रैतु वेलुगु** हूँ — प्राथमिक कृषि ऋण समितियों (PACS), सहकारिता कानून, PMFBY फसल बीमा और सरकारी योजनाओं का AI सहायक। आप क्या जानकारी चाहते हैं?',
  en: 'Namaste! I am **Raithu Velugu** — AI Legal & Governance Assistant for PACS, Cooperative Law, PMFBY Crop Insurance, and Farmer Grievances. How may I help you today?',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು **ರೈತು ವೆಲುಗು** — PACS ಸಹಕಾರ ಸಂಘಗಳು, ಕಾನೂನು ಹಕ್ಕುಗಳು ಮತ್ತು PMFBY ಬೆಳೆ ವಿಮೆಯ AI ಸಹಾಯಕ.',
  ta: 'வணக்கம்! நான் **ரைது வெலுகு** — PACS கூட்டுறவு சங்கங்கள், சட்ட உரிமைகள் மற்றும் பயிர் காப்பீட்டுக்கான AI உதவியாளர்.',
  mr: 'नमस्कार! मी **रैतू वेलुगू** आहे — प्राथमिक कृषी पतसंस्था (PACS), सहकार कायदे आणि PMFBY पीक विम्यासाठी AI सहाय्यक.'
};

export default function App() {
  const [language, setLanguage] = useState('te'); // default to Telugu
  const [activeSection, setActiveSection] = useState('chat'); // 'chat' | 'grievances' | 'account'
  const [sessionId, setSessionId] = useState(() => `kiosk-${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('raithu_velugu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('raithu_velugu_token') || '');

  // Modals state
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Initialize with welcome message when language changes or on start
  useEffect(() => {
    const welcomeText = WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'];
    setMessages([
      {
        role: 'assistant',
        content: welcomeText,
        language: language,
        sources: [],
        suggested_actions: [
          language === 'te' ? 'PMFBY పంట నష్టం 72 గంటల క్లెయిమ్ ఎలా చేయాలి?' : 'How to claim PMFBY crop loss?',
          language === 'te' ? 'PACS 4% క్రాప్ లోన్ నిబంధనలు' : 'PACS 4% Crop Loan rules',
          language === 'te' ? 'సొసైటీ అవినీతిపై ఫిర్యాదు చేయండి' : 'File a grievance against PACS corruption'
        ]
      }
    ]);
  }, [language]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeSection === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeSection]);

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    try {
      localStorage.setItem('raithu_velugu_user', JSON.stringify(user));
      localStorage.setItem('raithu_velugu_token', token);
    } catch (e) {
      console.error(e);
    }
    if (user.preferred_language) {
      setLanguage(user.preferred_language);
    }
    setActiveSection('chat');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem('raithu_velugu_user');
    localStorage.removeItem('raithu_velugu_token');
  };

  const handleSendMessage = async (text) => {
    if (!text || loading) return;

    const userMsg = {
      role: 'user',
      content: text,
      language: language
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          query: text,
          language: language,
          session_id: sessionId,
          user_role: currentUser?.role || 'farmer'
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const asstMsg = {
        role: 'assistant',
        content: data.response,
        sources: data.sources || [],
        grievance_ticket: data.grievance_ticket,
        suggested_actions: data.suggested_actions || [],
        language: data.language || language
      };

      setMessages((prev) => [...prev, asstMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Notice:** Unable to reach server (${err.message}). Please ensure the backend is running on port 8000.`,
          language: language,
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = () => {
    setSessionId(`kiosk-${Date.now()}`);
    const welcomeText = WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'];
    setMessages([
      {
        role: 'assistant',
        content: welcomeText,
        language: language,
        sources: []
      }
    ]);
  };

  const handleTrackTicket = (trackingId) => {
    setActiveTrackingId(trackingId);
    setTrackerOpen(true);
  };

  // Dedicated Sign-In Screen when not logged in
  if (!currentUser) {
    return (
      <SignInPage
        language={language}
        onLanguageChange={setLanguage}
        onLoginSuccess={handleLoginSuccess}
        apiBase={API_BASE}
      />
    );
  }

  return (
    <div 
      data-lang={language}
      className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white"
    >
      {/* Top Header */}
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        activeSection={activeSection}
        onOpenAdmin={() => setAdminOpen(true)}
        onResetChat={handleResetSession}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area (Vertical Portrait Optimized) */}
      <main className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-3 sm:px-4 pt-3 pb-24">
        {/* SECTION 1: AI ASSISTANT CHATBOT */}
        {activeSection === 'chat' && (
          <div className="flex flex-col min-h-full justify-between">
            {/* Scrollable Conversation Thread */}
            <div className="flex-1 space-y-2.5 mb-3">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  currentLanguage={language}
                  onTrackTicket={handleTrackTicket}
                  onSelectSuggestion={handleSendMessage}
                />
              ))}

              {loading && (
                <div className="flex items-center gap-2.5 my-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0 text-xs shadow-xs">
                    🌾
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 shrink-0" />
                    <span>
                      {language === 'en' 
                        ? 'Consulting Cooperative Law Knowledge Base & Groq AI...' 
                        : (language === 'hi' ? 'सहकारिता नियमों और एआई से परामर्श किया जा रहा है...' : 'సహకార చట్ట నిబంధనలను శోధిస్తోంది...')}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Fixed-Feel Sticky Chat Controls */}
            <div className="sticky bottom-0 z-20 space-y-2 pt-1 pb-1 bg-slate-50/95 backdrop-blur-xs">
              <QuickPrompts language={language} onSelectPrompt={handleSendMessage} />
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={loading}
                language={language}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: GRIEVANCES REDRESSAL */}
        {activeSection === 'grievances' && (
          <GrievancesSection 
            currentUser={currentUser} 
            language={language} 
            apiBase={API_BASE} 
          />
        )}

        {/* SECTION 3: ACCOUNT & MEMBERSHIP PASSBOOK */}
        {activeSection === 'account' && (
          <AccountSection 
            currentUser={currentUser} 
            language={language} 
            onLogout={handleLogout} 
          />
        )}
      </main>

      {/* Ergonomic Bottom Navigation Bar (Thumb-Friendly on Portrait Kiosk) */}
      <BottomNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        language={language}
      />

      {/* Grievance Ticket Tracker Quick Modal */}
      <GrievanceTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        initialTrackingId={activeTrackingId}
        apiBase={API_BASE}
      />

      {/* PACS Admin Drawer */}
      <AdminDrawer
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        apiBase={API_BASE}
      />
    </div>
  );
}
