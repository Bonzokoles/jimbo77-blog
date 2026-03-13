import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

export const postsRouter = new Hono()

// ─── GET /api/posts ─────────────────────────────────────
postsRouter.get('/', async (c) => {
  const db: D1Database = c.env.DB
  const limit = Math.min(Number(c.req.query('limit')) || 15, 50)
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0)
  const categoryId = c.req.query('category_id')
  const query = c.req.query('q')
  const sortBy = c.req.query('sort_by') // likes | comments | views
  const sortDir = c.req.query('sort_dir') === 'asc' ? 'ASC' : 'DESC'

  let where = '1=1'
  const params: unknown[] = []

  if (categoryId) { where += ' AND p.category_id = ?'; params.push(categoryId) }
  if (query) { where += ' AND (p.title LIKE ? OR p.content LIKE ?)'; params.push(`%${query}%`, `%${query}%`) }

  const orderMap: Record<string, string> = {
    likes: 'p.like_count', comments: 'p.comment_count', views: 'p.view_count'
  }
  const orderCol = orderMap[sortBy || ''] || 'p.is_pinned DESC, p.created_at'
  const orderClause = sortBy ? `${orderCol} ${sortDir}` : `${orderCol} ${sortDir}`

  const countResult = await db.prepare(`SELECT COUNT(*) as c FROM posts p WHERE ${where}`).bind(...params).first()
  const total = (countResult as any)?.c || 0

  const posts = await db.prepare(`
    SELECT p.id, p.title, p.content, p.category_id, p.is_pinned,
           p.view_count, p.like_count, p.comment_count, p.created_at,
           u.username as author_name, u.avatar_url as author_avatar, u.role as author_role, u.id as author_id,
           cat.name as category_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE ${where}
    ORDER BY ${orderClause}
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all()

  return c.json({ posts: posts.results || [], total })
})

// ─── GET /api/posts/:id ─────────────────────────────────
postsRouter.get('/:id', async (c) => {
  const postId = c.req.param('id')
  const userId = c.req.query('user_id')
  const db: D1Database = c.env.DB

  const post = await db.prepare(`
    SELECT p.*, u.username as author_name, u.avatar_url as author_avatar, u.role as author_role,
           cat.name as category_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.id = ?
  `).bind(postId).first()
  if (!post) return c.json({ error: 'Not found' }, 404)

  await db.prepare('UPDATE posts SET view_count = view_count + 1 WHERE id = ?').bind(postId).run()

  let liked = false
  if (userId) {
    const like = await db.prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?').bind(postId, userId).first()
    liked = !!like
  }

  return c.json({ ...post, liked })
})

// ─── POST /api/posts (protected) ────────────────────────
postsRouter.post('/', authMiddleware(), async (c) => {
  const userId = c.get('userId')
  const { title, content, category_id } = await c.req.json()
  if (!title?.trim() || !content?.trim()) return c.json({ error: 'Title and content required' }, 400)
  if (title.length > 30) return c.json({ error: 'Title max 30 chars' }, 400)
  if (content.length > 3000) return c.json({ error: 'Content max 3000 chars' }, 400)

  const db: D1Database = c.env.DB
  const result = await db.prepare(
    `INSERT INTO posts (title, content, author_id, category_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).bind(title.trim(), content, userId, category_id || null).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// ─── PUT /api/posts/:id (protected, owner/admin) ───────
postsRouter.put('/:id', authMiddleware(), async (c) => {
  const postId = c.req.param('id')
  const userId = c.get('userId')
  const role = c.get('userRole')
  const { title, content } = await c.req.json()
  const db: D1Database = c.env.DB

  const post = await db.prepare('SELECT author_id FROM posts WHERE id = ?').bind(postId).first()
  if (!post) return c.json({ error: 'Not found' }, 404)
  if ((post as any).author_id !== userId && role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  await db.prepare(
    `UPDATE posts SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(title?.slice(0, 30), content?.slice(0, 3000), postId).run()

  return c.json({ ok: true })
})

// ─── DELETE /api/posts/:id (protected, owner/admin) ────
postsRouter.delete('/:id', authMiddleware(), async (c) => {
  const postId = c.req.param('id')
  const userId = c.get('userId')
  const role = c.get('userRole')
  const db: D1Database = c.env.DB

  const post = await db.prepare('SELECT author_id FROM posts WHERE id = ?').bind(postId).first()
  if (!post) return c.json({ error: 'Not found' }, 404)
  if ((post as any).author_id !== userId && role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  await db.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run()
  return c.json({ ok: true })
})

// ─── POST /api/posts/:id/like (protected) ───────────────
postsRouter.post('/:id/like', authMiddleware(), async (c) => {
  const postId = c.req.param('id')
  const userId = c.get('userId')
  const db: D1Database = c.env.DB

  const existing = await db.prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?').bind(postId, userId).first()

  if (existing) {
    await db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').bind(postId, userId).run()
    await db.prepare('UPDATE posts SET like_count = MAX(0, like_count - 1) WHERE id = ?').bind(postId).run()
    return c.json({ liked: false })
  } else {
    await db.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').bind(postId, userId).run()
    await db.prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?').bind(postId).run()
    return c.json({ liked: true })
  }
})

// ─── GET /api/posts/:id/comments ────────────────────────
postsRouter.get('/:id/comments', async (c) => {
  const postId = c.req.param('id')
  const db: D1Database = c.env.DB

  const comments = await db.prepare(`
    SELECT c.id, c.content, c.created_at, c.author_id,
           u.username as author_name, u.avatar_url as author_avatar
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).bind(postId).all()

  return c.json(comments.results || [])
})

// ─── POST /api/posts/:id/comments (protected) ──────────
postsRouter.post('/:id/comments', authMiddleware(), async (c) => {
  const postId = c.req.param('id')
  const userId = c.get('userId')
  const { content } = await c.req.json()
  if (!content?.trim()) return c.json({ error: 'Content required' }, 400)
  if (content.length > 1000) return c.json({ error: 'Comment max 1000 chars' }, 400)

  const db: D1Database = c.env.DB
  const result = await db.prepare(
    'INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)'
  ).bind(postId, userId, content.trim()).run()

  await db.prepare('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?').bind(postId).run()

  const user = await db.prepare('SELECT username, avatar_url FROM users WHERE id = ?').bind(userId).first()

  return c.json({
    id: result.meta.last_row_id,
    post_id: Number(postId),
    author_id: userId,
    content: content.trim(),
    author_name: (user as any)?.username,
    author_avatar: (user as any)?.avatar_url,
    created_at: new Date().toISOString(),
  })
})
