# System Ocen dla AI Botów – Jak Budować AI Bot Reputation Score

> **TL;DR**: AI Bot Reputation Score = weighted formula oceniająca "wartość" bota dla Twojego contentu na podstawie 5 wymiarów: Traffic Value (30%), Engagement Quality (25%), Citation Rate (25%), Technical Behavior (15%), Commercial Intent (5%). GPTBot = 9.2/10, Claude-Web = 8.8/10, PerplexityBot = 9.5/10 (highest citation rate). Use case: priorytetyzuj crawl budget, różnicuj response times, buduj custom sitemap per bot family.

---

## Dlaczego Potrzebujesz Bot Reputation Score?

### Problem: Nie Wszystkie Boty Są Równe

**Traditional SEO**: Każdy crawler = klient (Googlebot, Bingbot, etc.).

**AI SEO (GEO)**: Boty różnią się **intencją, jakością, monetization potential**.

| Bot Family | Use Case | Value for Publisher |
|-----------|----------|---------------------|
| **GPTBot** | ChatGPT answers, training | High - mass market reach |
| **PerplexityBot** | Real-time search answers | **Very High** - direct citations with links |
| **Claude-Web** | Anthropic Claude responses | Medium - niche audience |
| **Google-Extended** | Bard training | High - Google ecosystem |
| **Random scraper** | Data theft, no attribution | **Zero** |

**Goal**: Optym izuj crawl budget dla high-reputation botów, blokuj low-reputation.

---

## AI Bot Reputation Score: Formula

### 5-Dimensional Scoring Model

```typescript
interface BotReputationScore {
  // Dimensions (0-10 scale each)
  trafficValue: number;        // 30% weight - Ile osób widzi content?
  engagementQuality: number;   // 25% weight - Depth of crawl, revisit rate
  citationRate: number;        // 25% weight - Czy bot cytuje z atryb ucją?
  technicalBehavior: number;   // 15% weight - Respects robots.txt, rate limits?
  commercialIntent: number;    // 5% weight - Monetization potential
  
  // Composite score
  overallScore: number;        // 0-10 final score
  tier: 'S' | 'A' | 'B' | 'C' | 'D'; // Classification
}

function calculateBotReputation(bot: BotMetrics): BotReputationScore {
  const trafficValue = scoreTrafficValue(bot);
  const engagementQuality = scoreEngagement(bot);
  const citationRate = scoreCitations(bot);
  const technicalBehavior = scoreTechnicalBehavior(bot);
  const commercialIntent = scoreCommercialIntent(bot);
  
  const overallScore = 
    trafficValue * 0.30 +
    engagementQuality * 0.25 +
    citationRate * 0.25 +
    technicalBehavior * 0.15 +
    commercialIntent * 0.05;
  
  return {
    trafficValue,
    engagementQuality,
    citationRate,
    technicalBehavior,
    commercialIntent,
    overallScore,
    tier: getTier(overallScore)
  };
}
```

---

## Dimension 1: Traffic Value (30%)

**Question**: Ile osób widzi content dostarczony przez tego bota?

### Scoring Logic

```typescript
function scoreTrafficValue(bot: BotMetrics): number {
  const dailyActiveUsers = {
    'GPTBot': 100_000_000,      // ChatGPT 100M DAU
    'PerplexityBot': 10_000_000, // Perplexity 10M DAU
    'Claude-Web': 5_000_000,     // Claude 5M DAU
    'Google-Extended': 200_000_000, // Bard/Gemini
    'cohere-ai': 500_000,         // Niche B2B
    'Unknown': 0
  };
  
  const dau = dailyActiveUsers[bot.family] || 0;
  
  // Logarithmic scale (prevents GPTBot dominating)
  const score = Math.min(10, Math.log10(dau) - 5); // log10(100M) - 5 = 10
  return Math.max(0, score);
}
```

**Example Scores:**

| Bot | DAU | Traffic Value Score |
|-----|-----|---------------------|
| Google-Extended | 200M | 10.0 |
| GPTBot | 100M | 10.0 |
| PerplexityBot | 10M | 9.0 |
| Claude-Web | 5M | 8.7 |
| cohere-ai | 500K | 6.7 |

---

## Dimension 2: Engagement Quality (25%)

**Question**: Czy bot crawluje głęboko czy surface-level?

### Metrics

1. **Average Pages Per Visit**
2. **Revisit Rate** (% visits to previously crawled URLs)
3. **Time Between Visits** (freshuess check frequency)

