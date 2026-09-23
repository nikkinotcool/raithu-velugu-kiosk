import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, MapPin, Phone, Award, CheckCircle2, 
  CreditCard, Sprout, Landmark, LogOut, Database, Printer, Download,
  Calendar, FileText, AlertCircle, ArrowUpRight, HelpCircle, ChevronRight,
  TrendingUp, Sparkles, Droplets, Info, Volume2, VolumeX, Calculator, Coins
} from 'lucide-react';
import { printPassbookSlip, downloadPassbookSlip } from '../utils/passbookSlipGenerator';
import { speakMessage, stopSpeech } from '../utils/speech';

const STRINGS = {
  te: {
    passbookTitle: 'డిజిటల్ PACS సభ్యత్వ పాస్‌బుక్',
    activeMember: 'ధృవీకరించబడిన సొసైటీ సభ్యుడు',
    shareCapital: 'వాటా మూలధనం',
    landArea: 'సాగు భూమి',
    loanLimit: 'క్రాప్ లోన్ పరిమితి',
    subventionNote: '4% వడ్డీ సబ్సిడీ వర్తిస్తుంది',
    btnPrint: 'పాస్‌బుక్ స్లిప్ ముద్రించండి',
    btnDownload: 'డౌన్‌లోడ్',
    tabLoan: '💳 క్రాప్ లోన్ ఖాతా',
    tabFertilizer: '🌾 ఎరువులు & విత్తనాలు',
    tabInsurance: '🛡️ PMFBY పంట బీమా',
    tabLand: '📜 భూమి & నేల రికార్డులు',
    askAI: 'ఈ అంశంపై AI ని అడగండి',
    dueOn: 'చెల్లింపు గడువు',
    disbursed: 'మంజూరైన మొత్తం',
    recentTx: 'ఇటీవలి లావాదేవీల రికార్డు',
    quotaAllocated: 'కేటాయించిన కోటా',
    quotaLifted: 'తీసుకున్న సరుకు',
    quotaRemaining: 'మిగిలిన కోటా',
    lossReporting: '72 గంటల నష్ట సమాచార హక్కు',
    soilHealth: 'నేల ఆరోగ్య కార్డు',
    signOut: 'లాగౌట్'
  },
  en: {
    passbookTitle: 'Digital PACS Member Passbook',
    activeMember: 'Verified Active Member',
    shareCapital: 'Share Capital',
    landArea: 'Land Area',
    loanLimit: 'KCC Loan Limit',
    subventionNote: '4% Subvention Applicable',
    btnPrint: 'Print Passbook Slip',
    btnDownload: 'Download Slip',
    tabLoan: '💳 KCC Loan Ledger',
    tabFertilizer: '🌾 Fertilizer & Seed Quota',
    tabInsurance: '🛡️ PMFBY Insurance',
    tabLand: '📜 Land & Soil Records',
    askAI: 'Ask AI About This',
    dueOn: 'Due Date',
    disbursed: 'Disbursed Amount',
    recentTx: 'Recent Ledger Transactions',
    quotaAllocated: 'Seasonal Quota',
    quotaLifted: 'Lifted Quantity',
    quotaRemaining: 'Remaining Balance',
    lossReporting: '72-Hour Loss Reporting Right',
    soilHealth: 'Soil Health Card',
    signOut: 'Sign Out'
  },
  hi: {
    passbookTitle: 'डिजिटल पैक्स (PACS) सदस्य पासबुक',
    activeMember: 'सत्यापित सक्रिय सदस्य',
    shareCapital: 'हिस्सा पूंजी',
    landArea: 'कृषि भूमि',
    loanLimit: 'केसीसी ऋण सीमा',
    subventionNote: '4% ब्याज अनुदान लागू',
    btnPrint: 'पासबुक रसीद प्रिंट करें',
    btnDownload: 'डाउनलोड',
    tabLoan: '💳 केसीसी ऋण खाता',
    tabFertilizer: '🌾 उर्वरक एवं बीज कोटा',
    tabInsurance: '🛡️ पीएमएफबीवाई बीमा',
    tabLand: '📜 भूमि एवं मृदा रिकॉर्ड',
    askAI: 'इस पर एआई से पूछें',
    dueOn: 'देय तिथि',
    disbursed: 'वितरित राशि',
    recentTx: 'हाल के वित्तीय लेनदेन',
    quotaAllocated: 'आवंटित कोटा',
    quotaLifted: 'प्राप्त मात्रा',
    quotaRemaining: 'शेष कोटा',
    lossReporting: '72 घंटे फसल हानि रिपोर्टिंग अधिकार',
    soilHealth: 'मृदा स्वास्थ्य कार्ड',
    signOut: 'लॉगआउट'
  }
};

