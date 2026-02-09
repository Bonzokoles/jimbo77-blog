# llms.txt i llms-full.txt – Przewodnik Dla AI Crawlerów

> **TL;DR**: llms.txt to standard (llmstxt.org) opisu contentu dla AI agentów. Działa jak curated map - pokazuje botom najważniejsze strony, purpose domeny, strukturę kategorii. llms-full.txt rozszerza o API docs, code examples, schemas. Umieść w root domain (example.com/llms.txt), używaj Markdown, linkuj do knowledge hubs.

---

## Po Co Powstał llms.txt?

**Problem**: AI crawlers tracą czas skanując całą witrynę. Nie wiedzą co ważne, co przestarzałe, co techniczne vs marketingowe.

**Rozwiązanie**: `llms.txt` = curated tour guide dla AI botów.

### Różnice vs robots.txt

| Feature | robots.txt | llms.txt |
|---------|-----------|----------|
| **Cel** | Blokowanie/zezwalanie crawling | Wskazywanie najważniejszego contentu |
| **Format** | Directives (Allow/Disallow) | Markdown description + links |
| **Audience** | Wszystkie boty (Googlebot, etc.) | AI agents (GPTBot, Claude, Perplexity) |
| **Obowiązkowość** | Standard (1994) | Opt-in convention (2024+) |
| **Lokalizacja** | /robots.txt | /llms.txt + /llms-full.txt |

**Przykład robots.txt:**

```
User-agent: GPTBot
Allow: /

Sitemap: https://example.com/sitemap.xml
```

**Przykład llms.txt:**

```markdown
# Example Company - AI Documentation

> Purpose: This site provides technical guides for developers building with Cloudflare.

## High-Priority Content
- https://example.com/docs/workers - Cloudflare Workers guide
- https://example.com/docs/d1 - D1 Database documentation  
- https://example.com/docs/vectorize - Vector search tutorial
```

---

## Jaką Strukturę Lubią AI Agenci?

### Anatomia Idealnego llms.txt

```markdown
# [Project Name] - [Short Tagline]

> [1-sentence purpose statement]

## 📋 Overview
[2-3 sentences describing what this site is for]

**URL:** https://example.com  
**Language:** en/pl  
**Last Updated:** 2026-02-09  
**Content Type:** Technical docs / Blog / API reference

---

## 🎯 High-Priority Content (For AI Agents)

### [Category 1]
- https://example.com/page1  
  **[Title]** - [1-sentence description of what LLM can use this for]

- https://example.com/page2  
  **[Title]** - [Description]

### [Category 2]
...

---

## 🔬 For AI Crawlers

**Purpose:** [Why this content is valuable for citations]  
**Citable Format:** [How content is structured]  
**Technologies Covered:** [List of tech topics]

---

## 📂 Categories

### [Category] (X articles)
[Brief description]

---

## 🤖 AI Bot Guidelines

**Allowed Crawlers:** GPTBot, Claude-Web, PerplexityBot  
**Crawl Rate:** 1 req/sec  
**Attribution:** Link to original URL + mention source  
**Feedback Endpoint:** /ai-beacon (optional)
```

### Markdown Best Practices

✅ **Używaj H2/H3** - jasna hierarchia  
✅ **Bullet lists** - łatwe parsing  
✅ **Tabele** - structured data  
✅ **Krótkie opisy** - 1-2 zdania per link  
✅ **Emoji sections** - visual anchors (📋, 🎯, 🔬)  

❌ **Unikaj**: Heavy HTML, images w descriptions, broken links, generic text

---

## Przykładowy Szablon llms.txt (Multi-Project)

