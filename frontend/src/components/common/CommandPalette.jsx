import React, { useState, useEffect } from 'react';
import { Search, Play, CheckCircle2, Sparkles, Sun, Moon, Volume2, X, Command } from 'lucide-react';
import { useApp, THEME_LIST } from '../../context/AppContext';

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, tasks, switchTheme, triggerSound, setIsFocusModeOpen } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { id: 'focus', title: 'Start Fullscreen Focus Mode', icon: <Play size={16} className="text-indigo-400" />, run: () => setIsFocusModeOpen(true) },
    ...THEME_LIST.map(t => ({
      id: `theme_${t.id}`,
      title: `Switch Theme to ${t.name}`,
      icon: <Sun size={16} className="text-amber-400" />,
      run: () => switchTheme(t.id)
    })),
    ...tasks.map(t => ({
      id: `task_${t.id}`,
      title: `Task: ${t.title}`,
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      run: () => {}
    }))
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in" onClick={() => setIsCommandPaletteOpen(false)}>
      <div className="glass-panel w-full max-w-xl overflow-hidden shadow-2xl rounded-2xl border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-base"
            placeholder="Type a command or search tasks... (Ctrl+K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setIsCommandPaletteOpen(false)} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No matching commands found</div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  triggerSound('click');
                  item.run();
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 cursor-pointer text-sm text-gray-200 hover:text-white transition-colors"
              >
                {item.icon}
                <span className="flex-1">{item.title}</span>
                <span className="text-xs text-gray-500 font-mono">Select</span>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>FocusFlow Command Palette</span>
          <span>Esc to Close</span>
        </div>
      </div>
    </div>
  );
}
