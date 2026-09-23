import React, { useState, useEffect, useRef } from 'react';
import { 
  X, AlertTriangle, Mic, MicOff, Send, CheckCircle2, 
  Printer, Download, ShieldAlert, ArrowRight, Building2, User, Phone, Loader2 
} from 'lucide-react';
import { printGrievanceReceipt, downloadReceiptFile } from '../utils/receiptGenerator';
import { fetchWithCloudFallback } from '../utils/apiClient';

const GRIEVANCE_CATEGORIES = {
  te: [
    { id: 'pmfby', name: 'PMFBY పంట నష్టం క్లెయిమ్ ఆలస్యం / తిరస్కరణ', dept: 'DAIGC బీమా కమిటీ' },
    { id: 'loan', name: 'PACS 4% క్రాప్ లోన్ లేదా వడ్డీ సబ్సిడీ సమస్య', dept: 'DCCB తనిఖీ విభాగం' },
    { id: 'fertilizer', name: 'ఎరువులు & విత్తనాల కోటా నిరాకరణ / బ్లాక్ మార్కెట్', dept: 'వ్యవసాయ విస్తరణ అధికారి' },
    { id: 'vote', name: 'సొసైటీ ఎన్నికల్లో ఓటు హక్కు నిరాకరణ', dept: 'సహకార ఎన్నికల అధికారి' },
    { id: 'secretary', name: 'PACS సెక్రటరీ లేదా పాలకవర్గ అవినీతి / దుష్ప్రవర్తన', dept: 'జిల్లా ARCS కార్యాలయం' },
    { id: 'other', name: 'ఇతర సహకార సంఘ సమస్య', dept: 'సహకార శాఖ రిజిస్ట్రార్' },
  ],
  en: [
    { id: 'pmfby', name: 'PMFBY Crop Loss Claim Delay / Rejection', dept: 'DAIGC Insurance Committee' },
    { id: 'loan', name: 'PACS 4% Crop Loan or Interest Subsidy Issue', dept: 'DCCB Inspection Wing' },
    { id: 'fertilizer', name: 'Fertilizer & Certified Seed Quota Denial', dept: 'Agricultural Extension Officer' },
    { id: 'vote', name: 'Denial of Voting Rights in PACS Elections', dept: 'Cooperative Election Authority' },
    { id: 'secretary', name: 'PACS Secretary / Management Misconduct', dept: 'District ARCS Office' },
    { id: 'other', name: 'Other Cooperative Society Grievance', dept: 'Registrar of Cooperative Societies' },
  ]
};

