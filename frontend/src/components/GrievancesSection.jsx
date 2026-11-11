import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, PlusCircle, CheckCircle2, AlertTriangle, 
  ChevronRight, Printer, RefreshCw, X 
} from 'lucide-react';
import { printGrievanceReceipt } from '../utils/receiptGenerator';
import { fetchWithCloudFallback } from '../utils/apiClient';

const CATEGORIES = [
  { id: 'pmfby', nameTe: 'PMFBY పంట నష్టం క్లెయిమ్ ఆలస్యం / తిరస్కరణ', nameEn: 'PMFBY Crop Loss Claim Delay / Rejection' },
  { id: 'loan', nameTe: 'PACS 4% క్రాప్ లోన్ లేదా సబ్సిడీ సమస్య', nameEn: 'PACS 4% Crop Loan or Subsidy Issue' },
  { id: 'fertilizer', nameTe: 'ఎరువులు & విత్తనాల కోటా లభ్యత సమస్య', nameEn: 'Fertilizer & Certified Seed Quota Issue' },
  { id: 'bylaws', nameTe: 'సొసైటీ బైలాస్ లేదా రికార్డుల నిరాకరణ', nameEn: 'PACS Bylaws / Audit Record Denial' },
];

export default function GrievancesSection({ currentUser, language, apiBase }) {
  const [tab, setTab] = useState('list'); // 'list' | 'new'
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New Grievance State
  const [category, setCategory] = useState(CATEGORIES[0].nameTe);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newTicketCreated, setNewTicketCreated] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetchWithCloudFallback('/grievances?limit=10', {}, apiBase);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (e) {
      console.warn('Failed to fetch grievances:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleLodgeGrievance = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError(language === 'te' ? 'దయచేసి వివరాలను నమోదు చేయండి.' : 'Please enter grievance details.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      const res = await fetchWithCloudFallback('/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complainant_name: currentUser?.full_name || 'Member Farmer',
          phone_number: currentUser?.phone_number || '9876543210',
          pacs_name: currentUser?.pacs_name || 'Kandi Primary Agricultural Credit Society',
          village: currentUser?.village || 'Kandi',
          district: currentUser?.district || 'Sangareddy',
          state: currentUser?.state || 'Telangana',
          category: category,
          description: description
        })
      }, apiBase);

      if (res.ok) {
        const data = await res.json();
        setNewTicketCreated(data);
        setDescription('');
        fetchGrievances();
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      setFormError(language === 'te' ? 'ఫిర్యాదు నమోదు కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Failed to submit grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGrievances = searchId.trim()
    ? grievances.filter((g) => 
        (g.tracking_id || '').toLowerCase().includes(searchId.toLowerCase()) ||
        (g.category || '').toLowerCase().includes(searchId.toLowerCase())
      )
    : grievances;

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full pb-8">

      {/* iOS Segmented Header Switcher */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex bg-slate-200/70 p-1 rounded-full text-xs sm:text-sm font-semibold">
          <button
            onClick={() => { setTab('list'); setNewTicketCreated(null); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'list'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{language === 'te' ? 'ఫిర్యాదులు' : 'My Grievances'}</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
              {grievances.length}
            </span>
          </button>
          <button
            onClick={() => { setTab('new'); setNewTicketCreated(null); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'new'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'కొత్త ఫిర్యాదు' : 'New Grievance'}</span>
          </button>
        </div>

        <button
          onClick={fetchGrievances}
          className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all cursor-pointer"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* VIEW 1: CLEAN APPLE-STYLE LIST OF GRIEVANCES */}
      {tab === 'list' && (
        <div className="space-y-3">

          {/* Minimal iOS Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={language === 'te' ? 'ట్రాకింగ్ ID లేదా అంశాన్ని వెతకండి...' : 'Search tracking ID or category...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
            {searchId && (
              <button
                onClick={() => setSearchId('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grievance Cards List — Clean & Uncluttered */}
          {filteredGrievances.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 text-center text-slate-400 text-sm border border-slate-200/60 shadow-xs">
              {loading ? 'Loading grievances...' : (language === 'te' ? 'ఫిర్యాదులు ఏవీ లేవు.' : 'No grievances found.')}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredGrievances.map((g) => {
                const isResolved = g.status?.toLowerCase().includes('resolved');
                return (
                  <div
                    key={g.id || g.tracking_id}
                    onClick={() => setSelectedTicket(g)}
                    className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-xs hover:border-slate-300 transition-all cursor-pointer active:scale-99 space-y-1.5"
                  >
                    {/* Top Row: Category + Status Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-sm sm:text-[15px] text-slate-900 leading-snug">
                        {g.category}
                      </h4>
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                      }`}>
                        {g.status || 'Under Review'}
                      </span>
                    </div>

                    {/* Middle: Description summary */}
                    <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-1">
                      {g.description}
                    </p>

                    {/* Bottom: Tracking ID & View Chevron */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs text-slate-400 font-mono">
                      <span>ID: {g.tracking_id}</span>
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold font-sans text-xs">
                        <span>{language === 'te' ? 'వివరాలు' : 'Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TICKET DETAIL MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {selectedTicket.tracking_id}
              </span>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-base text-slate-900">{selectedTicket.category}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedTicket.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {selectedTicket.description}
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1 pt-1">
              <p>🏛️ <strong>PACS:</strong> {selectedTicket.pacs_name || currentUser?.pacs_name}</p>
              <p>📍 <strong>Authority:</strong> {selectedTicket.routed_to || 'Assistant Registrar of Cooperative Societies (ARCS)'}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => printGrievanceReceipt(selectedTicket, currentUser)}
                className="flex-1 py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'te' ? 'రసీదు ప్రింట్ / సేవ్' : 'Print Receipt Slip'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="py-2.5 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CLEAN MINIMAL NEW GRIEVANCE FORM */}
      {tab === 'new' && (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          {newTicketCreated ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {language === 'te' ? 'ఫిర్యాదు విజయవంతంగా నమోదైంది!' : 'Grievance Submitted!'}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  ID: <strong className="text-slate-800">{newTicketCreated.tracking_id}</strong>
                </p>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => printGrievanceReceipt(newTicketCreated, currentUser)}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'te' ? 'రసీదు పొందండి' : 'Print Receipt'}</span>
                </button>
                <button
                  onClick={() => {
                    setTab('list');
                    setNewTicketCreated(null);
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold active:scale-95 cursor-pointer"
                >
                  {language === 'te' ? 'జాబితా చూడండి' : 'View Tickets'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeGrievance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {language === 'te' ? 'ఫిర్యాదు విభాగం' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.nameTe}>
                      {language === 'te' ? cat.nameTe : cat.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {language === 'te' ? 'మీ సమస్య వివరాలు' : 'Description of Issue'}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'te' ? 'మీ సమస్యను స్పష్టంగా ఇక్కడ రాయండి...' : 'Explain the issue in detail...'}
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-600 font-medium">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>{submitting ? '...' : (language === 'te' ? 'ఫిర్యాదు సమర్పించండి' : 'Submit Grievance')}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
