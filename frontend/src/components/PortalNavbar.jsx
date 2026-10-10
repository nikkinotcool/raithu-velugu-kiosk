import React, { useState } from 'react';
import { Bot, Menu, X, ArrowRight, PhoneCall, PackageCheck } from 'lucide-react';

export default function PortalNavbar({
  currentPage,
  onNavigate,
  onLaunchKiosk,
  onOpenStock,
  onOpenHelplines
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Sovereign Ministry & Authority Strip */}
      <div className="w-full bg-gradient-to-r from-[#063323] via-[#083c2a] to-[#04281b] text-emerald-100 text-[11px] py-1.5 px-4 font-medium border-b border-emerald-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="tracking-wide text-slate-200 font-medium">
              Ministry of Cooperation, Govt. of India • PACS Digital Transformation Mission
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Cooperative Society: <strong className="text-white font-semibold">Kandi PACS (Sangareddy)</strong></span>
            <span className="text-slate-700">•</span>
            <span>National Kisan Toll-Free: <strong className="text-amber-400 font-mono font-semibold">1800-180-1551</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-amber-300 flex items-center justify-center text-xl shadow-md shadow-emerald-900/20 border border-emerald-500/50 group-hover:border-emerald-400 transition-colors">
              🌾
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  Raithu Velugu
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 text-[10px] font-bold uppercase border border-emerald-200/80">
                  NATIONAL DPI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                PACS Digital Public Infrastructure • Voice AI Kiosk
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'home' 
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'about' 
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              About PACS
            </button>
            <button
              onClick={() => handleNavClick('schemes')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'schemes' 
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Schemes & Law
            </button>
            <button
              onClick={() => handleNavClick('grievances')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'grievances' 
                  ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Grievance Redressal
            </button>
            <button
              onClick={onOpenStock}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fertilizer Stock</span>
            </button>
            <button
              onClick={onOpenHelplines}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>Helplines</span>
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Primary CTA Button: Launch Kiosk / Voice Assistant */}
            <button
              onClick={onLaunchKiosk}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/25 transition-all cursor-pointer flex items-center gap-2 border border-emerald-500/50"
            >
              <Bot className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Talk to Raithu Velugu</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
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
              currentPage === 'home' ? 'bg-emerald-100 text-emerald-950' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'about' ? 'bg-emerald-100 text-emerald-950' : 'text-slate-700'
            }`}
          >
            About PACS
          </button>
          <button
            onClick={() => handleNavClick('schemes')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'schemes' ? 'bg-emerald-100 text-emerald-950' : 'text-slate-700'
            }`}
          >
            Schemes & Law
          </button>
          <button
            onClick={() => handleNavClick('grievances')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${
              currentPage === 'grievances' ? 'bg-emerald-100 text-emerald-950' : 'text-slate-700'
            }`}
          >
            Grievance Redressal
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStock();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <PackageCheck className="w-4 h-4 text-emerald-700" />
            <span>Fertilizer Stock</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHelplines();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-700" />
            <span>Helplines</span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchKiosk();
              }}
              className="w-full py-3 rounded-xl bg-slate-950 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Talk to Raithu Velugu</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
