import React, { useState } from 'react';
import { X, Search, ShieldCheck, Clock, CheckCircle2, AlertCircle, Building2, User, Phone, MapPin } from 'lucide-react';

export default function GrievanceTrackerModal({ isOpen, onClose, initialTrackingId, apiBase }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId || '');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await fetch(`${apiBase}/grievances/track/${encodeURIComponent(trackingId.trim())}`);
      if (!res.ok) {
        throw new Error('No ticket found with this Tracking ID. Please double check the number.');
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Track Grievance Redressal Status
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              National Cooperative Dispute & Redressal Registry
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
              placeholder="e.g. RV-GRV-20260908-ABC123"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm transition-all cursor-pointer shadow-md shadow-emerald-800/20"
          >
            {loading ? 'Searching...' : 'Track'}
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
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Status</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {ticket.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Category:</span>
                <span className="font-bold text-slate-900">{ticket.category}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Forwarded Officer / Authority:</span>
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  {ticket.routed_to}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Registered Complaint:</span>
                <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 italic mt-1 shadow-xs">
                  "{ticket.description}"
                </p>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 text-[11px] font-medium">
                <span>Registered: {new Date(ticket.created_at).toLocaleString()}</span>
                <span className="text-emerald-800 font-bold">Mandatory SLA: 7 Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
