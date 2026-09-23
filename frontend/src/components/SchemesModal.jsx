import React from 'react';
import { X, Sparkles, Tractor, Sun, Warehouse, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

const SCHEMES = [
  {
    id: 'chc',
    icon: Tractor,
    badgeColor: 'emerald',
    titleTe: 'PACS కస్టమ్ హైరింగ్ సెంటర్ (CHC యంత్రాల అద్దె)',
    titleEn: 'PACS Custom Hiring Centre (Farm Machinery Rental)',
    descTe: 'రైతులకు సబ్సిడీ రేట్లలో ట్రాక్టర్లు, కంబైన్డ్ హార్వెస్టర్లు, రొటవేటర్లు మరియు డ్రోన్ స్ప్రేయింగ్ అద్దె సదుపాయం.',
    descEn: 'Subsidized rental access to modern tractors, combine harvesters, rotavators, and agriculture drone spraying.',
    subsidyTe: 'మార్కెట్ ధర కంటే 40% తక్కువ అద్దె (ట్రాక్టర్ గంటకు ₹800 vs మార్కెట్ ₹1,400)',
    subsidyEn: '40% below market rates (Tractor @ ₹800/hr vs market ₹1,400/hr)',
    query: 'PACS కస్టమ్ హైరింగ్ సెంటర్ ద్వారా ట్రాక్టర్ మరియు హార్వెస్టర్ అద్దె నిబంధనలు మరియు బుకింగ్ ప్రక్రియ ఏమిటి?'
  },
  {
    id: 'aif',
    icon: Warehouse,
    badgeColor: 'blue',
    titleTe: 'వ్యవసాయ మౌలిక నిధి (AIF 3% వడ్డీ రాయితీ)',
    titleEn: 'Agriculture Infrastructure Fund (AIF 3% Subvention)',
    descTe: 'PACS మరియు రైతు ఉత్పత్తిదారుల సంఘాలు (FPO) గోదాములు, కోల్డ్ స్టోరేజ్ మరియు ప్రాసెసింగ్ యూనిట్లను ఏర్పాటు చేయడానికి 3% వడ్డీ రాయితీ రుణాలు.',
    descEn: 'Loans up to ₹2 Crore with 3% per annum interest subvention and CGTMSE credit guarantee for post-harvest storage.',
    subsidyTe: '₹2 కోట్ల వరకు రుణంపై 3% వడ్డీ రాయితీ + 7 సంవత్సరాల మారటోరియం',
    subsidyEn: '3% interest subvention for loans up to ₹2 Crore + 7-year repayment window',
    query: 'PACS పరిధిలో చిన్న కోల్డ్ స్టోరేజ్ లేదా గోదాము ఏర్పాటుకు AIF 3% వడ్డీ రాయితీ పథకం నిబంధనలు ఏమిటి?'
  },
  {
    id: 'kusum',
    icon: Sun,
    badgeColor: 'amber',
    titleTe: 'PM-KUSUM సోలార్ వ్యవసాయ పంపుసెట్ పథకం',
    titleEn: 'PM-KUSUM Solar Agri Pump Subsidy (Component B)',
    descTe: 'డీజిల్ లేదా కరెంట్ బిల్లుల బాధ లేకుండా పొలాల్లో 3HP నుండి 7.5HP వరకు స్టాండలోన్ సోలార్ పంపుసెట్ల ఏర్పాటు.',
    descEn: 'Installation of 3HP to 7.5HP standalone solar agricultural pumps replacing costly diesel and grid motors.',
    subsidyTe: '60% ప్రభుత్వ సబ్సిడీ (కేంద్రం 30% + రాష్ట్రం 30%), రైతు వాటా కేవలం 40%',
    subsidyEn: '60% Combined Govt Subsidy (30% Central + 30% State), Farmer share only 40%',
    query: 'PM-KUSUM పథకం ద్వారా పొలంలో సోలార్ మోటార్ పంపుసెట్ పెట్టుకోవడానికి దరఖాస్తు విధానం మరియు సబ్సిడీ ఎంత?'
  },
  {
    id: 'pmfby',
    icon: ShieldAlert,
    badgeColor: 'rose',
    titleTe: 'PMFBY పంట నష్టం 72 గంటల తక్షణ క్లెయిమ్',
    titleEn: 'PMFBY 72-Hour Crop Damage Claim Protocol',
    descTe: 'అకాల వర్షాలు, వడగండ్లు, తుపాను వల్ల పంట నష్టపోతే 72 గంటల్లో కియోస్క్ లేదా 14447 ద్వారా నేరుగా బీమా కంపెనీకి ఫిర్యాదు చేసే హక్కు.',
    descEn: 'Statutory right to report localized crop loss within 72 hours via kiosk or 14447 toll-free helpline for rapid field survey.',
    subsidyTe: 'రైతు ప్రీమియం ఖరీఫ్‌కు 2%, రబీకి 1.5% మాత్రమే. మిగతా 98% ప్రభుత్వమే భరిస్తుంది.',
    subsidyEn: 'Farmer pays nominal 2% premium for Kharif, 1.5% for Rabi; remaining 98% paid by Govt.',
    query: 'PMFBY పంట నష్టం జరిగినప్పుడు 72 గంటల వ్యవధిలో క్లెయిమ్ ఎలా నమోదు చేయాలి? సర్వే ఎలా జరుగుతుంది?'
  }
];

export default function SchemesModal({ isOpen, onClose, language = 'te', onSelectScheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl relative text-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🌾
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {language === 'te' ? 'సహకార & ప్రభుత్వ పథకాల సమాచారం' : 'PACS & Cooperative Schemes Explorer'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'te' ? 'రైతులకు వర్తించే సబ్సిడీలు, యంత్రాల అద్దె మరియు రుణాలు' : 'Official Central & State Subsidies, Machinery Rentals & Credit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {SCHEMES.map((scheme) => {
            const Icon = scheme.icon;
            const title = language === 'te' ? scheme.titleTe : scheme.titleEn;
            const desc = language === 'te' ? scheme.descTe : scheme.descEn;
            const subsidy = language === 'te' ? scheme.subsidyTe : scheme.subsidyEn;

            return (
              <div 
                key={scheme.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-slate-900 leading-snug">
                        {title}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        ✓ {subsidy}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {desc}
                </p>

                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onSelectScheme) {
                        onSelectScheme(scheme.query);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'ఈ పథకం గురించి AI ని అడగండి' : 'Ask AI About This Scheme'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
          Ministry of Cooperation • National Cooperative Database (NCD) • Govt. of India
        </div>
      </div>
    </div>
  );
}
