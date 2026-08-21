# ✦ FocusFlow v2.0

> **A high-performance student focus & productivity workspace** featuring a world-class Glassmorphic UI, Web Audio API ambient soundscapes, gamified XP leveling & avatar evolution, an interactive AI study coach, and a resilient Node.js API backend.

![Status](https://img.shields.io/badge/Status-Production_Ready-emerald)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-8.2-646cff)
![Node.js](https://img.shields.io/badge/Node.js-REST_API-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌟 Key Features

### 🎯 1. Immersive Fullscreen Focus Mode
- Fullscreen focus space with screen dimming, live SVG countdown timer ring, current task display, motivational quote ticker, and keyboard hotkeys (`Space` to pause, `Esc` to exit).
- Built-in Web Audio ambient rain soundscape right inside the focus mode.

### 🎵 2. Web Audio API Sound Synthesizer & Soundscapes
- **Tactile UI Audio Feedback**: Micro-sound effects generated natively via the Web Audio API for UI clicks (`playClick()`), task completion chimes (`playSuccessChime()`), timer bells (`playTimerBell()`), and level-up fanfares (`playLevelUpFanfare()`).
- **Procedural Ambient Soundscapes**: 4 built-in Web Audio sound generators with zero external MP3 file dependencies:
  - *Gentle Rain* (filtered white/pink noise)
  - *Ocean Waves* (LFO-modulated lowpass wave swells)
  - *Deep White Noise*
  - *40Hz Binaural Beats*

### 🏪 3. XP Shop & 9 Custom Theme Skins
- Earn XP through focus sessions (+2 XP/min), completing daily tasks (+25 XP), habit streaks (+15 XP), and mindful check-ins (+20 XP).
- Unlock and switch between 9 theme skins:
  - *Default Glass*, *Clean Light*, *Cyberpunk Neon*, *Space Cosmos*, *Sakura Blossom*, *Matrix Green*, *Tokyo Night*, *Nord Frost*, *AMOLED Black*, *Retro Amber*.

### 🌱 4. Avatar Evolution Progression System
- Your student avatar evolves as your level increases:
  - **Level 1**: Seedling 🌱
  - **Level 3**: Sprout 🌿
  - **Level 5**: Mighty Oak 🌳
  - **Level 8**: Summit Mountain ⛰️
  - **Level 12**: Rising Phoenix 🦅
  - **Level 20**: Cosmic Dragon 🐉

### 🐾 5. Productivity Pet Companion
- **Spark the Focus Fox** 🦊 companion that gains happiness and energy as you finish study blocks and complete tasks.

### ⌨️ 6. Command Palette (`Ctrl+K` / `Cmd+K`)
- Power-user command bar to search tasks, jump to pages, start timers, toggle theme skins, or trigger ambient rain sounds instantly.

### 🤖 7. Study Companion AI Coach
- Rule-based study coach analyzing daily focus hours, task velocity, streak consistency, and generating personalized study advice.

### ⚡ 8. Tasks & Habit Chain Tracker
- Categorized tasks (*Study*, *Project*, *Exam*, *Personal*) with priority tags (*High*, *Medium*, *Low*), filterable tabs, and party popper confetti completion celebrations.
- Daily habit chain tracker with streak counters.

### 🧘 9. Mindful Space & 4-7-8 Breathing Guide
- Interactive mood logger (feeling tags, energy/focus sliders, journal notes) and guided 4-7-8 animated breathing circle.

### 🟩 10. Study Heatmap & Backup Data Exporter
- GitHub-style 4-week study activity heatmap grid, trophy achievements showcase, and JSON/CSV backup data exporter.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Particle Confetti, Web Audio API.
- **Backend API**: Node.js HTTP Server, `scryptSync` & `sha256` Cryptographic Auth, JSON Disk Database (`backend/data/db.json`), Dynamic Port Detection (3001/3002/3003).

```
FocusFlow/
├── backend/
│   ├── data/
│   │   └── db.json         # Persistent JSON database (Users, Tasks, Habits, Moods, Sessions)
│   ├── package.json
│   └── server.js           # REST API Server with Auth & CRUD endpoints
└── frontend/
    ├── src/
    │   ├── components/     # UI Views, Navigation, Command Palette, Auth Modal
    │   ├── context/        # AppContext global state & XP leveling provider
    │   ├── services/       # Web Audio synth, API client, particle confetti, AI coach
    │   └── styles/         # Glassmorphism & 9 Theme CSS Engine
    ├── index.html
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Start the Backend API Server
```powershell
cd backend
npm install
node server.js
```
*The server will start at `http://localhost:3001` (or port `3002` if 3001 is occupied).*

### 2. Start the Frontend Application
Open a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173`!

---

## CURRENT STATUS
---------------------------------------------------------
IN PROCESSS....
