import React, { useState } from 'react';
import { 
  Bot, Mic, ArrowRight, ShieldCheck, CheckCircle2, PackageCheck, 
  Coins, FileText, PhoneCall, Building2, HelpCircle, 
  ChevronDown, ChevronUp, Printer, Clock, Volume2, Award
} from 'lucide-react';

const STATS = [
  { 
    value: '1,02,000+', 
    label: 'PACS Computerized Across India' 
  },
  { 
    value: '4% Interest', 
    label: 'Short-Term Crop Loan Subvention (KCC)' 
  },
  { 
    value: '72 Hours', 
    label: 'Statutory PMFBY Loss Reporting SLA' 
  },
  { 
    value: '100% Voice AI', 
    label: 'Native Indic Script AI (Telugu/Hindi/English)' 
  },
];

const PILLARS = [
  {
    icon: Mic,
    title: 'Native Indic Voice AI (Whisper Large V3)',
    desc: 'Low-literacy farmers speak naturally in Telugu, Hindi, or English. Powered by conditioned Groq Whisper Large V3 without Latin transliteration artifacts.',
    badge: 'Voice First',
    iconBg: 'bg-emerald-50 text-emerald-700'
  },
  {
    icon: FileText,
    title: 'Transparent Cooperative Passbook & Thermal Slips',
    desc: 'View live share capital, KCC loan balances, fertilizer quota balances, and print official dispute and transactional slips with authentic QR stamps.',
    badge: 'DPI Ledger',
    iconBg: 'bg-amber-50 text-amber-700'
  },
  {
    icon: ShieldCheck,
    title: 'Statutory Grievance Redressal Registry',
    desc: 'Direct statutory routing to the District Assistant Registrar (ARCS) and DCCB inspection wing with unique tracking IDs and mandatory 7-15 day SLAs.',
    badge: 'Legal Mandate',
    iconBg: 'bg-teal-50 text-teal-700'
  },
  {
    icon: PackageCheck,
    title: 'Live Fertilizer & Seed Inventory Board',
    desc: 'Real-time statutory bag counters for Neem Coated Urea, DAP, MOP, and complexes with landholding entitlement calculators and voice audio readouts.',
    badge: 'Real-Time Stock',
    iconBg: 'bg-sky-50 text-sky-700'
  },
  {
    icon: Coins,
    title: 'Zero / 4% Crop Loan & Subvention Calculator',
    desc: 'District Scale of Finance calculation (₹38,000/acre for Kharif Paddy) coupled with Prompt Repayment Incentive (PRI 3% + GOI 3% subvention) validation.',
    badge: 'KCC Subvention',
    iconBg: 'bg-emerald-50 text-emerald-900'
  },
  {
    icon: Clock,
    title: 'Hardened Touchscreen Privacy Guard',
    desc: 'Designed for public village kiosks with a 150-second idle detection guard and a 20-second audible countdown auto-reset to protect farmer banking data.',
    badge: 'Kiosk Security',
    iconBg: 'bg-rose-50 text-rose-700'
  }
];

const FAQS = [
  {
    q: 'What is a PACS and how can a farmer become an active member?',
    a: 'A Primary Agricultural Credit Society (PACS) is the grassroots village cooperative financial institution providing subsidized inputs, short-term crop loans, and agricultural services. Any farmer or tenant farmer holding land can subscribe to share capital to become an active A-class voting member.'
  },
  {
    q: 'How does the 4% crop loan work and what is Prompt Repayment Incentive (PRI)?',
    a: 'The base loan rate of 9% receives an upfront 2% subvention from the Government of India, plus an additional 3% Prompt Repayment Incentive upon clearing dues within 12 months, bringing net effective interest down to 4% (and 0% up to ₹1 Lakh in select state schemes).'
  },
  {
    q: 'What should a farmer do if the PACS Secretary refuses fertilizer or credit?',
    a: 'Farmers can immediately register an enforceable grievance on Raithu Velugu. It generates a statutory tracking code and forwards the ticket directly to the District Assistant Registrar of Cooperative Societies (ARCS) with a 7 to 15-day inquiry mandate.'
  },
  {
    q: 'What is the mandatory 72-hour crop loss notification rule under PMFBY?',
    a: 'For localized calamities (inundation, hail, cloudburst), loss intimation must be submitted within 72 hours via the PMFBY toll-free desk (14447) or Raithu Velugu Kiosk for joint field survey and survey panchnama.'
  }
];

