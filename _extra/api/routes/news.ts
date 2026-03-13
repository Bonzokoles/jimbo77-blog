import { Hono } from 'hono'

export const newsRouter = new Hono()

// GET /api/community-news
newsRouter.get('/', async (c) => {
  const db: D1Database = c.env.DB
  const result = await db.prepare(
    'SELECT id, type, title, content, url, created_at FROM community_news ORDER BY created_at DESC LIMIT 20'
  ).all()
  return c.json(result.results || [])
})
