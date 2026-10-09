import React, { useState } from 'react';
import { 
  Bot, Mic, ArrowRight, ShieldCheck, CheckCircle2, PackageCheck, 
  Coins, FileText, PhoneCall, Sparkles, Building2, HelpCircle, 
  ChevronDown, ChevronUp, ExternalLink, Printer, Clock, Play, Volume2
} from 'lucide-react';

const STATS = [
  { 
    value_en: '1,02,000+', 
    value_te: '1,02,000+', 
    value_hi: '1,02,000+', 
    label_te: 'కంప్యూటరీకరణలో ఉన్న PACS సంఘాలు', 
    label_en: 'PACS Being Computerized Across India' 
  },
  { 
    value_en: '4% Interest', 
    value_te: '4% వడ్డీ', 
    value_hi: '4% ब्याज', 
    label_te: 'రైతులకు స్వల్పకాలిక పంట రుణం (KCC)', 
    label_en: 'Short-Term Crop Loan Subvention (KCC)' 
  },
  { 
    value_en: '72 Hours', 
    value_te: '72 గంటలు', 
    value_hi: '72 घंटे', 
    label_te: 'PMFBY పంట నష్టం తెలియజేసే గడువు', 
    label_en: 'Statutory PMFBY Loss Reporting SLA' 
  },
  { 
    value_en: '100% Voice AI', 
    value_te: '100% వాయిస్ AI', 
    value_hi: '100% वॉइस AI', 
    label_te: 'తెలుగు & హిందీ మాతృభాష AI మద్దతు', 
    label_en: 'Native Indic Script Transcription' 
  },
];

const PILLARS = [
  {
    icon: Mic,
    title_te: 'బహుభాషా వాయిస్ AI (Whisper Large V3)',
    title_en: 'Native Indic Voice AI',
    desc_te: 'రైతులు టైప్ చేయాల్సిన అవసరం లేదు. గ్రామీణ తెలుగు, హిందీ యాసల్లో మాట్లాడితే చాలు — ప్రశ్నలను అర్థం చేసుకుని స్పందిస్తుంది.',
    desc_en: 'Low-literacy farmers speak naturally in Telugu, Hindi, or English. Powered by conditioned Groq Whisper Large V3.',
    color: 'emerald'
  },
  {
    icon: FileText,
    title_te: 'సభ్యుల పాస్‌బుక్ & రసీదు స్లిప్ ప్రింట్',
    title_en: 'Transparent Cooperative Passbook',
    desc_te: 'సొసైటీ షేర్ మూలధనం, క్రాప్ లోన్ నిల్వలు, సబ్సిడీ ఎరువుల కోటా వివరాలను చూసి థర్మల్ రసీదు స్లిప్ ప్రింట్ చేసుకోవచ్చు.',
    desc_en: 'View live share capital, KCC loan balances, fertilizer ledger, and print official slips with barcode stamps.',
    color: 'teal'
  },
  {
    icon: ShieldCheck,
    title_te: 'చట్టబద్ధమైన ఫిర్యాదుల పరిష్కార వ్యవస్థ',
    title_en: 'Statutory Grievance Redressal',
    desc_te: 'లోన్ లేదా ఎరువులు నిరాకరిస్తే తక్షణమే ట్రాకింగ్ ఐడీతో ఫిర్యాదు నమోదు. స్వయంచాలకంగా జిల్లా ARCS / DCCB కి చేరుతుంది.',
    desc_en: 'Direct statutory routing to Assistant Registrar (ARCS) and DCCB inspection wing with unique tracking IDs.',
    color: 'amber'
  },
  {
    icon: PackageCheck,
    title_te: 'లైవ్ ఎరువులు & విత్తనాల నిల్వల బోర్డు',
    title_en: 'Live Fertilizer & Seed Inventory',
    desc_te: 'యూరియా, డీఏపీ నిల్వలు, ప్రభుత్వ రాయితీ ధరలు మరియు మార్కెట్ ధరల తేడాను పరిశీలించి రైతు కోటాను లెక్కించండి.',
    desc_en: 'Real-time bag counters for Urea, DAP, MOP, Complex, and personal landholding quota calculator with voice readouts.',
    color: 'sky'
  },
  {
    icon: Coins,
    title_te: '4% క్రాప్ లోన్ & వడ్డీ రాయితీ లెక్కింపు',
    title_en: 'Zero/4% KCC Loan Subvention Calculator',
    desc_te: 'స్కేల్ ఆఫ్ ఫైనాన్స్ ప్రకారం ఖరీఫ్ వరికి ఎకరానికి ₹38,000 వరకు రుణం మరియు సకాలంలో చెల్లింపు రాయితీ (PRI) లెక్కింపు.',
    desc_en: 'Interactive calculator for district Scale of Finance and Prompt Repayment Incentive (PRI 3% + 3% subvention).',
    color: 'indigo'
  },
  {
    icon: Clock,
    title_te: 'పబ్లిక్ కియోస్క్ ప్రైవసీ ఆటో-రీసెట్ గార్డ్',
    title_en: 'Public Kiosk Privacy Guard',
    desc_te: 'రైతు కియోస్క్ వద్ద లేనప్పుడు 150 సెకన్ల తర్వాత 20-సెకన్ల కౌంట్‌డౌన్‌తో సెషన్ ఆటోమేటిక్‌గా రీసెట్ అయి సమాచారాన్ని కాపాడుతుంది.',
    desc_en: 'Hardened public touchscreen kiosk mode with 150s idle + 20s countdown auto-reset to protect farmer banking data.',
    color: 'rose'
  }
];

