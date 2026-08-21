import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle, Music } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { audioSynth } from '../../services/audioSynth';

const SOUNDSCAPES = [
  { id: 'none', name: 'Mute Soundscape', icon: <VolumeX size={16} /> },
  { id: 'rain', name: 'Gentle Rain', icon: <Volume2 size={16} /> },
  { id: 'ocean', name: 'Ocean Waves', icon: <Volume2 size={16} /> },
  { id: 'white', name: 'Deep White Noise', icon: <Volume2 size={16} /> },
  { id: 'binaural', name: '40Hz Binaural Tones', icon: <Music size={16} /> }
];

export default function PomodoroView() {
  const { recordFocusSession, setIsFocusModeOpen, triggerSound } = useApp();
  
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intention, setIntention] = useState('');
  const [activeSound, setActiveSound] = useState('none');
  const [volume, setVolume] = useState(0.3);

  const canvasRef = useRef(null);

  // Timer Tick Effect
  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerSound('bell');
      recordFocusSession(sessionMinutes, intention || 'Focus Session', 'pomodoro');
      audioSynth.stopAmbientSound();
      setActiveSound('none');
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, sessionMinutes, intention]);

  // Ambient Sound Controller
  useEffect(() => {
    if (activeSound === 'none') {
      audioSynth.stopAmbientSound();
    } else {
      audioSynth.startAmbientSound(activeSound, volume);
    }
    return () => audioSynth.stopAmbientSound();
  }, [activeSound]);

  // Volume Change
  const handleVolumeChange = (v) => {
    setVolume(v);
    audioSynth.setVolume(v);
  };

  // Switch Mode
  const selectMode = (mins) => {
    triggerSound('click');
    setIsRunning(false);
    setSessionMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = ((sessionMinutes * 60 - secondsLeft) / (sessionMinutes * 60)) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8 pb-12">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 glass-panel rounded-2xl border border-white/10 w-fit mx-auto">
        {[
          { label: '25m Pomodoro', mins: 25 },
          { label: '50m Deep Work', mins: 50 },
          { label: '5m Short Break', mins: 5 },
          { label: '15m Long Break', mins: 15 }
        ].map(mode => (
          <button
            key={mode.mins}
            onClick={() => selectMode(mode.mins)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              sessionMinutes === mode.mins
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-indigo-950/30">
        <div className="relative z-10 max-w-md mx-auto space-y-6">
          {/* SVG Ring & Countdown */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" className="text-white/10 fill-none" />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progress) / 100}
                strokeLinecap="round"
                className="text-indigo-400 fill-none transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-white drop-shadow-md">
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-300 mt-2">
                {isRunning ? 'FOCUSING...' : 'READY'}
              </span>
            </div>
          </div>

          {/* Intention Input */}
          <div className="max-w-sm mx-auto">
            <input
              type="text"
              placeholder="What is your focus target for this session?"
              className="input-field text-center text-sm"
              value={intention}
              onChange={e => setIntention(e.target.value)}
            />
          </div>

          {/* Timer Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                triggerSound('click');
                setIsRunning(false);
                setSecondsLeft(sessionMinutes * 60);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={() => {
                triggerSound('click');
                setIsRunning(!isRunning);
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => {
                triggerSound('click');
                setIsFocusModeOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-indigo-300 hover:text-white transition-all"
              title="Fullscreen Immersive Mode"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Ambient Audio Soundscape Generator */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="text-indigo-400" size={20} />
            <h3 className="text-base font-bold text-white">Focus Soundscape Generator</h3>
          </div>
          {activeSound !== 'none' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SOUNDSCAPES.map(s => (
            <button
              key={s.id}
              onClick={() => {
                triggerSound('click');
                setActiveSound(s.id);
              }}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeSound === s.id
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/10'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {s.icon}
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
