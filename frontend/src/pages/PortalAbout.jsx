import React from 'react';
import { Building2, Users, ShieldCheck, Scale, Award, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export default function PortalAbout({ currentLanguage, onLaunchKiosk }) {
  const isTe = currentLanguage === 'te';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          {isTe ? 'సహకార సంఘాల నేపథ్యం' : 'Cooperative Movement & Model Bye-Laws'}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
          {isTe 
            ? 'PACS సహకార సంఘాల చరిత్ర, విధులు మరియు చట్టపరమైన హక్కులు' 
            : 'Understanding Primary Agricultural Credit Societies (PACS)'}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {isTe
            ? 'గ్రామీణ రైతులకు ఆర్థిక భరోసా కల్పించే ప్రాథమిక సహకార పరపతి సంఘాల సమగ్ర వివరాలు మరియు రైతు వెలుగు పాత్ర.'
            : 'How village-level cooperative credit societies operate, their 3-tier hierarchy, active member voting rights, and digital modernization.'}
        </p>
      </div>

      {/* 3-Tier Cooperative Credit Structure */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-700" />
          <span>{isTe ? '3-అంచెల సహకార పరపతి వ్యవస్థ' : '3-Tier Short-Term Cooperative Credit Structure'}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
              {isTe ? 'రాష్ట్ర స్థాయి / Apex Level' : 'State Apex Level'}
            </span>
            <h3 className="font-bold text-sm text-slate-900">
              {isTe ? 'StCB (రాష్ట్ర సహకార అపెక్స్ బ్యాంక్)' : 'StCB (State Apex Cooperative Bank)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTe 
                ? 'రాష్ట్ర స్థాయిలో నాబార్డ్ (NABARD) నుండి నిధులు సమీకరించి జిల్లాలకు పంపిణీ చేస్తుంది.'
                : 'Mobilizes credit from NABARD at the state level and refinances district cooperative networks.'}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
              {isTe ? 'జిల్లా స్థాయి / District Level' : 'District Level'}
            </span>
            <h3 className="font-bold text-sm text-slate-900">
              {isTe ? 'DCCB (జిల్లా కేంద్ర సహకార బ్యాంక్)' : 'DCCB (District Central Cooperative Bank)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTe
                ? 'సంగారెడ్డి వంటి జిల్లాల్లో PACS సంఘాలను పర్యవేక్షించి క్రాప్ లోన్ క్రెడిట్ పరిమితిని మంజూరు చేస్తుంది.'
                : 'Supervises PACS networks in districts like Sangareddy and approves seasonal crop loan credit limits.'}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {isTe ? 'గ్రామ స్థాయి / Grassroots Level' : 'Village Grassroots Level'}
            </span>
            <h3 className="font-bold text-sm text-emerald-950 font-black">
              {isTe ? 'PACS (ప్రాథమిక వ్యవసాయ సంఘం)' : 'PACS (Primary Agricultural Credit Society)'}
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              {isTe
                ? 'రైతులతో నేరుగా అనుసంధానమై ఎరువులు, విత్తనాలు, స్వల్పకాలిక రుణాలు మరియు ధాన్య సేకరణ నిర్వహిస్తుంది.'
                : 'Directly interfaces with village farmers for crop loans, fertilizer distribution, and MSP procurement.'}
            </p>
          </div>
        </div>
      </div>

      {/* Model Bye-Laws 2023 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            {isTe ? 'సహకార మంత్రిత్వ శాఖ మోడల్ బై-లాస్ 2023' : 'Model PACS Bye-Laws (2023 Mandate)'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isTe
              ? 'కేంద్ర సహకార మంత్రిత్వ శాఖ PACS లను బహుళార్ధసాధక సంస్థలుగా మార్చడానికి నూతన మోడల్ ఉప-నిబంధనలను ప్రవేశపెట్టింది. దీని ప్రకారం PACS కేవలం రుణాలకే పరిమితం కాకుండా కామన్ సర్వీస్ సెంటర్ (CSC), గోదాములు, ఫర్టిలైజర్ రీటైల్ మరియు సౌరశక్తి కేంద్రాలుగా మారవచ్చు.'
              : 'Enacted to transform PACS into vibrant Multi-Purpose Economic Nodes. PACS can now operate Common Service Centres (CSCs), custom hiring centres, retail fertilizer outlets, and cold storage chains.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            {isTe ? 'క్రియాశీల సభ్యుడి ఓటు హక్కు నిబంధనలు' : 'Active Member Democratic Voting Rights'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isTe
              ? 'ప్రజాస్వామిక పాలకవర్గ ఎన్నికల్లో ఓటు వేయడానికి రైతు క్రమం తప్పకుండా సొసైటీ సేవలను వినియోగించుకోవాలి. కనీస లావాదేవీలు మరియు సాధారణ సర్వసభ్య సమావేశానికి హాజరైన ఏ-క్లాస్ సభ్యులకు మాత్రమే చట్టబద్ధమైన ఓటు హక్కు ఉంటుంది.'
              : 'To vote in PACS Managing Committee elections, members must fulfill active criteria: utilizing society services within the preceding 2 financial years and attending annual general meetings.'}
          </p>
        </div>
      </div>

      {/* Why Raithu Velugu Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white space-y-6">
        <h3 className="font-heading text-2xl font-black">
          {isTe ? 'రైతు వెలుగు ఎందుకు అవసరం?' : 'How Raithu Velugu Solves Grassroots Information Asymmetry'}
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl font-medium">
          {isTe
            ? 'చాలా గ్రామాల్లో చిన్న మరియు సన్నకారు రైతులకు తమ హక్కులు, ఎరువుల కోటా మరియు వడ్డీ రాయితీ లెక్కలు తెలియక సెక్రటరీ లేదా దళారులపై ఆధారపడాల్సి వస్తుంది. రైతు వెలుగు టచ్ స్క్రీన్ కియోస్క్ ఈ అడ్డంకిని తొలగించి, వాయిస్ AI ద్వారా పూర్తి పారదర్శకతను నేరుగా రైతు చేతుల్లోకి అందిస్తుంది.'
            : 'For decades, lack of digital literacy and opaque physical ledgers allowed middlemen to exploit rural farmers. Raithu Velugu eliminates this barrier by giving every farmer an audible, voice-guided interactive portal with instant receipt proof and enforceable statutory grievance routing.'}
        </p>

        <div>
          <button
            onClick={onLaunchKiosk}
            className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-black text-xs sm:text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Bot className="w-4 h-4 text-emerald-800" />
            <span>{isTe ? 'రైతు వెలుగు కియోస్క్ ప్రారంభించండి' : 'Launch Kiosk Prototype'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
