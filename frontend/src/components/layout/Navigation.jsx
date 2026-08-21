import React, { useState } from 'react';
import { LayoutDashboard, Timer, CheckSquare, ShoppingBag, BarChart3, Heart, Command, Flame, User, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AuthModal from '../views/AuthModal';

export default function Navigation({ activeTab, setActiveTab }) {
  const { user, userState, getAvatar, setIsCommandPaletteOpen, triggerSound } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const avatar = getAvatar();
  const xpPercent = Math.min(100, Math.round(((userState.xp % 200) / 200) * 100));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'pomodoro', label: 'Focus & Sound', icon: <Timer size={18} /> },
    { id: 'tasks', label: 'Tasks & Habits', icon: <CheckSquare size={18} /> },
    { id: 'shop', label: 'XP Shop', icon: <ShoppingBag size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'mood', label: 'Mindfulness', icon: <Heart size={18} /> }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl px-4 lg:px-8 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/25">
                ✦
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  FocusFlow
                </h1>
                <p className="text-xs text-gray-400 font-mono">STUDENT WORKSPACE</p>
              </div>
            </div>

            {/* Avatar & XP Meter */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg" title={avatar.desc}>
                {avatar.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-300">Lvl {userState.level} · {avatar.title}</span>
                  <span className="text-xs font-medium text-amber-400 flex items-center gap-0.5">
                    <Flame size={12} className="fill-amber-400" /> {userState.streak}d
                  </span>
                </div>
                <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  triggerSound('click');
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-white/15 text-white shadow-sm border border-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Action Controls: Command Palette & Login/Profile Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerSound('click');
                setIsCommandPaletteOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-gray-300 border border-white/10 font-mono transition-all"
              title="Open Command Palette"
            >
              <Command size={14} />
              <span className="hidden sm:inline">Ctrl+K</span>
            </button>

            {/* Login / Profile Button */}
            <button
              onClick={() => {
                triggerSound('click');
                setIsAuthOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              {user ? (
                <>
                  <User size={14} />
                  <span>{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pt-3 border-t border-white/10 mt-3 scrollbar-none">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                triggerSound('click');
                setActiveTab(item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === item.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Auth Modal Dialog */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