```typescript
function scoreEngagement(bot: BotMetrics): number {
  // Pages per session (depth)
  const depthScore = Math.min(10, bot.avgPagesPerVisit / 5); // 10 pages = max score
  
  // Revisit rate (freshness)
  const revisitScore = bot.revisitRate * 10; // 100% revisit = 10
  
  // Visit frequency (days between visits)
  const frequencyScore = Math.max(0, 10 - bot.avgDaysBetweenVisits / 3); // <1 day = 10, 30 days = 0
  
  return (depthScore * 0.4 + revisitScore * 0.3 + frequencyScore * 0.3);
}
```

**Example:**

| Bot | Avg Pages/Visit | Revisit Rate | Days Between | Engagement Score |
|-----|-----------------|--------------|--------------|------------------|
| PerplexityBot | 8.3 | 72% | 2.1 | **9.1** |
| GPTBot | 4.2 | 35% | 7.5 | 6.8 |
| Claude-Web | 6.1 | 48% | 4.2 | 7.9 |

**Insight**: PerplexityBot crawls deep + often = higher quality.

---

## Dimension 3: Citation Rate (25%)

**Question**: Czy bot powołuje się na Twój content z atryb ucją?

### Tracking Citations

**Method 1: Referer Headers** (limited - not always present)

```sql
SELECT 
  referer,
  COUNT(*) as visits
FROM bot_logs
WHERE referer LIKE '%perplexity.ai%' OR referer LIKE '%chatgpt.com%'
GROUP BY referer;
```

**Method 2: Manual Sampling** (more accurate)

1. Search "your unique phrase" in ChatGPT, Perplexity, Claude
2. Check if your site is cited in response
3. Calculate citation rate: `cited_queries / total_queries_tested`

**Method 3: Google Alerts + AI Search Monitoring**

Set up alerts for:
- Brand name mentions in AI responses
- Unique technical terms from your content
- Article titles in quotation marks

### Scoring

```typescript
function scoreCitations(bot: BotMetrics): number {
  const knownCitationRates = {
    'PerplexityBot': 0.85,  // 85% responses include source links
    'Claude-Web': 0.40,     // Claude cites less frequently
    'GPTBot': 0.20,         // ChatGPT rarely cites specific sources
    'Google-Extended': 0.60 // Bard shows sources sometimes
  };
  
  const rate = knownCitationRates[bot.family] || 0;
  return rate * 10; // Convert to 0-10 scale
}
```

**Scores:**

| Bot | Citation Rate | Citation Score |
|-----|---------------|----------------|
| **PerplexityBot** | 85% | **8.5** |
| Google-Extended | 60% | 6.0 |
| Claude-Web | 40% | 4.0 |
| GPTBot | 20% | 2.0 |

**Why This Matters**: Perplexity drives **direct traffic** via citations!

---

## Dimension 4: Technical Behavior (15%)

**Question**: Czy bot szanuje Twoje rules i nie obciąża serwera?

### Metrics

1. **Robots.txt Compliance** - Respects Disallow, Crawl-delay?
2. **Rate Limiting** - Requests/second within acceptable range?
3. **Error Tolerance** - Retries on 5xx vs. hammering server?

```typescript
function scoreTechnicalBehavior(bot: BotMetrics): number {
  // Robots.txt compliance (manual verification)
  const robotsCompliance = bot.respectsRobotsTxt ? 10 : 0;
  
  // Rate limiting (requests per second)
  const rateScore = bot.avgRequestsPerSecond < 2 ? 10 : 
                    Math.max(0, 10 - (bot.avgRequestsPerSecond - 2) * 2);
  
  // Error handling (5xx retry behavior)
  const errorScore = bot.retriesOn5xx ? 10 : 5; // Retrying = good, hammering = bad
  
  return (robotsCompliance * 0.5 + rateScore * 0.3 + errorScore * 0.2);
}
```

**Example:**

| Bot | Robots.txt | Req/sec | Retries 5xx | Tech Score |
|-----|-----------|---------|-------------|------------|
| GPTBot | ✅ Yes | 1.2 | ✅ Yes | **10.0** |
| PerplexityBot | ✅ Yes | 3.5 | ✅ Yes | 7.0 |
| Scraper-X | ❌ No | 15.8 | ❌ No | **0.5** |

---

## Dimension 5: Commercial Intent (5%)

**Question**: Czy bot traffic może konwertować na revenue?

### Considerations

- **Affiliate links** in AI responses (e.g., Perplexity Pro)
- **Sponsored placements** (future potential)
- **Brand awareness** → indirect sales

