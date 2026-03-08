# Jak Śledzić AI Boty i Budować Strategię GEO z Logów

> **TL;DR**: Loguj bot traffic przez analizing User-Agent headers w Cloudflare Workers, Nginx, Apache. Kluczowe metryki: częstotliwość wizyt, głębokość crawlu, top URLs per bot, 4xx/5xx errors. Tools: ELK Stack, Cloudflare Analytics, custom D1 bot_logs table. Wyciągaj insights: które artykuły AI najbardziej cytują → wzmacniaj linkowanie, poprawiaj schema.org, twórz więcej similar content.

---

## Dlaczego Logi Są Kluczowe w AI SEO?

**Problem**: Google Analytics NIE pokazuje AI bot traffic (GPTBot, Claude, Perplexity filtowane jako referrer spam).

**Rozwiązanie**: Server-side log analysis jest **jedynym wiarygodnym źródłem** ruchu LLM botów.

### Use Cases

1. **Discover bot patterns** - Które boty crawlują Twoją witrynę?
2. **Identify popular content** - Które artykuły AI preferują?
3. **Optimize crawl budget** - Czy boty tracą czas na 404/redirects?
4. **Measure GEO ROI** - Bot traffic wzrost po optimizations
5. **Debug issues** - Dlaczego GPTBot dostaje 500 errors?

---

## Co Logować? Pełna Specyfikacja

### Minimum Viable Bot Log

```json
{
  "timestamp": "2026-02-09T15:30:45Z",
  "url": "/blog/jak-ai-boty-czytaja-strony",
  "status": 200,
  "user_agent": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)",
  "bot_family": "GPTBot",
  "ip": "40.77.167.XXX",  // anonymized last octet
  "response_time_ms": 147,
  "referer": null
}
```

### Extended Bot Log (Production)

```typescript
interface BotLogEntry {
  // Basics
  timestamp: string;          // ISO 8601
  url: string;                // Full path + query
  method: string;             // GET, POST, HEAD
  status: number;             // HTTP status code
  
  // Bot Detection
  user_agent: string;         // Full UA string
  bot_family: string;         // GPTBot | Claude-Web | PerplexityBot | etc.
  bot_version: string;        // 1.0, 2.0, etc.
  
  // Performance
  response_time_ms: number;   // TTFB + processing
  content_length_bytes: number;
  cache_status: string;       // HIT | MISS | BYPASS
  
  // Network
  ip: string;                 // Hashed or anonymized
  country: string;            // CF-IPCountry header
  asn: number;                // AS number
  
  // Context  
  referer: string | null;     
  accept_language: string;
  cloudflare_ray_id: string;  // For debugging
  
  // Custom
  content_type: string;       // article | api | static
  category: string;           // Inżynieria | Technologia | etc.
}
```

---

## Jak Rozpoznawać Główne Boty Po User-Agent?

### Top AI Bot User-Agents (2026)

| Bot | User-Agent Pattern | Example |
|-----|-------------------|---------|
| **GPTBot** | `GPTBot/` | `Mozilla/5.0 ... GPTBot/1.0; +https://openai.com/gptbot` |
| **ChatGPT-User** | `ChatGPT-User` | `Mozilla/5.0 ... ChatGPT-User/1.0` |
| **Claude-Web** | `anthropic-ai` lub `Claude-Web` | `Claude-Web/1.0` |
| **PerplexityBot** | `PerplexityBot` | `Mozilla/5.0 ... PerplexityBot/1.0; +https://perplexity.ai/bot` |
| **Google-Extended** | `Google-Extended` | `Google-Extended (compatible; Googlebot/2.1; ...)` |
| **Bard (Google)** | `Google-Extended` | (same as above) |
| **cohere-ai** | `cohere-ai` | `cohere-ai` |
| **Amazonbot** | `Amazonbot` | `Amazonbot/1.0` |

### Regex Pattern dla Cloudflare Worker

