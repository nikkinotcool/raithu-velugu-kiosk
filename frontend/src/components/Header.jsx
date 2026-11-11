import React, { useState, useEffect } from 'react';
import { Globe, LayoutDashboard, RefreshCw, LogOut, Maximize, Minimize, BookOpen, PackageCheck, PhoneCall } from 'lucide-react';

const LANGUAGES = [
  { code: 'te', name: 'తెలుగు' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'mr', name: 'मराठी' },
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

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
      {/* Slim info bar */}
      <div className="w-full bg-[#052e1a] text-emerald-200/80 text-[10px] py-1 px-4 flex items-center justify-between overflow-x-hidden">
        <span className="font-medium truncate">
          {currentLanguage === 'te'
            ? '🌤️ కంది, సంగారెడ్డి • 29°C • ఖరీఫ్ నాట్లకు యూరియా వేయుటకు అనుకూల సమయం'
            : currentLanguage === 'hi'
            ? '🌤️ कांडी, संगारेड्डी • 29°C • खरीफ में पहली यूरिया की खुराक का सही समय'
            : '🌤️ Kandi, Sangareddy • 29°C • Ideal weather for Kharif paddy top-dressing'}
        </span>
        <span className="hidden sm:block font-mono text-amber-400 ml-4 shrink-0">1800-180-1551</span>
      </div>

      {/* Main header row */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">

        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            🌾
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                {currentLanguage === 'en' ? 'Raithu Velugu' : currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు'}
              </span>
              <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                PACS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              {currentUser?.pacs_name || 'Kandi PACS'} · {currentUser?.district || 'Sangareddy'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">

          {onOpenStock && (
            <button
              onClick={onOpenStock}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 text-xs font-semibold transition-all cursor-pointer"
              title="Fertilizer Stock"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {currentLanguage === 'te' ? 'ఎరువులు' : currentLanguage === 'hi' ? 'खाद' : 'Stock'}
              </span>
            </button>
          )}

          {onOpenHelplines && (
            <button
              onClick={onOpenHelplines}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-100 text-xs font-semibold transition-all cursor-pointer"
              title="Helplines"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </button>
          )}

          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>← {currentLanguage === 'te' ? 'పోర్టల్' : currentLanguage === 'hi' ? 'पोर्टल' : 'Portal'}</span>
            </button>
          )}

          {/* Language selector */}
          <div className="relative">
            <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-6 pr-2 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-0 cursor-pointer transition-all appearance-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Kiosk'}
          >
            {isFullscreen
              ? <Minimize className="w-4 h-4" />
              : <Maximize className="w-4 h-4" />
            }
          </button>

          {/* Reset chat */}
          {activeSection === 'chat' && (
            <button
              onClick={onResetChat}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title="New Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Schemes */}
          {onOpenSchemes && (
            <button
              onClick={onOpenSchemes}
              className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
              title="PACS Schemes"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* Admin */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Admin Portal"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>

          {/* Logout */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
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
