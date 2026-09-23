import React, { useState, useEffect } from 'react';
import { 
  X, RefreshCw, CheckCircle, Clock, AlertTriangle, ShieldCheck, 
  FileSpreadsheet, Download, Search, Filter
} from 'lucide-react';
import { fetchWithCloudFallback } from '../utils/apiClient';

export default function AdminDrawer({ isOpen, onClose, apiBase }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Submitted - Under Review' | 'Under ARCS Inquiry' | 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetchWithCloudFallback('/grievances', {}, apiBase);
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
      const res = await fetchWithCloudFallback(`/grievances/${trackingId}/status?new_status=${encodeURIComponent(newStatus)}`, {
        method: 'PATCH'
      }, apiBase);
      if (res.ok) {
        fetchGrievances();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (!grievances.length) return;
    const headers = ['Tracking ID', 'Date Logged', 'Complainant Name', 'Phone', 'PACS Society', 'Category', 'Description', 'Routed Authority', 'Status'];
    const rows = grievances.map(g => [
      `"${g.tracking_id || ''}"`,
      `"${new Date(g.created_at).toLocaleDateString('en-IN')}"`,
      `"${(g.complainant_name || '').replace(/"/g, '""')}"`,
      `"${g.complainant_phone || ''}"`,
      `"${(g.pacs_name || '').replace(/"/g, '""')}"`,
      `"${(g.category || '').replace(/"/g, '""')}"`,
      `"${(g.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(g.routed_to || '').replace(/"/g, '""')}"`,
      `"${g.status || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PACS_Grievance_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const filteredGrievances = grievances.filter((g) => {
    const matchesFilter = filterStatus === 'ALL' || g.status === filterStatus;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      (g.tracking_id || '').toLowerCase().includes(query) ||
      (g.category || '').toLowerCase().includes(query) ||
      (g.complainant_name || '').toLowerCase().includes(query) ||
      (g.description || '').toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

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
                National Cooperative Database (NCD) Grievance Registry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              disabled={!grievances.length}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Export official CSV audit report for ARCS inspection"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
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

        {/* Filter & Search Bar */}
        <div className="pt-3 pb-2 space-y-2.5 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, farmer name, category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({grievances.length})
            </button>
            <button
              onClick={() => setFilterStatus('Submitted - Under Review')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'Submitted - Under Review'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Under Review ({grievances.filter(g => g.status === 'Submitted - Under Review').length})
            </button>
            <button
              onClick={() => setFilterStatus('Under ARCS Inquiry')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'Under ARCS Inquiry'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              Inquiry ({grievances.filter(g => g.status === 'Under ARCS Inquiry').length})
            </button>
            <button
              onClick={() => setFilterStatus('Resolved')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'Resolved'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Resolved ({grievances.filter(g => g.status === 'Resolved').length})
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="flex-1 py-3 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
            <span>Showing: <strong className="text-emerald-900">{filteredGrievances.length}</strong> of {grievances.length} complaints</span>
            <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          {filteredGrievances.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching grievance tickets found.
            </div>
          ) : (
            filteredGrievances.map((g) => (
              <div key={g.id || g.tracking_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{g.tracking_id}</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    g.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : (g.status === 'Under ARCS Inquiry'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300')
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">{g.category}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Complainant: <strong>{g.complainant_name}</strong> {g.complainant_phone ? `(${g.complainant_phone})` : ''}</p>
                </div>

                <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  "{g.description}"
                </p>

                <div className="text-[11px] text-slate-600 font-medium flex justify-between pt-0.5 flex-wrap gap-1">
                  <span>Routing: <strong className="text-emerald-900">{g.routed_to}</strong></span>
                  <span className="text-slate-400 font-mono">{new Date(g.created_at).toLocaleDateString('en-IN')}</span>
                </div>

                {/* Status Action Buttons for Officer */}
                <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Update Action:</span>
                  <button
                    onClick={() => handleUpdateStatus(g.tracking_id, 'Under ARCS Inquiry')}
                    disabled={updatingId === g.tracking_id || g.status === 'Under ARCS Inquiry'}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-900 border border-blue-200 transition-colors cursor-pointer"
                  >
                    Send to Inquiry
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(g.tracking_id, 'Resolved')}
                    disabled={updatingId === g.tracking_id || g.status === 'Resolved'}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
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
