import React, { useState, useEffect } from 'react';
import { X, PhoneCall, ShieldAlert, Copy, Check, Clock, ExternalLink, Building2, User } from 'lucide-react';
import { fetchWithCloudFallback } from '../utils/apiClient';

const LABELS = {
  te: {
    title: 'రైతు అత్యవసర హెల్ప్‌లైన్లు & అధికారిక పరిచయాలు',
    subtitle: 'సహకార సంఘాలు, పంట బీమా మరియు చట్టపరమైన సంప్రదింపు నంబర్లు',
    callNow: 'కాల్ చేయండి',
    copied: 'కాపీ చేయబడింది!',
    copyNumber: 'నెంబర్ కాపీ',
    hours: 'పని వేళలు',
    tollFree: 'ఉచిత కాల్ (Toll-Free)',
    directLine: 'డైరెక్ట్ లైన్'
  },
  hi: {
    title: 'किसान आपातकालीन हेल्पलाइन एवं आधिकारिक संपर्क',
    subtitle: 'सहकारी समितियां, फसल बीमा एवं विधिक सहायता नंबर',
    callNow: 'कॉल करें',
    copied: 'कॉपी हो गया!',
    copyNumber: 'नंबर कॉपी करें',
    hours: 'कार्य समय',
    tollFree: 'टोल-फ्री',
    directLine: 'सीधी लाइन'
  },
  en: {
    title: 'Emergency Farmer Helplines & Authority Directory',
    subtitle: 'Verified Cooperative, Crop Insurance & Legal Contacts',
    callNow: 'Call Now',
    copied: 'Copied!',
    copyNumber: 'Copy Number',
    hours: 'Hours',
    tollFree: 'Toll-Free',
    directLine: 'Direct Line'
  }
};

