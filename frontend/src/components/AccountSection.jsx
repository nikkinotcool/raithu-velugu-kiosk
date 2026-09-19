import React from 'react';
import { 
  Building2, ShieldCheck, MapPin, Phone, Award, CheckCircle2, 
  CreditCard, Sprout, Landmark, LogOut, Database
} from 'lucide-react';

export default function AccountSection({ currentUser, language, onLogout }) {
  if (!currentUser) return null;

  return (
    <div className="space-y-4 max-w-xl mx-auto w-full animate-fadeIn pb-6">
      {/* Executive Member Identity Passbook Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Subtle Background Geometry */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
                  {currentUser.full_name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold">
                  ● Verified Active Member
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                {currentUser.pacs_name || 'Kandi Primary Agricultural Credit Society'}
              </p>
              <div className="flex items-center gap-3 text-xs text-emerald-100/70 font-mono mt-2">
                <span>ID: <strong>{currentUser.member_id || 'PACS-KD-1042'}</strong></span>
                <span>•</span>
                <span>Phone: <strong>{currentUser.phone_number || 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'లాగౌట్' : 'Sign Out'}</span>
          </button>
        </div>

        {/* 3 Key Stats Pills */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
              {language === 'te' ? 'వాటా మూలధనం' : 'Share Capital'}
            </span>
            <span className="text-sm sm:text-base font-bold text-white block">
              ₹15,000
            </span>
            <span className="text-[10px] text-emerald-300/80">150 Shares</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
              {language === 'te' ? 'భూమి వివరాలు' : 'Land Area'}
            </span>
            <span className="text-sm sm:text-base font-bold text-white block">
              3.5 Acres
            </span>
            <span className="text-[10px] text-emerald-300/80">Paddy & Cotton</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200/70 block mb-0.5">
              {language === 'te' ? 'క్రాప్ లోన్ పరిమితి' : 'Loan Entitlement'}
            </span>
            <span className="text-sm sm:text-base font-bold text-white block">
              ₹3,00,000
            </span>
            <span className="text-[10px] text-emerald-300/80">4% Subvention</span>
          </div>
        </div>
      </div>

      {/* Society Information & Legal Entitlements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Society Info */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{language === 'te' ? 'సొసైటీ వివరాలు' : 'Cooperative Society Details'}</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Society:</span>
              <span className="font-semibold text-slate-800">{currentUser.pacs_name || 'Kandi PACS'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">District & State:</span>
              <span className="font-semibold text-slate-800">{currentUser.district || 'Sangareddy'}, {currentUser.state || 'Telangana'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Affiliated District Bank:</span>
              <span className="font-semibold text-slate-800">DCCB Sangareddy</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">General Body Voting:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Legal Entitlements */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>{language === 'te' ? 'చట్టపరమైన హక్కులు' : 'Statutory Rights'}</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-0.5">🌾 PMFBY 72-గంటల క్లెయిమ్ హక్కు</span>
              <span className="text-slate-500 leading-snug block">
                పంట నష్టం జరిగిన 72 గంటల్లో కియోస్క్ లేదా 14447 ద్వారా ఫిర్యాదు నమోదు చేయవచ్చు.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block mb-0.5">💳 4% సున్నా వడ్డీ సబ్సిడీ</span>
              <span className="text-slate-500 leading-snug block">
                సకాలంలో రుణ వాయిదా చెల్లించే రైతులకు కేంద్ర & రాష్ట్ర ప్రభుత్వ వడ్డీ రాయితి.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sync Pill */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-100/80 text-[11px] text-slate-500 flex items-center justify-between font-sans">
        <span className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-700" />
          <span>Synced with <strong>National Cooperative Database (NCD)</strong> & Supabase Cloud</span>
        </span>
        <span className="text-emerald-700 font-bold">● Live Sync</span>
      </div>
    </div>
  );
}
