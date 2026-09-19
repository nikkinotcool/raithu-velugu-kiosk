import React, { useState } from 'react';
import { X, User, Shield, Phone, Key, ArrowRight, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, apiBase }) {
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' or 'officer'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFarmerSubmit = async (e) => {
    e?.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/auth/farmer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber.trim() })
      });
      if (!res.ok) {
        throw new Error('Login failed. Please verify your mobile or member ID.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerSubmit = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/auth/officer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: username.trim(), password: password.trim() })
      });
      if (!res.ok) {
        throw new Error('Invalid officer credentials or unauthorized society access.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
      onClose();
    } catch (err) {
      setError(err.message || 'Officer login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFarmer = () => {
    setPhoneNumber('9876543210');
    setTimeout(() => {
      fetch(`${apiBase}/auth/farmer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: '9876543210' })
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            onLoginSuccess(d.user, d.access_token);
            onClose();
          }
        });
    }, 100);
  };

  const handleQuickDemoOfficer = () => {
    setUsername('SEC-SRD-09');
    setPassword('officer123');
    setTimeout(() => {
      fetch(`${apiBase}/auth/officer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: 'SEC-SRD-09', password: 'officer123' })
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            onLoginSuccess(d.user, d.access_token);
            onClose();
          }
        });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Cooperative Portal Login
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Kandi PACS • Ministry of Cooperation (Govt of India)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('farmer'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'farmer'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Farmer / Member</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('officer'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'officer'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>PACS Officer / Staff</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Farmer Login Form */}
        {activeTab === 'farmer' ? (
          <form onSubmit={handleFarmerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Mobile Number or PACS Member ID
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 9876543210 or PACS-KD-1042"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                New member? Entering your mobile number will create a verified kiosk session.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20"
            >
              <span>{loading ? 'Verifying...' : 'Access Kiosk Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* One-tap demo button */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={handleQuickDemoFarmer}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                🌾 Quick Demo: Login as K. Ramu (Active Member)
              </button>
            </div>
          </form>
        ) : (
          /* Officer Login Form */
          <form onSubmit={handleOfficerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Officer ID / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. SEC-SRD-09"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{loading ? 'Authenticating...' : 'Officer Login (Admin Access)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* One-tap demo officer */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={handleQuickDemoOfficer}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                🏛️ Quick Demo: Login as PACS Secretary
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
