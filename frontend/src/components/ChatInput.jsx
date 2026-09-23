import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Check, X } from 'lucide-react';

export default function ChatInput({ 
  onSendMessage, 
  disabled, 
  language,
  triggerVoice,
  onVoiceStateChange
}) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const baseTextRef = useRef('');

  const langMap = {
    te: 'te-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    en: 'en-IN'
  };

  // Setup SpeechRecognition with continuous listening and live interim results
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript + ' ';
          } else {
            interimStr += res[0].transcript;
          }
        }

        const currentSpeech = (finalStr + interimStr).trim();
        setLiveTranscript(currentSpeech);

        const fullText = (
          (baseTextRef.current ? baseTextRef.current + ' ' : '') + currentSpeech
        ).trim();

        setInputText(fullText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'no-speech') {
          // Do NOT terminate on silence; keep listening continuously
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert(
            language === 'te'
              ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతించండి.'
              : 'Microphone permission denied. Please allow microphone in your browser settings.'
          );
          stopRecording();
          return;
        }
        if (event.error === 'aborted') {
          return;
        }
      };

      recognition.onend = () => {
        // If still supposed to be recording, restart to prevent 1-second timeout in Chrome
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already active or starting
          }
        } else {
          setIsRecording(false);
          setLiveTranscript('');
          if (onVoiceStateChange) onVoiceStateChange(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        isRecordingRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [language]);

  // Listen to external voice trigger from home screen
  useEffect(() => {
    if (triggerVoice && !isRecordingRef.current) {
      startRecording();
    }
  }, [triggerVoice]);

  const startRecording = async () => {
    if (!recognitionSupported) {
      alert(
        language === 'te'
          ? 'మీ బ్రౌజర్‌లో వాయిస్ రికార్డింగ్ సపోర్ట్ లేదు. దయచేసి Chrome లేదా Edge ఉపయోగించండి.'
          : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    // Warm up hardware audio input if possible
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn('Microphone permission check:', err);
    }

    try {
      baseTextRef.current = inputText.trim();
      isRecordingRef.current = true;
      setIsRecording(true);
      setLiveTranscript('');
      if (onVoiceStateChange) onVoiceStateChange(true);

      if (recognitionRef.current) {
        recognitionRef.current.lang = langMap[language] || 'en-IN';
        recognitionRef.current.start();
      }
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setLiveTranscript('');
    if (onVoiceStateChange) onVoiceStateChange(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendVoiceMessage = () => {
    stopRecording();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleCancelVoice = () => {
    stopRecording();
    // restore base text if user wants to discard
    setInputText(baseTextRef.current);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    if (isRecording) {
      stopRecording();
    }
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const placeholders = {
    te: 'మీ ప్రశ్నను ఇక్కడ అడగండి లేదా మాట్లాడండి...',
    hi: 'अपना प्रश्न यहाँ पूछें या बोलकर बताएं...',
    en: 'Type your question or tap mic to speak...',
    kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕೇಳಿ లేదా ಮಾತನಾಡಿ...',
    ta: 'உங்கள் கேள்வியை இங்கே கேளுங்கள் அல்லது பேசுங்கள்...',
    mr: 'तुमचा प्रश्न येथे विचारा किंवा बोला...'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {/* Live Voice Assistant Active Floating Banner */}
      {isRecording && (
        <div className="mb-2 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white shadow-lg border border-emerald-500/40 flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Pulsing Mic Indicator */}
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-7 h-7 rounded-full bg-red-600/30 animate-ping absolute" />
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xs">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-300">
                  {language === 'te' ? 'వింటున్నాము... మాట్లాడండి' : (language === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... Speak now')}
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
                {liveTranscript || (language === 'te' ? 'మీ ప్రశ్నను చెప్పండి...' : 'Speak your question...')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCancelVoice}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Cancel Voice Input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleSendVoiceMessage}
              disabled={!inputText.trim()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'పూర్తయింది' : (language === 'hi' ? 'भेजें' : 'Done')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white border transition-all ${
        isRecording 
          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-700/10' 
          : 'border-slate-200/90 shadow-md shadow-slate-200/50 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15'
      }`}>
        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 touch-manipulation ${
            isRecording
              ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
              : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/80 bg-slate-50 border border-slate-200/70'
          }`}
          title={isRecording ? 'Stop Recording' : 'Voice Input (మాట్లాడండి)'}
          aria-label={isRecording ? 'Stop Recording' : 'Voice Input'}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 text-emerald-700" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? (language === 'te' ? '🎙️ వింటున్నాము... మాట్లాడండి...' : '🎙️ Listening... Speak now...') : (placeholders[language] || placeholders['en'])}
          disabled={disabled}
          className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50 font-medium"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:hover:bg-emerald-700 text-white font-semibold transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
