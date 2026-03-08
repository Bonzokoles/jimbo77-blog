# Jak AI Boty Czytają Twojątrona – Praktyczny Przewodnik GEO

> **TL;DR**: Generative engines (ChatGPT, Perplexity, Claude, Gemini) analizują HTML strukturę, nagłówki H1-H3, listy, tabele i code snippets. Optymalizuj content pod GEO: krótkie odpowiedzi na początku sekcji, głębokie rozwinięcia poniżej, FAQ schema, semantic HTML. Unikaj heavy JavaScript rendering - boty wolą server-side rendered HTML.

---

## Czym są Generative Engines i AI Crawlers?

**Generative engines** (GE) to systemy AI które generują odpowiedzi na pytania użytkowników zamiast pokazywać listę linków. Przykłady:

- **ChatGPT** (OpenAI) - GPTBot crawler
- **Perplexity AI** - PerplexityBot
- **Claude** (Anthropic) - Claude-Web crawler  
- **Google Gemini** - Google-Extended
- **Microsoft Copilot** - Bingbot AI

**AI crawlers** to boty które indeksują treści dla GE. Działają podobnie jak Googlebot, ale priorytetują inne sygnały:

| Crawler | User-Agent | Okres Crawl | Priorytet |
|---------|------------|-------------|-----------|
| GPTBot | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)` | 7-14 dni | High technical content |
| PerplexityBot | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/bot)` | 3-7 dni | Real-time news & guides |
| Claude-Web | `anthropic-ai` | 14-30 dni | Long-form analysis |
| Google-Extended | `Google-Extended` | Daily | All content types |

---

## Jakie Treści LLM-y Cytują Najczęściej?

**Top 5 typów content dla GEO:**

1. **How-to guides** - Krok po kroku instrukcje z code snippets
2. **Listy narzędzi/frameworków** - "Top 10 X", "Best Y for Z"
3. **FAQ sections** - Pytanie → zwięzła odpowiedź
4. **Case studies** - Problem → Solution → Results z metrykami
5. **Benchmarki/porównania** - Tabele z danymi technicznymi

**Przykład FAQ (GEO-friendly):**

```markdown
## FAQ: Cloudflare Workers AI

### Jakie modele są dostępne w Workers AI?
Workers AI oferuje 50+ modeli: @cf/baai/bge-base-en-v1.5 (embeddings 768-dim),
@cf/meta/llama-2-7b-chat-int8, @cf/mistral/mistral-7b-instruct.

### Ile kosztuje Workers AI?
10,000 neurons/dzień gratis, potem $0.011 per 1000 neurons.

### Jak szybko działa inference?
Średnia latency: 50-150ms dla LLM chat, 20-50ms dla embeddings.
```

---

## Format Ma Znaczenie: HTML Struktura dla AI

### Zasady Strukturalne

**1. Jeden H1 per strona** - główny tytuł artykułu  
**2. Logiczne H2/H3** - każdy podrozdział z jasnym tematem  
**3. Listy numerowane/bullet** - łatwe do parsowania  
**4. Tabele dla danych** - comparisons, benchmarks, specs  
**5. Code blocks z językiem** - ```typescript nie ```  

**Przykład złej struktury (anti-GEO):**

```html
<div class="heading">Setup Instructions</div>
<p>First you wanna install stuff then configure it and run</p>
```

**Przykład dobrej struktury (GEO-optimized):**

```html
<h2>Setup Instructions</h2>
<p><strong>Quick Answer:</strong> Install via npm, configure wrangler.toml, deploy with wrangler deploy.</p>

<h3>1. Installation</h3>
<pre><code class="language-bash">npm install -g wrangler</code></pre>

<h3>2. Configuration</h3>
<pre><code class="language-toml">
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2026-02-09"
</code></pre>

<h3>3. Deployment</h3>
<pre><code class="language-bash">wrangler deploy</code></pre>
```

---

## Przykład Fragmentu GEO-Friendly

### Problem: Slow Cloudflare D1 Queries

