import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRouter } from './routes/auth'
import { postsRouter } from './routes/posts'
import { commentsRouter } from './routes/comments'
import { categoriesRouter } from './routes/categories'
import { listingsRouter } from './routes/listings'
import { newsRouter } from './routes/news'
import { uploadRouter } from './routes/upload'
import { crawlerRouter } from './routes/crawlers'
import { webhookRouter } from './routes/webhooks'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger())

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auth (login, register, user profile, dashboard)
app.route('/api', authRouter)

// Posts (CRUD + likes + comments per post)
app.route('/api/posts', postsRouter)

// Comments (delete only — create is under /api/posts/:id/comments)
app.route('/api/comments', commentsRouter)

// Categories
app.route('/api/categories', categoriesRouter)

// Marketplace listings
app.route('/api/listings', listingsRouter)

// Community news / gazetka
app.route('/api/community-news', newsRouter)

// File upload (R2)
app.route('/api/upload', uploadRouter)

// Crawlers
app.route('/api/crawlers', crawlerRouter)

// Webhooks
app.route('/api/webhooks', webhookRouter)

export default app
