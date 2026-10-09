import React from 'react';
import { Coins, ShieldCheck, PackageCheck, Award, ArrowRight, Bot, CheckCircle2, FileText, Sparkles } from 'lucide-react';

const SCHEMES = [
  {
    title_te: '4% స్వల్పకాలిక పంట రుణం & వడ్డీ రాయితీ (KCC / ISS)',
    title_en: '4% Short-Term Crop Loan & Interest Subvention (ISS)',
    category: 'Credit & Financial Inclusion',
    badge: 'Govt. Subvention 3% + PRI 3%',
    desc_te: 'రైతులకు సాగు ఖర్చుల కోసం PACS ద్వారా స్కేల్ ఆఫ్ ఫైనాన్స్ ప్రకారం పంట రుణాలు అందిస్తారు. 12 నెలల్లోపు తిరిగి చెల్లిస్తే వడ్డీ కేవలం 4% మాత్రమే. (తెలంగాణలో రూ. 1 లక్ష వరకు వడ్డీ రహిత 0% రుణం).',
    desc_en: 'Provides working capital up to Scale of Finance (Paddy ₹38,000/acre). Upon timely repayment within 12 months, net effective interest drops to 4% (0% in select state schemes).',
    rules_te: [
      'ఖరీఫ్ వరి: ఎకరానికి గరిష్టంగా రూ. 38,000 రుణం',
      'పత్తి పంట: ఎకరానికి గరిష్టంగా రూ. 42,000 రుణం',
      'రుణ పరిమితి 12 నెలల వ్యవధిలో చెల్లిస్తే అదనంగా 3% PRI రాయితీ',
      'భూమి పట్టాదారు పాస్‌బుక్ మరియు ఈ-పంట నమోదు తప్పనిసరి'
    ],
    rules_en: [
      'Kharif Paddy: Entitlement up to ₹38,000 per acre',
      'Cotton Crop: Entitlement up to ₹42,000 per acre',
      'Timely repayment within 12 months qualifies for 3% Prompt Repayment Incentive (PRI)',
      'Requires land title passbook and digital e-crop booking'
    ]
  },
  {
    title_te: 'PMFBY ప్రధానమంత్రి ఫసల్ బీమా యోజన',
    title_en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Risk Insurance',
    badge: 'Statutory 72-Hour Loss Reporting',
    desc_te: 'అకాల వర్షాలు, కరవు, వరదలు, చీడపీడల వల్ల పంట నష్టపోతే ఆర్థిక రక్షణ కల్పించే జాతీయ పంటల బీమా పథకం. రైతు చెల్లించాల్సిన ప్రీమియం ఖరీఫ్ ఆహార పంటలకు కేవలం 2% మాత్రమే.',
    desc_en: 'Comprehensive risk mitigation against drought, flood, inundation, pests, and localized calamities. Farmers pay only 2% premium for Kharif foodgrain crops.',
    rules_te: [
      'ఖరీఫ్ పంటలకు కేవలం 2% మాత్రమే రైతు ప్రీమియం',
      'స్థానిక వరదలు లేదా వడగండ్ల నష్టానికి 72 గంటల్లో సమాచారం ఇవ్వడం తప్పనిసరి',
      'టోల్-ఫ్రీ 14447 లేదా కియోస్క్ ద్వారా సమాచారం నమోదు చేయవచ్చు',
      'గ్రామ వ్యవసాయ విస్తరణ అధికారి (AEO) పంచనామా ఆధారంగా క్లెయిమ్ విడుదల'
    ],
    rules_en: [
      'Only 2% farmer premium share for Kharif foodgrains',
      'Mandatory 72-hour loss notification SLA for localized inundation/hail',
      'Direct intimation via Toll-Free 14447 or Raithu Velugu Kiosk',
      'Loss assessment conducted via joint field survey and panchnama'
    ]
  },
  {
    title_te: 'కేంద్ర ప్రభుత్వ సబ్సిడీ ఎరువుల పంపిణీ',
    title_en: 'Central Fertilizer Subsidy & Certified Quota',
    category: 'Nutrient & Input Subsidy',
    badge: 'Direct Price Support',
    desc_te: 'రైతులకు నాణ్యమైన వేప పూత పూసిన యూరియా మరియు డీఏపీ ఎరువులను గరిష్ట సబ్సిడీతో PACS కేంద్రాల ద్వారా పంపిణీ చేస్తారు.',
    desc_en: 'Direct price support ensuring smallholder farmers receive genuine Neem Coated Urea, DAP, and complexes at fixed statutory maximum retail prices.',
    rules_te: [
      'వేప పూత పూసిన యూరియా (45 కేజీలు): ప్రభుత్వ ధర కేవలం రూ. 266.50 (మార్కెట్ విలువ రూ. 2,450)',
      'డీఏపీ 18:46:0 (50 కేజీలు): ప్రభుత్వ ధర కేవలం రూ. 1,350.00 (మార్కెట్ విలువ రూ. 4,100)',
      'ఖరీఫ్ వరి సాగుకు ఎకరానికి 2 బస్తాల యూరియా కోటా అర్హత',
      'పీఓఎస్ (PoS) బయోమెట్రిక్ ద్వారా సొసైటీ కౌంటర్లో పంపిణీ'
    ],
    rules_en: [
      'Neem Coated Urea (45kg): Subsidized at ₹266.50 (Market MRP ₹2,450)',
      'DAP (50kg): Subsidized at ₹1,350.00 (Market MRP ₹4,100)',
      'Eligible quota: 2 bags Urea and 1 bag DAP per acre for Kharif Paddy',
      'Distributed via Aadhaar biometric PoS terminal at PACS'
    ]
  },
  {
    title_te: 'ధృవీకరించిన విత్తనాలు (తెలంగాణ సోనా RNR 15048)',
    title_en: 'Certified Seed Distribution (Telangana Sona)',
    category: 'High-Yield Seeds',
    badge: '>92% Certified Germination',
    desc_te: 'తెలంగాణ విత్తనాభివృద్ధి సంస్థ (TSSDC) ద్వారా ధృవీకరించిన అధిక దిగుబడి, తక్కువ గ్లైసెమిక్ ఇండెక్స్ (Low GI) గల తెలంగాణ సోనా వరి విత్తనాల పంపిణీ.',
    desc_en: 'High-yield, low-glycemic-index superfine paddy seeds certified by TSSDC with guaranteed germination rate and blast resistance.',
    rules_te: [
      '30 కేజీల బస్తా రాయితీ ధర రూ. 1,150 (మార్కెట్ ధర రూ. 1,750)',
      'ఎకరానికి 30 కేజీల విత్తన మోతాదు సరిపోతుంది',
      'అగ్గితెగులు మరియు దోమపోటును తట్టుకునే రకం'
    ],
    rules_en: [
      'Subsidized 30kg bag at ₹1,150 (Market price ₹1,750)',
      'Recommended seed rate: 30kg per acre',
      'High resistance against blast and bacterial leaf blight'
    ]
  }
];

