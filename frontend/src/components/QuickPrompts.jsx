import React from 'react';
import { PackageCheck, PhoneCall, Mic, Sparkles } from 'lucide-react';

const QUICK_ACTIONS_BY_LANG = {
  te: [
    { label: 'PMFBY 72 గంటల క్లెయిమ్', query: 'నా పంట వర్షానికి దెబ్బతింది, PMFBY బీమా క్లెయిమ్ 72 గంటల్లో ఎలా చేయాలి?' },
    { label: 'PACS 4% క్రాప్ లోన్', query: 'PACS సొసైటీలో 4% వడ్డీతో పంట రుణం (KCC) ఎలా పొందాలి? అర్హతలు ఏమిటి?' },
    { label: 'సొసైటీ ఓటు హక్కు', query: 'సొసైటీ ఎన్నికల్లో క్రియాశీల సభ్యుడి ఓటు హక్కు నిబంధనలు ఏమిటి?' },
    { label: 'ఎరువులు / లోన్ ఫిర్యాదు', query: 'నాకు రావాల్సిన ఎరువులు లేదా లోన్ ఇవ్వలేదు, నేను ఫిర్యాదు చేయాలనుకుంటున్నాను.' },
  ],
  hi: [
    { label: 'PMFBY 72 घंटे क्लेम', query: 'फसल नुकसान होने पर PMFBY बीमा क्लेम 72 घंटे में कैसे दर्ज करें?' },
    { label: 'PACS 4% फसली ऋण', query: 'PACS समिति से 4% ब्याज पर KCC फसली ऋण कैसे प्राप्त करें?' },
    { label: 'मतदान नियम', query: 'पैक्स समिति के चुनाव में सक्रिय सदस्य के मतदान अधिकार के नियम क्या हैं?' },
    { label: 'खाद/लोन शिकायत', query: 'सोसाइटी से खाद या लोन नहीं मिला, मुझे शिकायत दर्ज करनी है।' },
  ],
  en: [
    { label: 'PMFBY 72hr Claim', query: 'How do I intimate localized crop loss under PMFBY within 72 hours?' },
    { label: 'PACS 4% Crop Loan', query: 'What are the rules and documents for 4% PACS Short-Term Crop Loan (KCC)?' },
    { label: 'Voting Rights', query: 'What are the active member voting eligibility rules under Model PACS Bylaws?' },
    { label: 'Lodge Grievance', query: 'The PACS Secretary illegally refused my fertilizer or loan. I want to lodge a complaint.' },
  ]
};

export default function QuickPrompts({ language, onSelectPrompt, onStartVoice, onOpenSchemes, onOpenStock, onOpenHelplines }) {
  const prompts = QUICK_ACTIONS_BY_LANG[language] || QUICK_ACTIONS_BY_LANG['en'];

  const voiceLabels = {
    te: 'వాయిస్',
    hi: 'बोलें',
    en: 'Voice',
    kn: 'ಧ್ವನಿ',
    ta: 'குரல்',
    mr: 'आवाज'
  };

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {/* Voice Pill */}
      <button
        type="button"
        onClick={onStartVoice}
        className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
      >
        <Mic className="w-3.5 h-3.5" />
        <span>{voiceLabels[language] || voiceLabels['en']}</span>
      </button>

      {/* Stock Quick Button */}
      {onOpenStock && (
        <button
          type="button"
          onClick={onOpenStock}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
        >
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'te' ? 'ఎరువులు' : language === 'hi' ? 'खाद' : 'Stock'}</span>
        </button>
      )}

      {/* Helplines Quick Button */}
      {onOpenHelplines && (
        <button
          type="button"
          onClick={onOpenHelplines}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'te' ? 'హెల్ప్‌లైన్' : language === 'hi' ? 'हेल्पलाइन' : 'Helplines'}</span>
        </button>
      )}

      {/* Quick Prompts */}
      {prompts.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectPrompt(p.query)}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-slate-400" />
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
}
