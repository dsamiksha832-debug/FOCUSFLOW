import React, { useState } from 'react';
import { Heart, Sparkles, Wind, Clock, MessageSquare, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MOOD_OPTIONS = [
  { emoji: '🧐', label: 'Focused' },
  { emoji: '😄', label: 'Energized' },
  { emoji: '🌿', label: 'Grounded' },
  { emoji: '🧘', label: 'Calm' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '⚡', label: 'Productive' },
  { emoji: '💭', label: 'Reflective' }
];

export default function MoodView() {
  const { moods, logMood, triggerSound } = useApp();

  const [selectedMood, setSelectedMood] = useState('Grounded');
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState(4);
  const [focusLevel, setFocusLevel] = useState(4);

  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale (4s)');

  const handleLog = (e) => {
    e.preventDefault();
    logMood(selectedMood, note, energy, focusLevel);
    setNote('');
  };

  const toggleBreathing = () => {
    triggerSound('click');
    setIsBreathingActive(!isBreathingActive);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Heart size={24} className="text-pink-400" /> Mindful Space & Check-in
        </h2>
        <p className="text-xs text-gray-400">Pause for a moment, ground your thoughts, and log how you feel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Logger Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleLog} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white">How are you feeling right now?</h3>

            {/* Emoji Selector */}
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
              {MOOD_OPTIONS.map(m => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => {
                    triggerSound('click');
                    setSelectedMood(m.label);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMood === m.label
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300 ring-2 ring-pink-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{m.emoji}</span>
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-300">
                  <span>Energy Level</span>
                  <span className="text-indigo-300">{energy} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energy}
                  onChange={e => setEnergy(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-300">
                  <span>Focus Clarity</span>
                  <span className="text-pink-300">{focusLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={focusLevel}
                  onChange={e => setFocusLevel(parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Reflection Note */}
            <div>
              <textarea
                placeholder="Write a brief reflection or gratitude note..."
                rows={3}
                className="input-field text-sm"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3">
              + Log Mood Check-in (+20 XP)
            </button>
          </form>

          {/* Mood History Log */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-gray-400" /> Reflection Journal History
            </h3>

            {moods.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No mood reflections logged yet today.</p>
            ) : (
              <div className="space-y-2.5">
                {moods.slice(0, 5).map(m => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-pink-300">{m.mood}</span>
                      <span className="text-gray-400 font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {m.note && <p className="text-xs text-gray-300">{m.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4-7-8 Breathing Circle Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 bg-pink-950/10 text-center space-y-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider mb-2">
              <Wind size={16} /> 4-7-8 Breathing Guide
            </div>
            <h3 className="text-lg font-bold text-white">Reset & De-stress</h3>
            <p className="text-xs text-gray-300 mt-1">
              Inhale deeply for 4s, hold for 7s, exhale slowly for 8s to calm your nervous system.
            </p>
          </div>

          {/* Animated Breathing Ring */}
          <div className="my-auto py-6">
            <div
              className={`w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-pink-500/30 transition-transform ${
                isBreathingActive ? 'animate-breathe' : ''
              }`}
            >
              <span className="text-xs font-bold font-mono tracking-wider">
                {isBreathingActive ? breathPhase : 'TAP START'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleBreathing}
            className={`btn w-full py-2.5 text-xs font-bold ${
              isBreathingActive ? 'btn-secondary' : 'btn-primary'
            }`}
          >
            {isBreathingActive ? 'Stop Exercise' : 'Start 4-7-8 Exercise'}
          </button>
        </div>
      </div>
    </div>
  );
}
