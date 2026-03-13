# Project Snapshots

> Generuj snapshot co ~2h aktywnej pracy.  
> Format: data + czas → co zrobiono → co dalej → blokady

---

### [2026-03-10 ~sesja] Snapshot — Community Hub v2.0

**Zrobiono:**

1. **Fix build error** — `HandHelping` → `HeartHandshake` (lucide-react)
2. **Backend deploy** — Cloudflare Worker `804d95db` z endpointami:
   - `GET/POST/DELETE /api/listings` (marketplace)
   - `GET/POST/DELETE /api/community-news` (gazetka)
   - `GET /api/users/:username/dashboard`
   - URL: `https://jimbo77-community.stolarnia-ams.workers.dev`
3. **Linki ekosystemu** — jimbo77.com / mybonzo.com / zenbrowsers.org dodane do:
   - `Navbar.jsx` (ikony desktop + sekcja mobile)
   - `Footer.jsx` (kolorowe badges + CF Workers badge)
   - `Sidebars.jsx` (karty "NASZE STRONY" + iframe ZenBrowser na home)
   - `Community.jsx` (quick links + iframe + sekcja "NASZE STRONY" w obu sidebarach)
4. **Layout 25/50/25** — grid `[1fr_2fr_1fr]`, container `max-w-[1920px]`
5. **Collapsible sidebars** — toggle buttons w MarketplaceSidebar i GazetkaSidebar
6. **Marketplace interaktywny:**
   - Ogłoszenia rozwijalne na click (expandedId state)
   - Autor klikalny → nawigacja do profilu użytkownika
7. **Tag + backup:**
   - Tag: `v2.0-community-hub` (frontend `80ba3ce`, backend `6d725c3`)
   - Branch: `backup/v2.0-community-hub` (oba repo)
8. **`.workspace_meta`** — skopiowano z template, wypełniony workspace.spec.json

**Commity sesji (frontend — jimbo77-blog):**
- `e98256d` — feat: 3-column layout - marketplace sidebar + gazetka sidebar
- `bda63cf` — feat: add site links + zen iframe widgets across Navbar, Footer, Sidebars, Community
- `80ba3ce` — feat: 25/50/25 full-width layout, collapsible sidebars, clickable author profiles

**Commity sesji (backend — jimbo77-community):**
- Worker version `804d95db` — listings + community-news endpoints

**Pliki zmodyfikowane:**
- `src/pages/Community.jsx` (~1495 linii — MarketplaceSidebar, GazetkaSidebar, main layout)
- `src/components/Navbar.jsx` (3 icon-links + mobile section)
- `src/components/Footer.jsx` (badges + version → v1.0.5)
- `src/components/Sidebars.jsx` (cards + iframe + links)

**Następne kroki:**
- Dodać persystentny stan sidebarów (localStorage)
- Dodać paginację do marketplace (jeśli > 10 ogłoszeń)
- Podpiąć real-time updates (WebSocket lub polling)

---

### [2026-03-13 ~sesja] Snapshot — Blog Publishing Pipeline (2 artykuły + Publisher Discovery)

**Zrobiono:**

1. **Artykuł 1 — RAG & małe modele:**
   - `public/blog-content/dlaczego-wielkie-modele-przegrywaja-w-rag.md`
   - Temat: dlaczego komercyjne systemy RAG wybierają małe modele zamiast dużych (ekonomia 50-300x, halucynacje, latencja, case study Pumo RAG)
   - Hero image: `dlaczego-wielkie-modele-ai-przegrywaja-w-hero.webp` (FLUX Schnell via Replicate)
   - Kategoria: `AI Zastosowania`, sortDate `2026-03-13`

2. **Artykuł 2 — Claude MCP Tampermonkey hack:**
   - `public/blog-content/jak-oszukalem-claude-mcp-tampermonkey-websocket.md`
   - Temat: jak użytkownik zbudował 3-warstwowy system (Tampermonkey userscripts → WebSocket bridge → JSON-RPC MCP server) i testował Claude przez 45 min
   - Hero image: `jak-oszukalem-claude-tampermonkey-websoc-hero.webp` (FLUX 1.1 Pro Ultra via Replicate)
   - Kategoria: `AI Moje Projekty`, sortDate `2026-03-13`
   - Korekta Zeno Bro: iframe wyszukiwarka z lat 90-tych + Chrome extensions (NIE MCP)

