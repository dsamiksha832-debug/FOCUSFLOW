import { createHash, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT || 3001);
const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data', 'db.json');

const defaultTasks = [
  { title: 'Complete Calculus Chapter 4 Review', category: 'Study', priority: 'High', detail: 'Solve all odd-numbered problems in Section 4.2', completed: false },
  { title: 'Outline DBMS Term Paper', category: 'Project', priority: 'Medium', detail: 'Draft ER diagrams & normalization steps', completed: false },
  { title: '30-Minute Morning Reading Session', category: 'Personal', priority: 'Low', detail: 'Read Atomic Habits Chapter 3', completed: true },
  { title: 'Prepare DSA Lab Presentation', category: 'Exam', priority: 'High', detail: 'Build visual slides on Graph Traversal algorithms', completed: false }
];

const defaultHabits = [
  { id: 'h1', title: 'Daily Workout / Stretch', category: 'Health', streak: 5, history: ['2026-08-20', '2026-08-21'] },
  { id: 'h2', title: 'Read 20 Pages', category: 'Mindset', streak: 8, history: ['2026-08-20', '2026-08-21'] },
  { id: 'h3', title: 'Hydrate 2.5L Water', category: 'Health', streak: 12, history: ['2026-08-20', '2026-08-21'] },
  { id: 'h4', title: 'Journal Reflection', category: 'Mindfulness', streak: 3, history: ['2026-08-21'] }
];

const defaultMissions = [
  { id: 'm1', title: 'Complete 3 Daily Tasks', target: 3, progress: 1, xpReward: 100, completed: false },
  { id: 'm2', title: 'Focus for 60 Minutes', target: 60, progress: 30, xpReward: 120, completed: false },
  { id: 'm3', title: 'Log Your Daily Mood', target: 1, progress: 0, xpReward: 50, completed: false }
];

async function loadDb() {
  try {
    const data = await readFile(dataFile, 'utf8');
    const db = JSON.parse(data);
    if (!Array.isArray(db.users)) db.users = [];
    if (!Array.isArray(db.tasks)) db.tasks = [];
    if (!Array.isArray(db.habits)) db.habits = [];
    if (!Array.isArray(db.moods)) db.moods = [];
    if (!Array.isArray(db.focusSessions)) db.focusSessions = [];
    if (!db.userStates || typeof db.userStates !== 'object') db.userStates = {};
    return db;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    const initialDb = {
      users: [],
      tasks: [],
      habits: [],
      moods: [],
      focusSessions: [],
      userStates: {}
    };
    await saveDb(initialDb);
    return initialDb;
  }
}

async function saveDb(db) {
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(db, null, 2));
}

function hashPassword(password) {
  return scryptSync(password, 'focusflow-salt-2026', 64).toString('hex');
}

function generateToken(user) {
  return createHash('sha256').update(`${user.id}:${user.passwordHash}`).digest('hex');
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user)
  };
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function errorResponse(res, statusCode, message) {
  jsonResponse(res, statusCode, { error: message });
}

async function parseBody(req) {
  let bodyStr = '';
  for await (const chunk of req) {
    bodyStr += chunk;
  }
  try {
    return bodyStr ? JSON.parse(bodyStr) : {};
  } catch {
    throw new Error('Invalid JSON input');
  }
}

function getAuthenticatedUser(req, db) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  return db.users.find(u => {
    const userToken = generateToken(u);
    return userToken.length === token.length && timingSafeEqual(Buffer.from(userToken), Buffer.from(token));
  });
}