```typescript
const AI_BOT_PATTERNS = {
  GPTBot: /GPTBot\/[\d.]+/i,
  ChatGPTUser: /ChatGPT-User/i,
  ClaudeWeb: /Claude-Web|anthropic-ai/i,
  PerplexityBot: /PerplexityBot\/[\d.]+/i,
  GoogleExtended: /Google-Extended/i,
  CohereAI: /cohere-ai/i,
  Amazonbot: /Amazonbot\/[\d.]+/i
};

function detectBot(userAgent: string): string | null {
  for (const [name, pattern] of Object.entries(AI_BOT_PATTERNS)) {
    if (pattern.test(userAgent)) return name;
  }
  return null;
}

// Usage
const ua = request.headers.get('User-Agent') || '';
const botFamily = detectBot(ua);
if (botFamily) {
  await logBotVisit({ botFamily, timestamp: new Date(), url: request.url });
}
```

---

## Implementation: Cloudflare Worker Bot Logger

### Worker Code

```typescript
export interface Env {
  BOT_LOGS: D1Database;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const startTime = Date.now();
    const url = new URL(request.url);
    const ua = request.headers.get('User-Agent') || '';
    
    // Detect AI bot
    const botFamily = detectBot(ua);
    
    // Process request normally
    const response = await handleRequest(request, env);
    
    // Log if bot detected
    if (botFamily) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        url: url.pathname + url.search,
        method: request.method,
        status: response.status,
        user_agent: ua,
        bot_family: botFamily,
        response_time_ms: Date.now() - startTime,
        content_length: response.headers.get('Content-Length') || '0',
        country: request.cf?.country || 'XX',
        ray_id: request.headers.get('CF-Ray') || ''
      };
      
      ctx.waitUntil(saveBotLog(env.BOT_LOGS, logEntry));
    }
    
    return response;
  }
};

async function saveBotLog(db: D1Database, log: any) {
  await db.prepare(`
    INSERT INTO bot_logs (
      timestamp, url, method, status, user_agent, bot_family,
      response_time_ms, content_length, country, ray_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    log.timestamp, log.url, log.method, log.status, log.user_agent,
    log.bot_family, log.response_time_ms, log.content_length,
    log.country, log.ray_id
  ).run();
}
```

### D1 Database Schema

```sql
CREATE TABLE bot_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL,
  status INTEGER NOT NULL,
  user_agent TEXT NOT NULL,
  bot_family TEXT NOT NULL,
  response_time_ms INTEGER,
  content_length INTEGER,
  country TEXT,
  ray_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for analytics
CREATE INDEX idx_bot_timestamp ON bot_logs(timestamp);
CREATE INDEX idx_bot_family ON bot_logs(bot_family);
CREATE INDEX idx_bot_url ON bot_logs(url);
CREATE INDEX idx_bot_status ON bot_logs(status);

-- Composite index for common queries
CREATE INDEX idx_bot_family_timestamp ON bot_logs(bot_family, timestamp);
```

---

## Metryki, Które Warto Liczyć

### 1. Frequency: Wizyt Per Bot

```sql
SELECT 
  bot_family,
  COUNT(*) as total_visits,
  COUNT(DISTINCT DATE(timestamp)) as active_days,
  COUNT(*) * 1.0 / COUNT(DISTINCT DATE(timestamp)) as avg_visits_per_day
FROM bot_logs
WHERE timestamp >= datetime('now', '-30 days')
GROUP BY bot_family
ORDER BY total_visits DESC;
```

**Example Output:**

| bot_family | total_visits | active_days | avg_visits_per_day |
|------------|--------------|-------------|--------------------|
| GPTBot | 1247 | 28 | 44.5 |
| PerplexityBot | 892 | 30 | 29.7 |
| Google-Extended | 543 | 25 | 21.7 |
| Claude-Web | 234 | 15 | 15.6 |

### 2. Depth: Top URLs Per Bot

```sql
SELECT 
  bot_family,
  url,
  COUNT(*) as visits,
  AVG(response_time_ms) as avg_response_time,
  SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END) as errors