3. **Odkrycie Publisher System (`publisher/`):**
   - `image_generator.py` — multi-model Replicate (FLUX Pro/Schnell/Ultra, SDXL, GPT Image 1, DALL-E 3)
   - `moa_engine.py` — Mixture of Agents (Perplexity → DeepSeek+Gemma+Qwen → GPT-5-nano)
   - `publisher_workflow.py` — pełny pipeline: research → write → image → save → deploy
   - Venv: `publisher/venv/Scripts/python.exe`, `.env` z kluczami API
   - `generate_hero_image(title, category, style, output_dir, model_override)` → `(filename, model_name, prompt)`

4. **Deployment & fixes:**
   - CF Workers AI failed (brak `ai` scope w OAuth token)
   - HuggingFace FLUX failed (ZeroGPU quota exceeded)
   - Rozwiązanie: publisher/image_generator.py via Replicate API → działa idealnie
   - Git push rejected (non-fast-forward) → stash + pull --rebase + stash pop → OK
   - Fix hero image path (R2 URL → local `/blog-images/`)
   - 4 commity: artykuł RAG, fix path, artykuł Claude, fix Zeno Bro

**Commity sesji:**
- `c47dd7b` — blog: artykul RAG male modele + hero image FLUX Schnell
- `0e39836` — fix: hero image path w artykule RAG
- `82ed6ff` — blog: jak oszukalem Claude - MCP Tampermonkey WebSocket hack + hero FLUX Ultra
- `dd1bb0b` — fix: Zeno Bro opis - iframe wyszukiwarka 90s + Chrome extensions, nie MCP

**Pliki utworzone:**
- `public/blog-content/dlaczego-wielkie-modele-przegrywaja-w-rag.md`
- `public/blog-content/jak-oszukalem-claude-mcp-tampermonkey-websocket.md`
- `public/blog-images/dlaczego-wielkie-modele-ai-przegrywaja-w-hero.webp`
- `public/blog-images/jak-oszukalem-claude-tampermonkey-websoc-hero.webp`

**Pliki zmodyfikowane:**
- `src/data/blogPosts.js` — 2 nowe wpisy (pozycje 1-2)

**Workflow publikacji bloga (odkryty):**
1. Napisz markdown → `public/blog-content/{slug}.md`
2. Wygeneruj hero image → `publisher/image_generator.py` → `public/blog-images/{slug}-hero.webp`
3. Dodaj wpis do `src/data/blogPosts.js` (id, title, excerpt, category, sortDate, image)
4. `git add . && git commit && git push origin main` → Vercel auto-deploy

**Następne kroki:**
- Rozpisać więcej artykułów z `20 wspólnych linków OneLink`
- Przetestować pełny pipeline MOA (publisher_workflow.py)
- Scommitować pliki .workspace_meta i backend rebuild files

**Blokady:** brak

---

### [2026-03-12 ~sesja] Snapshot — Backend Rebuild & Deploy

**Zrobiono:**

1. **Diagnoza** — frontend Community.jsx (~1600 linii) zmapowany → backend miał zły schemat i brakujące pliki
2. **Nowy schemat D1** — 10 tabel (users, posts, comments, categories, post_likes, listings, community_news, crawler_visits, global_stats, webhooks)
3. **Nowe pliki backendowe:**
   - `middleware/auth.ts` (PBKDF2 + JWT + Hono middleware)
   - `routes/auth.ts` (login, register, profile, dashboard)
   - `routes/posts.ts` (pełne CRUD + likes + comments + paginacja)
   - `routes/comments.ts`, `categories.ts`, `listings.ts`, `news.ts`, `upload.ts`, `webhooks.ts`
   - `db/client.ts`, `package.json`
4. **Deploy na Cloudflare:**
   - D1 `jimbo77-social-db` utworzona (EEUR)
   - Schema zaaplikowany (35 queries)
   - JWT_SECRET jako CF Secret
   - Worker: `https://jimbo77-community.stolarnia-ams.workers.dev`
   - Version: `54dc3e3c-874a-43bb-b6b5-3ce1e363c093`