export default function HelplineModal({ isOpen, onClose, language = 'te', apiBase }) {
  const [copiedId, setCopiedId] = useState(null);
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = LABELS[language] || LABELS['en'];

  const DEFAULT_HELPLINES = [
    {
      id: 'kcc',
      title_en: 'Kisan Call Centre (KCC)',
      title_te: 'కిసాన్ కాల్ సెంటర్ (జాతీయ హెల్ప్‌లైన్)',
      title_hi: 'किसान कॉल सेंटर (राष्ट्रीय हेल्पलाइन)',
      number: '1800-180-1551',
      category: 'Agricultural Advisory',
      description_en: 'Toll-free agricultural expertise, pest advisories, and weather guidance in 22 regional languages.',
      description_te: 'వ్యవసాయ సలహాలు, తెగుళ్ల నివారణ మరియు వాతావరణ సమాచారం కోసం ఉచిత జాతీయ కాల్ సెంటర్.',
      operational_hours: '6:00 AM - 10:00 PM (All 7 Days)',
      toll_free: true
    },
    {
      id: 'pmfby',
      title_en: 'PMFBY Crop Loss 72-Hour Claim Desk',
      title_te: 'PMFBY పంట నష్టం 72 గంటల క్లెయిమ్ డెస్క్',
      title_hi: 'पीएमएफबीवाई फसल नुकसान 72 घंटे दावा डेस्क',
      number: '14447',
      category: 'Crop Insurance',
      description_en: 'Mandatory 72-hour localized crop loss reporting desk for hail, inundation, or storm damage.',
      description_te: 'అకాల వర్షాలు, వరదల వల్ల పంట నష్టం జరిగితే 72 గంటల్లో ఉచితంగా సమాచారం ఇచ్చే డెస్క్.',
      operational_hours: '24x7 Toll-Free',
      toll_free: true
    },
    {
      id: 'arcs_srd',
      title_en: 'Sangareddy District ARCS Office',
      title_te: 'సంగారెడ్డి జిల్లా సహకార సంఘాల ఉప-రిజిస్ట్రార్ (ARCS)',
      title_hi: 'संगारेड्डी जिला सहायक रजिस्ट्रार सहकारी समितियां (ARCS)',
      number: '08455-276342',
      category: 'Cooperative Governance',
      description_en: 'Statutory appellate authority for PACS by-law violations, member voting disputes, and audits.',
      description_te: 'PACS సొసైటీ ఉప-నిబంధనల ఉల్లంఘన, ఎన్నికల వివాదాలు మరియు అవినీతిపై చట్టపరమైన విచారణ అధికారి.',
      operational_hours: '10:30 AM - 5:00 PM (Mon-Sat)',
      toll_free: false
    },
    {
      id: 'dccb_mgr',
      title_en: 'DCCB Sangareddy Branch Manager',
      title_te: 'డీసీసీబీ (DCCB) సంగారెడ్డి బ్రాంచ్ మేనేజర్',
      title_hi: 'डीसीसीबी संगारेड्डी शाखा प्रबंधक',
      number: '08455-272188',
      category: 'Crop Loans & Subsidy',
      description_en: 'Apex cooperative bank manager for 4% crop loan scale of finance and interest subsidy release.',
      description_te: '4% పంట రుణాలు, స్కేల్ ఆఫ్ ఫైనాన్స్ మరియు వడ్డీ రాయితీ విడుదలకు సంబంధించి అధికారిక సంప్రదింపులు.',
      operational_hours: '10:00 AM - 4:00 PM (Banking Days)',
      toll_free: false
    },
    {
      id: 'aeo_kandi',
      title_en: 'Kandi Village Agricultural Extension Officer (AEO)',
      title_te: 'కంది గ్రామ వ్యవసాయ విస్తరణ అధికారి (AEO)',
      title_hi: 'कांडी ग्राम कृषि विस्तार अधिकारी (AEO)',
      number: '+91 94409 01824',
      category: 'Field Survey & E-Crop Booking',
      description_en: 'Local village officer for field verification, crop damage panchnama, and Rythu Bharosa verification.',
      description_te: 'గ్రామ స్థాయిలో పంట నష్టం పంచనామా, ఈ-పంట నమోదు మరియు రైతు భరోసా ధృవీకరణ అధికారి.',
      operational_hours: '9:00 AM - 6:00 PM',
      toll_free: false
    },
    {
      id: 'cyber_fraud',
      title_en: 'National Cyber & Banking Fraud Reporting',
      title_te: 'జాతీయ సైబర్ & బ్యాంకింగ్ మోసాల హెల్ప్‌లైన్',
      title_hi: 'राष्ट्रीय साइबर एवं बैंकिंग धोखाधड़ी हेल्पलाइन',
      number: '1930',
      category: 'Financial Security',
      description_en: 'Immediate reporting of unauthorized cooperative bank OTP deductions, fake loan calls, or ATM skimming.',
      description_te: 'బ్యాంక్ ఖాతా నుండి అనధికారిక లావాదేవీలు లేదా ఓటీపీ మోసాలు జరిగితే తక్షణమే కాల్ చేయవలసిన నంబర్.',
      operational_hours: '24x7 Emergency',
      toll_free: true
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const fetchHelplines = async () => {
      setLoading(true);
      try {
        const res = await fetchWithCloudFallback('/helplines', {}, apiBase);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setHelplines(data);
          } else {
            setHelplines(DEFAULT_HELPLINES);
          }
        } else {
          setHelplines(DEFAULT_HELPLINES);
        }
      } catch {
        setHelplines(DEFAULT_HELPLINES);
      } finally {
        setLoading(false);
      }
    };
    fetchHelplines();
  }, [isOpen, apiBase]);

  if (!isOpen) return null;

  const handleCopy = (id, num) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const list = helplines.length > 0 ? helplines : DEFAULT_HELPLINES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl relative text-slate-900 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Helplines List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {list.map((item) => {
            const title = language === 'te' ? item.title_te : (language === 'hi' ? item.title_hi : item.title_en);
            const desc = language === 'te' ? item.description_te : item.description_en;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                    item.toll_free
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {item.toll_free ? t.tollFree : t.directLine}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {desc}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.operational_hours}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.id, item.number)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title={t.copyNumber}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span className="text-emerald-800">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>{t.copyNumber}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`tel:${item.number.replace(/\s+/g, '')}`}
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm border border-emerald-600/50 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{item.number}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
