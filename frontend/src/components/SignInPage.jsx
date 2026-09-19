import React, { useState } from 'react';
import { User, Shield, Phone, Key, ArrowRight, Globe, CheckCircle2, AlertCircle, UserPlus, LogIn } from 'lucide-react';

const LANGUAGES = [
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🌾' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🌾' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🌾' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🌾' },
];

export default function SignInPage({ language, onLanguageChange, onLoginSuccess, apiBase }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' | 'officer'
  
  // Sign In Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [username, setUsername] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('Sangareddy');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFarmerLogin = async (e) => {
    e?.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/auth/farmer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          password: farmerPassword.trim() || 'farmer123',
          language
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Sign-in failed. Please verify your credentials.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !officerPassword.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/auth/officer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: username.trim(), password: officerPassword.trim() })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid officer credentials.');
      }
      const data = await res.json();
      onLoginSuccess(data.user, data.access_token);
    } catch (err) {
      setError(err.message || 'Officer login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError('Please provide your name, 10-digit mobile number, and password.');
      return;
    }
    if (regPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regName.trim(),
          phone_number: regPhone.trim(),
          password: regPassword.trim(),
          language,
          district: regDistrict.trim(),
          mandal: 'Kandi',
          pacs_name: 'Kandi Primary Agricultural Credit Society'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Registration failed.');
      }

      const data = await res.json();
      setSuccessMsg(`ఖాతా నమోదైంది! ID: ${data.user.member_id}`);
      setTimeout(() => {
        onLoginSuccess(data.user, data.access_token);
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoFarmer = () => {
    setPhoneNumber('9876543210');
    setFarmerPassword('farmer123');
    setActiveTab('farmer');
  };

  const fillDemoOfficer = () => {
    setUsername('SEC-SRD-09');
    setOfficerPassword('officer123');
    setActiveTab('officer');
  };

  const handleWalkInGuest = () => {
    const guestUser = {
      id: 9999,
      full_name: language === 'te' ? 'రైతు (అతిథి)' : 'Walk-in Farmer (Guest)',
      phone_number: 'Walk-in',
      member_id: 'GUEST-KIOSK',
      role: 'farmer',
      preferred_language: language,
      pacs_name: 'Kandi Primary Agricultural Credit Society',
      village: 'Kandi',
      district: 'Sangareddy',
      state: 'Telangana'
    };
    onLoginSuccess(guestUser, 'token-guest-session');
  };

  return (
    <div 
      data-lang={language}
      className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-emerald-600 selection:text-white"
    >
      {/* Sleek Minimal Header */}
      <header className="px-4 py-3 sm:px-8 border-b border-slate-200/70 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🌾
            </div>
            <div>
              <span className="font-heading text-base font-bold text-slate-900 block leading-tight">
                రైతు వెలుగు
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Primary Agricultural Cooperative Society
              </span>
            </div>
          </div>

          {/* Clean Language Selector */}
          <div className="relative flex items-center">
            <Globe className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-7 pr-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Centered Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40">
          {/* Brand Heading */}
          <div className="text-center mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {authMode === 'signin' 
                ? (language === 'te' ? 'పోర్టల్ ప్రవేశం' : 'Portal Sign In')
                : (language === 'te' ? 'కొత్త రైతు నమోదు' : 'New Member Registration')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {language === 'te' ? 'PACS చట్టపరమైన & సహకార సహాయక కియోస్క్' : 'PACS Legal & Governance Assistance Kiosk'}
            </p>
          </div>

          {/* Mode Segmented Switcher (Sign In vs Register) */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'te' ? 'లాగిన్' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'te' ? 'నమోదు' : 'Register'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 mb-4 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 mb-4 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {authMode === 'signin' ? (
            <div>
              {/* Role Toggle Pill: Farmer vs Officer */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('farmer'); setError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'farmer'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'రైతు / సభ్యుడు' : 'Farmer / Member'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('officer'); setError(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'officer'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'సొసైటీ అధికారి' : 'PACS Officer'}</span>
                </button>
              </div>

              {activeTab === 'farmer' ? (
                <form onSubmit={handleFarmerLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {language === 'te' ? 'మొబైల్ నంబర్ లేదా ID' : 'Mobile Number or Member ID'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {language === 'te' ? 'పాస్‌వర్డ్ / PIN' : 'Password or PIN'}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={farmerPassword}
                        onChange={(e) => setFarmerPassword(e.target.value)}
                        placeholder="•••••••• (డెమో: farmer123)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !phoneNumber.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98 mt-2"
                  >
                    <span>{loading ? 'Verifying...' : (language === 'te' ? 'ప్రవేశించండి' : 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Tap Quick Demo Helper */}
                  <div className="pt-2 text-center flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={fillDemoFarmer}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                    >
                      {language === 'te' ? '⚡ డెమో క్రెడెన్షియల్స్ నింపండి' : '⚡ Fill Demo Account'}
                    </button>
                    <button
                      type="button"
                      onClick={handleWalkInGuest}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      {language === 'te' ? 'అతిథి ప్రవేశం' : 'Guest Walk-in'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOfficerLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Officer ID
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="SEC-SRD-09"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        placeholder="•••••••• (demo: officer123)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !username.trim() || !officerPassword.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 mt-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Officer Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={fillDemoOfficer}
                      className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline"
                    >
                      ⚡ Fill Demo PACS Secretary (SEC-SRD-09)
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* REGISTER VIEW */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'రైతు పూర్తి పేరు' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. K. Mallesh"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? '10-అంకెల మొబైల్ నంబర్' : 'Mobile Number (10 Digits)'} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'పాస్‌వర్డ్ లేదా 4-అంకెల PIN' : 'Password or PIN'} *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'జిల్లా' : 'District'}
                </label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !regName.trim() || !regPhone.trim() || !regPassword.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98 mt-3"
              >
                <span>{loading ? 'Creating...' : (language === 'te' ? 'ఖాతా సృష్టించండి' : 'Create Account')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  {language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి' : 'Already registered? Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Grounded Minimal Footer */}
      <footer className="py-3 px-4 text-center text-[11px] text-slate-400 font-medium border-t border-slate-200/60 bg-white">
        <span>Ministry of Cooperation • National Cooperative Database (NCD) • Govt. of India</span>
      </footer>
    </div>
  );
}
