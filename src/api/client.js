// API Client for JIMBO77 Social Club
// Łączy frontend z backendem

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const api = {
  // Posts
  async getPosts() {
    const res = await fetch(`${API_BASE}/api/posts`)
    return res.json()
  },
  
  async getPost(slug) {
    const res = await fetch(`${API_BASE}/api/posts/${slug}`)
    return res.json()
  },
  
  async createPost(post) {
    const res = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    return res.json()
  },
  
  // Crawlers (AI tracking)
  async getCrawlerStats() {
    const res = await fetch(`${API_BASE}/api/crawlers/stats`)
    return res.json()
  },
  
  async trackCrawlerVisit(data) {
    const res = await fetch(`${API_BASE}/api/crawlers/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  }
}

export default api
