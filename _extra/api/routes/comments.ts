import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

export const commentsRouter = new Hono()

// DELETE /api/comments/:id (protected, owner/admin)
commentsRouter.delete('/:id', authMiddleware(), async (c) => {
  const commentId = c.req.param('id')
  const userId = c.get('userId')
  const role = c.get('userRole')
  const db: D1Database = c.env.DB

  const comment = await db.prepare('SELECT author_id, post_id FROM comments WHERE id = ?').bind(commentId).first()
  if (!comment) return c.json({ error: 'Not found' }, 404)
  if ((comment as any).author_id !== userId && role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  await db.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run()
  await db.prepare('UPDATE posts SET comment_count = MAX(0, comment_count - 1) WHERE id = ?')
    .bind((comment as any).post_id).run()

  return c.json({ ok: true })
})
