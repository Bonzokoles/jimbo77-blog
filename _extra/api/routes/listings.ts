import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

export const listingsRouter = new Hono()

// GET /api/listings
listingsRouter.get('/', async (c) => {
  const type = c.req.query('type')
  const db: D1Database = c.env.DB

  let query = `
    SELECT l.*, u.username as author_name
    FROM listings l JOIN users u ON l.author_id = u.id
  `
  const params: unknown[] = []

  if (type) {
    query += ' WHERE l.type = ?'
    params.push(type)
  }
  query += ' ORDER BY l.created_at DESC LIMIT 30'

  const result = await db.prepare(query).bind(...params).all()
  return c.json(result.results || [])
})

// POST /api/listings (protected)
listingsRouter.post('/', authMiddleware(), async (c) => {
  const userId = c.get('userId')
  const { title, description, type, contact } = await c.req.json()
  if (!title?.trim() || !description?.trim()) return c.json({ error: 'Title and description required' }, 400)
  if (title.length > 80) return c.json({ error: 'Title max 80 chars' }, 400)
  if (description.length > 500) return c.json({ error: 'Description max 500 chars' }, 400)

  const validType = type === 'szukam' ? 'szukam' : 'oferuję'
  const db: D1Database = c.env.DB

  await db.prepare(
    'INSERT INTO listings (author_id, title, description, type, contact) VALUES (?, ?, ?, ?, ?)'
  ).bind(userId, title.trim(), description.trim(), validType, (contact || '').slice(0, 100)).run()

  return c.json({ ok: true }, 201)
})

// DELETE /api/listings/:id (protected, owner/admin)
listingsRouter.delete('/:id', authMiddleware(), async (c) => {
  const listingId = c.req.param('id')
  const userId = c.get('userId')
  const role = c.get('userRole')
  const db: D1Database = c.env.DB

  const listing = await db.prepare('SELECT author_id FROM listings WHERE id = ?').bind(listingId).first()
  if (!listing) return c.json({ error: 'Not found' }, 404)
  if ((listing as any).author_id !== userId && role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  await db.prepare('DELETE FROM listings WHERE id = ?').bind(listingId).run()
  return c.json({ ok: true })
})
