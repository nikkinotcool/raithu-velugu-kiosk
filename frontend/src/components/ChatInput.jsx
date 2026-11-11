import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Mic, MicOff, Check, X, Loader2 } from 'lucide-react';
import { fetchWithCloudFallback } from '../utils/apiClient';

export default function ChatInput({
  onSendMessage,
  disabled,
  language,
  triggerVoice,
  onVoiceStateChange
}) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const baseTextRef = useRef('');
  const capturedTextRef = useRef('');

  const langMap = {
    te: 'te-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    en: 'en-IN'
  };

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
        if (currentSpeech) {
          capturedTextRef.current = currentSpeech;
          setLiveTranscript(currentSpeech);

          const fullText = (
            (baseTextRef.current ? baseTextRef.current + ' ' : '') + currentSpeech
          ).trim();

          setInputText(fullText);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      if (typeof window !== 'undefined' && window.MediaRecorder) {
        setRecognitionSupported(true);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaStreamRef.current) {
        try { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
      }
    };
  }, [language]);

  useEffect(() => {
    if (triggerVoice && !isRecordingRef.current) {
      startRecording();
    }
  }, [triggerVoice]);

  const startRecording = async () => {
    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      alert(
        language === 'te'
          ? 'దయచేసి మైక్రోఫోన్ అనుమతి (Allow Microphone) ఇవ్వండి.'
          : 'Please allow microphone access in your browser settings.'
      );
      return;
    }

    baseTextRef.current = inputText.trim();
    capturedTextRef.current = '';
    setLiveTranscript('');
    isRecordingRef.current = true;
    setIsRecording(true);
    if (onVoiceStateChange) onVoiceStateChange(true);

    audioChunksRef.current = [];
    if (stream && typeof window !== 'undefined' && window.MediaRecorder) {
      try {
        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
          else mimeType = '';
        }
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(250);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn('MediaRecorder error:', recErr);
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = langMap[language] || 'en-IN';
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const stopRecording = async (shouldSendDirectly = false) => {
    isRecordingRef.current = false;
    setIsRecording(false);
    if (onVoiceStateChange) onVoiceStateChange(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
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
      try { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
      mediaStreamRef.current = null;
    }

    let finalSpeech = capturedTextRef.current.trim();

    // Groq Whisper Large V3 with conditioned Telugu prompt
    if (audioBlob && audioBlob.size > 300) {
      setIsProcessingSTT(true);
      try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'speech.webm');
        formData.append('language', language);

        const res = await fetchWithCloudFallback('/stt', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text && data.text.trim()) {
            finalSpeech = data.text.trim();
          }
        }
      } catch (sttErr) {
        console.warn('STT request failed:', sttErr);
      } finally {
        setIsProcessingSTT(false);
      }
    }

    if (finalSpeech) {
      const fullText = (
        (baseTextRef.current ? baseTextRef.current + ' ' : '') + finalSpeech
      ).trim();
      setInputText(fullText);
      setLiveTranscript(finalSpeech);

      if (shouldSendDirectly && fullText) {
        onSendMessage(fullText);
        setInputText('');
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(false);
    } else {
      startRecording();
    }
  };

  const handleSendVoiceMessage = () => {
    stopRecording(true);
  };

  const handleCancelVoice = () => {
    stopRecording(false);
    setInputText(baseTextRef.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || isProcessingSTT) return;
    if (isRecording) {
      await stopRecording(true);
      return;
    }
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const placeholders = {
    te: 'రైతు వెలుగును ఏదైనా అడగండి...',
    hi: 'रैतु वेलुगु से कुछ भी पूछें...',
    en: 'Ask Raithu Velugu anything...',
    kn: 'ರೈತು ವೆಲುಗು ಅವರಲ್ಲಿ ಕೇಳಿ...',
    ta: 'ரைது வேலுகுவிடம் கேளுங்கள்...',
    mr: 'रैतू वेलूगूकडे काहीही विचारा...'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">

      {/* iOS Active Recording Capsule Banner */}
      {isRecording && (
        <div className="mb-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-150">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-5 h-5 rounded-full bg-red-500/40 animate-ping absolute" />
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Mic className="w-3 h-3 animate-pulse" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">
              {liveTranscript || (language === 'te' ? 'మాట్లాడండి, వింటున్నాము...' : 'Listening...')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCancelVoice}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSendVoiceMessage}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs sm:text-sm flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'పూర్తి' : 'Done'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Processing Spinner Banner */}
      {isProcessingSTT && (
        <div className="mb-2 px-4 py-2 rounded-2xl bg-slate-900 text-white flex items-center gap-2.5 shadow-md">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm text-slate-200 font-medium">
            {language === 'te' ? 'AI మీ వాయిస్‌ని స్పష్టంగా టెక్స్ట్‌గా మారుస్తోంది...' : 'Transcribing voice...'}
          </span>
        </div>
      )}

      {/* iOS Style Floating Capsule Input Bar */}
      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xl border transition-all ${
        isRecording
          ? 'border-red-500 ring-2 ring-red-500/20 shadow-lg'
          : 'border-slate-200 shadow-md focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15'
      }`}>

        {/* Mic Dictation Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 touch-manipulation ${
            isRecording
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'
          }`}
          title={isRecording ? 'Stop Recording' : 'Voice Input (మాట్లాడండి)'}
          aria-label={isRecording ? 'Stop Recording' : 'Voice Input'}
        >
          {isRecording ? (
            <MicOff className="w-4.5 h-4.5 animate-pulse" />
          ) : (
            <Mic className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Text Input with Larger Apple-Style Typography */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecording
              ? (language === 'te' ? 'వింటున్నాము... మాట్లాడండి...' : 'Listening...')
              : (placeholders[language] || placeholders['en'])
          }
          disabled={disabled}
          className="flex-1 bg-transparent py-1 text-[15px] sm:text-[16px] text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50"
        />

        {/* Circular Up-Arrow Send Button (iMessage / ChatGPT style) */}
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 shadow-2xs ${
            inputText.trim() && !disabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
}
