import React from 'react';
import { 
  Building2, ShieldCheck, CreditCard, Sprout, 
  Printer, LogOut, CheckCircle2, FileText, ArrowRight
} from 'lucide-react';
import { printPassbookSlip } from '../utils/passbookSlipGenerator';

const STRINGS = {
  te: {
    passbookTitle: 'డిజిటల్ PACS సభ్యత్వ పాస్‌బుక్',
    activeMember: 'ధృవీకరించబడిన సభ్యుడు',
    kccLoan: '4% PACS క్రాప్ లోన్',
    kccSub: 'వడ్డీ సబ్సిడీ వర్తిస్తుంది',
    disbursed: 'వినియోగించిన రుణం',
    limit: 'మొత్తం పరిమితి',
    dueDate: 'గడువు తేదీ',
    fertilizer: 'ఎరువుల కోటా',
    ureaLeft: '4 యూరియా బస్తాలు మిగిలి ఉన్నాయి',
    insurance: 'PMFBY పంట బీమా రక్షణ',
    policyActive: 'పాలసీ యాక్టివ్‌గా ఉంది',
    btnPrint: 'పాస్‌బుక్ స్లిప్ ముద్రించండి (Print Slip)',
    signOut: 'లాగౌట్ (Sign Out)',
    syncedNCD: 'NCD జాతీయ డేటాబేస్‌తో అనుసంధానించబడింది',
  },
  en: {
    passbookTitle: 'Digital PACS Membership Passbook',
    activeMember: 'Active Verified Member',
    kccLoan: '4% PACS Crop Loan',
    kccSub: '4% Subsidized Interest Rate',
    disbursed: 'Disbursed',
    limit: 'Sanctioned Limit',
    dueDate: 'Due Date',
    fertilizer: 'Fertilizer PoS Quota',
    ureaLeft: '4 Bags Urea Remaining',
    insurance: 'PMFBY Crop Insurance',
    policyActive: 'Active Policy',
    btnPrint: 'Print Passbook Slip',
    signOut: 'Sign Out',
    syncedNCD: 'Synchronized with National Cooperative Database (NCD)',
  },
  hi: {
    passbookTitle: 'डिजिटल पैक्स (PACS) सदस्य पासबुक',
    activeMember: 'सत्यापित सक्रिय सदस्य',
    kccLoan: '4% पैक्स फसली ऋण',
    kccSub: '4% ब्याज अनुदान लागू',
    disbursed: 'वितरित राशि',
    limit: 'स्वीकृत सीमा',
    dueDate: 'देय तिथि',
    fertilizer: 'उर्वरक पीओएस कोटा',
    ureaLeft: '4 बोरी यूरिया शेष',
    insurance: 'पीएमएफबीवाई फसल बीमा',
    policyActive: 'सक्रिय पॉलिसी',
    btnPrint: 'पासबुक रसीद प्रिंट करें',
    signOut: 'लॉगआउट',
    syncedNCD: 'राष्ट्रीय सहकारी डेटाबेस (NCD) से सिंक्रनाइज़',
  }
};

export default function AccountSection({ currentUser, language, onLogout }) {
  if (!currentUser) return null;

  const t = STRINGS[language] || STRINGS['en'];

  // Member default fallback data
  const passbookData = {
    loanDisbursed: '₹1,50,000',
    loanLimit: '₹3,00,000',
    loanDue: '31 March 2027',
    interestRate: '4.0% p.a.',
    ureaBal: '4 Bags (8 Lifted / 12 Quota)',
    dapBal: '0 Bags (6 Lifted / 6 Quota)',
    complexBal: '3 Bags (5 Lifted / 8 Quota)',
    insurancePolicy: 'PMFBY/TS/SRD/2026/08892',
    sumInsured: '₹1,85,500',
    landArea: '3.50 Acres (Sy. No. 142/A)',
    khataNo: 'KH-894 (Kandi)',
  };

  const handlePrint = () => {
    printPassbookSlip(currentUser, passbookData);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full pb-8">
      {/* 1. Apple Wallet Style Digital Member Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 shadow-xl border border-emerald-700/40">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Society Header + Active Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold truncate">
                {currentUser.pacs_name || 'Kandi PACS (Sangareddy)'}
              </span>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t.activeMember}
            </span>
          </div>

          {/* Member Name & Details */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentUser.full_name || 'C. Nikhil'}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-emerald-100/80 font-mono">
              <span>ID: {currentUser.member_id || 'PACS-SRD-1042'}</span>
              <span>•</span>
              <span>Ph: {currentUser.phone_number || '9390336984'}</span>
              <span>•</span>
              <span>{passbookData.landArea}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Essentials at a Glance (3 Minimal iOS Cards) */}
      <div className="space-y-3">
        {/* KCC Loan Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-slate-900">{t.kccLoan}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
              {t.kccSub}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{passbookData.loanDisbursed}</span>
            <span className="text-xs text-slate-500 font-medium">{t.limit}: {passbookData.loanLimit}</span>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '50%' }} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
            <span>{t.dueDate}: <strong className="text-slate-700 font-semibold">{passbookData.loanDue}</strong></span>
            <span>Interest: <strong className="text-emerald-700 font-semibold">{passbookData.interestRate}</strong></span>
          </div>
        </div>

        {/* Fertilizer Quota Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-slate-900">{t.fertilizer}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60">
              PoS Subsidized
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-1">
            {t.ureaLeft}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              Urea: 4 left (8/12)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              DAP: 0 left (6/6)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              Complex: 3 left (5/8)
            </span>
          </div>
        </div>

        {/* PMFBY Crop Insurance Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-slate-900">{t.insurance}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
              {t.policyActive}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{passbookData.sumInsured}</span>
            <span className="text-xs text-slate-500 font-mono">{passbookData.insurancePolicy}</span>
          </div>

          <p className="text-xs text-slate-500">
            Kharif Paddy crop coverage • 72-hour localized loss reporting right active
          </p>
        </div>
      </div>

      {/* 3. Action Buttons (Print Slip & Sign Out) */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4.5 h-4.5" />
          <span>{t.btnPrint}</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-2xl bg-white/80 hover:bg-red-50 hover:text-red-600 active:scale-98 text-slate-600 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200/80 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.signOut}</span>
        </button>
      </div>

      {/* Synchronized status pill */}
      <div className="text-center pt-2 text-xs text-slate-400">
        {t.syncedNCD}
      </div>
    </div>
  );
}