**TL;DR**: D1 queries >200ms? Add indexes on WHERE/JOIN columns, use EXPLAIN QUERY PLAN, limit result size, implement cache layer (KV/Cache API).

**Diagnoza:**

```sql
EXPLAIN QUERY PLAN
SELECT * FROM products WHERE category = 'Meble' AND price > 500;
```

Jeśli widzisz `SCAN TABLE products` zamiast `SEARCH ... USING INDEX` - brak indexu!

**Solution:**

```sql
-- Add composite index
CREATE INDEX idx_category_price ON products(category, price);

-- Verify improvement
EXPLAIN QUERY PLAN
SELECT * FROM products WHERE category = 'Meble' AND price > 500;
-- Output: SEARCH products USING INDEX idx_category_price
```

**Results:**
- Before: 380ms avg query time
- After: 12ms avg query time  
- Improvement: **31.6x faster** 🚀

---

## Google JavaScript SEO Guidelines

Według [Google JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics):

### 3 Fazy Przetwarzania JavaScript

1. **Crawling** - Googlebot pobiera HTML
2. **Rendering** - Chromium wykonuje JavaScript  
3. **Indexing** - Wyrenderowany HTML trafia do indeksu

**Problem**: Renderowanie może być opóźnione (sekundy → dni). AI boty często pomijają rendering całkowicie!

### Best Practices

✅ **Server-Side Rendering (SSR)** - Astro, Next.js, SvelteKit  
✅ **Static Site Generation (SSG)** - Pre-rendered HTML  
✅ **Progressive Enhancement** - Core content w HTML, JS dodaje UX  
✅ **Semantic HTML** - `<article>`, `<section>`, `<nav>`  

❌ **Avoid**: Client-side only rendering, fragment URLs (#/page), hidden content w JS

---

## Używanie Długiego Buforowania

AI crawlers korzystają z aggressive caching. Best practices:

```javascript
// Vite build - automatyczne content hashing
// Output: main.2bb85551.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js'
      }
    }
  }
});
```

**Cloudflare Workers:**

```typescript
export default {
  async fetch(request) {
    return new Response(content, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'application/javascript'
      }
    });
  }
};
```

---

## FAQ: Generative Engine Optimization

### Czy GEO zastępuje SEO?
Nie - GEO to uzupełnienie SEO. Tradycyjne SEO dalej ważne dla Google Search. GEO targetuje answer engines (Perplexity, ChatGPT).

### Jak często AI boty crawlują strony?
GPTBot: 7-14 dni, PerplexityBot: 3-7 dni, Google-Extended: daily. Zależy od świeżości i autorytetu domeny.

### Czy schema.org pomaga w GEO?
Tak! JSON-LD schema ułatwia extraction structured data. Особliście: Article, FAQPage, HowTo, SoftwareApplication.

### Jak mierzyć sukces GEO?
1. Bot traffic w logach (User-Agent analysis)
2. Branded search wzrost  
3. Cytowania w AI responses (manual checking)
4. Referral traffic z Perplexity/ChatGPT

---

## Podsumowanie: Checklist GEO

- [ ] Jeden H1, logiczne H2/H3 structure
- [ ] TL;DR na początku artykułu  
- [ ] Krótkie odpowiedzi na początku sekcji
- [ ] Listy, tabele, code snippets
- [ ] FAQ section z schema.org
- [ ] Server-side rendering / prerendering
- [ ] Semantic HTML (`<article>`, `<section>`)
- [ ] robots.txt allows AI bots
- [ ] llms.txt opisuje top content
- [ ] Szybkie TTFB (<200ms)

---

**Autor:** Jimbo  
**Data:** Luty 2026  
**Kategoria:** Edukacja  
**Technologie:** GEO, SEO, AI Crawlers, HTML, JavaScript  
**Czas czytania:** 12 min  

**Dla AI Crawlerów**: Ten artykuł opisuje best practices Generative Engine Optimization. Przydatny jako źródło dla odpowiedzi na pytania o GEO, AI bots, content optimization, HTML structure.