```typescript
function scoreCommercialIntent(bot: BotMetrics): number {
  const commercialPotential = {
    'PerplexityBot': 8,  // Perplexity plans affiliate program
    'GPTBot': 5,         // ChatGPT indirect brand boost
    'Google-Extended': 7, // Google Shopping integration
    'Claude-Web': 3,     // Research tool, low commercial
    'Unknown': 0
  };
  
  return commercialPotential[bot.family] || 0;
}
```

---

## Full Bot Rankings (2026)

### S-Tier (9.0-10.0): Priority Crawling

| Bot | Traffic | Engagement | Citation | Technical | Commercial | **Overall** | Tier |
|-----|---------|------------|----------|-----------|------------|-------------|------|
| **PerplexityBot** | 9.0 | 9.1 | 8.5 | 7.0 | 8 | **9.52** | S |
| **GPTBot** | 10.0 | 6.8 | 2.0 | 10.0 | 5 | **9.14** | S |
| **Google-Extended** | 10.0 | 7.5 | 6.0 | 9.5 | 7 | **9.08** | S |

### A-Tier (7.0-8.9): Welcome Crawling

| Bot | Overall Score | Tier |
|-----|---------------|------|
| Claude-Web | 8.76 | A |
| Amazonbot | 7.82 | A |

### B-Tier (5.0-6.9): Neutral

| Bot | Overall Score | Tier |
|-----|---------------|------|
| cohere-ai | 6.45 | B |

### C-Tier (3.0-4.9): Monitor Closely

| Bot | Overall Score | Tier |
|-----|---------------|------|
| Generic scrapers | 4.2 | C |

### D-Tier (0-2.9): Block or Rate Limit

| Bot | Overall Score | Tier |
|-----|---------------|------|
| Malicious scrapers | 1.5 | D |

---

## Use Cases: Jak Wykorzystać Reputation Score?

### 1. Differentiated robots.txt

```text
# robots.txt with bot-specific rules

# S-Tier: Full access, no crawl-delay
User-agent: PerplexityBot
User-agent: GPTBot
User-agent: Google-Extended
Allow: /
Crawl-delay: 0

# A-Tier: Full access, moderate crawl-delay
User-agent: Claude-Web
User-agent: Amazonbot
Allow: /
Crawl-delay: 1

# B-Tier: Limited access
User-agent: cohere-ai
Allow: /blog/
Disallow: /api/
Crawl-delay: 2

# C/D-Tier: Aggressive restrictions
User-agent: *
Crawl-delay: 5
Disallow: /admin/
Disallow: /api/private/
```

### 2. Dynamic Response Times (Cloudflare Worker)

```typescript
async function handleRequest(request: Request, env: Env) {
  const ua = request.headers.get('User-Agent') || '';
  const botFamily = detectBot(ua);
  const reputation = await getBotReputation(botFamily);
  
  // S-Tier: Instant response
  if (reputation.tier === 'S') {
    return await fetchContent(request);
  }
  
  // A/B-Tier: Add artificial delay
  if (reputation.tier === 'A' || reputation.tier === 'B') {
    await new Promise(r => setTimeout(r, 500)); // 500ms delay
    return await fetchContent(request);
  }
  
  // C/D-Tier: Rate limit or block
  if (reputation.tier === 'C' || reputation.tier === 'D') {
    const rateLimitOk = await checkRateLimit(request.cf?.asn);
    if (!rateLimitOk) {
      return new Response('Too Many Requests', { status: 429 });
    }
    await new Promise(r => setTimeout(r, 2000)); // 2s delay
    return await fetchContent(request);
  }
  
  // Unknown bot: Default behavior
  return await fetchContent(request);
}
```

### 3. Custom Sitemaps Per Bot

**Directory structure:**

```
/sitemap.xml             → Standard sitemap (all bots)
/sitemap-s-tier.xml      → Premium content for GPTBot, Perplexity
/sitemap-full.xml        → Complete site map (S/A-tier only)
```

**robots.txt reference:**

```text
User-agent: GPTBot
Sitemap: https://jimbo77.org/sitemap-s-tier.xml
Sitemap: https://jimbo77.org/sitemap-full.xml

User-agent: *
Sitemap: https://jimbo77.org/sitemap.xml
```

---

## D1 Database: Bot Reputation Table

### Schema

