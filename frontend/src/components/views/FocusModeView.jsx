import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { audioSynth } from '../../services/audioSynth';

const QUOTES = [
  "Focus is a muscle. Every second you stay present, you're training your mind.",
  "Small daily steps compound into extraordinary lifetime achievements.",
  "Deep work is the superpower of the 21st century.",
  "Silence the noise. Embrace the flow state."
];

export default function FocusModeView() {
  const { isFocusModeOpen, setIsFocusModeOpen, activeFocusTask, recordFocusSession, triggerSound } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isRainActive, setIsRainActive] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    if (isFocusModeOpen && isRainActive) {
      audioSynth.startAmbientSound('rain', 0.25);
    }
    return () => audioSynth.stopAmbientSound();
  }, [isFocusModeOpen, isRainActive]);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerSound('bell');
      recordFocusSession(25, activeFocusTask?.title || 'Deep Focus', 'focus_mode');
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isFocusModeOpen) return;
      if (e.key === 'Escape') setIsFocusModeOpen(false);
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFocusModeOpen, setIsFocusModeOpen]);

  if (!isFocusModeOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPercent = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 text-white flex flex-col justify-between p-8 backdrop-blur-2xl animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-semibold tracking-wider uppercase">
            IMMERSIVE FOCUS MODE
          </span>
          {activeFocusTask && (
            <span className="text-sm text-gray-400 font-medium">
              Task: <strong className="text-white">{activeFocusTask.title}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsRainActive(!isRainActive);
              if (isRainActive) audioSynth.stopAmbientSound();
              else audioSynth.startAmbientSound('rain', 0.25);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
            title="Toggle Rain Sound"
          >
            {isRainActive ? <Volume2 size={20} className="text-indigo-400" /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={() => setIsFocusModeOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
            title="Exit Focus Mode (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Timer */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="3" className="text-white/10 fill-none" />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              className="text-indigo-500 fill-none transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl sm:text-7xl font-bold font-mono tracking-tight text-white drop-shadow-lg">
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-widest text-indigo-300 mt-2 font-medium">
              {isRunning ? 'DEEP WORK SESSION' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={() => {
              triggerSound('click');
              setIsRunning(false);
              setSecondsLeft(25 * 60);
            }}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={() => {
              triggerSound('click');
              setIsRunning(!isRunning);
            }}
            className="p-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 text-white shadow-xl shadow-indigo-500/30 transition-all"
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
        </div>
      </div>

      {/* Quote Footer */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <p className="text-sm text-gray-400 italic font-serif">"{QUOTES[quoteIdx]}"</p>
        <span className="text-xs text-gray-600 block mt-2 font-mono">Press Space to Pause · Esc to Exit</span>
      </div>
    </div>
  );
}
