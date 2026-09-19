import React from 'react';
import { ShieldCheck, Coins, Users, AlertOctagon } from 'lucide-react';

const QUICK_ACTIONS_BY_LANG = {
  te: [
    { label: '🌾 పంట నష్టం (PMFBY 72 గంటల క్లెయిమ్)', query: 'నా పంట వర్షానికి దెబ్బతింది, PMFBY బీమా క్లెయిమ్ 72 గంటల్లో ఎలా చేయాలి?' },
    { label: '💳 PACS 4% క్రాప్ లోన్ నిబంధనలు', query: 'PACS సొసైటీలో 4% వడ్డీతో పంట రుణం (KCC) ఎలా పొందాలి? అర్హతలు ఏమిటి?' },
    { label: '🗳️ సొసైటీ ఎన్నికల్లో ఓటు హక్కు', query: 'సొసైటీ ఎన్నికల్లో క్రియాశీల సభ్యుడి ఓటు హక్కు నిబంధనలు ఏమిటి?' },
    { label: '⚠️ లోన్ / ఎరువులు రాలేదా? ఫిర్యాదు చేయండి', query: 'నాకు రావాల్సిన ఎరువులు లేదా లోన్ ఇవ్వలేదు, నేను ఫిర్యాదు చేయాలనుకుంటున్నాను.' },
  ],
  hi: [
    { label: '🌾 फसल नुकसान (PMFBY क्लेम)', query: 'फसल नुकसान होने पर PMFBY बीमा क्लेम 72 घंटे में कैसे दर्ज करें?' },
    { label: '💳 PACS 4% फसली ऋण नियम', query: 'PACS समिति से 4% ब्याज पर KCC फसली ऋण कैसे प्राप्त करें?' },
    { label: '🗳️ समिति चुनाव मतदान नियम', query: 'पैक्स समिति के चुनाव में सक्रिय सदस्य के मतदान अधिकार के नियम क्या हैं?' },
    { label: '⚠️ खाद/लोन न मिलने की शिकायत', query: 'सोसाइटी से खाद या लोन नहीं मिला, मुझे शिकायत दर्ज करनी है।' },
  ],
  en: [
    { label: '🌾 PMFBY Crop Loss (72hr Claim)', query: 'How do I intimate localized crop loss under PMFBY within 72 hours?' },
    { label: '💳 PACS 4% Crop Loan & Subsidy', query: 'What are the rules and documents for 4% PACS Short-Term Crop Loan (KCC)?' },
    { label: '🗳️ Cooperative Voting Rights', query: 'What are the active member voting eligibility rules under Model PACS Bylaws?' },
    { label: '⚠️ File Grievance on Refusal', query: 'The PACS Secretary illegally refused my fertilizer or loan. I want to lodge a complaint.' },
  ]
};

export default function QuickPrompts({ language, onSelectPrompt }) {
  const prompts = QUICK_ACTIONS_BY_LANG[language] || QUICK_ACTIONS_BY_LANG['en'];

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {prompts.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(item.query)}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
