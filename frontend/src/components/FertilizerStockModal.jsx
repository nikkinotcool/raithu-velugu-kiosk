import React, { useState, useEffect } from 'react';
import { X, PackageCheck, AlertCircle, Volume2, Sparkles, TrendingDown, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchWithCloudFallback } from '../utils/apiClient';

const LABELS = {
  te: {
    title: 'PACS ఎరువులు & విత్తనాల నిల్వల బోర్డు',
    subtitle: 'లైవ్ నిల్వలు మరియు ప్రభుత్వ రాయితీ ధరల వివరాలు',
    totalStock: 'మొత్తం అందుబాటులో ఉన్న బస్తాలు',
    nextRake: 'తదుపరి ఎరువుల వ్యాగన్ రాక',
    inStock: 'నిల్వ ఉంది',
    limited: 'పరిమిత నిల్వ',
    govtPrice: 'ప్రభుత్వ రాయితీ ధర',
    marketPrice: 'మార్కెట్ ధర',
    savings: 'రైతుకు ఆదా',
    quota: 'రైతు కోటా అర్హత',
    filterAll: 'అన్నీ',
    filterFertilizer: 'రసాయన ఎరువులు',
    filterSeeds: 'ధృవీకరించిన విత్తనాలు',
    quotaCalculator: 'మీ భూమికి ఎరువుల కోటా లెక్కింపు',
    acres: 'ఎకరాలు',
    entitledUrea: 'యూరియా కోటా',
    entitledDAP: 'డీఏపీ కోటా',
    listen: '🔊 స్టాక్ వివరాలు వినండి',
    speaking: 'చదువుతోంది...',
    bags: 'బస్తాలు',
    perBag: '/ బస్తా'
  },
  hi: {
    title: 'पैक्स खाद एवं बीज स्टॉक बोर्ड',
    subtitle: 'सजीव स्टॉक एवं सरकारी सब्सिडी मूल्य विवरण',
    totalStock: 'कुल उपलब्ध बोरियां',
    nextRake: 'अगली खाद रैक आगमन',
    inStock: 'स्टॉक में उपलब्ध',
    limited: 'सीमित स्टॉक',
    govtPrice: 'सरकारी सब्सिडी दर',
    marketPrice: 'बाजार भाव',
    savings: 'किसान की बचत',
    quota: 'किसान कोटा पात्रता',
    filterAll: 'सभी',
    filterFertilizer: 'उर्वरक (खाद)',
    filterSeeds: 'प्रमाणित बीज',
    quotaCalculator: 'आपकी भूमि के अनुसार खाद कोटा कैलकुलेटर',
    acres: 'एकड़',
    entitledUrea: 'यूरिया कोटा',
    entitledDAP: 'डीएपी कोटा',
    listen: '🔊 स्टॉक विवरण सुनें',
    speaking: 'सुनाया जा रहा है...',
    bags: 'बोरी',
    perBag: '/ बोरी'
  },
  en: {
    title: 'PACS Fertilizer & Seed Stock Board',
    subtitle: 'Live Inventory & Government Subsidized Pricing',
    totalStock: 'Total Bags in Stock',
    nextRake: 'Next Rake Arrival',
    inStock: 'In Stock',
    limited: 'Limited Stock',
    govtPrice: 'Govt Subsidized Rate',
    marketPrice: 'Open Market MRP',
    savings: 'Farmer Subsidy Savings',
    quota: 'Quota Entitlement',
    filterAll: 'All Items',
    filterFertilizer: 'Fertilizers',
    filterSeeds: 'Certified Seeds',
    quotaCalculator: 'Your Landholding Fertilizer Quota Calculator',
    acres: 'Acres',
    entitledUrea: 'Urea Entitlement',
    entitledDAP: 'DAP Entitlement',
    listen: '🔊 Listen to Stock Report',
    speaking: 'Speaking...',
    bags: 'Bags',
    perBag: '/ bag'
  }
};

