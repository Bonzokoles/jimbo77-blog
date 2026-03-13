import { Hono } from 'hono'
import { hashPassword, verifyPassword, createToken, authMiddleware } from '../middleware/auth'

export const authRouter = new Hono()

const JWT_SECRET = (env: any) => env.JWT_SECRET || 'jimbo77-community-secret-key'

// ─── POST /api/login ────────────────────────────────────
authRouter.post('/login', async (c) => {
  const { email, password, totp_code } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Missing email or password' }, 400)

  const db: D1Database = c.env.DB
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase().trim()).first()
  if (!user) return c.json({ error: 'Username or Password Error' }, 401)

  const valid = await verifyPassword(password, user.password_hash as string)
  if (!valid) return c.json({ error: 'Username or Password Error' }, 401)

  if (user.totp_enabled && !totp_code) {
    return c.json({ error: 'TOTP_REQUIRED' }, 401)
  }

  const token = await createToken(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET(c.env)
  )

  const { password_hash, totp_secret, ...safeUser } = user as Record<string, unknown>
  return c.json({ token, user: safeUser })
})

// ─── POST /api/register ─────────────────────────────────
authRouter.post('/register', async (c) => {
  const { email, username, password } = await c.req.json()
  if (!email || !username || !password) return c.json({ error: 'Missing email, username or password' }, 400)

  const trimmedEmail = email.toLowerCase().trim()
  const trimmedUsername = username.trim()

  if (trimmedUsername.length > 20) return c.json({ error: 'Username too long (Max 20 chars)' }, 400)
  if (trimmedEmail.length > 50) return c.json({ error: 'Email too long (Max 50 chars)' }, 400)
  if (password.length < 8 || password.length > 16) return c.json({ error: 'Password must be 8-16 characters' }, 400)

  const db: D1Database = c.env.DB

  const existingEmail = await db.prepare('SELECT id FROM users WHERE email = ?').bind(trimmedEmail).first()
  if (existingEmail) return c.json({ error: 'Email already exists' }, 409)

  const existingUsername = await db.prepare('SELECT id FROM users WHERE username = ?').bind(trimmedUsername).first()
  if (existingUsername) return c.json({ error: 'Username already taken' }, 409)

  const passwordHash = await hashPassword(password)

  await db.prepare(
    `INSERT INTO users (username, email, password_hash, role, created_at) VALUES (?, ?, ?, 'member', datetime('now'))`
  ).bind(trimmedUsername, trimmedEmail, passwordHash).run()

  return c.json({ message: 'Rejestracja udana! Możesz się zalogować.' }, 201)
})

// ─── POST /api/user/profile (protected) ─────────────────
authRouter.post('/user/profile', authMiddleware(), async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const db: D1Database = c.env.DB

  const fields = ['username', 'avatar_url', 'bio', 'location', 'website',
                   'github_url', 'twitter_url', 'linkedin_url', 'skills', 'dashboard_sections']

  const setClauses: string[] = []
  const values: unknown[] = []

  for (const field of fields) {
    if (body[field] !== undefined) {
      setClauses.push(`${field} = ?`)
      values.push(typeof body[field] === 'string' ? body[field].slice(0, 500) : body[field])
    }
  }

  if (setClauses.length === 0) return c.json({ error: 'Nothing to update' }, 400)

  if (body.username) {
    const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND id != ?')
      .bind(body.username.trim(), userId).first()
    if (existing) return c.json({ error: 'Username already taken' }, 409)
  }

  values.push(userId)
  await db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`).bind(...values).run()

  const updated = await db.prepare(
    'SELECT id, username, email, avatar_url, bio, location, website, github_url, twitter_url, linkedin_url, skills, dashboard_sections, role, totp_enabled, created_at FROM users WHERE id = ?'
  ).bind(userId).first()

  return c.json({ user: updated })
})

// ─── POST /api/user/change-password (protected) ─────────
authRouter.post('/user/change-password', authMiddleware(), async (c) => {
  const userId = c.get('userId')
  const { current_password, new_password } = await c.req.json()
  if (!current_password || !new_password) return c.json({ error: 'Missing passwords' }, 400)
  if (new_password.length < 8 || new_password.length > 16) return c.json({ error: 'Password must be 8-16 characters' }, 400)

  const db: D1Database = c.env.DB
  const user = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(userId).first()
  if (!user) return c.json({ error: 'User not found' }, 404)

  const valid = await verifyPassword(current_password, user.password_hash as string)
  if (!valid) return c.json({ error: 'Wrong current password' }, 401)

  const newHash = await hashPassword(new_password)
  await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(newHash, userId).run()

  return c.json({ message: 'Password changed' })
})

// ─── GET /api/users/:username/dashboard ─────────────────
authRouter.get('/users/:username/dashboard', async (c) => {
  const username = c.req.param('username')
  const db: D1Database = c.env.DB

  const user = await db.prepare(
    `SELECT id, username, avatar_url, bio, location, website,
            github_url, twitter_url, linkedin_url, skills,
            dashboard_sections, role, created_at
     FROM users WHERE username = ?`
  ).bind(username).first()
  if (!user) return c.json({ error: 'User not found' }, 404)

  const userId = (user as any).id

  // Stats
  const postCount = await db.prepare('SELECT COUNT(*) as c FROM posts WHERE author_id = ?').bind(userId).first()
  const commentCount = await db.prepare('SELECT COUNT(*) as c FROM comments WHERE author_id = ?').bind(userId).first()
  const likesReceived = await db.prepare(
    'SELECT COUNT(*) as c FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)'
  ).bind(userId).first()

  // Recent posts
  const recentPosts = await db.prepare(
    `SELECT id, title, like_count, comment_count, view_count, created_at
     FROM posts WHERE author_id = ? ORDER BY created_at DESC LIMIT 5`
  ).bind(userId).all()

  return c.json({
    ...user,
    stats: {
      posts: (postCount as any)?.c || 0,
      comments: (commentCount as any)?.c || 0,
      likes_received: (likesReceived as any)?.c || 0,
    },
    recent_posts: recentPosts.results || [],
  })
})
