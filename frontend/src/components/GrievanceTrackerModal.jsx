import React, { useState } from 'react';
import { X, Search, ShieldCheck, Clock, CheckCircle2, AlertCircle, Building2, User, Phone, MapPin, Printer, Download, Volume2 } from 'lucide-react';
import { printGrievanceReceipt, downloadReceiptFile } from '../utils/receiptGenerator';
import { fetchWithCloudFallback } from '../utils/apiClient';

const LABELS = {
  te: {
    title: 'ఫిర్యాదు పరిష్కార స్థితి పరిశీలన',
    subtitle: 'జాతీయ సహకార వివాద & పరిష్కార రిజిస్ట్రీ',
    placeholder: 'ఉదా: RV-GRV-20260922-PM5541',
    trackBtn: 'స్థితిని చూడండి',
    tracking: 'శోధిస్తోంది...',
    status: 'ప్రస్తుత స్థితి',
    category: 'ఫిర్యాదు విభాగం',
    authority: 'బాధ్యత గల అధికారి / విభాగం',
    complaint: 'నమోదైన ఫిర్యాదు వివరాలు',
    registered: 'నమోదైన సమయం',
    sla: 'చట్టబద్ధ పరిష్కార గడువు: 7-15 రోజులు',
    printPdf: 'రసీదు ప్రింట్ (PDF)',
    downloadSlip: 'స్లిప్ డౌన్‌లోడ్',
    listen: '🔊 స్థితి వినండి',
    speaking: 'చదువుతోంది...',
    notFound: 'ఈ ట్రాకింగ్ ఐడీతో ఏ ఫిర్యాదు కనుగొనబడలేదు. దయచేసి సంఖ్యను సరిచూడండి.'
  },
  hi: {
    title: 'शिकायत निवारण स्थिति जांचें',
    subtitle: 'राष्ट्रीय सहकारिता विवाद एवं निवारण रजिस्ट्री',
    placeholder: 'उदा: RV-GRV-20260922-PM5541',
    trackBtn: 'स्थिति देखें',
    tracking: 'खोजा जा रहा है...',
    status: 'वर्तमान स्थिति',
    category: 'शिकायत श्रेणी',
    authority: 'प्राधिकृत अधिकारी / विभाग',
    complaint: 'दर्ज शिकायत का विवरण',
    registered: 'पंजीकरण समय',
    sla: 'वैधानिक समय सीमा: 7-15 दिन',
    printPdf: 'रसीद प्रिंट (PDF)',
    downloadSlip: 'स्लिप डाउनलोड',
    listen: '🔊 स्थिति सुनें',
    speaking: 'सुनाया जा रहा है...',
    notFound: 'इस ट्रैकिंग आईडी से कोई शिकायत नहीं मिली। कृपया पुनः जांचें।'
  },
  en: {
    title: 'Track Grievance Redressal Status',
    subtitle: 'National Cooperative Dispute & Redressal Registry',
    placeholder: 'e.g. RV-GRV-20260922-PM5541',
    trackBtn: 'Track Status',
    tracking: 'Tracking...',
    status: 'Current Status',
    category: 'Grievance Category',
    authority: 'Assigned Authority / Department',
    complaint: 'Registered Complaint Text',
    registered: 'Registered At',
    sla: 'Mandatory Statutory SLA: 7-15 Days',
    printPdf: 'Print Receipt (PDF)',
    downloadSlip: 'Download Slip',
    listen: '🔊 Listen to Status',
    speaking: 'Speaking...',
    notFound: 'No grievance ticket found with this Tracking ID. Please double check.'
  }
};

export default function GrievanceTrackerModal({ isOpen, onClose, initialTrackingId, apiBase, currentUser, language = 'te' }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = LABELS[language] || LABELS['en'];

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await fetchWithCloudFallback(`/grievances/track/${encodeURIComponent(trackingId.trim())}`, {}, apiBase);
      if (!res.ok) {
        throw new Error(t.notFound);
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket status');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakStatus = async () => {
    if (!ticket || isSpeaking) return;
    setIsSpeaking(true);

    let textToSpeak = '';
    if (language === 'te') {
      textToSpeak = `మీ ఫిర్యాదు సంఖ్య ${ticket.tracking_id}. ప్రస్తుత స్థితి: ${ticket.status}. బాధ్యత గల అధికారి: ${ticket.routed_to}. పరిష్కార గడువు ఏడు నుండి పదిహేను పని దినాలు.`;
    } else if (language === 'hi') {
      textToSpeak = `आपकी शिकायत संख्या ${ticket.tracking_id}। वर्तमान स्थिति है: ${ticket.status}। प्राधिकृत विभाग: ${ticket.routed_to}। समाधान की समय सीमा 7 से 15 दिन है।`;
    } else {
      textToSpeak = `Your grievance ticket ${ticket.tracking_id}. Current status is: ${ticket.status}. Forwarded to ${ticket.routed_to}. Statutory resolution timeline is 7 to 15 working days.`;
    }

    try {
      const res = await fetchWithCloudFallback('/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, language: language })
      }, apiBase);

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.lang = language === 'te' ? 'te-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl relative text-slate-900 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold border border-emerald-600/50 text-sm transition-all cursor-pointer shadow-md shadow-slate-950/20 shrink-0"
          >
            {loading ? t.tracking : t.trackBtn}
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Ticket Details View */}
        {ticket && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">{t.status}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakStatus}
                  disabled={isSpeaking}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Volume2 className={`w-3 h-3 ${isSpeaking ? 'animate-bounce text-emerald-700' : 'text-emerald-800'}`} />
                  <span>{isSpeaking ? t.speaking : t.listen}</span>
                </button>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200">
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">{t.category}:</span>
                <span className="font-bold text-slate-900">{ticket.category}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">{t.authority}:</span>
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  {ticket.routed_to}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">{t.complaint}:</span>
                <p className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 italic mt-1 shadow-xs">
                  "{ticket.description}"
                </p>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 text-[11px] font-medium">
                <span>{t.registered}: {new Date(ticket.created_at).toLocaleString()}</span>
                <span className="text-emerald-950 font-bold">{t.sla}</span>
              </div>

              {/* Receipt Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => printGrievanceReceipt(ticket, currentUser)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-emerald-600/50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printPdf}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadReceiptFile(ticket, currentUser)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadSlip}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