5. **Testy endpointów** — health, categories, register, login, posts (CRUD), community-news — wszystko OK

**Pliki zmodyfikowane (backend `_extra/api/`):**
- `wrangler.toml` (D1 ID, R2 bucket, nazwa workera, usunięto routes)
- `index.ts` (9 modułów routów)
- `routes/posts.ts` (kompletna przebudowa)
- `routes/crawlers.ts` (fix starych kolumn)

**Pliki utworzone:**
- `package.json`, `db/client.ts`, `middleware/auth.ts`
- `routes/auth.ts`, `routes/comments.ts`, `routes/categories.ts`
- `routes/listings.ts`, `routes/news.ts`, `routes/upload.ts`, `routes/webhooks.ts`
- `_extra/stock/migration.sql` (na wypadek migracji istniejących danych)

**Następne kroki:**
- Zarejestrować konta od nowa (nowa baza jest czysta)
- Sprawdzić login z frontendu w przeglądarce
- Migracja starych danych użytkowników (jeśli potrzebne)
- Sprawdzić upload obrazów (R2)
- Test marketplace i gazetki z frontendu
- Create user registration/login flow
- SEO: meta tags, Open Graph dla community postów
- Rozpisać blog posts z `20 „wspólnych" linków OneLink`

**Blokady:** brak

---

### [2026-03-10 sesja 2] Snapshot — Home page cleanup

**Zrobiono:**

1. **Footer.jsx** — skrócono tekst newslettera: "Bądź na Bieżąco: Newsy o AI & DevOps w jednej linii." → "🔔 BĄDŹ NA BIEŻĄCO"
2. **Home.jsx** — ograniczono posty do 8 (slice(0, 8)), pierwsze 2 jako duże (isFeatured = index < 2), kolejne 6 małe
3. **Home.jsx** — usunięto "LOAD MORE DATA..." (nie istniało jako osobny komponent — sekcja archiwum z przyciskiem "Przejdź do pełnego archiwum" ZOSTAŁA)

**Kolejność 8 postów na Home (sortDate desc):**
1. AI w medycynie... (2026-03-09) — **duży**
2. AI w rolnictwie... (2026-03-09) — **duży**
3-6. 4x GEO artykuły (2026-02-01) — małe
7. Orkiestracja Multi-Agentowa (2026-01-01) — małe
8. Naprawa i Optymalizacja Pumo RAG (2026-01-01) — małe

**Commity:**
- `b74853d` — fix: skróć tekst newslettera w Footer, usuń sekcję LOAD MORE z Home
- `2d3bfd4` — fix: ogranicz Home do 2 najnowszych postów
- `8cc2cd9` — fix: 8 postów na Home - 2 duże (featured) + 6 mniejszych

**Pliki zmodyfikowane:**
- `src/components/Footer.jsx`
- `src/pages/Home.jsx`

---

### [2026-03-10 sesja 3] Snapshot — Gallery Pipeline + Core Page

**Zrobiono:**

1. **Core.jsx** — pełna rozbudowa pustej strony Core:
   - Inline SVG isometric diagram (zastąpił broken Unsplash img)
   - Section 01: Live System Status (6 kart + ping R2 Worker + refresh)
   - Section 02: Architecture Diagram (@xyflow/react, 7 węzłów)
   - Section 03: MCP Stack & Tools (8 kart)
   - Section 04: Changelog timeline v1.0.0→v1.0.5

2. **Gallery.jsx** — nowa strona /gallery:
   - Masonry grid (columns-2→5), lightbox z klawiaturą (←→Esc)
   - Filtry po modelu i temacie, star ratings (localStorage)
   - 25 seed images z test_output publisher
   - Dynamiczne ładowanie z `/gallery/gallery-index.json`

3. **Gallery pipeline** — publisher auto-zapisuje metadane obrazów:
   - `image_generator.py`: generate_hero_image() → tuple (filename, model_name, prompt)
   - `publisher_workflow.py`: save_gallery_entry() → public/gallery/gallery-index.json
   - `gallery-index.json`: seed file z 25 obrazami

4. **Navbar** + **App.jsx** — link i route /gallery

**Commit:** `f0f0623` — feat: gallery auto-update pipeline

