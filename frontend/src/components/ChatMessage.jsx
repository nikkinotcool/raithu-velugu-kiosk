import React, { useState } from 'react';
import { Bot, User, BookOpen, ShieldAlert, Volume2, VolumeX, ChevronRight, Copy, Check } from 'lucide-react';

const UI_LABELS = {
  te: {
    advisor: 'సహకార AI సలహాదారు',
    listen: 'వినండి',
    stop: 'ఆపండి',
    ticketGen: 'అధికారిక ఫిర్యాదు నమోదైంది',
    trackBtn: 'ట్రాక్ చేయండి',
    legalRef: 'చట్టపరమైన సూచనలు (Legal References):'
  },
  hi: {
    advisor: 'सहकारी एआई सलाहकार',
    listen: 'सुनें',
    stop: 'रोकें',
    ticketGen: 'आधिकारिक शिकायत दर्ज की गई',
    trackBtn: 'ट्रैक करें',
    legalRef: 'कानूनी संदर्भ (Legal References):'
  },
  en: {
    advisor: 'Cooperative AI Advisor',
    listen: 'Listen',
    stop: 'Stop',
    ticketGen: 'Official Grievance Registered',
    trackBtn: 'Track Status',
    legalRef: 'Legal References & Bylaw Clauses:'
  },
  kn: {
    advisor: 'ಸಹಕಾರಿ AI ಸಲಹೆಗಾರ',
    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    ticketGen: 'ಅಧಿಕೃತ ದೂರು ದಾಖಲಾಗಿದೆ',
    trackBtn: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    legalRef: 'ಕಾನೂನು ಉಲ್ಲೇಖಗಳು:'
  },
  ta: {
    advisor: 'கூட்டுறவு AI ஆலோசகர்',
    listen: 'கேளுங்கள்',
    stop: 'நிறுத்து',
    ticketGen: 'அதிகாரப்பூர்வ புகார் பதிவு',
    trackBtn: 'நிலை அறிக்கை',
    legalRef: 'சட்ட குறிப்புகள்:'
  },
  mr: {
    advisor: 'सहकारी AI सल्लागार',
    listen: 'ऐका',
    stop: 'थांबवा',
    ticketGen: 'अधिकृत तक्रार नोंदवली',
    trackBtn: 'स्थिती ट्रॅक करा',
    legalRef: 'कायदेशीर संदर्भ:'
  }
};

export default function ChatMessage({ message, currentLanguage, onTrackTicket, onSelectSuggestion }) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const lang = currentLanguage || message.language || 'en';
  const t = UI_LABELS[lang] || UI_LABELS['en'];

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingTTS) {
        window.speechSynthesis.cancel();
        setIsPlayingTTS(false);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = message.content.replace(/[*#`_-]/g, ' ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        
        if (lang === 'hi') utterance.lang = 'hi-IN';
        else if (lang === 'te') utterance.lang = 'te-IN';
        else if (lang === 'ta') utterance.lang = 'ta-IN';
        else if (lang === 'kn') utterance.lang = 'kn-IN';
        else utterance.lang = 'en-IN';

        utterance.onend = () => setIsPlayingTTS(false);
        utterance.onerror = () => setIsPlayingTTS(false);
        setIsPlayingTTS(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full gap-2.5 sm:gap-3 my-2.5 sm:my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-xs">
          🌾
        </div>
      )}

      {/* Message Bubble Card */}
      <div 
        data-lang={lang}
        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm ${
          isUser 
            ? 'bg-slate-900 text-white rounded-tr-xs font-medium shadow-xs leading-relaxed' 
            : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
        }`}
      >
        {/* Header for Assistant Messages */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {t.advisor}
            </span>
            <button
              onClick={handleTTS}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer font-sans ${
                isPlayingTTS 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800'
              }`}
              title="Voice Readout"
            >
              {isPlayingTTS ? <VolumeX className="w-3 h-3 text-red-600" /> : <Volume2 className="w-3 h-3 text-emerald-700" />}
              <span>{isPlayingTTS ? t.stop : t.listen}</span>
            </button>
          </div>
        )}

        {/* Text Content */}
        <div className="leading-relaxed whitespace-pre-line font-normal space-y-1.5">
          {message.content}
        </div>

        {/* Official Grievance Ticket Badge */}
        {message.grievance_ticket && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-900 font-sans space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-950">{t.ticketGen}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-200/80 text-amber-950">
                {message.grievance_ticket.status}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200/60 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">ID: {message.grievance_ticket.tracking_id}</span>
              <button 
                onClick={() => copyToClipboard(message.grievance_ticket.tracking_id)} 
                className="text-slate-500 hover:text-slate-800 cursor-pointer p-0.5"
                title="Copy ID"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <button
              onClick={() => onTrackTicket(message.grievance_ticket.tracking_id)}
              className="w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
            >
              <span>{t.trackBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Cited Legal Clauses & Guidelines */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 font-sans">
            <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <BookOpen className="w-3 h-3 text-emerald-700" />
              <span>{t.legalRef}</span>
            </div>
            <div className="space-y-1.5">
              {message.sources.map((src, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] leading-snug">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>{src.act_or_scheme}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{src.section}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{src.clause_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Next Action Chips */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {message.suggested_actions.map((act, i) => (
              <button
                key={i}
                onClick={() => onSelectSuggestion(act)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-colors cursor-pointer text-left"
              >
                👉 {act}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
