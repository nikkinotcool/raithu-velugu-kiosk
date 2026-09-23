import React, { useState, useEffect } from 'react';
import { Globe, LayoutDashboard, RefreshCw, LogOut, User, Maximize, Minimize, BookOpen } from 'lucide-react';

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
  onResetChat,
  currentUser,
  onLogout
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
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-2xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Area */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-xs">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {currentLanguage === 'en' ? 'Raithu Velugu' : (currentLanguage === 'hi' ? 'रैतु वेलुगु' : (currentLanguage === 'kn' ? 'ರೈತು ವೆಲುಗು' : (currentLanguage === 'ta' ? 'ரைது வெலுகு' : 'రైతు వెలుగు')))}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/60">
                PACS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
              {currentUser?.pacs_name || 'Kandi PACS'} • {currentUser?.district || 'Sangareddy'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
            {isFullscreen ? <Minimize className="w-4 h-4 text-emerald-700" /> : <Maximize className="w-4 h-4" />}
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
              className="p-1.5 rounded-lg text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 transition-colors cursor-pointer"
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
