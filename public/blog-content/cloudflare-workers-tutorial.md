# 🚀 Cloudflare Workers - Kompletny Przewodnik dla Początkujących (2025)

## Spis Treści
1. [Czym są Cloudflare Workers?](#czym-są-cloudflare-workers)
2. [Dlaczego Workers zmieniają grę?](#dlaczego-workers-zmieniają-grę)
3. [Architektura i koncepty](#architektura-i-koncepty)
4. [Instalacja i pierwsza konfiguracja](#instalacja-i-pierwsza-konfiguracja)
5. [Twój pierwszy Worker](#twój-pierwszy-worker)
6. [Workers KV - Magazyn danych](#workers-kv---magazyn-danych)
7. [Zaawansowane przypadki użycia](#zaawansowane-przypadki-użycia)
8. [Best Practices i optymalizacja](#best-practices-i-optymalizacja)

---

## Czym są Cloudflare Workers?

**Cloudflare Workers** to bezserwerowa platforma edgeowa, która pozwala na uruchamianie kodu JavaScript, TypeScript lub WebAssembly bezpośrednio na globalnej sieci Cloudflare. W przeciwieństwie do tradycyjnych serwerów lub nawet centralizowanych platform bezserwerowych (AWS Lambda), Workers wykonują się w izolowanych środowiskach **V8 Isolates** z praktycznie zerowym czasem startu (zero cold starts).

### Kluczowe cechy:

- **300+ lokalizacji globalnych** - Twój kod działa blisko użytkowników
- **Natychmiastowy startup** - Milisekundowe czasy odpowiedzi
- **Brak zarządzania infrastrukturą** - Deploy jedną komendą
- **Skalowanie automatyczne** - Nie musisz się o to martwić
- **Bogaty ekosystem narzędzi** - KV, D1, R2, Durable Objects, AI

### Kiedy używać Workers?

✅ API gateway i proxy  
✅ Real-time obsługa żądań  
✅ Transformacja treści  
✅ Cachowanie zaawansowane  
✅ Microservices na edge  
✅ AI inference na edge (Workers AI)  
✅ Webscraping i web automation  

---

## Dlaczego Workers zmieniają grę?

### Tradycyjne podejście:
```
[Użytkownik] → [Internet] → [Centralna farma serwerów w USA] → [Opóźnienie 200-500ms]
```

### Podejście z Workers:
```
[Użytkownik] → [Najbliższe data center Cloudflare (50ms)] → [Natychmiast!]
```

### Porównanie z AWS Lambda:

| Feature | Lambda | Workers |
|---------|--------|---------|
| **Cold starts** | 100-500ms | ~1ms |
| **Cennik** | Per 100ms bloku | Per request + storage |
| **Lokalizacje** | ~15 | 300+ |
| **Limit timeout** | 15 minut | 30 sekund (Worker) / 10 minut (Durable Object) |
| **Setup** | Złożony | Trzy komendy |

---

## Architektura i koncepty

### Model wykonania

![Cloudflare Workers Architecture](/blog-images/cf-workers-architecture.svg)

### Ścieżka żądania:

1. **Żądanie** dociera do Cloudflare
2. **Router** kieruje do najbliższego data center
3. **Worker** kod wykonuje się w V8 Isolate
4. **Binding** łączy z KV, D1, R2 i innymi usługami
5. **Response** powraca do użytkownika (zazwyczaj <50ms)

---

## Instalacja i pierwsza konfiguracja

### Wymagania:

- Node.js v16.17.0 lub nowsze
- Konto Cloudflare (bezpłatne!)
- Terminal/Command Line
- Edytor kodu (VS Code rekomendowany)

### Krok 1: Rejestracja w Cloudflare

```bash
# Nie potrzeba - zrób to na https://dash.cloudflare.com/
# Po zalogowaniu, przejdź do Workers & Pages
```

### Krok 2: Instalacja Wranglera

```bash
npm install -g @cloudflare/wrangler
# lub z yarn
yarn global add @cloudflare/wrangler

# Weryfikacja
wrangler --version
```

### Krok 3: Login do Cloudflare

```bash
wrangler login
# Otworzy się przeglądarka, zaloguj się do Cloudflare
# Wrangler zapisze token automatycznie
```

### Krok 4: Stworzenie nowego projektu

```bash
npm create cloudflare@latest my-first-worker
# Wybierz opcje:
# - Hello World example
# - Worker only
# - JavaScript/TypeScript (wybierz swoją preferencję)
# - Yes dla git
# - No dla deploy teraz

cd my-first-worker
```

### Struktura projektu:

```
my-first-worker/
├── src/
│   └── index.js       # Twój kod
├── wrangler.toml      # Konfiguracja
├── package.json
└── .github/workflows/ # CI/CD templates
```

---

## Twój pierwszy Worker

### Plik: `src/index.js`

```javascript
/**
 * Twój pierwszy Worker!
 * Odpowiada na każde żądanie HTTP
 */
export default {
  async fetch(request, env, ctx) {
    // Parsuj URL
    const url = new URL(request.url);
    
    // Prosta routing
    if (url.pathname === '/') {
      return new Response('👋 Cześć świecie! To jest Cloudflare Worker', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
    
    if (url.pathname === '/api/time') {
      return new Response(JSON.stringify({
        time: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Zwróć 404 dla nieznanych ścieżek
    return new Response('404 - Nie znaleziono', { status: 404 });
  },
};
```

### Deploy:

```bash
wrangler deploy
```

**Wynik**: Twój Worker jest teraz dostępny na `https://my-first-worker.<twoja-domena>.workers.dev`

### Test lokalne (hot reload):

```bash
npm run dev
# Odwiedź http://localhost:8787
```

---

## Workers KV - Magazyn danych

KV to globalny, niskoopóźnieniowy magazyn klucz-wartość. Idealne do:
- Cache'owania danych
- Przechowywania session tokens
- Konfiguracji A/B testing
- Rate limiting cache

### Krok 1: Stworzenie KV Namespace

```bash
wrangler kv:namespace create "CACHE_STORAGE"
```

**Output**:
```
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CACHE_STORAGE", id = "e29b263ab50e42ce9b637fa8370175e8" }
```

### Krok 2: Dodanie do `wrangler.toml`

```toml
name = "my-first-worker"
main = "src/index.js"
compatibility_date = "2025-01-25"

[[kv_namespaces]]
binding = "CACHE_STORAGE"
id = "e29b263ab50e42ce9b637fa8370175e8"
```

### Krok 3: Używanie KV w kodzie

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // GET - pobranie z cache
    if (url.pathname === '/api/user/123') {
      const cached = await env.CACHE_STORAGE.get('user:123');
      
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Jeśli nie ma w cache - pobierz z API
      const response = await fetch('https://api.example.com/user/123');
      const data = await response.json();
      
      // Zapisz w cache na 1 godzinę
      await env.CACHE_STORAGE.put(
        'user:123',
        JSON.stringify(data),
        { expirationTtl: 3600 } // 1 godzina
      );
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // DELETE - usunięcie z cache
    if (request.method === 'DELETE' && url.pathname === '/api/user/123/cache') {
      await env.CACHE_STORAGE.delete('user:123');
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response('Not found', { status: 404 });
  },
};
```

---

## Zaawansowane przypadki użycia

### Przypadek 1: AI Gateway z Rate Limitingiem

```javascript
// Używamy Workers AI + KV do śledzenia limitów
export default {
  async fetch(request, env, ctx) {
    const ip = request.headers.get('cf-connecting-ip');
    const rateKey = `ratelimit:${ip}`;
    
    // Sprawdź limit
    const count = await env.RATE_LIMIT.get(rateKey);
    if (count && parseInt(count) >= 100) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
    
    // Zwiększ licznik
    await env.RATE_LIMIT.put(
      rateKey,
      String(parseInt(count || '0') + 1),
      { expirationTtl: 3600 }
    );
    
    // Użyj Workers AI do generowania tekstu
    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      prompt: 'Napisz krótki wiersz o programowaniu',
    });
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

### Przypadek 2: Proxy z transformacją HTML

```javascript
export default {
  async fetch(request, env, ctx) {
    // Pobierz stronę
    const response = await fetch('https://example.com');
    let html = await response.text();
    
    // Transformuj HTML
    html = html.replace(
      /<title>(.*?)<\/title>/,
      '<title>$1 - Proxied by Worker</title>'
    );
    
    // Dodaj nasz CSS
    html = html.replace(
      '</head>',
      '<style>body { background: #0f172a; color: #38bdf8; }</style></head>'
    );
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
```

### Przypadek 3: Webhook Handler z asynchronicznym przetwarzaniem

```javascript
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const payload = await request.json();
      
      // Ustaw webhook w queue (asynchronicznie)
      ctx.waitUntil(
        env.QUEUE.send({
          payload,
          timestamp: Date.now(),
        })
      );
      
      return new Response(
        JSON.stringify({ received: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response('Method not allowed', { status: 405 });
  },
};
```

---

## Best Practices i optymalizacja

### 1. Cachowanie inteligentne

```javascript
// Strategi cache w zależności od URL
const shouldCache = (url) => {
  return /\.(js|css|png|jpg|svg)$/.test(url);
};

// TTL zależy od typu zasobu
const getTTL = (url) => {
  if (/\.js$/.test(url)) return 86400; // 1 dzień
  if (/\.css$/.test(url)) return 86400;
  if (/\.(png|jpg)$/.test(url)) return 2592000; // 30 dni
  return 3600; // 1 godzina domyślnie
};
```

### 2. Error handling

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch('https://api.example.com/data');
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
```

### 3. Routing framework (Hono)

```bash
npm install hono
```

```javascript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello World'));

app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id');
  const user = await fetchUser(id);
  return c.json(user);
});

app.post('/api/webhook', async (c) => {
  const payload = await c.req.json();
  // Przetwórz webhook
  return c.json({ success: true });
});

export default app;
```

### 4. Logging i monitoring

```javascript
export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now();
    
    try {
      const response = await handleRequest(request, env);
      const duration = Date.now() - startTime;
      
      // Loguj do Logflare/DataDog/itp
      console.log({
        method: request.method,
        path: new URL(request.url).pathname,
        status: response.status,
        duration: `${duration}ms`,
      });
      
      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
```

### 5. Optymalizacja wydajności

```javascript
// Używaj Request/Response streaming dla dużych plików
export default {
  async fetch(request, env, ctx) {
    const response = await fetch('https://example.com/large-file.zip');
    
    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Length': response.headers.get('content-length'),
      },
    });
  },
};
```

---

## Checklist do deploymentu

- [ ] Wrangler zainstalowany i zalogowany
- [ ] `wrangler.toml` skonfigurowany poprawnie
- [ ] Kod przetestowany lokalnie (`npm run dev`)
- [ ] KV namespaces dodane jeśli są wymagane
- [ ] Environment variables ustawione
- [ ] Error handling zaimplementowany
- [ ] Logging skonfigurowany
- [ ] Rate limiting jeśli potrzebny
- [ ] CORS headers ustawione jeśli trzeba
- [ ] Deploy: `wrangler deploy`

---

## Przydatne komendy

```bash
# Lokalne testowanie
npm run dev

# Deploy do produkcji
wrangler deploy

# Przejrzyj logi
wrangler tail

# Zarządzaj KV
wrangler kv:key put NAMESPACE "key" "value"
wrangler kv:key get NAMESPACE "key"
wrangler kv:key delete NAMESPACE "key"

# Zarządzaj secrets
wrangler secret put API_KEY
wrangler secret delete API_KEY

# Stwórz nowy projekt
npm create cloudflare@latest
```

---

## Zasoby i dokumentacja

- **Oficjalna dokumentacja**: https://developers.cloudflare.com/workers/
- **Cloudflare Developers Discord**: https://discord.cloudflare.com
- **Workers Templates**: https://workers.cloudflare.com/templates
- **Cloudflare Learning Path**: https://developers.cloudflare.com/learning-paths/workers/
- **Community**: https://community.cloudflare.com

---

## Podsumowanie

Cloudflare Workers to **rewolucja w edge computing**. W 2025 roku, gdy wydajność i skalowanie są kluczowe, Workers oferują:

✅ Zerowe cold starts  
✅ 300+ globalne lokalizacje  
✅ Integracja z AI, bazami danych i storage  
✅ Proste deployment  
✅ Konkurencyjna cena  

Jeśli budujesz nowoczesne aplikacje, **edge jest już nie opcjonalny, ale konieczny**. Cloudflare Workers to najlepsza platforma do tego w 2025 roku.

Zaczynaj dziś: https://dash.cloudflare.com

---

**Wersja**: 1.0  
**Data aktualizacji**: 25 stycznia 2025  
**Autor**: Bonzo (AI-powered development guide)  
**Język**: Polski