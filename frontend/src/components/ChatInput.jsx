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
      // Browser doesn't have webkitSpeechRecognition, but has MediaRecorder
      if (typeof window !== 'undefined' && window.MediaRecorder) {
        setRecognitionSupported(true);
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

  // Listen to external voice trigger from home screen
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

    // 1. Start MediaRecorder for Whisper AI transcription fallback
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

    // 2. Start Web SpeechRecognition for instant live visual feedback
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = langMap[language] || 'en-IN';
        recognitionRef.current.start();
      } catch (recStartErr) {
        console.warn('SpeechRecognition start error:', recStartErr);
      }
    }
  };

  const stopRecording = async () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    if (onVoiceStateChange) onVoiceStateChange(false);

    // Stop SpeechRecognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop MediaRecorder and grab audio blob
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

    // Stop audio stream tracks
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }

    // If Web Speech already captured text, we're done
    const speechResult = capturedTextRef.current.trim();
    if (speechResult) {
      return;
    }

    // If Web Speech was silent or unresponsive, send audio to Groq Whisper AI (/api/stt)
    if (audioBlob && audioBlob.size > 1000) {
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
          if (data.text) {
            const fullText = (
              (baseTextRef.current ? baseTextRef.current + ' ' : '') + data.text
            ).trim();
            setInputText(fullText);
            setLiveTranscript(data.text);
          }
        } else {
          console.warn('STT API returned error status:', res.status);
        }
      } catch (sttErr) {
        console.warn('STT backend request failed:', sttErr);
      } finally {
        setIsProcessingSTT(false);
      }
    }
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

      {/* AI Whisper Transcription In-Progress Banner */}
      {isProcessingSTT && (
        <div className="mb-2 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white shadow-lg border border-emerald-500/30 flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-emerald-200">
            {language === 'te' ? 'AI మీ వాయిస్‌ని స్పష్టంగా టెక్స్ట్‌గా మారుస్తోంది...' : 'AI is transcribing your speech...'}
          </span>
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
