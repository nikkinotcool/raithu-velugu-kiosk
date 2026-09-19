import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, PlusCircle, CheckCircle2, Clock, AlertTriangle, 
  ShieldAlert, ArrowRight, Building2, User, Phone, Send, RefreshCw
} from 'lucide-react';

const CATEGORIES = [
  { id: 'pmfby', nameTe: 'PMFBY పంట నష్టం క్లెయిమ్ ఆలస్యం / తిరస్కరణ', nameEn: 'PMFBY Crop Loss Claim Delay / Rejection', dept: 'DAIGC Insurance Committee' },
  { id: 'loan', nameTe: 'PACS 4% క్రాప్ లోన్ లేదా సబ్సిడీ సమస్య', nameEn: 'PACS 4% Crop Loan or Subsidy Issue', dept: 'DCCB Inspection Wing' },
  { id: 'fertilizer', nameTe: 'ఎరువులు & విత్తనాల కోటా లభ్యత సమస్య', nameEn: 'Fertilizer & Certified Seed Quota Issue', dept: 'Agricultural Extension Officer' },
  { id: 'bylaws', nameTe: 'సొసైటీ బైలాస్ లేదా రికార్డుల నిరాకరణ', nameEn: 'PACS Bylaws / Audit Record Denial', dept: 'District ARCS Registry' },
];

export default function GrievancesSection({ currentUser, language, apiBase }) {
  const [tab, setTab] = useState('list'); // 'list' | 'new'
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // New Grievance State
  const [category, setCategory] = useState(CATEGORIES[0].nameTe);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newTicketCreated, setNewTicketCreated] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/grievances?limit=15`);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleTrackSearch = async (e) => {
    e?.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const res = await fetch(`${apiBase}/grievances/track/${encodeURIComponent(searchId.trim())}`);
      if (!res.ok) {
        throw new Error(language === 'te' ? 'ఈ ట్రాకింగ్ సంఖ్యతో ఎలాంటి ఫిర్యాదు నమోదు కాలేదు.' : 'No grievance found with this Tracking ID.');
      }
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLodgeGrievance = async (e) => {
    e?.preventDefault();
    if (!description.trim()) {
      setFormError(language === 'te' ? 'దయచేసి మీ సమస్య వివరాలను నమోదు చేయండి.' : 'Please describe your grievance.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        category,
        description: description.trim(),
        complainant_name: currentUser?.full_name || 'రైతు (Farmer)',
        complainant_phone: currentUser?.phone_number || '',
        pacs_name: currentUser?.pacs_name || 'Kandi Primary Agricultural Credit Society',
        district: currentUser?.district || 'Sangareddy',
        state: currentUser?.state || 'Telangana'
      };

      const res = await fetch(`${apiBase}/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setNewTicketCreated(data);
      setDescription('');
      fetchGrievances();
    } catch (err) {
      setFormError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3.5 max-w-xl mx-auto w-full animate-fadeIn pb-6">
      {/* Sleek Subheader Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            {language === 'te' ? 'ఫిర్యాదుల పరిష్కార పోర్టల్' : 'Grievance Redressal Portal'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {language === 'te' 
              ? 'PACS అవకతవకలు, పంట నష్టం బీమా క్లెయిమ్‌లపై అధికారిక వినతులు' 
              : 'Statutory dispute management for PACS & PMFBY Crop Insurance'}
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => { setTab('list'); setNewTicketCreated(null); }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'list'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'ఫిర్యాదుల జాబితా & ట్రాక్' : 'My Tickets & Track'}</span>
          </button>
          <button
            onClick={() => { setTab('new'); setNewTicketCreated(null); }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'new'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'కొత్త ఫిర్యాదు' : 'File Grievance'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TICKETS LIST & TRACK SEARCH */}
      {tab === 'list' && (
        <div className="space-y-4">
          {/* Quick Track Input Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder={language === 'te' ? 'ట్రాకింగ్ నంబర్ (ఉదా: RV-GRV-20260919-BC19)' : 'Enter tracking ID (e.g. RV-GRV-20260919-BC19)'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchId.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                {loading ? '...' : (language === 'te' ? 'ట్రాక్' : 'Track')}
              </button>
            </form>

            {searchError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {searchResult && (
              <div className="mt-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-900">{searchResult.tracking_id}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {searchResult.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">{searchResult.category}</h4>
                <p className="text-xs text-slate-700">{searchResult.description}</p>
                <div className="pt-2 border-t border-emerald-200/50 text-[11px] text-slate-500 flex justify-between">
                  <span>🏛️ {searchResult.pacs_name}</span>
                  <span>📍 {searchResult.routed_to}</span>
                </div>
              </div>
            )}
          </div>

          {/* List of Recent Grievances */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'te' ? 'నమోదైన ఫిర్యాదులు' : 'Registered Grievance History'} ({grievances.length})
              </span>
              <button
                onClick={fetchGrievances}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {grievances.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                {language === 'te' ? 'ఇంకా ఎలాంటి ఫిర్యాదులు నమోదు కాలేదు.' : 'No grievances on record.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {grievances.map((g) => (
                  <div key={g.id || g.tracking_id} className="py-3.5 space-y-1.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {g.tracking_id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {g.category}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.status?.includes('Resolved') 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {g.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>👤 {g.complainant_name || 'Member'} • {g.pacs_name}</span>
                      <span className="text-emerald-700 font-medium">📍 {g.routed_to}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: LODGE NEW GRIEVANCE */}
      {tab === 'new' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs">
          {newTicketCreated ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                {language === 'te' ? 'ఫిర్యాదు నమోదైంది!' : 'Grievance Submitted!'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Tracking ID: <strong>{newTicketCreated.tracking_id}</strong>
              </p>
              <div className="flex gap-2 justify-center pt-3">
                <button
                  onClick={() => {
                    setSearchId(newTicketCreated.tracking_id);
                    setTab('list');
                    setNewTicketCreated(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'te' ? 'ట్రాక్ చేయండి' : 'Track Ticket'}
                </button>
                <button
                  onClick={() => setNewTicketCreated(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {language === 'te' ? '+ మరొకటి నమోదు' : 'File Another'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeGrievance} className="space-y-3.5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'సమస్య విభాగం' : 'Issue Category'} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={language === 'te' ? c.nameTe : c.nameEn}>
                      {language === 'te' ? c.nameTe : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'సమస్య సమగ్ర వివరాలు' : 'Description of Incident'} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'te' 
                    ? 'ఉదా: మండలంలో భారీ వర్షాల వల్ల వరి పంట దెబ్బతింది. క్లెయిమ్ నమోదు చేయడానికి వివరాలు...'
                    : 'Describe what happened, dates, and PACS personnel involved...'}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? '...' : (language === 'te' ? 'ఫిర్యాదును సమర్పించండి' : 'Submit Grievance')}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
