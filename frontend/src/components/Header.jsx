import React, { useState, useEffect } from 'react';
import { Globe, LayoutDashboard, RefreshCw, LogOut, Maximize, Minimize, BookOpen, PackageCheck, PhoneCall, CloudSun } from 'lucide-react';

const LANGUAGES = [
  { code: 'te', name: 'తెలుగు', flag: '🌾' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🌾' },
  { code: 'ta', name: 'தமிழ்', flag: '🌾' },
  { code: 'mr', name: 'मराठी', flag: '🌾' },
];

export default function Header({
  currentLanguage,
  onLanguageChange,
  activeSection,
  onOpenAdmin,
  onOpenSchemes,
  onOpenStock,
  onOpenHelplines,
  onResetChat,
  currentUser,
  onLogout,
  onBackToPortal
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const weatherTips = {
    te: '🌤️ కంది, సంగారెడ్డి: 29°C | తేమ: 74% • ఖరీఫ్ వరి నాట్లకు మొదటి దఫా యూరియా వేయడానికి అనుకూల సమయం',
    hi: '🌤️ कांडी, संगारेड्डी: 29°C | आर्द्रता: 74% • खरीफ धान में पहली यूरिया खाद की खुराक के लिए उपयुक्त मौसम',
    en: '🌤️ Kandi, Sangareddy: 29°C | 74% Humidity • Ideal weather for Kharif paddy top-dressing'
  };

  const stockBtnLabels = {
    te: 'ఎరువుల నిల్వలు',
    hi: 'खाद स्टॉक',
    en: 'Fertilizer Stock'
  };

  const helplineBtnLabels = {
    te: 'హెల్ప్‌లైన్లు',
    hi: 'हेल्पलाइन',
    en: 'Helplines'
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Weather & Agro-Advisory Banner */}
      <div className="w-full bg-[#091e3a] text-blue-100 text-[10px] sm:text-[11px] py-1 px-4 flex items-center justify-between overflow-x-auto no-scrollbar font-medium border-b border-blue-900/60">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{weatherTips[currentLanguage] || weatherTips['en']}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 shrink-0 text-[10px]">
          <span>{currentLanguage === 'te' ? 'యూరియా నిల్వ:' : (currentLanguage === 'hi' ? 'यूरिया स्टॉक:' : 'Urea Stock:')} <strong className="text-white">420 {currentLanguage === 'te' ? 'బస్తాలు' : (currentLanguage === 'hi' ? 'बोरी' : 'Bags')}</strong></span>
          <span className="text-slate-700">•</span>
          <span>{currentLanguage === 'te' ? 'టోల్-ఫ్రీ:' : 'Toll-Free:'} <strong className="text-amber-400 font-mono">1800-180-1551</strong></span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Area */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-amber-300 flex items-center justify-center text-base sm:text-lg font-bold shadow-md shrink-0 border border-blue-600/50">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {currentLanguage === 'en' ? 'Raithu Velugu' : (currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-950 text-[10px] font-bold border border-blue-200/70">
                PACS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
              {currentUser?.pacs_name || 'Kandi PACS'} • {currentUser?.district || 'Sangareddy'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Fertilizer Stock Board Quick Button */}
          {onOpenStock && (
            <button
              onClick={onOpenStock}
              className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200/80 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={stockBtnLabels[currentLanguage] || stockBtnLabels['en']}
            >
              <PackageCheck className="w-3.5 h-3.5 text-blue-800" />
              <span className="hidden md:inline">{stockBtnLabels[currentLanguage] || stockBtnLabels['en']}</span>
            </button>
          )}

          {/* Emergency Helplines Quick Button */}
          {onOpenHelplines && (
            <button
              onClick={onOpenHelplines}
              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={helplineBtnLabels[currentLanguage] || helplineBtnLabels['en']}
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">{helplineBtnLabels[currentLanguage] || helplineBtnLabels['en']}</span>
            </button>
          )}

          {/* Back to Portal Button */}
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="px-2.5 py-1 rounded-lg bg-blue-800 hover:bg-blue-900 text-white border border-blue-700/60 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
              title="Return to Website Portal"
            >
              <span>← {currentLanguage === 'te' ? 'పోర్టల్' : (currentLanguage === 'hi' ? 'पोर्टल' : 'Portal')}</span>
            </button>
          )}

          {/* Language Selector Pill */}
          <div className="relative flex items-center">
            <Globe className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-7 pr-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border-0 cursor-pointer transition-all"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fullscreen Kiosk Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen Kiosk' : 'Enter Full Screen Kiosk Mode'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-800" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Reset Chat (only on chat section) */}
          {activeSection === 'chat' && (
            <button
              onClick={onResetChat}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Cooperative Schemes Explorer */}
          {onOpenSchemes && (
            <button
              onClick={onOpenSchemes}
              className="p-1.5 rounded-lg text-blue-900 hover:text-blue-950 hover:bg-blue-50 transition-colors cursor-pointer"
              title="PACS Schemes Explorer"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* Audit Portal icon */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Open PACS Audit Portal"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