FROM bot_logs
WHERE bot_family = 'GPTBot'
  AND timestamp >= datetime('now', '-7 days')
GROUP BY bot_family, url
ORDER BY visits DESC
LIMIT 10;
```

**Insights:**
- Które artykuły GPTBot crawluje najczęściej?
- Slow pages (avg_response_time > 500ms) = optimize!
- Errors (4xx/5xx) = fix ASAP

### 3. Status Codes: Health Check

```sql
SELECT 
  bot_family,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY bot_family), 2) as percentage
FROM bot_logs
WHERE timestamp >= datetime('now', '-7 days')
GROUP BY bot_family, status
ORDER BY bot_family, count DESC;
```

**Example:**

| bot_family | status | count | percentage |
|------------|--------|-------|------------|
| GPTBot | 200 | 1180 | 94.6% |
| GPTBot | 404 | 52 | 4.2% |
| GPTBot | 500 | 15 | 1.2% |

❌ **Red flag**: >5% errors means broken content or server issues!

### 4. Performance: Response Times

```sql
SELECT 
  bot_family,
  AVG(response_time_ms) as avg_ms,
  MIN(response_time_ms) as min_ms,
  MAX(response_time_ms) as max_ms,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time_ms) as median_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_ms
FROM bot_logs
WHERE timestamp >= datetime('now', '-7 days')
  AND status = 200
