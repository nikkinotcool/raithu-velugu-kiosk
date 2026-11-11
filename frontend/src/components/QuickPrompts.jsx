import React from 'react';
import { Sparkles } from 'lucide-react';

const QUICK_ACTIONS_BY_LANG = {
  te: [
    { label: '🌾 PMFBY 72 గంటల క్లెయిమ్', query: 'నా పంట వర్షానికి దెబ్బతింది, PMFBY బీమా క్లెయిమ్ 72 గంటల్లో ఎలా చేయాలి?' },
    { label: '💳 PACS 4% క్రాప్ లోన్', query: 'PACS సొసైటీలో 4% వడ్డీతో పంట రుణం (KCC) ఎలా పొందాలి? అర్హతలు ఏమిటి?' },
    { label: '🗳️ సొసైటీ ఓటు హక్కు', query: 'సొసైటీ ఎన్నికల్లో క్రియాశీల సభ్యుడి ఓటు హక్కు నిబంధనలు ఏమిటి?' },
    { label: '⚖️ అధికారిక ఫిర్యాదు నమోదు', query: 'నాకు రావాల్సిన ఎరువులు లేదా లోన్ ఇవ్వలేదు, నేను ఫిర్యాదు చేయాలనుకుంటున్నాను.' },
  ],
  hi: [
    { label: '🌾 PMFBY 72 घंटे क्लेम', query: 'फसल नुकसान होने पर PMFBY बीमा क्लेम 72 घंटे में कैसे दर्ज करें?' },
    { label: '💳 PACS 4% फसली ऋण', query: 'PACS समिति से 4% ब्याज पर KCC फसली ऋण कैसे प्राप्त करें?' },
    { label: '🗳️ समिति मतदान नियम', query: 'पैक्स समिति के चुनाव में सक्रिय सदस्य के मतदान अधिकार के नियम क्या हैं?' },
    { label: '⚖️ खाद/लोन शिकायत दर्ज', query: 'सोसाइटी से खाद या लोन नहीं मिला, मुझे शिकायत दर्ज करनी है।' },
  ],
  en: [
    { label: '🌾 PMFBY 72hr Claim', query: 'How do I intimate localized crop loss under PMFBY within 72 hours?' },
    { label: '💳 4% PACS Crop Loan', query: 'What are the rules and documents for 4% PACS Short-Term Crop Loan (KCC)?' },
    { label: '🗳️ Voting Rights', query: 'What are the active member voting eligibility rules under Model PACS Bylaws?' },
    { label: '⚖️ File Grievance', query: 'The PACS Secretary illegally refused my fertilizer or loan. I want to lodge a complaint.' },
  ]
};

export default function QuickPrompts({ language, onSelectPrompt }) {
  const prompts = QUICK_ACTIONS_BY_LANG[language] || QUICK_ACTIONS_BY_LANG['en'];

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
      {prompts.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectPrompt(p.query)}
          className="shrink-0 px-4 py-2 rounded-full bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-200/90 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
