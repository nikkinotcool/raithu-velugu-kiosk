import React from 'react';
import { PhoneCall, ShieldCheck, Heart, ExternalLink, MapPin } from 'lucide-react';

export default function PortalFooter({ onLaunchKiosk, onOpenHelplines }) {
  return (
    <footer className="bg-[#08182b] text-slate-300 pt-16 pb-12 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-amber-300 flex items-center justify-center text-lg font-bold border border-blue-600/50">
                🌾
              </div>
              <span className="font-heading text-xl font-black text-white">
                Raithu Velugu
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              India’s sovereign multilingual voice AI and touchscreen kiosk system engineered for Primary Agricultural Credit Societies under the Ministry of Cooperation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Col 2: Cooperative Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Cooperative Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  4% Short-Term Crop Loan & Subvention
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Subsidized Fertilizers (Urea / DAP Quota)
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  PMFBY 72-Hour Loss Notification
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Active Member Bye-Law Rights
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Statutory Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://cooperation.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
                  <span>Ministry of Cooperation</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
                  <span>PMFBY Crop Insurance</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://sangareddy.telangana.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
                  <span>Sangareddy District Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: District & Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Emergency Assistance
            </h4>
            <div className="p-3.5 rounded-xl bg-[#0d2342] border border-blue-900/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Kisan Call Centre: 1800-180-1551</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>PMFBY Claim Desk: 14447</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Kandi PACS, Sangareddy, Telangana</span>
              </div>
            </div>
            <button
              onClick={onOpenHelplines}
              className="w-full py-2.5 rounded-xl bg-[#122e54] hover:bg-blue-800 text-xs font-bold text-white transition-colors cursor-pointer border border-blue-700/60"
            >
              Open Complete Directory
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>Raithu Velugu</strong> • National Digital Public Infrastructure for PACS.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian farmers and PACS members</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
