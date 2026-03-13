import { Hono } from 'hono'

export const categoriesRouter = new Hono()

// GET /api/categories
categoriesRouter.get('/', async (c) => {
  const db: D1Database = c.env.DB
  const result = await db.prepare('SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order ASC').all()
  return c.json(result.results || [])
})