export default function LodgeGrievanceModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  language = 'te', 
  apiBase, 
  onGrievanceCreated,
  initialCategory = ''
}) {
  const categories = GRIEVANCE_CATEGORIES[language === 'te' ? 'te' : 'en'] || GRIEVANCE_CATEGORIES['en'];
  
  const [category, setCategory] = useState(categories[0].name);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Speech-to-Text State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const baseDescRef = useRef('');
  const capturedTextRef = useRef('');

  useEffect(() => {
    if (initialCategory) {
      const match = categories.find((c) => c.id === initialCategory || c.name.includes(initialCategory));
      if (match) setCategory(match.name);
    }
  }, [initialCategory, categories]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const langMap = {
        te: 'te-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        en: 'en-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) finalStr += res[0].transcript + ' ';
          else interimStr += res[0].transcript;
        }
        const text = (finalStr + interimStr).trim();
        if (text) {
          capturedTextRef.current = text;
          const full = ((baseDescRef.current ? baseDescRef.current + ' ' : '') + text).trim();
          setDescription(full);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      if (typeof window !== 'undefined' && window.MediaRecorder) {
        setSpeechSupported(true);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        } catch (e) {}
      }
    };
  }, [language]);

  const toggleRecording = async () => {
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      let audioBlob = null;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          await new Promise((resolve) => {
            mediaRecorderRef.current.onstop = () => {
              const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
              audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
              resolve();
            };
            mediaRecorderRef.current.stop();
          });
        } catch (e) {}
      }

      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        } catch (e) {}
        mediaStreamRef.current = null;
      }

      // If Web Speech already worked, done
      if (capturedTextRef.current.trim()) return;

      // Otherwise, transcribe with Whisper via /api/stt
      if (audioBlob && audioBlob.size > 1000) {
        setIsProcessingSTT(true);
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'complaint.webm');
          formData.append('language', language);

          const res = await fetchWithCloudFallback('/stt', {
            method: 'POST',
            body: formData
          }, apiBase);

          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              const full = ((baseDescRef.current ? baseDescRef.current + ' ' : '') + data.text).trim();
              setDescription(full);
            }
          }
        } catch (err) {
          console.warn('STT fallback error:', err);
        } finally {
          setIsProcessingSTT(false);
        }
      }
    } else {
      let stream = null;
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
          });
          mediaStreamRef.current = stream;
        }
      } catch (err) {
        alert(
          language === 'te'
            ? 'దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతి ఇవ్వండి.'
            : 'Please allow microphone access in your browser settings.'
        );
        return;
      }

      baseDescRef.current = description.trim();
      capturedTextRef.current = '';
      isRecordingRef.current = true;
      setIsRecording(true);

      audioChunksRef.current = [];
      if (stream && typeof window !== 'undefined' && window.MediaRecorder) {
        try {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
          };
          recorder.start(250);
          mediaRecorderRef.current = recorder;
        } catch (e) {}
      }

      if (recognitionRef.current) {
        try {
          const langMap = {
            te: 'te-IN',
            hi: 'hi-IN',
            kn: 'kn-IN',
            ta: 'ta-IN',
            mr: 'mr-IN',
            en: 'en-IN'
          };
          recognitionRef.current.lang = langMap[language] || 'en-IN';
          recognitionRef.current.start();
        } catch (e) {}
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage(language === 'te' ? 'దయచేసి మీ సమస్య వివరాలను నమోదు చేయండి.' : 'Please describe your grievance.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        category,
        description: description.trim(),
        complainant_name: currentUser?.full_name || 'రైతు (Farmer)',
        complainant_phone: currentUser?.phone_number || '',
        pacs_name: currentUser?.pacs_name || 'Kandi Primary Agricultural Credit Society',
        district: currentUser?.district || 'Sangareddy',
        state: currentUser?.state || 'Telangana',
        user_id: currentUser?.id || null
      };

      const res = await fetchWithCloudFallback('/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, apiBase);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to submit grievance');
      }

      const data = await res.json();
      setCreatedTicket(data);
      if (onGrievanceCreated) {
        onGrievanceCreated(data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to lodge grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    if (createdTicket) {
      printGrievanceReceipt(createdTicket, currentUser);
    }
  };

  const handleDownloadFile = () => {
    if (createdTicket) {
      downloadReceiptFile(createdTicket, currentUser);
    }
  };

  const handleClose = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    setDescription('');
    setCreatedTicket(null);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        data-lang={language}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">
                {language === 'te' ? 'అధికారిక ఫిర్యాదు నమోదు' : 'Lodge Official Grievance'}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'te' ? 'PACS చట్టపరమైన పరిష్కార పోర్టల్' : 'PACS Statutory Redressal Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {createdTicket ? (
            /* SUCCESS TICKET CREATED VIEW */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {language === 'te' ? 'ఫిర్యాదు విజయవంతంగా నమోదైంది!' : 'Grievance Registered Successfully!'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'te' ? 'మీ ఫిర్యాదు సంబంధిత అధికారికి పంపబడింది.' : 'Your grievance has been forwarded to the statutory authority.'}
                </p>
              </div>

              {/* Ticket Card Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Tracking ID
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {createdTicket.tracking_id}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800 text-right">{createdTicket.category}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Routed Authority:</span>
                  <span className="font-semibold text-blue-700 text-right">{createdTicket.routed_to}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Mandated SLA:</span>
                  <span className="font-bold text-amber-700">7 to 15 Working Days</span>
                </div>
              </div>

              {/* ACTION BUTTONS: Download Receipt & Print */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'te' ? 'రసీదు ప్రింట్ / సేవ్ (PDF)' : 'Print / Save Official Receipt (PDF)'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'రసీదు డౌన్‌లోడ్' : 'Download File'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{language === 'te' ? 'పూర్తయింది' : 'Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* COMPLAINT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Member Summary Pill */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-semibold text-slate-800">{currentUser?.full_name || 'Member'}</span>
                  <span className="text-[10px] text-slate-400">({currentUser?.phone_number || 'Kiosk'})</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                  🏛️ {currentUser?.pacs_name || 'Kandi PACS'}
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'te' ? 'ఫిర్యాదు విభాగం (Issue Category)' : 'Grievance Category'} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complaint Text Box with Integrated Voice Mic */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {language === 'te' ? 'సమస్య సమగ్ర వివరాలు' : 'Description of Grievance'} *
                  </label>
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isRecording
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-700" />}
                      <span>{isRecording ? (language === 'te' ? 'వింటున్నాము...' : 'Listening...') : (language === 'te' ? '🎙️ మాట్లాడండి (Voice)' : '🎙️ Speak (Voice Mic)')}</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      isRecording
                        ? (language === 'te' ? '🎙️ మాట్లాడండి... మీ మాటలు ఇక్కడ రికార్డ్ అవుతాయి...' : '🎙️ Speak clearly... your words will appear here...')
                        : (language === 'te' 
                            ? 'ఉదాహరణ: నా PMFBY పంట బీమా క్లెయిమ్ 72 గంటల్లో సమర్పించినప్పటికీ ఇంకా పరిష్కారం కాలేదు...' 
                            : 'Provide dates, PACS personnel involved, and specific resolution required...')
                    }
                    className={`w-full p-3.5 rounded-xl bg-slate-50 border text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                      isRecording ? 'border-red-400 ring-2 ring-red-400/20 bg-red-50/20' : 'border-slate-200 focus:border-emerald-600'
                    }`}
                  />
                  {isRecording && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-white/90 px-2 py-0.5 rounded-full border border-red-200 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                      <span>Audio Recording Active</span>
                    </div>
                  )}
                  {isProcessingSTT && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>{language === 'te' ? 'AI మీ వాయిస్‌ని టెక్స్ట్‌గా మారుస్తోంది...' : 'AI is transcribing your voice...'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-800/20 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? (language === 'te' ? 'సమర్పిస్తోంది...' : 'Submitting...') : (language === 'te' ? 'ఫిర్యాదు సమర్పించండి & రసీదు పొందండి' : 'Submit Grievance & Get Receipt')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