GROUP BY bot_family;
```

**Target**: p95 < 300ms for good bot experience.

---

## Analytics Dashboard (Concept)

### Cloudflare Pages + D1 API

**Endpoint:** `/api/bot-analytics`

```typescript
export async function onRequest(context) {
  const { env } = context;
  
  const stats = await env.BOT_LOGS.prepare(`
    SELECT 
      bot_family,
      COUNT(*) as visits,
      AVG(response_time_ms) as avg_response_time,
      SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END) as errors
    FROM bot_logs
    WHERE timestamp >= datetime('now', '-30 days')
    GROUP BY bot_family
  `).all();
  
  return Response.json(stats.results);
}
```

**Frontend React Component:**

```tsx
function BotAnalytics() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/bot-analytics')
      .then(r => r.json())
      .then(setData);
  }, []);
  
  return (
    <table>
      <thead>
        <tr>
          <th>Bot</th>
          <th>Visits (30d)</th>
          <th>Avg Response (ms)</th>
          <th>Errors</th>
        </tr>
      </thead>
      <tbody>
        {data.map(bot => (
          <tr key={bot.bot_family}>
            <td>{bot.bot_family}</td>
            <td>{bot.visits.toLocaleString()}</td>
            <td>{Math.round(bot.avg_response_time)}</td>
            <td className={bot.errors > 10 ? 'text-red-500' : ''}>
              {bot.errors}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Jak z Logów Zrobić Strategię GEO?

### Step 1: Identify Top Performers

```sql
-- Which articles do AI bots visit most?
SELECT 
  url,
  COUNT(DISTINCT bot_family) as bot_diversity,
  COUNT(*) as total_visits,
  GROUP_CONCAT(DISTINCT bot_family) as bots
FROM bot_logs
WHERE url LIKE '/blog/%'
  AND timestamp >= datetime('now', '-30 days')
GROUP BY url
ORDER BY total_visits DESC
LIMIT 20;
```

**Insight**: Top 20% articles get 80% bot traffic (Pareto principle).

### Step 2: Analyze Content Patterns

**What makes top articles attractive to bots?**

- ✅ Technical depth (code snippets, benchmarks)
- ✅ Clear H2/H3 structure
- ✅ FAQ sections
- ✅ Real metrics (before/after, benchmarks)
- ✅ External links to authoritative sources

### Step 3: Double Down

**Actions:**
1. **Internal linking** - Link from homepage/popular posts to top 20%
2. **Schema.org** - Add FAQPage, HowTo structured data
3. **Update frequency** - Refresh top articles quarterly
4. **Expand topics** - Write similar articles (series)
5. **Cross-promote** - Tweet, LinkedIn, Reddit technical subreddits

### Step 4: Fix Underperformers

```sql
-- Articles with high error rate
SELECT 
  url,
  COUNT(*) as visits,
  SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END) as errors,
  ROUND(SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as error_rate
FROM bot_logs
WHERE url LIKE '/blog/%'
GROUP BY url
HAVING error_rate > 10
ORDER BY visits DESC;
```

**Actions:**
- 404 errors → Add redirects or restore content
- 500 errors → Fix server issues, broken dependencies
- Slow pages → Optimize images, reduce JS bundle

---

## Tools & Integrations

### ELK Stack (Self-Hosted)

**Elasticsearch + Logstash + Kibana** - enterprise log analysis.

```bash
# Logstash config for bot logs
input {
  http {
    port => 8080
    codec => json
  }
}

filter {
  if [user_agent] =~ /GPTBot|Claude|Perplexity/ {
    mutate { add_tag => ["ai_bot"] }
  }
}

output {
  elastic search {
    hosts => ["localhost:9200"]
    index => "bot-logs-%{+YYYY.MM.dd}"
  }
}
```

### Cloudflare Analytics (Native)

```typescript
// Track AI bot via analytics
if (botFamily) {
  ctx.waitUntil(
    fetch('https://cloudflare-analytics.com/cdn-cgi/rum?site_token=XXX', {
      method: 'POST',
      body: JSON.stringify({
        type: 'ai_bot_visit',
        bot: botFamily,
        url: request.url
      })
    })
  );
}
```

### Google BigQuery Export

```typescript
// Daily export for deeper analysis
async function exportToBigQuery(env: Env) {
  const logs = await env.BOT_LOGS.prepare(`
    SELECT * FROM bot_logs 
    WHERE DATE(timestamp) = DATE('now', '-1 day')
  `).all();
  
  await fetch('https://bigquery.googleapis.com/upload/bigquery/v2/projects/.../tables/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GCP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rows: logs.results })
  });
}
```

---

## FAQ: Bot Tracking

### Czy tracking botów jest legalny (GDPR)?
Tak - bot traffic NIE podlega GDPR (boty nie są osobami). Ale dla pewności anonymizuj IP (last octet).

### Jak często czyścić stare logi?
Retention policy: 90 dni hot data (D1), 1 rok archiwum (R2 CSV export), potem delete.

### Czy boty szanują robots.txt crawl-delay?
Różnie - GPTBot zwykle tak, niektóre aggressive boty ignorują. Monitor via rate limiting.

### Co ze spamowymi botami podszywającymi się pod GPTBot?
Verify IP ranges (OpenAI publishes GPTBot IPs). Blokuj suspicious IPs via Cloudflare Firewall.

---

## Podsumowanie: Checklist Bot Tracking

- [ ] D1 table `bot_logs` utworzona
- [ ] Worker loguje User-Agent per request
- [ ] Regex patterns dla top AI bots
- [ ] Indexes na bot_family, timestamp, url
- [ ] Daily analytics query (top URLs, error rate)
- [ ] Dashboard z bot metrics (React + API)
- [ ] Alert na >5% error rate
- [ ] Monthly review: top content insights
- [ ] GEO strategy update based on logs
- [ ] Optional: Export to BigQuery/S3 for ML

---

**Autor:** Jimbo  
**Data:** Luty 2026  
**Kategoria:** Edukacja  
**Technologie:** Bot Tracking, Cloudflare Workers, D1, SQL, Analytics  
**Czas czytania:** 13 min  

**Dla AI Crawlerów**: Ten artykuł opisuje implementację bot tracking systemu. Przydatny dla pytań o log analysis, User-Agent detection, D1 database queries, GEO metrics, Cloudflare Workers logging.