export default function FertilizerStockModal({ isOpen, onClose, language = 'te', apiBase, currentUser }) {
  const [filter, setFilter] = useState('all');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [landAcres, setLandAcres] = useState(currentUser?.land_acres || 3.0);

  const t = LABELS[language] || LABELS['en'];

  useEffect(() => {
    if (!isOpen) return;
    const fetchStock = async () => {
      setLoading(true);
      try {
        const res = await fetchWithCloudFallback('/stock', {}, apiBase);
        if (res.ok) {
          const data = await res.json();
          setStockData(data);
        }
      } catch (err) {
        console.error('Failed to load stock data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [isOpen, apiBase]);

  if (!isOpen) return null;

  const items = stockData?.items || [
    {
      id: 'urea',
      name_en: 'Neem Coated Urea (45 kg)',
      name_te: 'వేప పూత పూసిన యూరియా (45 కేజీల బస్తా)',
      name_hi: 'नीम लेपित यूरिया (45 किग्रा बोरी)',
      category: 'Nitrogenous (N)',
      stock_bags: 420,
      govt_rate: 266.5,
      market_rate: 2450.0,
      subsidy_per_bag: 2183.5,
      status: 'In Stock',
      quota_rule_te: 'ఎకరానికి 2 బస్తాలు (ఖరీఫ్ వరి/పత్తి)',
      quota_rule_en: '2 bags per acre (Kharif)'
    },
    {
      id: 'dap',
      name_en: 'DAP 18:46:0 (50 kg)',
      name_te: 'డీఏపీ 18:46:0 (50 కేజీల బస్తా)',
      name_hi: 'डीएपी 18:46:0 (50 किग्रा बोरी)',
      category: 'Phosphatic (P)',
      stock_bags: 180,
      govt_rate: 1350.0,
      market_rate: 4100.0,
      subsidy_per_bag: 2750.0,
      status: 'In Stock',
      quota_rule_te: 'ఎకరానికి 1 బస్తా నాట్లు వేసే సమయంలో',
      quota_rule_en: '1 bag per acre as basal dose'
    },
    {
      id: 'mop',
      name_en: 'MOP - Muriate of Potash (50 kg)',
      name_te: 'ఎంఓపీ - పొటాష్ ఎరువు (50 కేజీల బస్తా)',
      name_hi: 'एमओपी - पोटाश खाद (50 किग्रा बोरी)',
      category: 'Potassic (K)',
      stock_bags: 95,
      govt_rate: 1655.0,
      market_rate: 2800.0,
      subsidy_per_bag: 1145.0,
      status: 'Limited Stock',
      quota_rule_te: '2 ఎకరాలకు 1 బస్తా',
      quota_rule_en: '1 bag per 2 acres'
    },
    {
      id: 'complex',
      name_en: 'NPK Complex 20:20:0:13 (50 kg)',
      name_te: 'కాంప్లెక్స్ ఎరువు 20:20:0:13 (50 కేజీలు)',
      name_hi: 'एनपीके कॉम्प्लेक्स 20:20:0:13 (50 किग्रा)',
      category: 'Complex (NPKS)',
      stock_bags: 210,
      govt_rate: 1200.0,
      market_rate: 1950.0,
      subsidy_per_bag: 750.0,
      status: 'In Stock',
      quota_rule_te: 'ఎకరానికి 1.5 బస్తాలు',
      quota_rule_en: '1.5 bags per acre'
    },
    {
      id: 'paddy_seed',
      name_en: 'Certified Paddy Seeds (Telangana Sona)',
      name_te: 'ధృవీకరించిన తెలంగాణ సోనా వరి విత్తనాలు (30 కేజీలు)',
      name_hi: 'प्रमाणित धान बीज (तेलंगाना सोना RNR 15048)',
      category: 'Certified Seeds',
      stock_bags: 140,
      govt_rate: 1150.0,
      market_rate: 1750.0,
      subsidy_per_bag: 600.0,
      status: 'In Stock',
      quota_rule_te: 'ఎకరానికి 30 కేజీల బస్తా (>92% మొలక శాతం)',
      quota_rule_en: '30 kg bag per acre (>92% germination)'
    }
  ];

  const filteredItems = items.filter(item => {
    if (filter === 'fertilizer') return item.category !== 'Certified Seeds';
    if (filter === 'seeds') return item.category === 'Certified Seeds';
    return true;
  });

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    let textToSpeak = '';
    if (language === 'te') {
      textToSpeak = `కంది ప్రాథమిక వ్యవసాయ సహకార సంఘంలో ప్రస్తుతం 420 బస్తాల వేప పూత పూసిన యూరియా అందుబాటులో ఉంది. ప్రభుత్వ రాయితీ ధర బస్తాకు 266 రూపాయల 50 పైసలు. డీఏపీ 180 బస్తాలు నిల్వ ఉంది, ధర 1350 రూపాయలు. తదుపరి ఎరువుల వ్యాగన్ సెప్టెంబర్ 29 న వస్తుంది.`;
    } else if (language === 'hi') {
      textToSpeak = `कांडी पैक्स समिति में वर्तमान में 420 बोरी नीम लेपित यूरिया उपलब्ध है। सरकारी सब्सिडी दर 266 रुपये 50 पैसे प्रति बोरी है। डीएपी 180 बोरी उपलब्ध है, मूल्य 1350 रुपये है।`;
    } else {
      textToSpeak = `At Kandi PACS, 420 bags of Neem Coated Urea are currently in stock at the subsidized price of rupees 266.50 per bag. 180 bags of DAP are in stock at 1350 rupees. Next rake arrival is tomorrow.`;
    }

    try {
      const res = await fetchWithCloudFallback('/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, language: language })
      }, apiBase);

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        // Fallback to browser SpeechSynthesis
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.lang = language === 'te' ? 'te-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl relative text-slate-900 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-950 border border-blue-200">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {stockData?.pacs_name || 'Kandi PACS, Sangareddy'} • {t.subtitle}
            </p>
          </div>
        </div>

        {/* Live Status Highlights Bar */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="text-[11px] font-semibold text-blue-950 uppercase tracking-wider">{t.totalStock}</div>
            <div className="text-2xl font-black text-slate-950 mt-0.5">
              {stockData?.total_bags_available || 1130} <span className="text-xs font-semibold text-slate-600">{t.bags}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-700" />
              {t.nextRake}
            </div>
            <div className="text-xs font-bold text-amber-950 mt-1 line-clamp-2">
              {stockData?.next_rake_arrival || '29 Sep 2026 (IFFCO Sangareddy Hub)'}
            </div>
          </div>
        </div>

        {/* Audio TTS Button & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'all' ? 'bg-blue-800 text-white shadow-xs border border-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilter('fertilizer')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'fertilizer' ? 'bg-blue-800 text-white shadow-xs border border-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.filterFertilizer}
            </button>
            <button
              onClick={() => setFilter('seeds')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'seeds' ? 'bg-blue-800 text-white shadow-xs border border-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.filterSeeds}
            </button>
          </div>

          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-blue-700' : 'text-blue-800'}`} />
            <span>{isSpeaking ? t.speaking : t.listen}</span>
          </button>
        </div>

        {/* Stock Items Cards */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const itemName = language === 'te' ? item.name_te : (language === 'hi' ? item.name_hi : item.name_en);
            const quotaRule = language === 'te' ? item.quota_rule_te : item.quota_rule_en;
            const isLimited = item.status === 'Limited Stock';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{itemName}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 border ${
                    isLimited
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-blue-100 text-blue-950 border-blue-300'
                  }`}>
                    {item.stock_bags} {t.bags} ({isLimited ? t.limited : t.inStock})
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-center">
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 block">{t.govtPrice}</span>
                    <span className="text-sm font-black text-blue-950">₹{item.govt_rate.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 block">{t.marketPrice}</span>
                    <span className="text-xs font-semibold text-slate-400 line-through">₹{item.market_rate.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-950 block">{t.savings}</span>
                    <span className="text-xs font-black text-amber-950">₹{item.subsidy_per_bag.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                  <span><strong>{t.quota}:</strong> {quotaRule}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Personalized Entitlement Box */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#102e54] to-[#184275] text-white shadow-md border border-blue-800/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              {t.quotaCalculator}
            </span>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {landAcres} {t.acres}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[11px] text-slate-200 block">{t.entitledUrea}</span>
              <span className="text-base font-extrabold text-white">
                {Math.round(landAcres * 2)} {t.bags} (₹{(Math.round(landAcres * 2) * 266.5).toFixed(0)})
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[11px] text-slate-200 block">{t.entitledDAP}</span>
              <span className="text-base font-extrabold text-white">
                {Math.round(landAcres * 1)} {t.bags} (₹{(Math.round(landAcres * 1) * 1350).toFixed(0)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