const FAQS = [
  {
    q_te: 'PACS అంటే ఏమిటి? రైతు ఇందులో సభ్యుడిగా ఎలా చేరవచ్చు?',
    q_en: 'What is a PACS and how can a farmer become an active member?',
    a_te: 'PACS (ప్రాథమిక వ్యవసాయ సహకార పరపతి సంఘం) గ్రామ స్థాయిలో రైతులకు స్వల్పకాలిక రుణాలు, సబ్సిడీ ఎరువులు మరియు విత్తనాలు అందించే ప్రాథమిక సహకార సంస్థ. 18 ఏళ్లు నిండిన భూమి కలిగిన రైతు లేదా కౌలు రైతు సొసైటీలో షేర్ ఫీజు చెల్లించి ‘ఏ-క్లాస్’ సభ్యుడిగా చేరవచ్చు.',
    a_en: 'A Primary Agricultural Credit Society (PACS) is the village-level cooperative financial institution providing subsidized inputs, short-term crop loans, and agricultural services. Any farmer or tenant farmer holding land can subscribe to share capital to become an active A-class voting member.'
  },
  {
    q_te: '4% వడ్డీతో పంట రుణం (KCC) ఎలా పొందాలి? వడ్డీ రాయితీ ఎలా వర్తిస్తుంది?',
    q_en: 'How does the 4% crop loan work and what is Prompt Repayment Incentive?',
    a_te: 'భారత ప్రభుత్వం సాధారణ వడ్డీ 9% పై 2% రాయితీ ఇవ్వగా, రుణం తీసుకున్న రైతు 12 నెలల్లోపు తిరిగి చెల్లిస్తే అదనంగా 3% రాయితీ (PRI) లభిస్తుంది. ఫలితంగా రైతుకు నికర వడ్డీ రేటు కేవలం 4% మాత్రమే అవుతుంది. తెలంగాణలో అదనపు రాష్ట్ర రాయితీతో రూ. 1 లక్ష వరకు వడ్డీ రహిత (0%) రుణం అందుతుంది.',
    a_en: 'The base loan rate of 9% receives a 2% subvention from the Government of India, plus an additional 3% Prompt Repayment Incentive (PRI) upon clearing dues within 12 months, bringing net effective interest down to 4% (and 0% up to ₹1 Lakh in select state schemes).'
  },
  {
    q_te: 'సొసైటీ సెక్రటరీ యూరియా లేదా లోన్ నిరాకరిస్తే రైతు ఏమి చేయాలి?',
    q_en: 'What should a farmer do if the PACS Secretary refuses fertilizer or loans?',
    a_te: 'రైతు వెలుగు కియోస్క్ ద్వారా తక్షణమే అధికారిక ఫిర్యాదు నమోదు చేయవచ్చు. ఇది సహాయ రిజిస్ట్రార్ (ARCS) మరియు DCCB బ్యాంక్ ఇన్‌స్పెక్షన్ వింగ్‌కు వెళ్తుంది. చట్ట ప్రకారం అధికారి 7 నుండి 15 పని దినాల్లో విచారణ పూర్తి చేయాల్సి ఉంటుంది.',
    a_en: 'Farmers can immediately register an enforceable grievance on Raithu Velugu. It generates a statutory tracking code and forwards the ticket directly to the District Assistant Registrar of Cooperative Societies (ARCS) with a 7 to 15-day inquiry mandate.'
  },
  {
    q_te: 'PMFBY పంట నష్టం జరిగితే 72 గంటల నిబంధన ఏమిటి?',
    q_en: 'What is the mandatory 72-hour crop loss notification rule under PMFBY?',
    a_te: 'అకాల వర్షాలు, వడగండ్లు, వరదల వల్ల స్థానికంగా పంట నష్టపోతే, నష్టం జరిగిన 72 గంటల లోపు టోల్-ఫ్రీ నెంబర్ 14447 లేదా క్రాప్ ఇన్సూరెన్స్ యాప్ ద్వారా సమాచారం ఇవ్వడం తప్పనిసరి. ఆ తర్వాత వ్యవసాయ విస్తరణ అధికారి (AEO) పంచనామా నిర్వహిస్తారు.',
    a_en: 'For localized calamities (inundation, hail, cloudburst), loss intimation must be submitted within 72 hours via the PMFBY toll-free desk (14447) or Raithu Velugu Kiosk for joint field survey and survey panchnama.'
  }
];