**Pliki zmodyfikowane:**
- `publisher/image_generator.py`
- `publisher/publisher_workflow.py`
- `src/pages/Gallery.jsx`
- `public/gallery/gallery-index.json` (nowy)

**Następne kroki:**
- Przetestować pełny flow publisher → gallery-index.json
- Cloudflare Cron Trigger dla publishingu o 9:00 UTC
- D1 backend dla star ratings

---

### [2026-03-10 sesja 4] Snapshot — Publisher fixes, FLUX Ultra, Lightbox fix

**Zrobiono:**

1. **FLUX 1.1 Pro Ultra** — dodany do rotacji modeli w `image_generator.py`:
   - `output_format: jpg` (Ultra nie obsługuje webp w params, ale Replicate i tak zapisuje webp)
   - `output_quality: 95`, `raw: False`
   - `MODEL_TAG_MAP`: dodano `"FLUX 1.1 Pro Ultra": "flux-ultra"`
   - `MODEL_COLORS` w Gallery.jsx: `flux-ultra → text-pink-400`

2. **Nowa grafika hero** dla artykułu ChatGPT-5 emocje z głosu:
   - Wygenerowana przez FLUX 1.1 Pro Ultra z custom promptem (twarz z profilu, fale dźwiękowe cyan/violet)
   - Zastąpiła stary `.png` (GPT Image 1 Mini) nowym `.webp`
   - `blogPosts.js` zaktualizowany: `.png` → `.webp`
   - `gallery-index.json` zaktualizowany: nowy model/tag/prompt/src

3. **Lightbox fix** (Gallery.jsx) — dwa problemy, dwa fixy:
   - **z-index**: Navbar `z-50` zasłaniał lightbox `z-50` → zmieniono na `z-[200]`
   - **HeroUI Card**: `onClick` ignorowany bez `isPressable` → dodano `isPressable` + zmieniono na `onPress`
   - Strzałki nawigacji przeniesione do flex-row (nie wystaję poza ekran)
   - Obraz: `max-h-[75vh]` żeby mieścił się na ekranie

4. **blogPosts.js** — description fix: frontmatter YAML nie może być w JS stringu:
   - `save_post()` teraz strip-uje frontmatter przed ekstrakcją opisu
   - `" ".join(description.splitlines())` — wymusza single-line
   - Title limit: `[:80]` → `[:120]` (mniej obcięć)

**Commity sesji:**
- `cbbcd63` — feat: add FLUX 1.1 Pro Ultra to publisher model rotation
- `dfdbf09` — fix: FLUX Ultra jpg→webp output fix, swap hero image to FLUX Ultra version
- `04fb7b0` — fix: lightbox arrows inside container, add FLUX Ultra gallery entry + color tag
- `2bca7c3` — fix: lightbox z-[200] above navbar, Card isPressable+onPress for click

**Kluczowe wnioski / gotchas:**
- HeroUI Card wymaga `isPressable` + `onPress` (nie `onClick`) żeby reagować na kliknięcia
- Lightbox musi mieć wyższy z-index niż Navbar (`z-[200]` vs `z-50`)
- FLUX 1.1 Pro Ultra API: params muszą mieć `output_format: jpg/png` (nie webp), mimo że plik ląduje jako webp
- `gallery-index.json` i `blogPosts.js` muszą być aktualizowane synchronicznie po zmianie hero image

**Pliki zmodyfikowane:**
- `publisher/image_generator.py` (FLUX Ultra model)
- `publisher/publisher_workflow.py` (MODEL_TAG_MAP, title limit)
- `src/pages/Gallery.jsx` (lightbox z-index, isPressable, flux-ultra color)
- `src/data/blogPosts.js` (hero image extension)
- `public/gallery/gallery-index.json` (nowy wpis FLUX Ultra)
- `public/blog-images/nowy-przelom-w-ai-chatgpt-5-potrafi-czyt-hero.webp` (nowy plik)

**Następne kroki:**
- Title truncation: word-boundary ellipsis zamiast hard cut (`title[:120].rsplit(' ',1)[0] + '...'`)
- OpenRouter API key rotation (gemma-3-27b 403 "leaked key")
- Cloudflare Cron Trigger (publisher o 9:00 UTC)
- D1 backend dla star ratings w Gallery

<!-- Dodawaj nowe snapshoty poniżej -->
