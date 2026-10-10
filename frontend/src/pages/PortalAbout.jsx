import React from 'react';
import { Building2, Users, ShieldCheck, Scale, Award, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export default function PortalAbout({ onLaunchKiosk }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-950 text-xs font-black uppercase tracking-wider border border-emerald-200/70">
          Cooperative Movement & Model Bye-Laws
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-950">
          Understanding Primary Agricultural Credit Societies (PACS)
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          How village-level cooperative credit societies operate, their 3-tier hierarchy, active member voting rights, and national digital modernization.
        </p>
      </div>

      {/* 3-Tier Cooperative Credit Structure */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <h2 className="font-heading text-xl font-bold text-slate-950 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-800" />
          <span>3-Tier Short-Term Cooperative Credit Structure</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
              State Apex Level
            </span>
            <h3 className="font-bold text-sm text-slate-900">
              StCB (State Apex Cooperative Bank)
            </h3>
            <p className="text-xs text-slate-500">
              Mobilizes credit from NABARD at the state level and refinances district cooperative networks.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold">
              District Level
            </span>
            <h3 className="font-bold text-sm text-slate-900">
              DCCB (District Central Cooperative Bank)
            </h3>
            <p className="text-xs text-slate-500">
              Supervises PACS networks in districts like Sangareddy and approves seasonal crop loan credit limits.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-bold">
              Village Grassroots Level
            </span>
            <h3 className="font-bold text-sm text-emerald-950 font-black">
              PACS (Primary Agricultural Credit Society)
            </h3>
            <p className="text-xs text-emerald-900 font-medium">
              Directly interfaces with village farmers for crop loans, fertilizer distribution, and MSP procurement.
            </p>
          </div>
        </div>
      </div>

      {/* Model Bye-Laws 2023 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-950">
            Model PACS Bye-Laws (2023 Mandate)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Enacted by the Ministry of Cooperation to transform PACS into vibrant Multi-Purpose Economic Nodes. PACS can now operate Common Service Centres (CSCs), custom hiring centres, retail fertilizer outlets, and cold storage chains.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-950">
            Active Member Democratic Voting Rights
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            To vote in PACS Managing Committee elections, members must fulfill active criteria: utilizing society services within the preceding 2 financial years and attending annual general meetings with minimum share capital compliance.
          </p>
        </div>
      </div>

      {/* Why Raithu Velugu Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#073826] via-[#094731] to-[#0d593d] text-white space-y-6 border border-emerald-700/50 shadow-xl">
        <h3 className="font-heading text-2xl font-black">
          How Raithu Velugu Solves Grassroots Information Asymmetry
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-medium">
          For decades, lack of digital literacy and opaque physical ledgers allowed middlemen to exploit rural farmers. Raithu Velugu eliminates this barrier by giving every farmer an audible, voice-guided interactive portal with instant receipt proof and enforceable statutory grievance routing.
        </p>

        <div>
          <button
            onClick={onLaunchKiosk}
            className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Bot className="w-4 h-4 text-amber-500" />
            <span>Launch Kiosk Prototype</span>
            <ArrowRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

    </div>
  );
}