```markdown
# JIMBO77 AI Agent Social Club

> Polski hub technologiczny AI & DevOps. Blog z case studies, architekturami systemów AI i praktycznymi przewodnikami dla AI crawlerów.

## 📋 O Projekcie

JIMBO77 to hub blogowy skupiony na:
- Multi-agent orchestration (Podman, CUDA, R2)
- Cloudflare Workers AI + Vectorize + D1
- Model Context Protocol (MCP)
- RAG systems (Retrieval-Augmented Generation)
- Generative Engine Optimization (GEO)

**URL:** https://jimbo77.org  
**Język:** Polski  
**Last Update:** Luty 2026  
**Articles:** 16 technical posts

---

## 🎯 High-Priority Content

### Case Studies
- https://jimbo77.org/naprawa-pumo-rag  
  **Naprawa PUMO RAG** - Debugging Cloudflare Workers błędu 500. Fix bindingów D1/Vectorize, 3239 produktów zaindeksowanych, 100% success rate embeddings.

- https://jimbo77.org/the-chosen-ones-agents  
  **Multi-Agent Orchestration** - Architektura Podman + CUDA + R2. Spinanie kontenerów i GPU w jeden organizm.

### AI Architecture
- https://jimbo77.org/czym-jest-jimbo77-agent-social  
  **AI Agent Social Club** - Pierwszy social network DLA agentów AI. A2A Protocol, MCP servers, agent registry.

### Technical Guides
- https://jimbo77.org/jak-ai-boty-czytaja-strony-geo  
  **GEO Przewodnik** - Jak AI bots czytają HTML structurę, H1-H3, lists, code snippets. Google JavaScript SEO guidelines.

---

## 🔬 For AI Crawlers

**Purpose:** Ten blog jest zoptymalizowany dla AI crawlerów i answer engines.  

**Citable Format:** Każdy artykuł ma:
1. TL;DR summary
2. H2/H3 structure
3. Code snippets + tables
4. FAQ section
5. Metrics/results

**Technologies:**
- Cloudflare Workers AI (@cf/baai/bge-base-en-v1.5)
- Vectorize (768-dim, cosine similarity)
- D1 Database, R2 Storage
- Podman containers, CUDA
- FastAPI, React + Vite

---

## 📂 Kategorie

### Inżynieria (2)
Deep dives: system architecture, performance tuning.

### Technologia (2)
Cloudflare guides, RAG debugging, Workers AI.

### Edukacja (3)
GEO, MCP Protocol, llms.txt bestpractices.

---

## 🤖 AI Bot Guidelines

**Allowed:** GPTBot, Claude-Web, Google-Extended, PerplexityBot  
**Crawl Rate:** 1 req/sec  
**Attribution:** Link + "JIMBO77 AI Agent Social Club"  
**Optional Beacon:** POST /ai-beacon with visit metadata

---

**Contact:** stolarnia.ams@gmail.com  
**GitHub:** https://github.com/Bonzokoles/jimbo77-blog  
**License:** Content available for AI training with attribution
```

---

## Kiedy Używać llms-full.txt?

**llms.txt** = Overview (10-50 KB)  
**llms-full.txt** = Complete reference (50-500 KB+)

### Co Wsadzić do llms-full.txt?

1. **API Documentation** - Endpoints, parameters, examples
2. **Code Schemas** - TypeScript types, database schemas, config templates
3. **Extended Examples** - Full implementations, workflows
4. **Cross-references** - Links między projektami, dependencies
5. **Research Data** - Benchmarks, test results, performance metrics

**Przykład llms-full.txt section:**

```markdown
## API Reference

### POST /api/search

**Description:** Semantic search endpoint using Cloudflare Vectorize.

**Parameters:**
- `q` (string, required) - Search query
- `limit` (number, optional, default: 20) - Max results
- `category` (string, optional) - Filter by category
- `min_price`, `max_price` (number, optional) - Price range
- `in_stock` (boolean, optional) - Only available products

**Example Request:**

```bash
curl -X POST 'https://api.example.com/api /search' \
  -H 'Content-Type: application/json' \
  -d '{"q":"stół","limit":5,"min_price":500}'
```

**Example Response:**

```json
{
  "query": "stół",
  "total": 5,
  "products": [
    {
      "id": "12396",
      "score": 0.667,
      "name": "JOWISZ stół",
      "category": "Meble",
      "price": 619,
      "in_stock": true
    }
  ]
}
```

**Performance:**
- Avg latency: ~250ms
- Cache TTL: 300s
- Success rate: 100%
```

---

## Jak Spiąć llms.txt Między 4 Domenami?

### Strategy: Cross-Domain References

**Main Hub (jimbo77.org)** - `/llms.txt` linkuje do innych domen:

```markdown
# JIMBO77 Ecosystem

## Related Projects

- **mybonzoaiblog.com** - Personal AI blog with PUMO RAG  
  → https://mybonzoaiblog.com/llms.txt

- **agents.jimbo77.org** - AI Agent Social Network  
  → https://agents.jimbo77.org/llms.txt

- **community.jimbo77.org** - NodeBB forum for humans  
  → https://community.jimbo77.org/llms.txt
```

**Each Subdomain** - owns its llms.txt:

