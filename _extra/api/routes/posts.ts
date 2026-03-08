import { Hono } from 'hono'
import { getDB } from '../db/client'

export const postsRouter = new Hono()

// GET /api/posts - lista postów
postsRouter.get('/', async (c) => {
  const db = getDB(c.env.DB)
  const posts = await db.prepare(`
    SELECT * FROM posts 
    WHERE published = 1 
    ORDER BY created_at DESC 
    LIMIT 50
  `).all()
  
  return c.json({ posts: posts.results })
})

// GET /api/posts/:slug - pojedynczy post
postsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = getDB(c.env.DB)
  
  const post = await db.prepare(`
    SELECT * FROM posts WHERE slug = ?
  `).bind(slug).first()
  
  if (!post) return c.json({ error: 'Not found' }, 404)
  
  // Zwiększ licznik wyświetleń
  await db.prepare(`
    UPDATE posts SET views = views + 1 WHERE slug = ?
  `).bind(slug).run()
  
  return c.json({ post })
})

// POST /api/posts - tworzenie posta (wymaga auth)
postsRouter.post('/', async (c) => {
  const body = await c.req.json()
  const db = getDB(c.env.DB)
  
  const result = await db.prepare(`
    INSERT INTO posts (title, slug, content, author, published, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    body.title,
    body.slug,
    body.content,
    body.author,
    body.published || 0
  ).run()
  
  return c.json({ id: result.meta.last_row_id }, 201)
})
