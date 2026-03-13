<!-- Auto-saved: 10.03.2026, 06:22:18 -->
# jimbo77-blog — Community Hub v2.0

## Architektura
- Frontend: React+Vite+Tailwind+HeroUI → Vercel (auto-deploy)
- Backend: Hono+CF Workers+D1+R2 → wrangler deploy
- Worker URL: https://jimbo77-community.stolarnia-ams.workers.dev
- Repo FE: Bonzokoles/jimbo77-blog (U:\WWW_Jimbo_ORG)
- Repo BE: Bonzokoles/jimbo77-community (U:\jimbo77-community)

## Layout
- Grid: 1fr_2fr_1fr (25/50/25), max-w-[1920px]
- MarketplaceSidebar (left) | Posts (center) | GazetkaSidebar (right)
- Collapsible sidebary, sticky top-28

## API Endpoints
- GET/POST/DELETE /api/listings (marketplace)
- GET/POST/DELETE /api/community-news (gazetka)
- GET /api/users/:username/dashboard

## Gotchas
- HandHelping NIE istnieje w lucide-react → użyj HeartHandshake
- ZenBrowser iframe może być blokowany przez CSP
- Stan sidebarów nie jest persystentny (brak localStorage)

## Git
- Tag: v2.0-community-hub (FE: 80ba3ce, BE: 6d725c3)
- Backup: backup/v2.0-community-hub (oba repo)

## Backend Rebuild (2026-03-12)
- Stary backend miał zły schemat D1 — przebudowano kompletnie
- Nowa baza D1: `jimbo77-social-db` (ID: `7cd9d679-006f-4d12-a003-b1fe8ba921be`, EEUR)
- R2 bucket: `jimbo77-community-images`
- Auth: PBKDF2 + JWT (secret w Cloudflare Secrets)
- 10 tabel, 9 modułów routów, pełne CRUD + auth
- Deploy: `cd _extra/api && wrangler deploy`
- Szczegóły: `notes/2026-03-12_community-backend-rebuild.md`

## Backlog
- localStorage dla stanu sidebarów
- Paginacja marketplace
- ~~User auth flow~~ ✅ (zrobione 2026-03-12)
- SEO meta/Open Graph
- ~~Blog posts z OneLink~~ 🔄 (w trakcie — 2 artykuły opublikowane 2026-03-13)
- Migracja starych kont użytkowników (nowa baza jest czysta)
- Przetestować pełny pipeline MOA (publisher_workflow.py)

## Blog Publishing Workflow (odkryty 2026-03-13)
- Artykuły: `public/blog-content/{slug}.md` (markdown z frontmatter-like headers)
- Hero images: `public/blog-images/{slug}-hero.webp`
- Metadane: `src/data/blogPosts.js` — tablica obiektów, posortowana wg sortDate desc
- Frontend: `BlogPost.jsx` fetchuje `/blog-content/${slug}.md` na podstawie id z blogPosts.js
- Deploy: git push → Vercel auto-build (SPA rewrite w `vercel.json`)

### Publisher System (`publisher/`)
- `image_generator.py` — Replicate API, rotacja modeli (FLUX Pro/Schnell/Ultra, SDXL, GPT Image 1)
- `moa_engine.py` — MOA: Perplexity Sonar (research) → 3 LLM parallel (DeepSeek+Gemma+Qwen) → GPT-5-nano (synteza)
- `publisher_workflow.py` — pipeline: research → write → image → save → git deploy
- `.env` — klucze: Replicate, OpenRouter, OpenAI, DeepSeek, CF, Stability, Together, Gemini, Anthropic
- Venv: `publisher/venv/Scripts/python.exe`
- Użycie: `generate_hero_image(title, category, style, output_dir, model_override)` → `(filename, model, prompt)`