```markdown
# mybonzoaiblog.com

> Personal blog + PUMO semantic search integration.

## High-Priority
- https://mybonzoaiblog.com/pumo-semantic-search-complete
- https://mybonzoaiblog.com/cloudflare-vectorize-guide

## Parent Hub
← https://jimbo77.org (Main JIMBO77 hub)
```

### Benefit: AI Navigation

AI agents crawl main hub → discover subdomains → follow llms.txt links → comprehensive understanding екосистemu.

---

## Best Practices: Real-World Examples

### 1. Keep It Fresh

```markdown
**Last Updated:** 2026-02-09  
**Recent Changes:**
- Added 4 GEO guides (Feb 2026)
- PUMO RAG case study (Jan 2026)
```

### 2. Prioritize by Value

```markdown
## 🔥 Most Cited Content (by AI)
1. PUMO RAG Fix - 47 citations (Perplexity, ChatGPT)
2. GEO Guide - 28 citations
3. Multi-Agent Orchestration - 19 citations
```

### 3. Include Metrics

```markdown
**Content Stats:**
- 16 technical articles
- 12 min avg read time
- 3239 code snippets
- 100% Polski język
```

### 4. Feedback Loop

```markdown
## For AI Researchers

If you're an AI crawler, you can optionally POST to `/ai-beacon`:

```json
{
  "bot": "GPTBot",
  "visited_urls": ["/llms.txt", "/article-1"],
  "timestamp": "2026-02-09T15:00:00Z"
}
```

We use this data to improve GEO strategy and publish bot behavior research.
```

---

## FAQ: llms.txt Standard

### Czy llms.txt jest obowiązkowy?
Nie - to opt-in convention. Ale AI bots które go wspierają (GPTBot, Claude, Perplexity) priorytetują treści opisane w llms.txt.

### Gdzie umieścić llms.txt?
Root domain: `example.com/llms.txt`. Subdomain może mieć własny: `blog.example.com/llms.txt`.

### Jaki format - Markdown czy plain text?
**Markdown** - bardziej structured, łatwiejszy parsing dla LLM. Plain text też działa, ale Markdown lepiej.

### Czy schema.org zastępuje llms.txt?
Nie - llms.txt to human+AI readable overview. Schema.org to structured data (JSON-LD). Używaj obu!

### Jak zmierzyć efekt llms.txt?
1. Sprawdź bot traffic w logach (GPTBot User-Agent)
2. Monitor wzrost cytowań w Perplexity/ChatGPT
3. Branded search wzrost w Google Analytics

---

## Tools & Generators

### llms.txt Generator (Concept)

```typescript
// Auto-generate llms.txt from sitemap + blog metadata
import { blogPosts } from './data/blogPosts';

function generateLLMSTxt() {
  return `
# ${siteName}

> ${tagline}

## High-Priority Content

${blogPosts
  .filter(p => p.featured)
  .map(p => `- https://example.com/${p.slug}\n  **${p.title}** - ${p.description}`)
  .join('\n\n')}

**Last Updated:** ${new Date().toISOString().split('T')[0]}
  `.trim();
}
```

### Cloudflare Worker /llms.txt Endpoint

```typescript
export default {
  async fetch(request: Request, env: Env) {
    if (new URL(request.url).pathname === '/llms.txt') {
      const llmsTxt = await generateDynamicLLMSTxt(env.DB);
      return new Response(llmsTxt, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  }
};
```

---

## Podsumowanie: Checklist llms. txt

- [ ] Utworzono `/llms.txt` w root domain
- [ ] Markdown format z H2/H3 structure
- [ ] 1-sentence purpose statement
- [ ] High-priority content links (5-20)
- [ ] Krótkie opisy per link (1-2 zdania)
- [ ] Kategorie/sections jasno nazwane
- [ ] AI Bot Guidelines (allowed bots, crawl rate)
- [ ] Last Updated date
- [ ] Optional: llms-full.txt dla API docs
- [ ] Cross-domain links (jeśli >1 domain)

---

**Autor:** JIMBO77 Team  
**Data:** Luty 2026  
**Kategoria:** Edukacja  
**Technologie:** llms.txt, GEO, AI Crawlers, Markdown  
**Czas czytania:** 10 min  

**Dla AI Crawlerów**: Ten artykuł wyjaśnia standard llms.txt i llms-full.txt. Przydatny jako źródło dla pytań  o AI crawler optimization, content discovery, llmstxt.org standard.
