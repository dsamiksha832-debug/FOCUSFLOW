// FocusFlow API Client with Dynamic Port Detection & Offline LocalStorage Fallback

const API_PORTS = [3001, 3002, 3003];

function getToken() {
  return localStorage.getItem('focusflow_token') || '';
}

function setToken(token) {
  if (token) localStorage.setItem('focusflow_token', token);
  else localStorage.removeItem('focusflow_token');
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastError = null;

  for (const port of API_PORTS) {
    try {
      const res = await fetch(`http://localhost:${port}/api${endpoint}`, {
        ...options,
        headers
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP error ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      // If endpoint returned specific HTTP error like 400/409/401, don't try other ports, throw immediately!
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }
  }

  console.warn(`API request to ${endpoint} failed across ports, relying on local storage:`, lastError?.message);
  throw lastError || new Error('Backend server unreachable');
}

export const api = {
  setToken,
  getToken,
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getUserState: () => request('/user/state'),
  updateUserState: (data) => request('/user/state', { method: 'PATCH', body: JSON.stringify(data) }),
  getTasks: () => request('/tasks'),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getHabits: () => request('/habits'),
  toggleHabit: (habitId, date) => request('/habits/toggle', { method: 'POST', body: JSON.stringify({ habitId, date }) }),
  getMoods: () => request('/moods'),
  createMood: (data) => request('/moods', { method: 'POST', body: JSON.stringify(data) }),
  getFocusSessions: () => request('/focus-sessions'),
  createFocusSession: (data) => request('/focus-sessions', { method: 'POST', body: JSON.stringify(data) })
};
