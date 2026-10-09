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

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Ministry & Tricolor Strip */}
      <div className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              {currentLanguage === 'te' 
                ? 'భారత ప్రభుత్వ సహకార మంత్రిత్వ శాఖ • PACS డిజిటల్ పరివర్తన కార్యక్రమం'
                : (currentLanguage === 'hi' 
                    ? 'सहकारिता मंत्रालय, भारत सरकार • पैक्स डिजिटलीकरण मिशन' 
                    : 'Ministry of Cooperation, Govt. of India • PACS Digital Transformation')}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-100 text-[11px]">
            <span>సహకార సంఘం: <strong>కంది PACS (సంగారెడ్డి)</strong></span>
            <span>•</span>
            <span>టోల్-ఫ్రీ: <strong>1800-180-1551</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {currentLanguage === 'en' ? 'Raithu Velugu' : (currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-300">
                  PACS AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {currentLanguage === 'te'
                  ? 'సహకార పరపతి సంఘాల ప్రజా సేవా కియోస్క్'
                  : (currentLanguage === 'hi' 
                      ? 'प्राथमिक कृषि ऋण समिति जन सेवा कियोस्क' 
                      : 'Public Service Voice Kiosk for PACS')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'home' 
                  ? 'bg-emerald-50 text-emerald-900 font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'about' 
                  ? 'bg-emerald-50 text-emerald-900 font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.about}
            </button>
            <button
              onClick={() => handleNavClick('schemes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'schemes' 
                  ? 'bg-emerald-50 text-emerald-900 font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.schemes}
            </button>
            <button
              onClick={() => handleNavClick('grievances')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'grievances' 
                  ? 'bg-emerald-50 text-emerald-900 font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.grievances}
            </button>
            <button
              onClick={onOpenStock}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.stock}</span>
            </button>
            <button
              onClick={onOpenHelplines}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.helpline}</span>
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="pl-7 pr-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-0 cursor-pointer transition-all"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Standout Primary CTA Button: Launch Kiosk Prototype / Chatbot */}
            <button
              onClick={onLaunchKiosk}
              className="relative group px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 border border-emerald-500/30"
            >
              <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] uppercase tracking-wider shadow-xs animate-bounce">
                LIVE
              </span>
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-200 shrink-0" />
              <span>{t.launchKiosk}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
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
