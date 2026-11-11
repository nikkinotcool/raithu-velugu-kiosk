import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, MoreHorizontal, RefreshCw, LogOut, Maximize, Minimize, 
  BookOpen, PackageCheck, PhoneCall, ChevronLeft 
} from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setMenuOpen(false);
  };

  const getLangName = (code) => {
    const found = LANGUAGES.find((l) => l.code === code);
    return found ? found.name : 'English';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-2xs">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Left: Back to Portal button + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-0.5 text-emerald-800 hover:text-emerald-950 font-semibold text-sm transition-all cursor-pointer active:scale-95 shrink-0 pr-1.5"
              aria-label="Back to Portal"
            >
              <ChevronLeft className="w-5 h-5 -ml-1 text-emerald-700" />
              <span className="hidden sm:inline">Portal</span>
            </button>
          )}

          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-base font-bold shrink-0 shadow-2xs">
            🌾
          </div>

          <div className="min-w-0">
            <h1 className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight truncate">
              {currentLanguage === 'en' ? 'Raithu Velugu' : currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు'}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentUser?.pacs_name || 'Kandi PACS'}</span>
            </p>
          </div>
        </div>

        {/* Right: Only 2 clean iOS controls (Language selector + More Menu) */}
        <div className="flex items-center gap-2 shrink-0">

          {/* iOS Style Language Pill */}
          <div className="relative">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border-0 cursor-pointer transition-all appearance-none active:scale-95"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* iOS More Actions Menu Button (...) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                menuOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="More Actions"
              aria-label="More Actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* iOS Style Dropdown Menu Card */}
            {menuOpen && (
              <div className="absolute right-0 top-11 w-56 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">

                {/* Reset Chat */}
                {activeSection === 'chat' && onResetChat && (
                  <button
                    onClick={() => { onResetChat(); setMenuOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>{currentLanguage === 'te' ? 'కొత్త సంభాషణ' : 'New Conversation'}</span>
                  </button>
                )}

                {/* Fertilizer Stock */}
                {onOpenStock && (
                  <button
                    onClick={() => { onOpenStock(); setMenuOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                    <span>{currentLanguage === 'te' ? 'ఎరువుల స్టాక్ బోర్డు' : 'Fertilizer Stock'}</span>
                  </button>
                )}

                {/* Emergency Helplines */}
                {onOpenHelplines && (
                  <button
                    onClick={() => { onOpenHelplines(); setMenuOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-600" />
                    <span>{currentLanguage === 'te' ? 'హెల్ప్‌లైన్లు (Toll-Free)' : 'Helplines'}</span>
                  </button>
                )}

                {/* PACS Schemes */}
                {onOpenSchemes && (
                  <button
                    onClick={() => { onOpenSchemes(); setMenuOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>{currentLanguage === 'te' ? 'సహకార పథకాలు' : 'Cooperative Schemes'}</span>
                  </button>
                )}

                {/* Fullscreen Kiosk Mode */}
                <button
                  onClick={toggleFullscreen}
                  className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-4 h-4 text-slate-500" />
                      <span>Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-4 h-4 text-slate-500" />
                      <span>Fullscreen Kiosk</span>
                    </>
                  )}
                </button>

                {/* Logout / Sign Out */}
                {currentUser && onLogout && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
