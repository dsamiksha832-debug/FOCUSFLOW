import React, { useState } from 'react';
import Navigation from './components/layout/Navigation';
import DashboardView from './components/views/DashboardView';
import PomodoroView from './components/views/PomodoroView';
import TasksHabitsView from './components/views/TasksHabitsView';
import ShopView from './components/views/ShopView';
import AnalyticsView from './components/views/AnalyticsView';
import MoodView from './components/views/MoodView';
import CommandPalette from './components/common/CommandPalette';
import FocusModeView from './components/views/FocusModeView';
import { useApp } from './context/AppContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toasts } = useApp();

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'pomodoro' && <PomodoroView />}
        {activeTab === 'tasks' && <TasksHabitsView />}
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'mood' && <MoodView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-gray-500 font-mono">
        FocusFlow v2.0 · Built for Student Focus & Peak Productivity
      </footer>

      {/* Modals & Overlays */}
      <CommandPalette />
      <FocusModeView />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl border backdrop-blur-md text-xs font-semibold shadow-2xl pointer-events-auto transition-all animate-bounce ${
              t.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : t.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
