import React from 'react';
import { MessageSquare, FileText, UserCheck } from 'lucide-react';

const NAV_ITEMS = {
  te: {
    chat: 'AI సహాయక్',
    grievances: 'ఫిర్యాదులు',
    account: 'నా ఖాతా',
  },
  hi: {
    chat: 'AI सहायक',
    grievances: 'शिकायतें',
    account: 'मेरा खाता',
  },
  en: {
    chat: 'Assistant',
    grievances: 'Grievances',
    account: 'Account',
  },
  kn: {
    chat: 'AI ಸಹಾಯ',
    grievances: 'ದೂರುಗಳು',
    account: 'ಖಾತೆ',
  },
  ta: {
    chat: 'AI உதவி',
    grievances: 'புகார்கள்',
    account: 'கணக்கு',
  },
  mr: {
    chat: 'AI सहाय',
    grievances: 'तक्रारी',
    account: 'खाते',
  }
};

const TABS = [
  { key: 'chat', Icon: MessageSquare, labelKey: 'chat' },
  { key: 'grievances', Icon: FileText, labelKey: 'grievances' },
  { key: 'account', Icon: UserCheck, labelKey: 'account' },
];

export default function BottomNav({ activeSection, onSectionChange, language }) {
  const t = NAV_ITEMS[language] || NAV_ITEMS['en'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 safe-area-bottom">
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center h-16 px-2">
        {TABS.map(({ key, Icon, labelKey }) => {
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => onSectionChange(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer select-none transition-all active:scale-95`}
            >
              <div className={`flex items-center justify-center w-10 h-6 rounded-full transition-all ${
                isActive ? 'bg-emerald-100' : ''
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-400'
                }`} />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors ${
                isActive ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {t[labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
