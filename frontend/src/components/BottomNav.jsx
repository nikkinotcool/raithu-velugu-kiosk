import React from 'react';
import { MessageSquare, FileText, UserCheck, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = {
  te: {
    chat: 'ఏఐ సహాయక్',
    chatSub: 'చట్టపరమైన సలహా',
    grievances: 'ఫిర్యాదులు',
    grievancesSub: 'నమోదు & స్థితి',
    account: 'నా ఖాతా',
    accountSub: 'సభ్యత్వ వివరాలు'
  },
  hi: {
    chat: 'एआई सहायक',
    chatSub: 'विधिक सलाह',
    grievances: 'शिकायतें',
    grievancesSub: 'दर्ज व स्थिति',
    account: 'मेरा खाता',
    accountSub: 'सदस्यता विवरण'
  },
  en: {
    chat: 'AI Assistant',
    chatSub: 'Legal Guidance',
    grievances: 'Grievances',
    grievancesSub: 'Track & File',
    account: 'My Account',
    accountSub: 'PACS Membership'
  }
};

export default function BottomNav({ activeSection, onSectionChange, language }) {
  const t = NAV_ITEMS[language] || NAV_ITEMS['en'];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg shadow-slate-900/5 safe-area-bottom">
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around h-16 sm:h-18 px-3">
        {/* TAB 1: CHAT */}
        <button
          onClick={() => onSectionChange('chat')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none ${
            activeSection === 'chat'
              ? 'text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeSection === 'chat' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
          }`}>
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className={`text-[11px] sm:text-xs tracking-tight mt-0.5 ${
            activeSection === 'chat' ? 'font-bold text-emerald-900' : 'font-medium'
          }`}>
            {t.chat}
          </span>
        </button>

        {/* TAB 2: GRIEVANCES */}
        <button
          onClick={() => onSectionChange('grievances')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none ${
            activeSection === 'grievances'
              ? 'text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeSection === 'grievances' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
          }`}>
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className={`text-[11px] sm:text-xs tracking-tight mt-0.5 ${
            activeSection === 'grievances' ? 'font-bold text-emerald-900' : 'font-medium'
          }`}>
            {t.grievances}
          </span>
        </button>

        {/* TAB 3: ACCOUNT */}
        <button
          onClick={() => onSectionChange('account')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none ${
            activeSection === 'account'
              ? 'text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeSection === 'account' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
          }`}>
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className={`text-[11px] sm:text-xs tracking-tight mt-0.5 ${
            activeSection === 'account' ? 'font-bold text-emerald-900' : 'font-medium'
          }`}>
            {t.account}
          </span>
        </button>
      </div>
    </nav>
  );
}
