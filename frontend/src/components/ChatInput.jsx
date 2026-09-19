import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled, language }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (language === 'te') recognition.lang = 'te-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'kn') recognition.lang = 'kn-IN';
      else if (language === 'ta') recognition.lang = 'ta-IN';
      else if (language === 'mr') recognition.lang = 'mr-IN';
      else recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionSupported) {
      alert('Microphone speech recognition is not supported on this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        if (recognitionRef.current) {
          if (language === 'te') recognitionRef.current.lang = 'te-IN';
          else if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
          else if (language === 'kn') recognitionRef.current.lang = 'kn-IN';
          else if (language === 'ta') recognitionRef.current.lang = 'ta-IN';
          else recognitionRef.current.lang = 'en-IN';
          recognitionRef.current.start();
          setIsRecording(true);
        }
      } catch (err) {
        console.warn('Recognition start error', err);
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const placeholders = {
    te: 'మీ ప్రశ్నను ఇక్కడ అడగండి...',
    hi: 'अपना प्रश्न यहाँ पूछें...',
    en: 'Ask a question about PACS, loans, or schemes...',
    kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕೇಳಿ...',
    ta: 'உங்கள் கேள்வியை இங்கே கேளுங்கள்...',
    mr: 'तुमचा प्रश्न येथे विचारा...'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all">
        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0 ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse'
              : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/80'
          }`}
          title="Voice Input"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? '🎙️ వింటున్నాము... మాట్లాడండి...' : (placeholders[language] || placeholders['en'])}
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

      {isRecording && (
        <div className="absolute -top-7 left-3 flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          <span>Voice Active</span>
        </div>
      )}
    </form>
  );
}