export default function PortalHome({ 
  onLaunchKiosk, 
  onOpenStock, 
  onOpenHelplines,
  onNavigate 
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-14 sm:pb-22 bg-transparent border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Dignified Authority Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#09432e] border border-emerald-600/60 text-emerald-100 text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Smart India Hackathon 2026 • Ministry of Cooperation</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight sm:leading-none">
              India’s Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700">Voice AI & DPI</span> for Primary Agricultural Credit Societies
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Empowering 13+ Crore cooperative farmer members across 1,02,000+ PACS with Groq Whisper Large V3 voice assistance, live fertilizer stock boards, and statutory dispute redressal.
            </p>

            {/* Standout CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={onLaunchKiosk}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-700/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-emerald-500/50"
              >
                <Bot className="w-5 h-5 text-amber-300 shrink-0" />
                <span>Talk to Raithu Velugu Today</span>
                <ArrowRight className="w-4 h-4 text-emerald-100" />
              </button>

              <button
                onClick={onOpenStock}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4.5 h-4.5 text-emerald-700" />
                <span>Live Fertilizer Stock Board</span>
              </button>
            </div>

            {/* Demo Credentials Hint */}
            <div className="pt-2 text-[12px] text-slate-500 font-medium">
              <span>Demo Member Access: </span>
              <strong className="text-slate-800 font-mono">9390336984</strong>
              <span> | PIN: </span>
              <strong className="text-slate-800 font-mono">7171</strong>
              <span className="text-emerald-800 font-semibold ml-2">
                (Member: C. Nikhil, Kandi PACS)
              </span>
            </div>

          </div>

          {/* Live Metrics Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {STATS.map((s, idx) => (
              <div 
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-slate-950 font-heading tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. THE 6 CORE PILLARS OF RAITHU VELUGU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-950 text-xs font-black uppercase tracking-wider border border-emerald-200/80">
            Architectural Capabilities
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-950">
            Engineered for Rural Last-Mile Cooperative Inclusion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Built specifically for village touchscreen kiosks with multi-dialect Indic voice AI, thermal print slips, and statutory governance routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all group space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${p.iconBg} flex items-center justify-center transition-transform shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-950">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE AUDIO & DEMO TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#073826] via-[#094731] to-[#0d593d] text-white p-6 sm:p-12 shadow-xl border border-emerald-700/50 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                Groq Whisper Large V3
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black">
                Zero-Typing Voice AI for Low-Literacy Cooperative Members
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Injected with localized agricultural vocabulary (PACS, DAP, Neem-coated Urea, PMFBY, Scale of Finance) to prevent Latin transliteration errors and ensure 100% native Indic script accuracy.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 font-medium">
                  🗣️ "What is my eligible Urea fertilizer quota?"
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 font-medium">
                  🗣️ "Crop was damaged by rainfall, how do I file insurance claim?"
                </span>
              </div>

              <div className="pt-3">
                <button
                  onClick={onLaunchKiosk}
                  className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-emerald-900" />
                  <span>Try Voice Assistant Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                </button>
              </div>
            </div>

            {/* Interactive Passbook Sample Card */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <span className="text-xs font-bold text-amber-300">
                  Member Live Passbook Slip
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold border border-emerald-400/30">
                  Verified PACS Member
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Member Name:</span>
                  <strong className="text-white font-medium">C. Nikhil (Kandi PACS)</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Landholding:</span>
                  <strong className="text-white font-medium">3.00 Acres (Sy. No. 142/A)</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">KCC Loan Entitlement:</span>
                  <strong className="text-amber-300 font-bold">₹1,14,000 (Kharif Paddy)</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Subsidized Urea Quota:</span>
                  <strong className="text-emerald-300 font-bold">6 Bags (₹1,599)</strong>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 text-[11px] text-slate-300 flex items-center justify-between border border-white/10">
                <span>Thermal Print Slip Engine Ready</span>
                <Printer className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            Frequently Asked Questions
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-950">
            Clear Answers on Cooperative Governance & Schemes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
