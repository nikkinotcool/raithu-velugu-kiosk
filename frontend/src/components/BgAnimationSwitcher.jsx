import React, { useState } from 'react';
import { Sparkles, Waves, Flame, Share2, Eye, Check } from 'lucide-react';

const OPTIONS = [
  { id: 'aurora', label: 'Bio Aurora', icon: Sparkles, desc: 'Luminous emerald & champagne fluid mesh' },
  { id: 'particles', label: 'Fireflies & Pollen', icon: Flame, desc: 'Golden spores & bioluminescent fireflies' },
  { id: 'waves', label: 'Topo Waves', icon: Waves, desc: 'Terraced agricultural contours & rivers' },
  { id: 'constellation', label: 'DPI Network', icon: Share2, desc: 'Cooperative PACS constellation nodes' }
];

export default function BgAnimationSwitcher({ currentMode, onSelectMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200/90 w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-950">
                Background Animations
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Live Preview
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-2 leading-tight">
            Select an animation option below to preview it live across the platform:
          </p>

          <div className="space-y-1">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectMode(opt.id);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'hover:bg-emerald-50 text-slate-700 hover:text-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                    <div>
                      <div className="leading-tight">{opt.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-emerald-950 text-xs font-bold shadow-lg shadow-emerald-900/10 border border-emerald-200/90 hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-2 active:scale-95 group"
        title="Change Animated Background"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
        <span className="text-[11px] text-slate-600 font-semibold">BG Effect:</span>
        <span className="text-emerald-700 font-bold capitalize flex items-center gap-1">
          {OPTIONS.find(o => o.id === currentMode)?.label || 'Aurora'}
        </span>
        <Eye className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
