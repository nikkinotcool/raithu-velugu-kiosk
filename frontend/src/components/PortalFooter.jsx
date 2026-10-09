import React from 'react';
import { PhoneCall, ShieldCheck, Heart, ExternalLink, MapPin } from 'lucide-react';

export default function PortalFooter({ currentLanguage, onLaunchKiosk, onOpenHelplines }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                🌾
              </div>
              <span className="font-heading text-xl font-black text-white">
                {currentLanguage === 'en' ? 'Raithu Velugu' : (currentLanguage === 'hi' ? 'रैतु वेलुगु' : 'రైతు వెలుగు')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentLanguage === 'te' 
                ? 'భారత ప్రభుత్వ సహకార మంత్రిత్వ శాఖ PACS డిజిటలైజేషన్ లక్ష్యాలకు అనుగుణంగా రూపొందించిన తొలి బహుభాషా ఏఐ కియోస్క్ వ్యవస్థ.'
                : 'India’s first multilingual voice & touch kiosk system built for Primary Agricultural Credit Societies under the Ministry of Cooperation.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Col 2: Cooperative Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {currentLanguage === 'te' ? 'సహకార సేవలు' : 'Cooperative Services'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                  {currentLanguage === 'te' ? '4% పంట రుణం & వడ్డీ రాయితీ' : '4% Short-Term Crop Loan'}
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                  {currentLanguage === 'te' ? 'రాయితీ ఎరువుల పంపిణీ (యూరియా/డీఏపీ)' : 'Subsidized Fertilizers (Urea/DAP)'}
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                  {currentLanguage === 'te' ? 'PMFBY 72 గంటల నష్ట సమాచారం' : 'PMFBY 72-Hour Loss Notification'}
                </button>
              </li>
              <li>
                <button onClick={onLaunchKiosk} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                  {currentLanguage === 'te' ? 'సభ్యుల ఓటు హక్కు & ఉప-నిబంధనలు' : 'Active Member Bye-law Rights'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {currentLanguage === 'te' ? 'ప్రభుత్వ పోర్టల్స్' : 'Statutory Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://cooperation.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>Ministry of Cooperation</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>PMFBY Crop Insurance</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://sangareddy.telangana.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>Sangareddy District Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: District & Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {currentLanguage === 'te' ? 'అత్యవసర హెల్ప్‌లైన్లు' : 'Emergency Assistance'}
            </h4>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
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
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {currentLanguage === 'te' ? 'అధికారుల డైరెక్టరీ తెరవండి' : 'Open Complete Directory'}
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>రైతు వెలుగు (Raithu Velugu)</strong> • All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for rural Indian farmers and PACS members</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
