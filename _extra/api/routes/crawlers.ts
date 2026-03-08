import { Hono } from 'hono'

export const crawlerRouter = new Hono()

// GET /api/crawlers/stats - statystyki crawlerów
crawlerRouter.get('/stats', async (c) => {
  const db = c.env.DB
  
  const stats = await db.prepare(`
    SELECT 
      crawler_name,
      COUNT(*) as visits,
      MAX(visited_at) as last_visit
    FROM crawler_visits
    GROUP BY crawler_name
    ORDER BY visits DESC
  `).all()
  
  return c.json({ crawlers: stats.results })
})

// POST /api/crawlers/visit - zapisuje odwiedzinę crawlera
crawlerRouter.post('/visit', async (c) => {
  const body = await c.req.json()
  const db = c.env.DB
  
  // Zapisz odwiedzinę
  await db.prepare(`
    INSERT INTO crawler_visits (crawler_name, url, user_agent, ip, visited_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).bind(
    body.crawler_name || 'unknown',
    body.url,
    body.user_agent,
    body.ip
  ).run()
  
  // Zwiększ licznik w global_stats
  await db.prepare(`
    INSERT INTO global_stats (key, value) VALUES ('crawler_visits', 1)
    ON CONFLICT(key) DO UPDATE SET value = value + 1
  `).run()
  
  return c.json({ status: 'tracked' })
})

// GET /api/crawlers/llms-txt - dla AI crawlerów (llms.txt standard)
crawlerRouter.get('/llms-txt', async (c) => {
  const db = c.env.DB
  
  const posts = await db.prepare(`
    SELECT title, slug, excerpt, created_at 
    FROM posts 
    WHERE published = 1 
    ORDER BY created_at DESC 
    LIMIT 100
  `).all()
  
  // Generuj llms.txt format
  let llmsText = `# JIMBO77 AI Social Club - Content Index

`
  llmsText += `This file helps AI crawlers index our content efficiently.

`
  
  for (const post of posts.results) {
    llmsText += `## ${post.title}
`
    llmsText += `- URL: https://jimbo77.org/blog/${post.slug}
`
    llmsText += `- Description: ${post.excerpt || 'No description'}
`
    llmsText += `- Published: ${post.created_at}

`
  }
  
  return c.text(llmsText)
})
