import React, { useState, useEffect, useRef } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { X, Mic, Send, Bot, Cpu, Volume2, Sparkles, AlertCircle, Play, VolumeX, MicOff, Check } from 'lucide-react';

export const JarvisAssistant = () => {
  const { 
    jarvisActive, 
    setJarvisActive, 
    jarvisLogs, 
    processJarvisCommand 
  } = useSmartHome();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpeechResponse, setLastSpeechResponse] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [synthSupported, setSynthSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [micError, setMicError] = useState(null);
  const [speechMuted, setSpeechMuted] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition & Synthesis capability
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }

    if ('speechSynthesis' in window) {
      setSynthSupported(true);
      
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Find best English voice for Jarvis (e.g. Google UK English Male, Microsoft David/Guy, or en-US)
        const jarvisVoice = voices.find(v => 
          (v.name.includes('UK English Male') || v.name.includes('David') || v.name.includes('Guy') || v.name.includes('Natural')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        setSelectedVoice(jarvisVoice || null);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Sci-Fi Sound Generator via Web Audio API
  const playSciFiChime = (type = 'speak') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'listen') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'speak') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  // Text-to-Speech Engine with voice selection
  const speakText = (text) => {
    if (speechMuted || !synthSupported) return;

    try {
      window.speechSynthesis.cancel(); // Stop current speech
      
      playSciFiChime('speak');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower, measured AI pacing
      utterance.pitch = 0.95; // Deep futuristic tone
      utterance.volume = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    setMicError(null);
    const response = processJarvisCommand(text);
    setLastSpeechResponse(response);
    speakText(response);
    setInputQuery('');
  };

  const toggleVoiceListen = () => {
    setMicError(null);

    if (!speechSupported) {
      setMicError('Speech recognition is not supported in this browser. Please type or use quick prompts.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        playSciFiChime('listen');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInputQuery(transcript);
            handleSend(transcript);
            setIsListening(false);
          } else {
            interimTranscript += transcript;
            setInputQuery(interimTranscript);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setMicError('Microphone permission blocked. Please click the mic icon in your browser address bar to allow microphone access.');
        } else if (event.error === 'no-speech') {
          setMicError('No speech detected. Please speak into your microphone or click a prompt.');
        } else {
          setMicError(`Voice input error: ${event.error}. You can type your command below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      setIsListening(false);
      setMicError('Could not start microphone listener. Please ensure mic access is granted.');
    }
  };

  if (!jarvisActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050811]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl p-6 border border-cyan-400/40 shadow-[0_0_50px_rgba(0,243,255,0.25)] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-bold text-white tracking-wider flex items-center space-x-2">
                <span>JARVIS AI VOICE CORE</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                  AUDIO ONLINE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Neural Voice Assistant & Smart Energy Controller</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Speech Mute Toggle */}
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setSpeechMuted(!speechMuted);
              }}
              className={`p-2 rounded-xl text-xs font-mono border transition-all ${
                speechMuted 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
              title={speechMuted ? 'Unmute Jarvis Speech' : 'Mute Jarvis Speech'}
            >
              {speechMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setJarvisActive(false);
              }}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Selection Bar (if multiple voices exist) */}
        {availableVoices.length > 0 && (
          <div className="mt-3 flex items-center justify-between text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Engine:</span>
            </span>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              className="bg-slate-950 text-cyan-300 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none"
            >
              {availableVoices.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Jarvis Holographic HUD Arc Reactor Core */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            
            {/* Outer Spinning Arc Ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-all ${
              isListening 
                ? 'border-rose-400 animate-spin-fast shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
                : isSpeaking 
                ? 'border-emerald-400 animate-spin-slow shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'border-cyan-400/40 animate-spin-slow'
            }`} />
            
            <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-pulse-glow" />
            
            <div className={`absolute inset-6 rounded-full border transition-all flex items-center justify-center ${
              isListening 
                ? 'bg-rose-950/40 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.5)]' 
                : isSpeaking 
                ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                : 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_25px_rgba(0,243,255,0.4)]'
            }`}>
              <Cpu className={`w-12 h-12 transition-colors ${
                isListening ? 'text-rose-400 animate-pulse' : isSpeaking ? 'text-emerald-400 animate-bounce' : 'text-cyan-300 animate-pulse'
              }`} />
            </div>

            {/* Audio Wavebars Visualizer */}
            {(isListening || isSpeaking) && (
              <div className="absolute -bottom-1 flex items-center space-x-1">
                <span className="w-1 h-5 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-7 bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-9 bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-7 bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-5 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              </div>
            )}
          </div>

          <p className="mt-3 text-xs font-mono tracking-wider font-semibold">
            {isListening ? (
              <span className="text-rose-400 animate-pulse">🔴 LISTENING TO YOUR VOICE...</span>
            ) : isSpeaking ? (
              <span className="text-emerald-400 animate-pulse">🔊 JARVIS IS SPEAKING...</span>
            ) : (
              <span className="text-cyan-400">AWAITING VOICE OR TEXT COMMAND</span>
            )}
          </p>
        </div>

        {/* Mic Permission Banner / Warning */}
        {micError && (
          <div className="mb-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1">{micError}</span>
          </div>
        )}

        {/* Jarvis Output Readout with Speech Replay Button */}
        {lastSpeechResponse && (
          <div className="mb-3 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-sm font-sans flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <Volume2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-cyan-400 font-mono flex items-center space-x-2">
                  <span>JARVIS RESPONSE</span>
                  {isSpeaking && <span className="text-[10px] text-emerald-400 animate-pulse">(Speaking...)</span>}
                </p>
                <p className="mt-1 leading-relaxed text-xs sm:text-sm">{lastSpeechResponse}</p>
              </div>
            </div>
            
            <button
              onClick={() => speakText(lastSpeechResponse)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono flex items-center space-x-1 shrink-0 transition-colors"
              title="Listen to Jarvis response again"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay Voice</span>
            </button>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            "Why did you turn off the lights?",
            "Turn off AC",
            "What is battery level?",
            "Solar power status",
            "Enable Eco Mode"
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Jarvis Activity & Rationale Logs */}
        <div className="max-h-36 overflow-y-auto mb-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-1.5">
          {jarvisLogs.map(log => (
            <div key={log.id} className="flex items-start space-x-2 text-slate-300">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={log.type === 'ai' ? 'text-cyan-400' : log.type === 'user' ? 'text-purple-300' : 'text-emerald-400'}>
                {log.type === 'ai' ? 'JARVIS:' : log.type === 'user' ? 'USER:' : 'SYS:'} {log.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Jarvis anything about energy, appliances, or automation..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          <button
            onClick={toggleVoiceListen}
            className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
              isListening 
                ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-400'
            }`}
            title="Toggle Voice Input (Microphone)"
          >
            <Mic className="w-5 h-5" />
            <span className="text-xs font-mono font-bold hidden sm:inline">
              {isListening ? 'Listening' : 'Mic'}
            </span>
          </button>

          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
