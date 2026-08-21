import React from 'react';
import { BarChart3, Calendar, Award, Download, Flame, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ACHIEVEMENTS = [
  { id: 'first_task', title: 'First Steps', desc: 'Complete your first task', icon: '🏆', unlocked: true },
  { id: 'first_focus', title: 'Deep Diver', desc: 'Complete a 25m Focus Session', icon: '⏱️', unlocked: true },
  { id: 'streak_7', title: '7-Day Titan', desc: 'Maintain a 7-day study streak', icon: '🔥', unlocked: true },
  { id: 'tasks_50', title: 'Task Crusher', desc: 'Complete 50 study tasks', icon: '✅', unlocked: false },
  { id: 'night_owl', title: 'Night Owl', desc: 'Complete a focus session past 10 PM', icon: '🦉', unlocked: true },
  { id: 'focus_legend', title: 'Focus Master', desc: 'Log 10 hours of deep work', icon: '👑', unlocked: false }
];

export default function AnalyticsView() {
  const { userState, sessions, tasks, habits, triggerSound, addToast } = useApp();

  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const totalTasksCompleted = tasks.filter(t => t.completed).length;

  const exportData = (format) => {
    triggerSound('click');
    const dataObj = { userState, sessions, tasks, habits, exportedAt: new Date().toISOString() };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-backup-${Date.now()}.json`;
      a.click();
      addToast('Exported JSON Backup successfully!');
    } else {
      let csv = 'Type,Title/Duration,Date\n';
      tasks.forEach(t => { csv += `Task,"${t.title}",${t.createdAt}\n`; });
      sessions.forEach(s => { csv += `FocusSession,${s.minutes}m,${s.createdAt}\n`; });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-data-${Date.now()}.csv`;
      a.click();
      addToast('Exported CSV Data successfully!');
    }
  };

  // Generate 28 dummy days for heatmap
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const intensity = (i * 7) % 4; // 0 to 3
    return { day: i + 1, intensity };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8 pb-12">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-indigo-400" /> Analytics & Study Heatmap
          </h2>
          <p className="text-xs text-gray-400">Track your focus stats, unlocked trophies, and backup your data</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => exportData('json')} className="btn btn-secondary text-xs">
            <Download size={14} /> Export JSON
          </button>
          <button onClick={() => exportData('csv')} className="btn btn-secondary text-xs">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
          <span className="text-xs text-gray-400 font-medium block">Total Focus Time</span>
          <span className="text-2xl font-bold text-indigo-400 font-mono">
            {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
          <span className="text-xs text-gray-400 font-medium block">Completed Tasks</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{totalTasksCompleted}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
          <span className="text-xs text-gray-400 font-medium block">Current Streak</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{userState.streak} Days</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
          <span className="text-xs text-gray-400 font-medium block">Total XP Earned</span>
          <span className="text-2xl font-bold text-purple-400 font-mono">{userState.xp} XP</span>
        </div>
      </div>

      {/* GitHub-style Study Heatmap */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" /> 4-Week Activity Heatmap
          </h3>
          <span className="text-xs text-gray-400 font-mono">Study Activity Grid</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {heatmapDays.map((d, i) => {
            const colors = [
              'bg-white/5 border-white/10',
              'bg-emerald-900/40 border-emerald-700/40 text-emerald-300',
              'bg-emerald-600/60 border-emerald-500 text-white',
              'bg-emerald-500 border-emerald-400 text-white font-bold'
            ];
            return (
              <div
                key={i}
                className={`h-10 rounded-lg border flex items-center justify-center text-xs font-mono transition-all ${colors[d.intensity]}`}
                title={`Day ${d.day}: ${d.intensity * 45} mins focused`}
              >
                {d.day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Showcase Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award size={18} className="text-amber-400" /> Trophies & Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                ach.unlocked
                  ? 'bg-amber-950/20 border-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'bg-white/5 border-white/10 opacity-40'
              }`}
            >
              <div className="text-3xl">{ach.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                <p className="text-xs text-gray-300">{ach.desc}</p>
                <span className="text-[10px] font-semibold text-amber-400 block mt-1">
                  {ach.unlocked ? 'Unlocked 🏆' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