function getDefaultUserState(userId) {
  return {
    userId,
    xp: 350,
    level: 2,
    streak: 6,
    unlockedThemes: ['glass', 'dark'],
    activeTheme: 'glass',
    activePet: 'fox',
    petHappiness: 85,
    soundEffects: true,
    ambientSound: 'none',
    achievements: ['first_task', 'first_focus', 'mood_checkin']
  };
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return jsonResponse(res, 204, {});
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const db = await loadDb();

    // Healthcheck
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return jsonResponse(res, 200, { status: 'ok', time: new Date().toISOString() });
    }

    // Signup
    if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
      const { name, email, password } = await parseBody(req);
      if (!name?.trim() || !email?.trim() || !password || password.length < 4) {
        return errorResponse(res, 400, 'Name, valid email, and password (at least 4 chars) required.');
      }
      const normalizedEmail = email.trim().toLowerCase();
      if (db.users.some(u => u.email === normalizedEmail)) {
        return errorResponse(res, 409, 'An account already exists with this email address.');
      }

      const user = {
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
      };

      db.users.push(user);
      db.userStates[user.id] = getDefaultUserState(user.id);

      // Seed default tasks & habits for new user
      defaultTasks.forEach((t, i) => {
        db.tasks.push({ id: randomUUID(), userId: user.id, ...t, createdAt: new Date().toISOString(), position: i });
      });

      defaultHabits.forEach(h => {
        db.habits.push({ ...h, userId: user.id });
      });

      await saveDb(db);
      return jsonResponse(res, 201, { user: safeUser(user), state: db.userStates[user.id] });
    }

    // Login
    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password } = await parseBody(req);
      const normalizedEmail = (email || '').trim().toLowerCase();
      const user = db.users.find(u => u.email === normalizedEmail);

      if (!user) {
        return errorResponse(res, 401, 'Invalid email or password.');
      }

      const hash = hashPassword(password || '');
      if (hash.length !== user.passwordHash.length || !timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash))) {
        return errorResponse(res, 401, 'Invalid email or password.');
      }

      const userState = db.userStates[user.id] || getDefaultUserState(user.id);
      return jsonResponse(res, 200, { user: safeUser(user), state: userState });
    }

    // Authenticated routes check
    const currentUser = getAuthenticatedUser(req, db);
    if (!currentUser && url.pathname.startsWith('/api/')) {
      return errorResponse(res, 401, 'Authentication token missing or invalid.');
    }

    // Get User State
    if (req.method === 'GET' && url.pathname === '/api/user/state') {
      const state = db.userStates[currentUser.id] || getDefaultUserState(currentUser.id);
      return jsonResponse(res, 200, { state, missions: defaultMissions });
    }

    // Update User State (e.g. active theme, XP gain, pet change)
    if (req.method === 'PATCH' && url.pathname === '/api/user/state') {
      const updates = await parseBody(req);
      const currentState = db.userStates[currentUser.id] || getDefaultUserState(currentUser.id);
      db.userStates[currentUser.id] = { ...currentState, ...updates };
      await saveDb(db);
      return jsonResponse(res, 200, { state: db.userStates[currentUser.id] });
    }

    // Tasks API
    if (req.method === 'GET' && url.pathname === '/api/tasks') {
      const userTasks = db.tasks.filter(t => t.userId === currentUser.id);
      return jsonResponse(res, 200, { tasks: userTasks });
    }

    if (req.method === 'POST' && url.pathname === '/api/tasks') {
      const { title, detail = '', category = 'Study', priority = 'Medium' } = await parseBody(req);
      if (!title?.trim()) return errorResponse(res, 400, 'Task title is required.');

      const newTask = {
        id: randomUUID(),
        userId: currentUser.id,
        title: title.trim(),
        detail,
        category,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
      };

      db.tasks.push(newTask);
      await saveDb(db);
      return jsonResponse(res, 201, { task: newTask });
    }

    const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (taskMatch) {
      const taskId = taskMatch[1];
      const taskIndex = db.tasks.findIndex(t => t.id === taskId && t.userId === currentUser.id);
      if (taskIndex === -1) return errorResponse(res, 404, 'Task not found.');

      if (req.method === 'PATCH') {
        const updates = await parseBody(req);
        db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updates };
        await saveDb(db);
        return jsonResponse(res, 200, { task: db.tasks[taskIndex] });
      }

      if (req.method === 'DELETE') {
        db.tasks.splice(taskIndex, 1);
        await saveDb(db);
        return jsonResponse(res, 200, { success: true, id: taskId });
      }
    }

    // Habits API
    if (req.method === 'GET' && url.pathname === '/api/habits') {
      const userHabits = db.habits.filter(h => h.userId === currentUser.id);
      return jsonResponse(res, 200, { habits: userHabits });
    }

    if (req.method === 'POST' && url.pathname === '/api/habits/toggle') {
      const { habitId, date } = await parseBody(req);
      const habit = db.habits.find(h => h.id === habitId && h.userId === currentUser.id);
      if (!habit) return errorResponse(res, 404, 'Habit not found.');

      const todayStr = date || new Date().toISOString().split('T')[0];
      const idx = habit.history.indexOf(todayStr);
      if (idx >= 0) {
        habit.history.splice(idx, 1);
        habit.streak = Math.max(0, habit.streak - 1);
      } else {
        habit.history.push(todayStr);
        habit.streak += 1;
      }

      await saveDb(db);
      return jsonResponse(res, 200, { habit });
    }

    // Moods API
    if (req.method === 'GET' && url.pathname === '/api/moods') {
      const userMoods = db.moods.filter(m => m.userId === currentUser.id);
      return jsonResponse(res, 200, { moods: userMoods });
    }

    if (req.method === 'POST' && url.pathname === '/api/moods') {
      const { mood, note = '', energy = 3, focus = 3 } = await parseBody(req);
      if (!mood?.trim()) return errorResponse(res, 400, 'Mood selection is required.');

      const entry = {
        id: randomUUID(),
        userId: currentUser.id,
        mood: mood.trim(),
        note: note.trim(),
        energy,
        focus,
        createdAt: new Date().toISOString()
      };

      db.moods.push(entry);
      await saveDb(db);
      return jsonResponse(res, 201, { mood: entry });
    }

    // Focus Sessions API
    if (req.method === 'GET' && url.pathname === '/api/focus-sessions') {
      const sessions = db.focusSessions.filter(s => s.userId === currentUser.id);
      return jsonResponse(res, 200, { sessions });
    }

    if (req.method === 'POST' && url.pathname === '/api/focus-sessions') {
      const { minutes, intention = '', mode = 'pomodoro', rating = 5 } = await parseBody(req);
      if (!Number.isFinite(minutes) || minutes <= 0) return errorResponse(res, 400, 'Valid session duration required.');

      const session = {
        id: randomUUID(),
        userId: currentUser.id,
        minutes,
        intention: intention.trim(),
        mode,
        rating,
        createdAt: new Date().toISOString()
      };

      db.focusSessions.push(session);

      // Award XP to user
      const userState = db.userStates[currentUser.id] || getDefaultUserState(currentUser.id);
      const xpGained = Math.round(minutes * 2);
      userState.xp += xpGained;

      await saveDb(db);
      return jsonResponse(res, 201, { session, xpGained, totalXp: userState.xp });
    }

    return errorResponse(res, 404, 'Endpoint not found.');
  } catch (err) {
    console.error('Server error:', err);
    return errorResponse(res, 500, err.message || 'Internal server error');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const ALT_PORT = PORT + 1;
    console.log(`Port ${PORT} in use, trying ${ALT_PORT}...`);
    server.listen(ALT_PORT, () => {
      console.log(`🚀 FocusFlow API Server running at http://localhost:${ALT_PORT}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 FocusFlow API Server running at http://localhost:${PORT}`);
});
