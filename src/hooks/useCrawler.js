import { useEffect } from 'react'
import { api } from '../api/client'

// Hook do śledzenia AI crawlerów
export function useCrawlerTracking() {
  useEffect(() => {
    // Sprawdź czy to crawler AI
    const userAgent = navigator.userAgent.toLowerCase()
    const crawlers = [
      { name: 'ChatGPT', pattern: /chatgpt|gptbot/i },
      { name: 'Claude', pattern: /claude|anthropic/i },
      { name: 'Perplexity', pattern: /perplexity/i },
      { name: 'GoogleBot', pattern: /googlebot/i },
      { name: 'BingBot', pattern: /bingbot/i }
    ]
    
    const detectedCrawler = crawlers.find(c => c.pattern.test(userAgent))
    
    if (detectedCrawler) {
      // Zapisz odwiedzinę crawlera
      api.trackCrawlerVisit({
        crawler_name: detectedCrawler.name,
        url: window.location.href,
        user_agent: userAgent,
        ip: 'client-side' // IP będzie po stronie serwera
      }).catch(console.error)
      
      console.log(`[CRAWLER] ${detectedCrawler.name} detected!`)
    }
  }, [])
}
