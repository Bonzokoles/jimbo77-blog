# ⚡ Cloudflare Workers - Cheat Sheet 2025

## 🚀 Szybki Start (3 minuty)

```bash
# 1. Instalacja
npm install -g @cloudflare/wrangler

# 2. Login
wrangler login

# 3. Nowy projekt
npm create cloudflare@latest my-worker
cd my-worker

# 4. Development
npm run dev

# 5. Deploy
wrangler deploy
```

**URL**: `https://my-worker.<username>.workers.dev`

---

## 📝 Struktura Projektu

```
my-worker/
├── src/
│   └── index.js          # Twój kod
├── wrangler.toml         # Config
├── package.json
└── tsconfig.json         # Jeśli TypeScript
```

---

## 🎯 Podstawowy Worker

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Routing
    if (url.pathname === '/') {
      return new Response('Hello World!');
    }
    
    if (url.pathname === '/api/data') {
      return new Response(JSON.stringify({ data: 'test' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('404', { status: 404 });
  }
};
```

---

## 🔑 Workers KV - Cheat Sheet

### Setup

```bash
# Stwórz namespace
wrangler kv:namespace create "CACHE"

# Dodaj do wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_ID"
```

### Operacje w kodzie

```javascript
// GET
const value = await env.CACHE.get('key');

// PUT
await env.CACHE.put('key', 'value');
await env.CACHE.put('key', JSON.stringify(data), {
  expirationTtl: 3600  // 1 godzina
});

// DELETE
await env.CACHE.delete('key');

// List keys (tylko namespace ID potrzebny)
const list = await env.CACHE.list();

// Check if key exists
const value = await env.CACHE.get('key');
const exists = value !== null;
```

### Praktyczne pattery

```javascript
// Cache-aside pattern
async function getCached(key, fetchFn) {
  const cached = await env.CACHE.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetchFn();
  await env.CACHE.put(key, JSON.stringify(data), {
    expirationTtl: 3600
  });
  return data;
}

// TTL patterns
const TTL = {
  SHORT: 300,      // 5 min
  MEDIUM: 3600,    // 1 hour
  LONG: 86400,     // 1 day
  VERY_LONG: 604800 // 1 week
};
```

---

## 🌐 HTTP Methods & Routing

```javascript
export default {
  async fetch(request, env, ctx) {
    const { method } = request;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // GET
    if (method === 'GET') {
      if (path === '/users') {
        return new Response(JSON.stringify([...]),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // POST
    if (method === 'POST') {
      const body = await request.json();
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // DELETE
    if (method === 'DELETE') {
      return new Response(null, { status: 204 });
    }
    
    // 405 Method Not Allowed
    return new Response('Method Not Allowed', { status: 405 });
  }
};
```

---

## 🔐 Headers & CORS

```javascript
// Set CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS request (preflight)
if (request.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}

// Response z CORS
return new Response(data, {
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders
  }
});
```

---

## 🔗 Proxy Request

```javascript
// Proxy to another API
const response = await fetch('https://api.example.com/data', {
  method: request.method,
  headers: request.headers,
  body: request.method !== 'GET' ? await request.text() : null
});

return response;
```

---

## 🛡️ Rate Limiting

```javascript
// Simple rate limit
async function rateLimit(ip) {
  const key = `ratelimit:${ip}`;
  const count = await env.CACHE.get(key);
  
  if (count && parseInt(count) >= 100) {
    return false;
  }
  
  await env.CACHE.put(key, 
    String(parseInt(count || '0') + 1),
    { expirationTtl: 3600 }
  );
  
  return true;
}

// Use it
const ip = request.headers.get('cf-connecting-ip');
if (!await rateLimit(ip)) {
  return new Response('Rate limited', { status: 429 });
}
```

---

## 📊 Logging

```javascript
// Console logging
console.log('Info', data);
console.error('Error', error);
console.warn('Warning', issue);

// View logs
// wrangler tail

// Structured logging
const log = {
  timestamp: new Date().toISOString(),
  method: request.method,
  path: new URL(request.url).pathname,
  status: response.status,
  duration: Date.now() - startTime
};

console.log(JSON.stringify(log));
```

---

## 🔒 Environment Variables & Secrets

### Set in wrangler.toml
```toml
[env.production]
vars = { ENVIRONMENT = "production" }
```

### Set via CLI
```bash
wrangler secret put API_KEY
wrangler secret put DATABASE_URL
```

### Access in code
```javascript
export default {
  async fetch(request, env, ctx) {
    const apiKey = env.API_KEY;      // Secret
    const environment = env.ENVIRONMENT;  // Var
    
    return new Response(environment);
  }
};
```

---

## ⚙️ wrangler.toml - Complete Example

```toml
name = "my-awesome-worker"
main = "src/index.js"
compatibility_date = "2025-01-25"
workers_dev = true

# KV Namespaces
[[kv_namespaces]]
binding = "CACHE"
id = "abc123..."

[[kv_namespaces]]
binding = "SESSIONS"
id = "def456..."

# Environment Variables
vars = { 
  ENVIRONMENT = "production",
  API_VERSION = "v2"
}

# Custom domain (paid plan)
[env.production]
route = "example.com/*"

# Database binding
[[d1_databases]]
binding = "DB"
database_name = "my_database"
database_id = "abc123..."

# Queues
[[queues.consumers]]
queue = "my-queue"
```

---

## 📡 Workers AI

```javascript
export default {
  async fetch(request, env, ctx) {
    const response = await env.AI.run(
      '@cf/meta/llama-2-7b-chat-int8',
      {
        prompt: 'Write a poem about code',
        max_tokens: 256,
        temperature: 0.7
      }
    );
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

**Enable in wrangler.toml:**
```toml
[ai]
binding = "AI"
```

---

## 🐛 Error Handling

```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      // Your code
      const data = await someAsyncFunction();
      return new Response(JSON.stringify(data));
    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({
          error: error.message,
          status: 500
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};
```

---

## 🚀 Common Commands

```bash
# Development
npm run dev              # Local testing on :8787
npm run deploy           # Deploy to production
npm run test             # Run tests

# KV Management
wrangler kv:key put CACHE "key" "value"
wrangler kv:key get CACHE "key"
wrangler kv:key delete CACHE "key"
wrangler kv:key list CACHE
wrangler kv:namespace create "NEW_NS"

# Monitoring
wrangler tail            # Stream logs
wrangler logs            # View recent logs
wrangler deployments     # View deployment history

# Configuration
wrangler generate-types  # Generate TypeScript types
wrangler publish         # Deploy (old command)
```

---

## ⚡ Performance Tips

```javascript
// 1. Cache aggressively
const response = await fetch(url);
if (response.ok) {
  // Cache successful responses
  await env.CACHE.put(key, data, { expirationTtl: 3600 });
}

// 2. Use KV for read-heavy operations
const cached = await env.CACHE.get(key); // <10ms!

// 3. Minimize JSON parsing
// Bad: Multiple parses
const obj = JSON.parse(data);
const value = obj.nested.property;
const clone = JSON.parse(JSON.stringify(obj));

// Good: Parse once, reuse
const obj = JSON.parse(data);
const { nested } = obj;

// 4. Use streaming for large responses
const stream = fs.createReadStream('large-file');
return new Response(stream);

// 5. Set proper cache headers
return new Response(data, {
  headers: {
    'Cache-Control': 'public, max-age=3600',
    'ETag': '"abc123"'
  }
});
```

---

## 🎯 Context (ctx) Usage

```javascript
export default {
  async fetch(request, env, ctx) {
    // Start async work
    ctx.waitUntil(
      (async () => {
        // This runs after response is sent!
        await logToExternalService();
        await processWebhook();
        await cleanupDatabase();
      })()
    );
    
    // Return response immediately
    return new Response('Done!');
  }
};
```

---

## 📚 Useful Links

- **Docs**: https://developers.cloudflare.com/workers/
- **API Reference**: https://developers.cloudflare.com/workers/runtime-apis/
- **Discord**: https://discord.cloudflare.com
- **Templates**: https://workers.cloudflare.com/templates
- **Status**: https://www.cloudflarestatus.com

---

## 🔥 Pro Tips

1. **Always test locally first** (`npm run dev`)
2. **Use KV for caching** - it's fast and cheap
3. **Monitor with `wrangler tail`** - real-time logs
4. **Set appropriate TTLs** - don't cache forever
5. **Implement error handling** - prod issues happen
6. **Use environment variables** - keep secrets safe
7. **Version your APIs** - `/v1/`, `/v2/`
8. **Enable CORS early** - saves debugging time
9. **Compress responses** - use gzip when possible
10. **Use Durable Objects for state** - not just KV

---

**Version**: 1.0 | **Date**: 25 Jan 2025 | **Status**: Ready ⚡