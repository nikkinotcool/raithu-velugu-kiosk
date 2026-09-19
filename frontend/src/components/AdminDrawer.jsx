import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Clock, AlertTriangle, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function AdminDrawer({ isOpen, onClose, apiBase }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/grievances`);
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error('Failed to load grievances', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGrievances();
    }
  }, [isOpen]);

  const handleUpdateStatus = async (trackingId, newStatus) => {
    setUpdatingId(trackingId);
    try {
      const res = await fetch(`${apiBase}/grievances/${trackingId}/status?new_status=${encodeURIComponent(newStatus)}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        fetchGrievances();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl h-full bg-white border-l border-slate-200 p-6 flex flex-col shadow-2xl overflow-y-auto text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                PACS Officer & Audit Portal
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Grievance Tickets & Redressal Routing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchGrievances}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Refresh tickets"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="flex-1 py-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
            <span>Total Logged Complaints: <strong className="text-emerald-900">{grievances.length}</strong></span>
            <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          {grievances.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No grievance tickets logged yet. Submit a complaint in chat to see real-time routing here.
            </div>
          ) : (
            grievances.map((g) => (
              <div key={g.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{g.tracking_id}</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    g.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900">{g.category}</p>
                <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                  "{g.description}"
                </p>

                <div className="text-[11px] text-slate-600 font-medium flex justify-between pt-1">
                  <span>To: <strong className="text-emerald-900">{g.routed_to}</strong></span>
                  <span>{new Date(g.created_at).toLocaleDateString()}</span>
                </div>

                {/* Status Action Buttons for Demo */}
                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Update:</span>
                  <button
                    onClick={() => handleUpdateStatus(g.tracking_id, 'Under ARCS Inquiry')}
                    disabled={updatingId === g.tracking_id}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                  >
                    Under Inquiry
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(g.tracking_id, 'Resolved')}
                    disabled={updatingId === g.tracking_id}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-white transition-colors shadow-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