export default function PortalHome({ 
  currentLanguage, 
  onLaunchKiosk, 
  onOpenStock, 
  onOpenHelplines,
  onNavigate 
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const isTe = currentLanguage === 'te';
  const isHi = currentLanguage === 'hi';

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Pill / Badge (Clean, static, non-spinning) */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isTe ? 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 • సహకార మంత్రిత్వ శాఖ' : (isHi ? 'स्मार्ट इंडिया हैकथॉन 2026 • सहकारिता मंत्रालय' : 'Smart India Hackathon 2026 • Ministry of Cooperation')}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              {isTe ? (
                <>
                  గ్రామీణ రైతులకు <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-800">బహుభాషా AI</span> మరియు పారదర్శక సహకార సేవల కియోస్క్
                </>
              ) : (
                <>
                  India’s First <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-800">Multilingual Voice AI</span> Kiosk for Primary Agricultural Credit Societies
                </>
              )}
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              {isTe ? (
                'డిజిటల్ మరియు అక్షరాస్యత అంతరాలను దాటి, గ్రామీణ రైతులు తమ సొంత భాషలో (తెలుగు, హిందీ, ఇంగ్లీష్) మాట్లాడి పంట రుణాలు, సబ్సిడీ ఎరువులు, పంట బీమా మరియు చట్టబద్ధమైన హక్కుల వివరాలు తెలుసుకునే విప్లవాత్మక ప్రజా వేదిక.'
              ) : (
                'Empowering 13+ Crore cooperative farmer members across 1,02,000+ PACS with Groq Whisper Large V3 voice assistance, live fertilizer stock boards, and statutory dispute redressal.'
              )}
            </p>

            {/* Standout CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={onLaunchKiosk}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2.5 border border-emerald-600/50"
              >
                <Bot className="w-5 h-5 text-emerald-200" />
                <span>
                  {isTe ? 'టాక్ టు రైతు వెలుగు (కియోస్క్ ప్రారంభించండి)' : 'Talk to Raithu Velugu Today'}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                onClick={onOpenStock}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4.5 h-4.5 text-emerald-700" />
                <span>{isTe ? 'లైవ్ ఎరువుల నిల్వల బోర్డు' : 'Live Fertilizer Stock Board'}</span>
              </button>
            </div>

            {/* Demo Credentials Hint */}
            <div className="pt-2 text-[12px] text-slate-500 font-medium">
              <span>{isTe ? 'డెమో రైతు లాగిన్:' : 'Demo Member Access:'} </span>
              <strong className="text-slate-800 font-mono">9390336984</strong>
              <span> | PIN: </span>
              <strong className="text-slate-800 font-mono">7171</strong>
              <span className="text-emerald-700 font-semibold ml-2">
                ({isTe ? 'సభ్యుడు: సి. నిఖిల్, కంది PACS' : 'Member: C. Nikhil, Kandi PACS'})
              </span>
            </div>

          </div>

          {/* Live Metrics Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {STATS.map((s, idx) => (
              <div 
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-heading tracking-tight">
                  {isTe ? s.value_te : (isHi ? s.value_hi : s.value_en)}
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                  {isTe ? s.label_te : s.label_en}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. THE 6 CORE PILLARS OF RAITHU VELUGU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            {isTe ? 'ప్రధాన విభాగాలు & సేవలు' : 'Key Architectural Capabilities'}
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-900">
            {isTe ? 'గ్రామీణ రైతులకు అవసరమైన ప్రతి సేవ ఒక్కచోట' : 'Engineered for Rural Last-Mile Cooperative Inclusion'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {isTe 
              ? 'సాధారణ వెబ్‌సైట్ మాత్రమే కాదు — గ్రామీణ సహకార సంఘాల టచ్ స్క్రీన్ కియోస్క్‌ల కోసం ప్రత్యేకంగా డిజైన్ చేయబడింది.'
              : 'Built specifically for village touchscreen kiosks with multi-dialect Indic voice AI, thermal print slips, and statutory governance routing.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                  {isTe ? p.title_te : p.title_en}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isTe ? p.desc_te : p.desc_en}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE AUDIO & DEMO TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                {isTe ? 'వాయిస్ AI సాంకేతికత' : 'Groq Whisper Large V3'}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black">
                {isTe 
                  ? 'రైతుల సొంత మాతృభాషలో సహకార చట్టాల సమాచారం' 
                  : 'Zero-Typing Voice AI for Low-Literacy Cooperative Members'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                {isTe 
                  ? 'రైతు తెలుగులో మాట్లాడితే చాలు — వేప పూత పూసిన యూరియా స్టాక్, 4% క్రాప్ లోన్ నిబంధనలు, లేదా PMFBY నష్ట క్లెయిమ్‌లను కియోస్క్ క్షణాల్లో విశ్లేషించి తెలుగులోనే సమాధానం ఇస్తుంది.'
                  : 'Injected with localized agricultural vocabulary (PACS, DAP, Neem-coated Urea, PMFBY, Scale of Finance) to prevent Latin transliteration errors and ensure 100% native Indic script accuracy.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-100 font-medium">
                  🗣️ {isTe ? '"నాకు యూరియా కోటా ఎంత ఉంది?"' : '"What is my eligible Urea fertilizer quota?"'}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-emerald-100 font-medium">
                  🗣️ {isTe ? '"వర్షానికి పంట పోయింది, క్లెయిమ్ ఎలా చేయాలి?"' : '"Crop was damaged by rainfall, how do I file insurance claim?"'}
                </span>
              </div>

              <div className="pt-3">
                <button
                  onClick={onLaunchKiosk}
                  className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-emerald-800" />
                  <span>{isTe ? 'వాయిస్ కియోస్క్ పరీక్షించండి' : 'Try Voice Assistant Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Passbook Sample Card */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <span className="text-xs font-bold text-emerald-300">
                  {isTe ? 'సభ్యుడి పాస్‌బుక్ ప్రివ్యూ' : 'Member Live Passbook Slip'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                  Verified PACS Member
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">{isTe ? 'సభ్యుడి పేరు' : 'Member Name'}:</span>
                  <strong className="text-white font-medium">C. Nikhil ({isTe ? 'కంది PACS' : 'Kandi PACS'})</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">{isTe ? 'భూమి వివరాలు' : 'Landholding'}:</span>
                  <strong className="text-white font-medium">{isTe ? '3.00 ఎకరాలు (Sy. No. 142/A)' : '3.00 Acres (Sy. No. 142/A)'}</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">{isTe ? '4% క్రాప్ లోన్ అర్హత' : 'KCC Loan Entitlement'}:</span>
                  <strong className="text-amber-300 font-bold">{isTe ? '₹1,14,000 (ఖరీఫ్ వరి)' : '₹1,14,000 (Kharif Paddy)'}</strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">{isTe ? 'రాయితీ యూరియా కోటా' : 'Subsidized Urea Quota'}:</span>
                  <strong className="text-emerald-300 font-bold">{isTe ? '6 బస్తాలు (₹1,599)' : '6 Bags (₹1,599)'}</strong>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 text-[11px] text-emerald-200 flex items-center justify-between">
                <span>Thermal Print Slip Engine Ready</span>
                <Printer className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            {isTe ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Frequently Asked Questions'}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
            {isTe ? 'PACS మరియు ప్రభుత్వ పథకాలపై సందేహాలు' : 'Clear Answers on Cooperative Governance & Schemes'}
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
                    {isTe ? faq.q_te : faq.q_en}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {isTe ? faq.a_te : faq.a_en}
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