export default function AccountSection({ currentUser, language, onLogout, onAskAI }) {
  const [activeTab, setActiveTab] = useState('loan'); // 'loan' | 'fertilizer' | 'insurance' | 'land'
  if (!currentUser) return null;

  const t = STRINGS[language] || STRINGS['te'] || STRINGS['en'];

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
    premiumPaid: '₹3,710 (2% Farmer Share)',
    landArea: '3.50 Acres',
    khataNo: 'KH-894 (Kandi)'
  };

  const handlePrint = () => {
    printPassbookSlip(currentUser, passbookData);
  };

  const handleDownload = () => {
    downloadPassbookSlip(currentUser, passbookData);
  };

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [calcLoanAmount, setCalcLoanAmount] = useState(150000);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleVoiceNarration = () => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
      return;
    }

    let speechText = '';
    if (language === 'te') {
      speechText = `నమస్కారం ${currentUser.full_name} గారూ. మీ PACS సభ్యత్వ ఐడీ ${currentUser.member_id || 'PACS-SRD-1042'}. మీకు మంజూరైన క్రాప్ లోన్ లక్షా యాభై వేల రూపాయలు, 4 శాతం వడ్డీ రాయితీ వర్తిస్తుంది. చెల్లింపు గడువు 31 మార్చి 2027. మీ వద్ద ఇంకా 4 బస్తాల యూరియా మరియు 3 బస్తాల కాంప్లెక్స్ ఎరువుల కోటా మిగిలి ఉంది.`;
    } else if (language === 'hi') {
      speechText = `नमस्ते ${currentUser.full_name} जी। आपकी पैक्स सदस्य आईडी ${currentUser.member_id || 'PACS-SRD-1042'} है। आपका फसल ऋण ₹1,50,000 स्वीकृत है और 4 बैग यूरिया शेष है।`;
    } else {
      speechText = `Namaste ${currentUser.full_name}. Your PACS Member ID is ${currentUser.member_id || 'PACS-SRD-1042'}. Your disbursed crop loan is ₹1,50,000 with 4% interest subvention. Repayment due date is 31 March 2027. You have 4 bags of Urea and 3 bags of Complex fertilizer available in your quota.`;
    }

    setIsPlayingVoice(true);
    speakMessage({
      text: speechText,
      language,
      onStart: () => setIsPlayingVoice(true),
      onEnd: () => setIsPlayingVoice(false),
      onError: () => setIsPlayingVoice(false)
    });
  };

  const handleQuickAsk = (query) => {
    if (typeof onAskAI === 'function') {
      onAskAI(query);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full animate-fadeIn pb-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />
            {t.passbookTitle}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">
            {currentUser.pacs_name || 'Kandi Primary Agricultural Credit Society'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Read Aloud Voice Button */}
          <button
            onClick={handleVoiceNarration}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
              isPlayingVoice
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title="Read out passbook balances in voice"
          >
            {isPlayingVoice ? <VolumeX className="w-3.5 h-3.5 text-amber-800" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{isPlayingVoice ? (language === 'te' ? 'ఆపండి' : 'Stop') : (language === 'te' ? 'వినండి' : 'Listen')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Print Official Member Slip"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.btnPrint}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            title="Download Passbook"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-500 hover:text-red-700 text-xs font-bold border border-slate-200 hover:border-red-200 transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            title={t.signOut}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Premium Executive Member Smart Passbook Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-emerald-950/25 relative overflow-hidden">
        {/* Soft Decorative Ambient Background */}
        <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading text-lg sm:text-2xl font-bold tracking-tight">
                    {currentUser.full_name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-[10px] font-bold">
                    ✓ {t.activeMember}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80 font-mono mt-1 flex-wrap">
                  <span>ID: <strong className="text-white">{currentUser.member_id || 'PACS-SRD-1042'}</strong></span>
                  <span>•</span>
                  <span>Ph: <strong className="text-white">{currentUser.phone_number || 'N/A'}</strong></span>
                  <span>•</span>
                  <span>{currentUser.village || 'Kandi'}, {currentUser.district || 'Sangareddy'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Key Stats Highlight Bars */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
                {t.shareCapital}
              </span>
              <span className="text-sm sm:text-base font-bold text-white block">
                ₹15,000
              </span>
              <span className="text-[10px] text-emerald-300/80">150 Shares (Voting)</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
                {t.landArea}
              </span>
              <span className="text-sm sm:text-base font-bold text-white block">
                {passbookData.landArea}
              </span>
              <span className="text-[10px] text-emerald-300/80">Khata: {passbookData.khataNo}</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
                {t.loanLimit}
              </span>
              <span className="text-sm sm:text-base font-bold text-white block">
                {passbookData.loanLimit}
              </span>
              <span className="text-[10px] text-emerald-300/80">{t.subventionNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Segmented Navigation Bar */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold gap-1 shadow-inner overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('loan')}
          className={`flex-1 min-w-[120px] py-2 px-2 rounded-xl transition-all cursor-pointer text-center whitespace-nowrap ${
            activeTab === 'loan'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          {t.tabLoan}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fertilizer')}
          className={`flex-1 min-w-[120px] py-2 px-2 rounded-xl transition-all cursor-pointer text-center whitespace-nowrap ${
            activeTab === 'fertilizer'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          {t.tabFertilizer}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('insurance')}
          className={`flex-1 min-w-[120px] py-2 px-2 rounded-xl transition-all cursor-pointer text-center whitespace-nowrap ${
            activeTab === 'insurance'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          {t.tabInsurance}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('land')}
          className={`flex-1 min-w-[120px] py-2 px-2 rounded-xl transition-all cursor-pointer text-center whitespace-nowrap ${
            activeTab === 'land'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          {t.tabLand}
        </button>
      </div>

      {/* TAB 1: KCC CROP LOAN LEDGER */}
      {activeTab === 'loan' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Main Loan Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {language === 'te' ? 'క్రాప్ లోన్ పరిమితి & ప్రస్తుత నిల్వ' : 'Kisan Credit Card (KCC) Limit & Balance'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                Standard Active Loan
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  {t.disbursed}
                </span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  {passbookData.loanDisbursed}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Kharif 2026</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  {language === 'te' ? 'వడ్డీ రేటు' : 'Interest Rate'}
                </span>
                <span className="text-base font-bold text-emerald-700 block mt-0.5">
                  4.0% p.a.
                </span>
                <span className="text-[10px] text-slate-500">3% PRI Applied</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  {t.dueOn}
                </span>
                <span className="text-base font-bold text-amber-800 block mt-0.5">
                  31-Mar-2027
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Repay on time for 0%</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                  {language === 'te' ? 'అందుబాటులో ఉన్న రుణం' : 'Available Balance'}
                </span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  ₹1,50,000
                </span>
                <span className="text-[10px] text-slate-500">Of ₹3,00,000 Limit</span>
              </div>
            </div>

            {/* AI Action Banner */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs text-emerald-950 font-medium">
                  {language === 'te' 
                    ? '4% వడ్డీ రాయితీ లేదా రుణం రెన్యూవల్ గురించి ఏమైనా సందేహాలు ఉన్నాయా?' 
                    : 'Questions about KCC 4% interest subvention or renewal rules?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickAsk(language === 'te' ? 'PACS క్రాప్ లోన్ 4% వడ్డీ రాయితీ నిబంధనలు మరియు సకాలంలో చెల్లింపు ప్రయోజనాలు ఏమిటి?' : 'What are the rules for PACS 4% crop loan interest subvention and renewal?')}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
              >
                {t.askAI}
              </button>
            </div>
          </div>

          {/* Interactive KCC Zero-Interest Subvention Calculator */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 border border-emerald-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-emerald-950">
                  {language === 'te' ? 'వడ్డీ లేని పంట రుణాల కాలిక్యులేటర్ (Vaddi Leni Runalu)' : 'KCC Zero-Interest Scheme Calculator (4% Subvention)'}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                100% Subsidy on Prompt Repayment
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                  <span>{language === 'te' ? 'పంట రుణ మొత్తం (Loan Amount):' : 'Crop Loan Amount:'}</span>
                  <span className="text-emerald-800 text-sm font-extrabold font-mono">₹{calcLoanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range"
                  min="25000"
                  max="300000"
                  step="5000"
                  value={calcLoanAmount}
                  onChange={(e) => setCalcLoanAmount(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹25,000</span>
                  <span>₹1,50,000</span>
                  <span>₹3,00,000 (Max Limit)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Bank Rate (7%)</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">₹{Math.round(calcLoanAmount * 0.07).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center shadow-2xs">
                  <span className="text-[10px] text-emerald-600 block uppercase font-medium">Centre Subsidy (3%)</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">-₹{Math.round(calcLoanAmount * 0.03).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-center shadow-2xs">
                  <span className="text-[10px] text-emerald-600 block uppercase font-medium">State Rebate (4%)</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">-₹{Math.round(calcLoanAmount * 0.04).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-700 text-white text-center shadow-xs">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">Farmer Net Interest</span>
                  <span className="text-sm font-extrabold block mt-0.5">₹0 (ZERO)</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-900 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200 leading-snug">
                💡 {language === 'te' 
                  ? `రుణ గడువు (31 మార్చి 2027) లోపు చెల్లిస్తే మొత్తం ₹${Math.round(calcLoanAmount * 0.07).toLocaleString('en-IN')} వడ్డీ ప్రభుత్వమే భరిస్తుంది. మీకు వడ్డీ భారం సున్నా!`
                  : `When repaid on or before the due date (31 March 2027), the entire interest of ₹${Math.round(calcLoanAmount * 0.07).toLocaleString('en-IN')} is absorbed by Central & State subventions. Net farmer cost is ₹0!`}
              </p>
            </div>
          </div>

          {/* Recent Passbook Transactions */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              {t.recentTx}
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    CR
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Kharif Crop Loan Disbursed</span>
                    <span className="text-[11px] text-slate-500">NEFT via DCCB Sangareddy • Ref: TXN-89211</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">+₹1,50,000</span>
                  <span className="text-[10px] text-slate-400">10-Jul-2026</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                    DR
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Rabi Crop Loan Fully Repaid</span>
                    <span className="text-[11px] text-slate-500">Zero Interest Rebate Credited: ₹4,800</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 block">-₹1,20,000</span>
                  <span className="text-[10px] text-slate-400">24-Mar-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FERTILIZER & SEED QUOTA */}
      {activeTab === 'fertilizer' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {language === 'te' ? 'ఖరీఫ్ 2026 సబ్సిడీ ఎరువుల కోటా (DBT)' : 'Kharif 2026 Subsidized Fertilizer Allocation (DBT)'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                Aadhaar PoS Linked
              </span>
            </div>

            {/* Input 1: Urea */}
            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🌿 Neem Coated Urea (45 kg)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">₹266.50/bag</span>
                </div>
                <span className="font-bold text-emerald-800">4 Bags Available (8 of 12 lifted)</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '66.6%' }} />
              </div>
            </div>

            {/* Input 2: DAP */}
            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🧪 DAP (50 kg)</span>
                  <span className="text-[10px] text-slate-600 font-semibold bg-slate-200 px-1.5 py-0.5 rounded">₹1,350/bag</span>
                </div>
                <span className="font-bold text-slate-500">0 Bags Left (6 of 6 lifted)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Input 3: Complex */}
            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🌱 Complex NPK (20:20:0:13)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">₹1,200/bag</span>
                </div>
                <span className="font-bold text-emerald-800">3 Bags Available (5 of 8 lifted)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '62.5%' }} />
              </div>
            </div>

            {/* Ask AI Banner */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs text-emerald-950 font-medium">
                  {language === 'te' 
                    ? 'తదుపరి ఎరువుల స్టాక్ ఎప్పుడు వస్తుందో తెలుసుకోవాలా?' 
                    : 'Want to check next fertilizer stock arrival date and price rules?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickAsk(language === 'te' ? 'సొసైటీలో తదుపరి యూరియా మరియు డీఏపీ స్టాక్ ఎప్పుడు వస్తుంది? ప్రభుత్వ సబ్సిడీ ధరలు ఏమిటి?' : 'When will next Urea and DAP stocks arrive at the PACS society? What are the subsidized rates?')}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
              >
                {t.askAI}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PMFBY CROP INSURANCE */}
      {activeTab === 'insurance' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {language === 'te' ? 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన (PMFBY)' : 'Pradhan Mantri Fasal Bima Yojana (PMFBY)'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                Policy Active
              </span>
            </div>

            {/* Key Policy Details */}
            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Policy Number</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{passbookData.insurancePolicy}</span>
                <span className="text-[10px] text-slate-500">Agriculture Insurance Co. (AIC)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Insured Crop & Extent</span>
                <span className="font-bold text-slate-900 block mt-0.5">Paddy Fine • 3.50 Acres</span>
                <span className="text-[10px] text-emerald-700">Kharif Season 2026</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Sum Insured</span>
                <span className="font-bold text-emerald-700 text-sm block mt-0.5">{passbookData.sumInsured}</span>
                <span className="text-[10px] text-slate-500">₹53,000 / Acre</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Farmer Premium Paid</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{passbookData.premiumPaid}</span>
                <span className="text-[10px] text-emerald-700">98% Govt Subsidized</span>
              </div>
            </div>

            {/* 72-Hour Legal Window Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold text-amber-950">
                  {t.lossReporting}
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                {language === 'te'
                  ? 'అకాల వర్షం, వరదలు లేదా తెగుళ్ల వల్ల పంట నష్టం జరిగితే 72 గంటల్లోగా ఈ కియోస్క్ ద్వారా లేదా 14447 టోల్-ఫ్రీ నంబర్ ద్వారా ఫిర్యాదు చేయాలి. సర్వే బృందం 7 రోజుల్లో మీ పొలాన్ని పరిశీలిస్తుంది.'
                  : 'In case of localized calamity (inundation, hail, cyclone), intimation must be registered within 72 hours via this kiosk or toll-free 14447. Survey will be completed within 7 working days.'}
              </p>
              <button
                type="button"
                onClick={() => handleQuickAsk(language === 'te' ? 'నా పొలంలో పంట నష్టం జరిగింది, PMFBY 72 గంటల వ్యవధిలో క్లెయిమ్ ఎలా నమోదు చేయాలి?' : 'How do I submit a 72-hour crop loss claim under PMFBY on this kiosk?')}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5 mt-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'పంట నష్ట క్లెయిమ్ ఎలా చేయాలో అడగండి' : 'Ask AI How to File 72-Hour Claim'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LAND & SOIL HEALTH */}
      {activeTab === 'land' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {language === 'te' ? 'భూమి రికార్డులు (Dharani RoR 1B)' : 'Land Holdings (Dharani RoR 1B Record)'}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                Verified Pattadar
              </span>
            </div>

            <div className="space-y-2.5 my-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Survey No. 142/A • Wet Land (ఆయకట్టు)</span>
                  <span className="text-[11px] text-slate-500">Extent: 2.00 Acres • Crop: Paddy (Fine Sona)</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">Khata: 894</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Survey No. 143/B • Dry Land (మెట్ట భూమి)</span>
                  <span className="text-[11px] text-slate-500">Extent: 1.50 Acres • Crop: Cotton & Red Gram</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">Khata: 894</span>
              </div>
            </div>

            {/* Soil Health Summary */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                {t.soilHealth} (SHC-2026-SRD)
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100 text-center">
                  <span className="text-[10px] text-slate-500 block">pH Level</span>
                  <span className="font-bold text-emerald-800">7.2 (Neutral)</span>
                </div>
                <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Organic Carbon</span>
                  <span className="font-bold text-emerald-800">0.58% (Medium)</span>
                </div>
                <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Zinc Recommendation</span>
                  <span className="font-bold text-amber-800">10 kg/Acre</span>
                </div>
              </div>

              {/* Ask AI Soil Banner */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between gap-3 mt-3">
                <span className="text-xs text-emerald-950 font-medium">
                  {language === 'te' 
                    ? 'నేల ఆరోగ్య కార్డు ప్రకారం ఎరువుల మోతాదు గురించి AI సలహా తీసుకోండి' 
                    : 'Get fertilizer dose advice tailored to your Soil Health Card'}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAsk(language === 'te' ? 'నా నేల పరీక్షలో pH 7.2 మరియు జింక్ లోపం ఉంది. వరి పంటకు సరైన ఎరువుల యాజమాన్యం ఏమిటి?' : 'My soil test shows pH 7.2 and zinc deficiency. What is the recommended fertilizer management for paddy?')}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
                >
                  {t.askAI}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Synchronized Status Pill */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-sans border border-slate-200/60">
        <span className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-700" />
          <span>Synchronized with <strong>National Cooperative Database (NCD)</strong> & DCCB Sangareddy</span>
        </span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Ledger
        </span>
      </div>
    </div>
  );
}
