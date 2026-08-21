import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { audioSynth } from '../services/audioSynth';
import { triggerConfetti } from '../services/confetti';

const AppContext = createContext();

const AVATAR_STAGES = [
  { minLevel: 1, title: 'Seedling', emoji: '🌱', desc: 'Sowing the seeds of focus' },
  { minLevel: 3, title: 'Sprout', emoji: '🌿', desc: 'Growing daily discipline' },
  { minLevel: 5, title: 'Mighty Oak', emoji: '🌳', desc: 'Deep rooted concentration' },
  { minLevel: 8, title: 'Summit Mountain', emoji: '⛰️', desc: 'Unshakable mental strength' },
  { minLevel: 12, title: 'Rising Phoenix', emoji: '🦅', desc: 'Master of deep focus' },
  { minLevel: 20, title: 'Cosmic Dragon', emoji: '🐉', desc: 'Legendary productivity god' }
];

export const THEME_LIST = [
  { id: 'glass', name: 'Default Glass', price: 0, preview: 'linear-gradient(135deg, #0f172a, #1e293b)' },
  { id: 'light', name: 'Clean Light', price: 0, preview: 'linear-gradient(135deg, #f1f5f9, #ffffff)' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', price: 150, preview: 'linear-gradient(135deg, #09090e, #00ffcc)' },
  { id: 'space', name: 'Space Cosmos', price: 200, preview: 'linear-gradient(135deg, #050515, #8b5cf6)' },
  { id: 'sakura', name: 'Sakura Blossom', price: 250, preview: 'linear-gradient(135deg, #2a1b24, #f472b6)' },
  { id: 'matrix', name: 'Matrix Green', price: 300, preview: 'linear-gradient(135deg, #020b04, #22c55e)' },
  { id: 'tokyo-night', name: 'Tokyo Night', price: 350, preview: 'linear-gradient(135deg, #1a1b26, #7aa2f7)' },
  { id: 'nord', name: 'Nord Frost', price: 400, preview: 'linear-gradient(135deg, #2e3440, #88c0d0)' },
  { id: 'amoled', name: 'AMOLED Black', price: 450, preview: 'linear-gradient(135deg, #000000, #38bdf8)' },
  { id: 'retro', name: 'Retro Amber', price: 500, preview: 'linear-gradient(135deg, #181425, #f59e0b)' }
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('focusflow_user') || 'null'));
  const [userState, setUserState] = useState(() => ({
    xp: 450,
    level: 2,
    streak: 6,
    unlockedThemes: ['glass', 'light'],
    activeTheme: 'glass',
    activePet: 'fox',
    soundEffects: true,
    achievements: ['first_task', 'first_focus', 'mood_checkin']
  }));

  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('focusflow_tasks') || '[]'));
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('focusflow_habits') || '[]'));
  const [moods, setMoods] = useState(() => JSON.parse(localStorage.getItem('focusflow_moods') || '[]'));
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('focusflow_sessions') || '[]'));
  
  const [toasts, setToasts] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState(null);

  // Default seed data if local storage is empty
  useEffect(() => {
    if (tasks.length === 0) {
      const defaults = [
        { id: 't1', title: 'Complete Calculus Chapter 4 Review', category: 'Study', priority: 'High', detail: 'Solve all odd-numbered problems in Section 4.2', completed: false },
        { id: 't2', title: 'Outline DBMS Term Paper', category: 'Project', priority: 'Medium', detail: 'Draft ER diagrams & normalization steps', completed: false },
        { id: 't3', title: '30-Minute Morning Reading Session', category: 'Personal', priority: 'Low', detail: 'Read Atomic Habits Chapter 3', completed: true },
        { id: 't4', title: 'Prepare DSA Lab Presentation', category: 'Exam', priority: 'High', detail: 'Build visual slides on Graph Traversal algorithms', completed: false }
      ];
      setTasks(defaults);
      localStorage.setItem('focusflow_tasks', JSON.stringify(defaults));
    }

    if (habits.length === 0) {
      const defaultHabits = [
        { id: 'h1', title: 'Daily Workout / Stretch', category: 'Health', streak: 5, history: ['2026-08-20', '2026-08-21'] },
        { id: 'h2', title: 'Read 20 Pages', category: 'Mindset', streak: 8, history: ['2026-08-20', '2026-08-21'] },
        { id: 'h3', title: 'Hydrate 2.5L Water', category: 'Health', streak: 12, history: ['2026-08-20', '2026-08-21'] },
        { id: 'h4', title: 'Journal Reflection', category: 'Mindfulness', streak: 3, history: ['2026-08-21'] }
      ];
      setHabits(defaultHabits);
      localStorage.setItem('focusflow_habits', JSON.stringify(defaultHabits));
    }
  }, []);

  // Update theme class on body
  useEffect(() => {
    document.body.className = `theme-${userState.activeTheme || 'glass'}`;
  }, [userState.activeTheme]);

  // Sync state changes to localStorage
  useEffect(() => { localStorage.setItem('focusflow_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('focusflow_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('focusflow_moods', JSON.stringify(moods)); }, [moods]);
  useEffect(() => { localStorage.setItem('focusflow_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('focusflow_state', JSON.stringify(userState)); }, [userState]);

  // Toast notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sound play wrapper
  const triggerSound = (action) => {
    if (!userState.soundEffects) return;
    if (action === 'click') audioSynth.playClick();
    if (action === 'chime') audioSynth.playSuccessChime();
    if (action === 'fanfare') audioSynth.playLevelUpFanfare();
    if (action === 'bell') audioSynth.playTimerBell();
  };

  // Calculate Avatar Evolution based on level
  const getAvatar = () => {
    const lvl = userState.level || 1;
    let current = AVATAR_STAGES[0];
    for (const stage of AVATAR_STAGES) {
      if (lvl >= stage.minLevel) current = stage;
    }
    return current;
  };

  // Add XP and handle potential level-up
  const addXP = (amount, reason = '') => {
    setUserState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      const levelUp = newLevel > prev.level;

      if (levelUp) {
        triggerSound('fanfare');
        triggerConfetti({ count: 120 });
        addToast(`🎉 Level Up! You reached Level ${newLevel}!`, 'success');
      } else if (reason) {
        addToast(`+${amount} XP earned (${reason})`, 'success');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  // Task Actions
  const addTask = (title, category = 'Study', priority = 'Medium', detail = '') => {
    triggerSound('click');
    const newTask = {
      id: `t_${Date.now()}`,
      title,
      category,
      priority,
      detail,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task added successfully!');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          triggerSound('chime');
          triggerConfetti({ count: 50 });
          addXP(25, 'Task Completed');
        } else {
          triggerSound('click');
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    triggerSound('click');
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task removed');
  };

  // Habit Toggle
  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    triggerSound('click');
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const exists = h.history.includes(today);
        const newHist = exists ? h.history.filter(d => d !== today) : [...h.history, today];
        const newStreak = exists ? Math.max(0, h.streak - 1) : h.streak + 1;
        if (!exists) {
          triggerSound('chime');
          addXP(15, 'Habit Streak');
        }
        return { ...h, history: newHist, streak: newStreak };
      }
      return h;
    }));
  };

  // Mood Logger
  const logMood = (mood, note = '', energy = 3, focus = 3) => {
    triggerSound('click');
    const entry = {
      id: `m_${Date.now()}`,
      mood,
      note,
      energy,
      focus,
      createdAt: new Date().toISOString()
    };
    setMoods(prev => [entry, ...prev]);
    addXP(20, 'Mindful Check-in');
    addToast('Mood logged successfully!');
  };

  // Focus Session Logger
  const recordFocusSession = (minutes, intention = '', mode = 'pomodoro') => {
    triggerSound('fanfare');
    triggerConfetti({ count: 80 });
    const session = {
      id: `s_${Date.now()}`,
      minutes,
      intention,
      mode,
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [session, ...prev]);
    const xpEarned = Math.round(minutes * 2);
    addXP(xpEarned, `${minutes}m Focus Session`);
  };

  // Theme Purchase / Switch
  const switchTheme = (themeId) => {
    triggerSound('click');
    const theme = THEME_LIST.find(t => t.id === themeId);
    if (!theme) return;

    if (userState.unlockedThemes.includes(themeId)) {
      setUserState(prev => ({ ...prev, activeTheme: themeId }));
      addToast(`Theme switched to ${theme.name}!`);
    } else {
      if (userState.xp >= theme.price) {
        setUserState(prev => ({
          ...prev,
          xp: prev.xp - theme.price,
          unlockedThemes: [...prev.unlockedThemes, themeId],
          activeTheme: themeId
        }));
        triggerConfetti({ count: 60 });
        addToast(`🎉 Unlocked ${theme.name} theme!`, 'success');
      } else {
        addToast(`Need ${theme.price - userState.xp} more XP to unlock ${theme.name}`, 'warning');
      }
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      userState,
      tasks,
      habits,
      moods,
      sessions,
      toasts,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isFocusModeOpen,
      setIsFocusModeOpen,
      activeFocusTask,
      setActiveFocusTask,
      getAvatar,
      addXP,
      addTask,
      toggleTask,
      deleteTask,
      toggleHabit,
      logMood,
      recordFocusSession,
      switchTheme,
      triggerSound,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
