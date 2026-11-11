import React, { useState, useEffect } from 'react';
import { Bot, User, BookOpen, ShieldAlert, Volume2, VolumeX, ChevronRight, Copy, Check, Printer, Download, AlertCircle } from 'lucide-react';
import { speakMessage, stopSpeech } from '../utils/speech';
import { printGrievanceReceipt, downloadReceiptFile } from '../utils/receiptGenerator';

const UI_LABELS = {
  te: {
    advisor: 'రైతు వెలుగు',
    listen: 'వినండి',
    stop: 'ఆపు',
    ticketGen: 'ఫిర్యాదు నమోదైంది',
    trackBtn: 'స్థితి చూడండి',
    legalRef: 'చట్టపరమైన సూచనలు',
    printReceipt: 'రసీదు PDF',
    downloadSlip: 'డౌన్‌లోడ్'
  },
  hi: {
    advisor: 'रैतु वेलुगु',
    listen: 'सुनें',
    stop: 'रोकें',
    ticketGen: 'शिकायत दर्ज हुई',
    trackBtn: 'स्थिति देखें',
    legalRef: 'कानूनी संदर्भ',
    printReceipt: 'रसीद PDF',
    downloadSlip: 'डाउनलोड'
  },
  en: {
    advisor: 'Raithu Velugu',
    listen: 'Listen',
    stop: 'Stop',
    ticketGen: 'Grievance Registered',
    trackBtn: 'Track Status',
    legalRef: 'Legal References',
    printReceipt: 'Print Receipt',
    downloadSlip: 'Download'
  },
  kn: {
    advisor: 'ರೈತು ವೆಲುಗು',
    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    ticketGen: 'ದೂರು ದಾಖಲಾಗಿದೆ',
    trackBtn: 'ಸ್ಥಿತಿ ತಪಾಸಿಸಿ',
    legalRef: 'ಕಾನೂನು ಉಲ್ಲೇಖ',
    printReceipt: 'ರಸೀದಿ PDF',
    downloadSlip: 'ಡೌನ್‌ಲೋಡ್'
  },
  ta: {
    advisor: 'ரைது வேலுகு',
    listen: 'கேளுங்கள்',
    stop: 'நிறுத்து',
    ticketGen: 'புகார் பதிவு',
    trackBtn: 'நிலை காண்க',
    legalRef: 'சட்ட குறிப்புகள்',
    printReceipt: 'ரசீது PDF',
    downloadSlip: 'பதிவிறக்கு'
  },
  mr: {
    advisor: 'रैतू वेलुगू',
    listen: 'ऐका',
    stop: 'थांबवा',
    ticketGen: 'तक्रार नोंदवली',
    trackBtn: 'स्थिती पहा',
    legalRef: 'कायदेशीर संदर्भ',
    printReceipt: 'पावती PDF',
    downloadSlip: 'डाउनलोड'
  }
};

export default function ChatMessage({
  message,
  currentLanguage,
  currentUser,
  onTrackTicket,
  onSelectSuggestion,
  onOpenLodgeGrievance
}) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const lang = currentLanguage || message.language || 'en';
  const t = UI_LABELS[lang] || UI_LABELS['en'];

  useEffect(() => {
    return () => {
      if (isPlayingTTS) stopSpeech();
    };
  }, [isPlayingTTS]);

  const handleTTS = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isPlayingTTS) {
      stopSpeech();
      setIsPlayingTTS(false);
    } else {
      speakMessage({
        text: message.content,
        language: lang,
        onStart: () => setIsPlayingTTS(true),
        onEnd: () => setIsPlayingTTS(false),
        onError: () => setIsPlayingTTS(false)
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs">🌾</span>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[85%] sm:max-w-[78%] ${
        isUser
          ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5'
          : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100'
      }`}>

        {/* Assistant header row */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
              {t.advisor}
            </span>
            {/* TTS button — pill style */}
            <button
              type="button"
              onClick={handleTTS}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation ${
                isPlayingTTS
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
              }`}
              aria-label={isPlayingTTS ? t.stop : t.listen}
            >
              {isPlayingTTS ? (
                <>
                  <VolumeX className="w-3 h-3 shrink-0" />
                  <span>{t.stop}</span>
                  <span className="flex gap-0.5 ml-0.5">
                    <span className="w-0.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                    <span className="w-0.5 h-3.5 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 shrink-0" />
                  <span>{t.listen}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Message text */}
        <div className={`text-sm leading-relaxed whitespace-pre-line ${isUser ? 'font-medium' : 'text-slate-700 font-normal'}`}>
          {message.content}
        </div>

        {/* Official Grievance Ticket */}
        {message.grievance_ticket && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">{t.ticketGen}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                {message.grievance_ticket.status}
              </span>
            </div>

            {/* Tracking ID row */}
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
              <span className="font-mono text-xs font-bold text-slate-700">
                {message.grievance_ticket.tracking_id}
              </span>
              <button
                onClick={() => copyToClipboard(message.grievance_ticket.tracking_id)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => printGrievanceReceipt(message.grievance_ticket, currentUser)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3 h-3" />
                <span>{t.printReceipt}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadReceiptFile(message.grievance_ticket, currentUser)}
                className="py-1.5 px-3 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">{t.downloadSlip}</span>
              </button>
            </div>

            <button
              onClick={() => onTrackTicket(message.grievance_ticket.tracking_id)}
              className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{t.trackBtn}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Legal References */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center gap-1 mb-2">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.legalRef}</span>
            </div>
            <div className="space-y-1.5">
              {message.sources.map((src, i) => (
                <div key={i} className="px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] leading-snug">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                    <span>{src.act_or_scheme}</span>
                    <span className="text-emerald-700 text-[10px]">{src.section}</span>
                  </div>
                  <p className="text-slate-500">{src.clause_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Action Chips */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.suggested_actions.map((act, i) => {
              const isGrievance =
                act.toLowerCase().includes('complaint') ||
                act.toLowerCase().includes('grievance') ||
                act.includes('ఫిర్యాదు') ||
                act.includes('शिकायत');

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isGrievance && onOpenLodgeGrievance) {
                      onOpenLodgeGrievance();
                    } else {
                      onSelectSuggestion(act);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer text-left flex items-center gap-1 ${
                    isGrievance
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200'
                  }`}
                >
                  {isGrievance ? (
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                  )}
                  <span>{act}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
