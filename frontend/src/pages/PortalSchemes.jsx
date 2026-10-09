import React from 'react';
import { Coins, ShieldCheck, PackageCheck, Award, ArrowRight, Bot, CheckCircle2, FileText } from 'lucide-react';

const SCHEMES = [
  {
    title: '4% Short-Term Crop Loan & Interest Subvention (ISS)',
    category: 'Credit & Financial Inclusion',
    badge: 'Govt. Subvention 3% + PRI 3%',
    desc: 'Provides working capital up to Scale of Finance (Paddy ₹38,000/acre). Upon timely repayment within 12 months, net effective interest drops to 4% (0% up to ₹1 Lakh in select state schemes).',
    rules: [
      'Kharif Paddy: Entitlement up to ₹38,000 per acre',
      'Cotton Crop: Entitlement up to ₹42,000 per acre',
      'Timely repayment within 12 months qualifies for 3% Prompt Repayment Incentive (PRI)',
      'Requires land title passbook and digital e-crop booking'
    ]
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Risk Insurance',
    badge: 'Statutory 72-Hour Loss Reporting',
    desc: 'Comprehensive risk mitigation against drought, flood, inundation, pests, and localized calamities. Farmers pay only 2% premium for Kharif foodgrain crops.',
    rules: [
      'Only 2% farmer premium share for Kharif foodgrains',
      'Mandatory 72-hour loss notification SLA for localized inundation/hail',
      'Direct intimation via Toll-Free 14447 or Raithu Velugu Kiosk',
      'Loss assessment conducted via joint field survey and panchnama'
    ]
  },
  {
    title: 'Central Fertilizer Subsidy & Certified Quota',
    category: 'Nutrient & Input Subsidy',
    badge: 'Direct Price Support',
    desc: 'Direct price support ensuring smallholder farmers receive genuine Neem Coated Urea, DAP, and complexes at fixed statutory maximum retail prices.',
    rules: [
      'Neem Coated Urea (45kg): Subsidized at ₹266.50 (Market MRP ₹2,450)',
      'DAP (50kg): Subsidized at ₹1,350.00 (Market MRP ₹4,100)',
      'Eligible quota: 2 bags Urea and 1 bag DAP per acre for Kharif Paddy',
      'Distributed via Aadhaar biometric PoS terminal at PACS'
    ]
  },
  {
    title: 'Certified Seed Distribution (Telangana Sona RNR 15048)',
    category: 'High-Yield Seeds',
    badge: '>92% Certified Germination',
    desc: 'High-yield, low-glycemic-index superfine paddy seeds certified by TSSDC with guaranteed germination rate and blast resistance.',
    rules: [
      'Subsidized 30kg bag at ₹1,150 (Market price ₹1,750)',
      'Recommended seed rate: 30kg per acre',
      'High resistance against blast and bacterial leaf blight'
    ]
  }
];

export default function PortalSchemes({ onLaunchKiosk }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-950 text-xs font-black uppercase tracking-wider border border-blue-200/70">
          Cooperative Schemes & Statutory Entitlements
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-950">
          Government Agricultural & Cooperative Schemes
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Detailed guide on 4% crop loan subventions, PMFBY insurance compensation, and certified agricultural input entitlements.
        </p>
      </div>

      {/* Schemes List */}
      <div className="space-y-6">
        {SCHEMES.map((scheme, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 block">
                  {scheme.category}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-950 mt-0.5">
                  {scheme.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold self-start sm:self-auto border border-amber-200/80">
                {scheme.badge}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {scheme.desc}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Key Rules & Eligibility Criteria:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {scheme.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#102e54] to-[#184275] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-800/60 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading text-xl font-bold">
            Have a Question on Any Scheme? Ask the AI Assistant
          </h3>
          <p className="text-xs text-slate-300">
            Calculate your exact loan entitlement and subsidized fertilizer quota right on the voice kiosk.
          </p>
        </div>
        <button
          onClick={onLaunchKiosk}
          className="px-6 py-3 rounded-xl bg-white text-blue-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Bot className="w-4 h-4 text-amber-500" />
          <span>Launch Kiosk AI</span>
          <ArrowRight className="w-4 h-4 text-slate-700" />
        </button>
      </div>

    </div>
  );
}
