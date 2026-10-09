import React, { useState } from 'react';
import { Globe, Bot, Sparkles, Menu, X, ArrowRight, ShieldCheck, PhoneCall, PackageCheck, BookOpen, UserCheck } from 'lucide-react';

const LANGUAGES = [
  { code: 'te', name: 'తెలుగు', flag: '🌾' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🌾' },
  { code: 'ta', name: 'தமிழ்', flag: '🌾' },
  { code: 'mr', name: 'मराठी', flag: '🌾' },
];

const NAV_TEXT = {
  te: {
    home: 'హోమ్',
    about: 'సంఘం గురించి',
    schemes: 'పథకాలు & చట్టం',
    grievances: 'ఫిర్యాదుల విభాగం',
    stock: 'ఎరువుల నిల్వలు',
    helpline: 'హెల్ప్‌లైన్లు',
    launchKiosk: 'టాక్ టు రైతు వెలుగు',
    prototypeBadge: 'AI కియోస్క్',
    login: 'రైతు లాగిన్'
  },
  hi: {
    home: 'होम',
    about: 'समिति परिचय',
    schemes: 'योजनाएं व नियम',
    grievances: 'शिकायत निवारण',
    stock: 'खाद स्टॉक',
    helpline: 'हेल्पलाइन',
    launchKiosk: 'रैतु वेलुगु से बात करें',
    prototypeBadge: 'AI कियोस्क',
    login: 'किसान लॉगिन'
  },
  en: {
    home: 'Home',
    about: 'About PACS',
    schemes: 'Schemes & Law',
    grievances: 'Grievance Redressal',
    stock: 'Fertilizer Stock',
    helpline: 'Helplines',
    launchKiosk: 'Talk to Raithu Velugu',
    prototypeBadge: 'AI Kiosk Prototype',
    login: 'Farmer Login'
  }
};

const TOP_STRIP = {
  te: {
    ministry: 'భారత ప్రభుత్వ సహకార మంత్రిత్వ శాఖ • PACS డిజిటల్ పరివర్తన కార్యక్రమం',
    societyLabel: 'సహకార సంఘం:',
    societyName: 'కంది PACS (సంగారెడ్డి)',
    tollFreeLabel: 'టోల్-ఫ్రీ:'
  },
  hi: {
    ministry: 'सहकारिता मंत्रालय, भारत सरकार • पैक्स डिजिटलीकरण मिशन',
    societyLabel: 'सहकारी समिति:',
    societyName: 'कंडी पैक्स (संगारेड्डी)',
    tollFreeLabel: 'टोल-फ्री:'
  },
  en: {
    ministry: 'Ministry of Cooperation, Govt. of India • PACS Digital Transformation Mission',
    societyLabel: 'Cooperative Society:',
    societyName: 'Kandi PACS (Sangareddy)',
    tollFreeLabel: 'Toll-Free:'
  }
};

export default function PortalNavbar({
  currentLanguage,
  onLanguageChange,
  currentPage,
  onNavigate,
  onLaunchKiosk,
  onOpenStock,
  onOpenHelplines
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = NAV_TEXT[currentLanguage] || NAV_TEXT['en'];
  const topInfo = TOP_STRIP[currentLanguage] || TOP_STRIP['en'];

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Ministry & Statutory Strip */}
      <div className="w-full bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="tracking-wide">
              {topInfo.ministry}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300 text-[11px]">
            <span>{topInfo.societyLabel} <strong className="text-white font-semibold">{topInfo.societyName}</strong></span>
            <span className="text-slate-600">•</span>
            <span>{topInfo.tollFreeLabel} <strong className="text-emerald-400 font-semibold font-mono">1800-180-1551</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center text-xl shadow-xs group-hover:bg-emerald-800 transition-colors">
              🌾
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {currentLanguage === 'en' ? 'Raithu Velugu' : (currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు')}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-200">
                  DPI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {currentLanguage === 'te'
                  ? 'సహకార పరపతి సంఘాల ప్రజా సేవా కియోస్క్'
                  : (currentLanguage === 'hi' 
                      ? 'प्राथमिक कृषि ऋण समिति जन सेवा किయోस्क' 
                      : 'PACS Public Service Voice AI Kiosk')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'home' 
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'about' 
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick('schemes')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'schemes' 
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t.schemes}
            </button>
            <button
              onClick={() => handleNavClick('grievances')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'grievances' 
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {t.grievances}
            </button>
            <button
              onClick={onOpenStock}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.stock}</span>
            </button>
            <button
              onClick={onOpenHelplines}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.helpline}</span>
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="pl-7 pr-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:border-emerald-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Standout Primary CTA Button: Launch Kiosk / Voice Assistant */}
            <button
              onClick={onLaunchKiosk}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2 border border-emerald-600/50"
            >
              <Bot className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{t.launchKiosk}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'home' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'about' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            {t.about}
          </button>
          <button
            onClick={() => handleNavClick('schemes')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'schemes' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            {t.schemes}
          </button>
          <button
            onClick={() => handleNavClick('grievances')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'grievances' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            {t.grievances}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStock();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <PackageCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.stock}</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHelplines();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-700" />
            <span>{t.helpline}</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchKiosk();
              }}
              className="w-full py-3 rounded-xl bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Bot className="w-4 h-4" />
              <span>{t.launchKiosk}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
