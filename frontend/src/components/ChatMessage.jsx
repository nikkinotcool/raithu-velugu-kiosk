import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, ChevronRight, ShieldAlert, BookOpen, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { speakMessage, stopSpeech } from '../utils/speech';
import { printGrievanceReceipt } from '../utils/receiptGenerator';

const UI_LABELS = {
  te: {
    listen: 'వినండి',
    stop: 'ఆపు',
    ticketGen: 'ఫిర్యాదు నమోదైంది',
    trackBtn: 'స్థితి చూడండి',
    legalRef: 'చట్టపరమైన ఆధారాలు',
    printReceipt: 'రసీదు'
  },
  hi: {
    listen: 'सुनें',
    stop: 'रोकें',
    ticketGen: 'शिकायत दर्ज हुई',
    trackBtn: 'स्थिति देखें',
    legalRef: 'कानूनी संदर्भ',
    printReceipt: 'रसीद'
  },
  en: {
    listen: 'Listen',
    stop: 'Stop',
    ticketGen: 'Grievance Registered',
    trackBtn: 'Track Status',
    legalRef: 'Legal References',
    printReceipt: 'Receipt'
  },
  kn: {
    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    ticketGen: 'ದೂರು ದಾಖಲಾಗಿದೆ',
    trackBtn: 'ಸ್ಥಿತಿ ತಪಾಸಿಸಿ',
    legalRef: 'ಕಾನೂನು ಉಲ್ಲೇಖ',
    printReceipt: 'ರಸೀದಿ'
  },
  ta: {
    listen: 'கேளுங்கள்',
    stop: 'நிறுத்து',
    ticketGen: 'புகார் பதிவு',
    trackBtn: 'நிலை காண்க',
    legalRef: 'சட்ட குறிப்புகள்',
    printReceipt: 'ரசீது'
  },
  mr: {
    listen: 'ऐका',
    stop: 'थांबवा',
    ticketGen: 'तक्रार नोंदवली',
    trackBtn: 'स्थिती पहा',
    legalRef: 'कायदेशीर संदर्भ',
    printReceipt: 'पावती'
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
      setIsPlayingTTS(true);
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
    <div className={`flex w-full gap-2.5 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <span className="text-sm">🌾</span>
        </div>
      )}

      {/* Message Bubble — Apple iOS Style */}
      <div className={`max-w-[88%] sm:max-w-[80%] ${
        isUser
          ? 'bg-emerald-600 text-white rounded-[22px] rounded-br-[4px] px-5 py-3.5 shadow-2xs'
          : 'bg-white text-slate-900 rounded-[22px] rounded-bl-[4px] px-5 py-4 shadow-sm border border-slate-100/90'
      }`}>

        {/* Message text with comfortable larger iOS reading size & Markdown support */}
        <div className={`text-[15px] sm:text-[16px] leading-[1.6] ${
          isUser ? 'font-normal text-white whitespace-pre-wrap' : 'font-normal text-slate-800'
        }`}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 mt-2 mb-1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-900 mt-2 mb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-[15px] sm:text-[16px] font-bold text-emerald-950 mt-2.5 mb-1" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-[14px] sm:text-[15px] font-bold text-emerald-950 mt-2 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-800" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-slate-950" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-slate-700" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1.5" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-2 text-slate-800" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed pl-1" {...props} />,
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                  ) : (
                    <code className="block bg-slate-900 text-slate-100 p-2.5 rounded-xl text-xs font-mono my-2 overflow-x-auto" {...props} />
                  )
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Bottom Audio Player Bar for Assistant Messages */}
        {!isUser && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTTS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation ${
                isPlayingTTS
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label={isPlayingTTS ? t.stop : t.listen}
            >
              {isPlayingTTS ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{t.stop}</span>
                  <span className="flex gap-0.5 ml-1">
                    <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                    <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{t.listen}</span>
                </>
              )}
            </button>
            <span className="text-[11px] font-medium text-slate-400">Raithu Velugu AI</span>
          </div>
        )}

        {/* Official Grievance Ticket Card */}
        {message.grievance_ticket && (
          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span className="text-xs sm:text-sm font-bold text-slate-900">{t.ticketGen}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {message.grievance_ticket.status}
              </span>
            </div>

            {/* Tracking ID Row */}
            <div className="flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/70">
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">
                {message.grievance_ticket.tracking_id}
              </span>
              <button
                onClick={() => copyToClipboard(message.grievance_ticket.tracking_id)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                title="Copy ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Actions: Track Status & Print Slip */}
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={() => onTrackTicket(message.grievance_ticket.tracking_id)}
                className="flex-1 py-2 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-2xs"
              >
                <span>{t.trackBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => printGrievanceReceipt(message.grievance_ticket, currentUser)}
                className="py-2 px-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printReceipt}</span>
              </button>
            </div>
          </div>
        )}

        {/* Legal References (Clean accordion/card) */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.legalRef}</span>
            </div>
            <div className="space-y-1.5">
              {message.sources.map((src, i) => (
                <div key={i} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-[13px] leading-snug">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                    <span>{src.act_or_scheme}</span>
                    <span className="text-emerald-700 text-[11px] font-bold">{src.section}</span>
                  </div>
                  <p className="text-slate-600">{src.clause_text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Next Actions */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
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
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer text-left flex items-center gap-1.5 active:scale-95 ${
                    isGrievance
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-0'
                  }`}
                >
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
