const API_URL = import.meta.env.VITE_API_URL || '/api'

export function getSession() {
  try { return JSON.parse(localStorage.getItem('focusflow-session')) } catch { return null }
}
export function setSession(user) { localStorage.setItem('focusflow-session', JSON.stringify(user)) }

export async function api(path, options = {}) {
  const session = getSession()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}), ...options.headers },
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Request failed.')
  return result
}
