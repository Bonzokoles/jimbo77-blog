import { Hono } from 'hono'

export const webhookRouter = new Hono()

// POST /api/webhooks/receive
webhookRouter.post('/receive', async (c) => {
  const { source_app, event_type, payload } = await c.req.json()
  if (!source_app || !event_type) return c.json({ error: 'Missing source_app or event_type' }, 400)

  const db: D1Database = c.env.DB
  await db.prepare(
    'INSERT INTO webhooks (source_app, event_type, payload) VALUES (?, ?, ?)'
  ).bind(source_app, event_type, JSON.stringify(payload || {})).run()

  return c.json({ ok: true }, 201)
})

// GET /api/webhooks (admin only — basic)
webhookRouter.get('/', async (c) => {
  const db: D1Database = c.env.DB
  const result = await db.prepare(
    'SELECT id, source_app, event_type, processed, created_at FROM webhooks ORDER BY created_at DESC LIMIT 50'
  ).all()
  return c.json(result.results || [])
})
