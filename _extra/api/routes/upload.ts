import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'

export const uploadRouter = new Hono()

// POST /api/upload (protected, R2)
uploadRouter.post('/', authMiddleware(), async (c) => {
  const bucket = c.env.BUCKET as R2Bucket | undefined
  if (!bucket) return c.json({ error: 'Storage not configured' }, 500)

  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) return c.json({ error: 'No file provided' }, 400)
  if (file.size > 2 * 1024 * 1024) return c.json({ error: 'File too large (max 2MB)' }, 400)
  if (!file.type.startsWith('image/')) return c.json({ error: 'Only images allowed' }, 400)

  const ext = file.name.split('.').pop() || 'png'
  const key = `community/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })

  const publicUrl = `${c.env.R2_PUBLIC_URL || 'https://cdn.jimbo77.org'}/${key}`
  return c.json({ url: publicUrl, publicUrl })
})
