import React from 'react';
import { Play, Sparkles, CheckCircle2, Flame, Award, Heart, ArrowRight, Bot, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAICoachInsights } from '../../services/aiCoach';

export default function DashboardView({ setActiveTab }) {
  const { userState, tasks, habits, sessions, moods, toggleTask, getAvatar, setIsFocusModeOpen, setActiveFocusTask, triggerSound } = useApp();

  const avatar = getAvatar();
  const insights = generateAICoachInsights(userState, sessions, tasks);
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4);

  const completedToday = tasks.filter(t => t.completed).length;
  const focusMinutesToday = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> YOUR DAILY SPACE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {insights.greeting} <span className="inline-block animate-bounce">{avatar.emoji}</span>
            </h2>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Consistency is built one focused block at a time. Your mind is sharp and ready today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerSound('click');
                setIsFocusModeOpen(true);
              }}
              className="btn btn-primary shadow-lg shadow-indigo-500/30 py-3 px-6 text-base"
            >
              <Play size={18} /> Start Focus Session
            </button>
          </div>
        </div>
      </div>

      {/* Top Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Focus Time</p>
            <h3 className="text-xl font-bold text-white">{Math.floor(focusMinutesToday / 60)}h {focusMinutesToday % 60}m</h3>
            <p className="text-xs text-emerald-400 font-mono">Today's Total</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tasks Completed</p>
            <h3 className="text-xl font-bold text-white">{completedToday} / {tasks.length}</h3>
            <p className="text-xs text-emerald-400 font-mono">+25 XP per task</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Current Streak</p>
            <h3 className="text-xl font-bold text-white">{userState.streak} Days</h3>
            <p className="text-xs text-amber-400 font-mono">Best: 14 Days</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total XP</p>
            <h3 className="text-xl font-bold text-white">{userState.xp} XP</h3>
            <p className="text-xs text-purple-400 font-mono">Lvl {userState.level} {avatar.title}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Coach + Tasks + Pet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): AI Coach & Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Coach Advice Card */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Study Companion AI Coach</h3>
                <p className="text-xs text-gray-400">Personalized study insights based on your rhythm</p>
              </div>
            </div>

            <div className="space-y-3">
              {insights.tips.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-sm">
                  <span className="font-semibold text-indigo-300 block mb-0.5">{tip.title}</span>
                  <p className="text-gray-300 text-xs">{tip.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Tasks */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Priority Tasks</h3>
                <p className="text-xs text-gray-400">Keep your focus momentum going</p>
              </div>
              <button
                onClick={() => {
                  triggerSound('click');
                  setActiveTab('tasks');
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all →
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                🎉 All priority tasks completed! Great work.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTask(t.id)}
                        className="w-5 h-5 rounded-md border border-gray-400 hover:border-indigo-400 flex items-center justify-center transition-colors"
                      >
                        {t.completed && <CheckCircle2 size={16} className="text-emerald-400" />}
                      </button>
                      <div>
                        <span className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">
                          {t.title}
                        </span>
                        <span className="text-xs text-gray-400 block">{t.category} · {t.priority} Priority</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        triggerSound('click');
                        setActiveFocusTask(t);
                        setIsFocusModeOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold transition-all"
                    >
                      Focus Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pet Companion & Avatar Evolution */}
        <div className="space-y-6">
          {/* Avatar Evolution Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/30 animate-pulse-glow">
              {avatar.emoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{avatar.title}</h3>
              <p className="text-xs text-indigo-300 font-mono">Level {userState.level} Avatar Stage</p>
              <p className="text-xs text-gray-400 mt-1">{avatar.desc}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('shop')}
                className="w-full btn btn-secondary text-xs py-2"
              >
                View Avatar Progression →
              </button>
            </div>
          </div>

          {/* Productivity Pet Card */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦊</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Spark the Focus Fox</h4>
                  <p className="text-xs text-emerald-400 font-mono">Productivity Companion</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                Happy
              </span>
            </div>

            <p className="text-xs text-gray-300">
              Spark gains energy whenever you finish focus sessions and check off daily study tasks!
            </p>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Happiness Level</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
