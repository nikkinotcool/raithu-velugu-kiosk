import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Building2, Clock, AlertCircle, CheckCircle2, 
  Printer, Download, Volume2, ArrowRight, Bot, Scale, FileText 
} from 'lucide-react';
import { fetchWithCloudFallback } from '../utils/apiClient';
import { printGrievanceReceipt, downloadReceiptFile } from '../utils/receiptGenerator';

export default function PortalGrievance({ onLaunchKiosk, apiBase }) {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await fetchWithCloudFallback(`/grievances/track/${encodeURIComponent(trackingId.trim())}`, {}, apiBase);
      if (!res.ok) {
        throw new Error('No grievance ticket found with this tracking ID. Please verify the number.');
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message || 'Error tracking ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakStatus = async () => {
    if (!ticket || isSpeaking) return;
    setIsSpeaking(true);

    const textToSpeak = `Your grievance ticket ${ticket.tracking_id}. Current status is: ${ticket.status}. Forwarded to ${ticket.routed_to}. Mandatory statutory SLA is 7 to 15 working days.`;

    try {
      const res = await fetchWithCloudFallback('/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, language: 'en' })
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
        utter.lang = 'en-IN';
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-950 text-xs font-black uppercase tracking-wider border border-blue-200/70">
          Statutory Dispute Redressal & Transparency
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-950">
          National Cooperative Dispute & Redressal Registry
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Track live inquiries, inspect statutory escalations to ARCS/DCCB, and print official dispute receipt slips.
        </p>
      </div>

      {/* Live Tracking Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <h2 className="font-heading text-lg font-bold text-slate-950 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-800" />
          <span>Track Your Grievance Status Live</span>
        </h2>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. RV-GRV-20260922-PM5541"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-blue-950 disabled:opacity-50 text-white font-bold text-sm transition-all cursor-pointer shadow-xs border border-slate-800 shrink-0"
          >
            {loading ? 'Searching...' : 'Track Ticket'}
          </button>
        </form>

        {/* Quick Sample Chips for Evaluators */}
        <div className="text-xs text-slate-500 space-y-1.5">
          <span className="font-medium">Sample Pre-Seeded Tracking IDs for Demonstration:</span>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setTrackingId('RV-GRV-20260922-PM5541')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 cursor-pointer transition-colors"
            >
              RV-GRV-20260922-PM5541 (PMFBY Inquiry)
            </button>
            <button
              type="button"
              onClick={() => setTrackingId('RV-GRV-20260921-UR8812')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 cursor-pointer transition-colors"
            >
              RV-GRV-20260921-UR8812 (Urea Quota - Resolved)
            </button>
            <button
              type="button"
              onClick={() => setTrackingId('RV-GRV-20260923-LN1094')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 cursor-pointer transition-colors"
            >
              RV-GRV-20260923-LN1094 (4% Loan Issue)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {ticket && (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-slate-500 block">Tracking ID:</span>
                <span className="font-mono text-base font-bold text-slate-900">{ticket.tracking_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakStatus}
                  disabled={isSpeaking}
                  className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-blue-700' : 'text-blue-800'}`} />
                  <span>{isSpeaking ? 'Speaking...' : '🔊 Listen'}</span>
                </button>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Category:</span>
                <strong className="text-slate-900 text-sm">{ticket.category}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Forwarded Authority:</span>
                <strong className="text-blue-950 text-sm flex items-center gap-1 mt-0.5">
                  <Building2 className="w-4 h-4 text-blue-800 shrink-0" />
                  {ticket.routed_to}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs italic text-slate-800">
              "{ticket.description}"
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span>Registered: {new Date(ticket.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-blue-900 font-bold">Statutory SLA: 7-15 Days</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => printGrievanceReceipt(ticket)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-800"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadReceiptFile(ticket)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Escalation Pathways */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="font-heading text-lg font-bold text-slate-950 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-800" />
          <span>Statutory Escalation Framework</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Under the Cooperative Societies Act and Model Bylaws, aggrieved farmers possess statutory legal recourse. Complaints logged on Raithu Velugu are automatically routed to the District Assistant Registrar of Cooperative Societies (ARCS) and District Central Cooperative Bank (DCCB) Inspection Wing.
        </p>

        <div className="pt-2">
          <button
            onClick={onLaunchKiosk}
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 cursor-pointer border border-slate-800 transition-colors"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Lodge a Complaint via Voice Kiosk</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
}
