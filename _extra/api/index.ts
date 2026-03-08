import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { postsRouter } from './routes/posts'
import { crawlerRouter } from './routes/crawlers'
import { authRouter } from './routes/auth'
import { webhookRouter } from './routes/webhooks'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger())

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.route('/api/posts', postsRouter)
app.route('/api/crawlers', crawlerRouter)
app.route('/api/auth', authRouter)
app.route('/api/webhooks', webhookRouter)

export default app