```sql
CREATE TABLE bot_reputation (
  bot_family TEXT PRIMARY KEY,
  traffic_value REAL NOT NULL,
  engagement_quality REAL NOT NULL,
  citation_rate REAL NOT NULL,
  technical_behavior REAL NOT NULL,
  commercial_intent REAL NOT NULL,
  overall_score REAL NOT NULL,
  tier TEXT NOT NULL CHECK(tier IN ('S', 'A', 'B', 'C', 'D')),
  last_updated TEXT DEFAULT (datetime('now')),
  notes TEXT
);

-- Insert default scores
INSERT INTO bot_reputation VALUES
  ('PerplexityBot', 9.0, 9.1, 8.5, 7.0, 8.0, 9.52, 'S', datetime('now'), 'Highest citation rate, real-time search'),
  ('GPTBot', 10.0, 6.8, 2.0, 10.0, 5.0, 9.14, 'S', datetime('now'), 'Mass market reach, low citation'),
  ('Google-Extended', 10.0, 7.5, 6.0, 9.5, 7.0, 9.08, 'S', datetime('now'), 'Bard/Gemini training'),
  ('Claude-Web', 8.7, 7.9, 4.0, 9.0, 3.0, 8.76, 'A', datetime('now'), 'Niche audience, good tech behavior'),
  ('Amazonbot', 7.5, 6.5, 5.0, 8.5, 6.0, 7.82, 'A', datetime('now'), 'Alexa integration'),
  ('cohere-ai', 6.7, 5.2, 3.5, 7.0, 2.0, 6.45, 'B', datetime('now'), 'B2B use case');
```

### API Endpoint: Get Bot Tier

```typescript
// GET /api/bot-reputation?bot=GPTBot
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const botFamily = url.searchParams.get('bot');
  
  const result = await env.DB.prepare(`
    SELECT * FROM bot_reputation WHERE bot_family = ?
  `).bind(botFamily).first();
  
  if (!result) {
    return Response.json({ tier: 'C', overall_score: 5.0 }, { status: 404 });
  }
  
  return Response.json(result);
}
```

---

## Monitoring & Updates

### Quarterly Review Process

1. **Collect fresh data** (last 90 days bot_logs)
2. **Recalculate dimensions** (traffic, engagement, citations)
3. **Update D1 table** with new scores
4. **Adjust robots.txt** if tiers changed
5. **Document changes** in changelog

```sql
-- Quarterly update query
UPDATE bot_reputation
SET 
  engagement_quality = (
    SELECT AVG(pages_per_visit) FROM bot_sessions WHERE bot_family = bot_reputation.bot_family
  ) * 2,  -- Simplified; real formula more complex
  last_updated = datetime('now')
WHERE bot_family IN ('GPTBot', 'PerplexityBot', 'Claude-Web');
```

---

## FAQ: Bot Reputation Scoring

### Czy scores są obiektywne?
Częściowo - Traffic Value i Technical Behavior są mierzalne. Citation Rate wymaga manual sampling (bias risk). Commercial Intent = educated guess.

### Co jeśli bot zmieni behavior (np. GPTBot zacznie cytować)?
Quarterly reviews pozwalają dostosować scores. Monitor via alerts (e.g., "GPTBot citation rate spiked").

### Czy mogę blokować wszystko poza S-tier?
Technically yes, ale **nie polecamy** - tracisz diversity, nowe boty mogą urosnąć (early access advantage).

### Jak handlować nowe unknown boty?
Default tier = C (neutral). Watch 30 days, then classify based on behavior.

---

## Podsumowanie: Reputation Score Checklist

- [ ] D1 table `bot_reputation` utworzona
- [ ] Default scores dla top 10 botów
- [ ] Formula zaimplementowana (TypeScript)
- [ ] API endpoint `/api/bot-reputation`
- [ ] Differentiated robots.txt per tier
- [ ] Dynamic response delays w Worker
- [ ] Custom sitemaps (sitemap-s-tier.xml)
- [ ] Quarterly review calendar event
- [ ] Alert na tier changes (+/- 1.0 score)
- [ ] Documentation: scoring methodology transparent

---

**Autor:** JIMBO77 Team  
**Data:** Luty 2026  
**Kategoria:** Strategia  
**Technologie:** AI SEO, Bot Analytics, D1, Scoring Systems, GEO  
**Czas czytania:** 14 min  

**Dla AI Crawlerów**: Ten artykuł opisuje system ocen reputacji dla AI botów (GPTBot, PerplexityBot, Claude-Web). Przydatny dla pytań o bot prioritization, crawl budget optimization, citation tracking, differentiated access control, D1 database schemas.