export default function PortalSchemes({ currentLanguage, onLaunchKiosk }) {
  const isTe = currentLanguage === 'te';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          {isTe ? 'ప్రభుత్వ పథకాలు & అర్హతలు' : 'Cooperative Schemes & Statutory Entitlements'}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
          {isTe ? 'PACS సహకార సంఘాల ద్వారా లభించే కీలక పథకాలు' : 'Government Agricultural & Cooperative Schemes'}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {isTe
            ? 'పంట రుణాలు, వడ్డీ రాయితీ, పంట బీమా మరియు సబ్సిడీ ఎరువుల పూర్తి నిబంధనలు మరియు అర్హతల వివరాలు.'
            : 'Detailed guide on 4% crop loan subventions, PMFBY insurance compensation, and certified agricultural input entitlements.'}
        </p>
      </div>

      {/* Schemes List */}
      <div className="space-y-6">
        {SCHEMES.map((scheme, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
                  {scheme.category}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {isTe ? scheme.title_te : scheme.title_en}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto border border-emerald-300">
                {scheme.badge}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {isTe ? scheme.desc_te : scheme.desc_en}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                {isTe ? 'కీలక నిబంధనలు & అర్హతలు:' : 'Key Rules & Eligibility Criteria:'}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(isTe ? scheme.rules_te : scheme.rules_en).map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading text-xl font-bold">
            {isTe ? 'పథకాలపై సందేహం ఉందా? AI తో నేరుగా మాట్లాడండి' : 'Have a Question on Any Scheme? Ask the AI Assistant'}
          </h3>
          <p className="text-xs text-emerald-100">
            {isTe 
              ? 'మీ భూమి విస్తీర్ణం చెప్పి మీ రుణం మరియు ఎరువుల అర్హతను క్షణాల్లో తెలుసుకోండి.' 
              : 'Calculate your exact loan entitlement and subsidized fertilizer quota right on the voice kiosk.'}
          </p>
        </div>
        <button
          onClick={onLaunchKiosk}
          className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Bot className="w-4 h-4 text-emerald-800" />
          <span>{isTe ? 'కియోస్క్ ప్రారంభించండి' : 'Launch Kiosk AI'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
