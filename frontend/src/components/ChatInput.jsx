import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Check, X, Loader2 } from 'lucide-react';
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

  // Setup Web SpeechRecognition
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
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
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
      console.warn('Microphone permission error:', err);
      alert(
        language === 'te'
          ? 'దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ అనుమతి (Allow Microphone) ఇవ్వండి.'
          : 'Microphone permission denied. Please allow microphone in your browser settings.'
      );
      return;
    }

    baseTextRef.current = inputText.trim();
    capturedTextRef.current = '';
    setLiveTranscript('');
    isRecordingRef.current = true;
    setIsRecording(true);
    if (onVoiceStateChange) onVoiceStateChange(true);

    // Start MediaRecorder for Whisper AI transcription
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
        console.warn('MediaRecorder start error:', recErr);
      }
    }

    // Start Web SpeechRecognition for live visual feedback
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = langMap[language] || 'en-IN';
        recognitionRef.current.start();
      } catch (recStartErr) {
        console.warn('SpeechRecognition start error:', recStartErr);
      }
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
      } catch (recStopErr) {
        console.warn('MediaRecorder stop error:', recStopErr);
      }
    }

    if (mediaStreamRef.current) {
      try { mediaStreamRef.current.getTracks().forEach((track) => track.stop()); } catch (e) {}
      mediaStreamRef.current = null;
    }

    let finalSpeech = capturedTextRef.current.trim();

    // Groq Whisper Large V3 — highest accuracy for Telugu & Indic languages
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
        console.warn('Whisper STT request failed, using Web Speech transcript:', sttErr);
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
    te: 'మీ ప్రశ్నను అడగండి...',
    hi: 'अपना प्रश्न पूछें...',
    en: 'Ask your question...',
    kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...',
    ta: 'உங்கள் கேள்வி கேளுங்கள்...',
    mr: 'तुमचा प्रश्न विचारा...'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">

      {/* Recording Banner */}
      {isRecording && (
        <div className="mb-2 px-3 py-2.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mic pulse */}
            <div className="relative shrink-0">
              <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <Mic className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-400">
                {language === 'te' ? 'వింటున్నాము...' : language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
              </p>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {liveTranscript || (language === 'te' ? 'మాట్లాడండి...' : 'Speak now...')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCancelVoice}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleSendVoiceMessage}
              disabled={!inputText.trim()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all"
            >
              <Check className="w-3 h-3" />
              <span>{language === 'te' ? 'పంపు' : language === 'hi' ? 'भेजें' : 'Send'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Processing Banner */}
      {isProcessingSTT && (
        <div className="mb-2 px-3 py-2 rounded-2xl bg-slate-900 text-white flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
          <span className="text-xs text-slate-300">
            {language === 'te' ? 'AI వాయిస్ ప్రాసెస్ చేస్తోంది...' : 'Processing your voice...'}
          </span>
        </div>
      )}

      {/* Input Bar — iOS style pill */}
      <div className={`flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-white border transition-all ${
        isRecording
          ? 'border-red-400 ring-2 ring-red-400/20'
          : 'border-slate-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15'
      }`}>

        {/* Mic button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 touch-manipulation ${
            isRecording
              ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
              : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          aria-label={isRecording ? 'Stop Recording' : 'Voice Input'}
        >
          {isRecording
            ? <MicOff className="w-4 h-4 animate-pulse" />
            : <Mic className="w-4 h-4" />
          }
        </button>

        {/* Text input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecording
              ? (language === 'te' ? '🎙️ వింటున్నాము...' : '🎙️ Listening...')
              : (placeholders[language] || placeholders['en'])
          }
          disabled={disabled}
          className="flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-90 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
