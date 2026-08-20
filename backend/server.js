import { createHash, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT || 3001)
const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data', 'db.json')
const defaultTasks = [
  ['Assign team roles', '9:00 AM · NAILED IT!', true],
  ['Finalise app concept', '', true],
  ['Build 5 mockup screens', '', false],
  ['Create pitch slides', '', false],
]

async function loadDb() {
  try { return JSON.parse(await readFile(dataFile, 'utf8')) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    const db = { users: [], tasks: [], moods: [], focusSessions: [] }
    await saveDb(db)
    return db
  }
}
async function saveDb(db) {
  await mkdir(dirname(dataFile), { recursive: true })
  await writeFile(dataFile, JSON.stringify(db, null, 2))
}
function passwordHash(password) { return scryptSync(password, 'focusflow-local-salt', 64).toString('hex') }
function sessionToken(user) { return createHash('sha256').update(`${user.id}:${user.passwordHash}`).digest('hex') }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, token: sessionToken(user) } }
function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': 'http://localhost:5173', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS' })
  response.end(JSON.stringify(body))
}
function error(response, status, message) { json(response, status, { error: message }) }
async function body(request) {
  let raw = ''
  for await (const chunk of request) raw += chunk
  try { return raw ? JSON.parse(raw) : {} } catch { throw new Error('Invalid JSON') }
}
function currentUser(request, db) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  return db.users.find((user) => token && timingSafeEqual(Buffer.from(sessionToken(user)), Buffer.from(token)))
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return json(response, 204, {})
  try {
    const url = new URL(request.url, `http://${request.headers.host}`)
    const db = await loadDb()
    if (request.method === 'GET' && url.pathname === '/api/health') return json(response, 200, { status: 'ok' })
    if (request.method === 'POST' && url.pathname === '/api/auth/signup') {
      const { name, email, password } = await body(request)
      if (!name?.trim() || !email?.trim() || !password || password.length < 6) return error(response, 400, 'Name, email, and a password of at least 6 characters are required.')
      if (db.users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) return error(response, 409, 'An account already exists for this email.')
      const user = { id: randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), passwordHash: passwordHash(password) }
      db.users.push(user)
      db.tasks.push(...defaultTasks.map(([title, detail, completed], position) => ({ id: randomUUID(), userId: user.id, title, detail, completed, position })))
      await saveDb(db)
      return json(response, 201, { user: publicUser(user) })
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password } = await body(request)
      const user = db.users.find((item) => item.email === email?.trim().toLowerCase())
      if (!user || !timingSafeEqual(Buffer.from(user.passwordHash), Buffer.from(passwordHash(password || '')))) return error(response, 401, 'Incorrect email or password.')
      return json(response, 200, { user: publicUser(user) })
    }
    const user = currentUser(request, db)
    if (!user) return error(response, 401, 'Please log in first.')
    if (request.method === 'GET' && url.pathname === '/api/tasks') return json(response, 200, { tasks: db.tasks.filter((task) => task.userId === user.id).sort((a, b) => a.position - b.position) })
    if (request.method === 'POST' && url.pathname === '/api/tasks') {
      const { title, detail = '' } = await body(request)
      if (!title?.trim()) return error(response, 400, 'A task title is required.')
      const task = { id: randomUUID(), userId: user.id, title: title.trim(), detail, completed: false, position: db.tasks.filter((item) => item.userId === user.id).length }
      db.tasks.push(task); await saveDb(db); return json(response, 201, { task })
    }
    const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/)
    if (request.method === 'PATCH' && taskMatch) {
      const task = db.tasks.find((item) => item.id === taskMatch[1] && item.userId === user.id)
      if (!task) return error(response, 404, 'Task not found.')
      const updates = await body(request)
      if (typeof updates.completed === 'boolean') task.completed = updates.completed
      if (typeof updates.title === 'string' && updates.title.trim()) task.title = updates.title.trim()
      if (typeof updates.detail === 'string') task.detail = updates.detail
      await saveDb(db); return json(response, 200, { task })
    }
    if (request.method === 'GET' && url.pathname === '/api/moods') return json(response, 200, { moods: db.moods.filter((mood) => mood.userId === user.id) })
    if (request.method === 'POST' && url.pathname === '/api/moods') {
      const { mood, note = '' } = await body(request)
      if (!mood?.trim()) return error(response, 400, 'A mood is required.')
      const entry = { id: randomUUID(), userId: user.id, mood: mood.trim(), note, createdAt: new Date().toISOString() }
      db.moods.push(entry); await saveDb(db); return json(response, 201, { mood: entry })
    }
    if (request.method === 'POST' && url.pathname === '/api/focus-sessions') {
      const { minutes, intention = '' } = await body(request)
      if (!Number.isFinite(minutes) || minutes <= 0) return error(response, 400, 'A positive session length is required.')
      const session = { id: randomUUID(), userId: user.id, minutes, intention, createdAt: new Date().toISOString() }
      db.focusSessions.push(session); await saveDb(db); return json(response, 201, { session })
    }
    return error(response, 404, 'Endpoint not found.')
  } catch (caught) { return error(response, 400, caught.message || 'Something went wrong.') }
})

server.listen(port, () => console.log(`FocusFlow API running at http://localhost:${port}`))
