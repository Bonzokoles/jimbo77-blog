# Architecture Decision Records

> Dokumentuj tu każdą ważną decyzję techniczną.  
> Format: data → kontekst → decyzja → konsekwencje

---

### ADR-001: Zamiana ikony HandHelping na HeartHandshake
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Build frontend się wysypywał — `HandHelping` nie istnieje w zainstalowanej wersji lucide-react.  
**Decyzja:** Zamieniono `HandHelping` na `HeartHandshake` (import + użycie w `typeIcon` function w Community.jsx ~linia 993).  
**Konsekwencje:** Build przechodzi. Ikona wizualnie pasuje do kontekstu "pomoc/usługi".  
**Alternatywy:** Hand, HandMetal, HelpCircle — HeartHandshake najlepiej pasuje semantycznie.

---

### ADR-002: Layout 25/50/25 full-width (1fr/2fr/1fr)
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Oryginalne sidebary miały stały `260px` i container `max-w-[1400px]` — za wąskie, dużo pustej przestrzeni na szerokich ekranach.  
**Decyzja:** Zmieniono grid z `grid-cols-[260px_1fr_260px]` na `grid-cols-[1fr_2fr_1fr]`. Container poszerzony z `max-w-[1400px]` na `max-w-[1920px]`.  
**Konsekwencje:** Sidebary zajmują 25% szerokości ekranu, content 50%. Na full HD i większych ekranach content jest czytelniejszy.  
**Alternatywy:** Stały width w px, lub `[minmax(260px,1fr)_2fr_minmax(260px,1fr)]` — wybrano prostsze `1fr_2fr_1fr`.

---

### ADR-003: Collapsible sidebars z expand/collapse
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Sidebary mają dużo contentu — marketplace CRUD, gazetka, linki, iframe — co przytłacza użytkownika.  
**Decyzja:** Dodano stan `sectionOpen`/`setSectionOpen` (MarketplaceSidebar) i `sidebarExpanded`/`setSidebarExpanded` (GazetkaSidebar) z przyciskami toggle (ChevronDown/ChevronUp). Content sidebarów domyślnie rozwinięty, ale użytkownik może zwinąć.  
**Konsekwencje:** Lepszy UX — użytkownik kontroluje ile informacji widzi. Stan nie jest persystentny (resetuje się przy odświeżeniu).  
**Alternatywy:** Accordion na każdej sekcji osobno — zbyt granularny, jeden toggle wystarczy.

---

### ADR-004: Marketplace — klikalny autor + rozwijalne ogłoszenia
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Autor ogłoszenia był statycznym tekstem, ogłoszenia pokazywały tylko tytuł/typ — brak interaktywności.  
**Decyzja:** `@nazwa_autora` jest teraz klikalnym linkiem → wywołuje `onViewProfile(name)` → ustawia `viewUserDashboard` → nawiguje do dashboard użytkownika. Ogłoszenia rozwijalne na click (`expandedId` state) — pokazują pełny opis + link kontaktowy.  
**Konsekwencje:** Marketplace stał się interaktywny. Wymaga działającego endpointu `/api/users/:username/dashboard` w backendzie.  
**Alternatywy:** Modal z profilem zamiast pełnej nawigacji — zbyt skomplikowany.

---

### ADR-005: Multi-repo architektura (frontend + backend osobno)
**Data:** 2026-03-10  
**Status:** superseded (backend przeniesiony do _extra/api/ w monorepo)

> **UPDATE 2026-03-12:** Backend jest teraz w `_extra/api/` w tym samym repo. Deploy nadal oddzielny: Vercel (frontend) + wrangler (backend).

---

### ADR-008: Przebudowa backendu — nowy schemat D1 + pełne auth
**Data:** 2026-03-12  
**Status:** accepted  
**Kontekst:** Po zmianach w D1 login i wpisy przestały działać. Analiza wykazała 100% niezgodność schematu z frontendem. 3 importowane pliki (auth.ts, webhooks.ts, db/client.ts) nie istniały.  
**Decyzja:** Kompletna przebudowa backendu — nowy schemat 10 tabel, auth PBKDF2+JWT, 9 modułów routów, package.json z hono.  
**Konsekwencje:** Frontend NIE wymagał żadnych zmian — backend dopasowany do istniejącego Community.jsx. Stare konta użytkowników utracone (nowa baza). JWT_SECRET w CF Secrets (nie w vars).  
**Alternatywy:** Próba łatania starego schematu — zbyt dużo niezgodności, czysta przebudowa szybsza i bezpieczniejsza.

---

### ADR-009: Nazwa workera = jimbo77-community (nie jimbo77-social-club-api)
**Data:** 2026-03-12  
**Status:** accepted  
**Kontekst:** wrangler.toml miał `name = "jimbo77-social-club-api"`, co daje URL `jimbo77-social-club-api.stolarnia-ams.workers.dev`. Frontend w 13 plikach hardcoded `jimbo77-community.stolarnia-ams.workers.dev`.  
**Decyzja:** Zmieniono nazwę workera na `jimbo77-community` — dopasowanie do frontendu, zero zmian w 13 plikach.  
**Konsekwencje:** Worker dostępny pod oczekiwanym URL. Stary worker `jimbo77-social-club-api` został utworzony automatycznie (na nim ustawiono pierwszy JWT_SECRET) — można go usunąć.  
**Alternatywy:** Zmiana 13 plików w repo — niepotrzebne ryzyko regresji.

---

### ADR-010: Auth — PBKDF2 + JWT (nie bcrypt, nie sessions)
**Data:** 2026-03-12  
**Status:** accepted  
**Kontekst:** Cloudflare Workers nie mają dostępu do node:crypto (bcrypt). Potrzebny stateless auth (D1 nie wspiera sessions).  
**Decyzja:** PBKDF2-SHA256 (100k iteracji, 16-byte salt) via Web Crypto API. JWT HMAC-SHA256, expiry 7 dni. Format stored: `salt:hash`.  
**Konsekwencje:** Kompatybilne z CF Workers. Stateless — nie wymaga session store. JWT expiry wymusza re-login co tydzień.  
**Alternatywy:** bcrypt (niedostępny na CF), Argon2 (niedostępny), cookie sessions (wymagają KV/D1 store).

---

### ADR-005: Multi-repo architektura (frontend + backend osobno)
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Frontend (React/Vite) i backend (Cloudflare Workers) mają różne cykle deploy — frontend auto-deploys z Vercel, backend z wrangler.  
**Decyzja:** Dwa osobne repozytoria: `jimbo77-blog` (frontend) i `jimbo77-community` (backend). Tag `v2.0-community-hub` na obu repozytoriach jako punkt synchronizacji.  
**Konsekwencje:** Muszą być tagowane jednocześnie. CORS skonfigurowany na workerze. API URL hardcoded w frontend jako env variable.  
**Alternatywy:** Monorepo — zbyt ciężki dla tego przypadku.

---

### ADR-006: Linki ekosystemu (jimbo77.com, mybonzo.com, zenbrowsers.org) wszędzie
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Użytkownik chce cross-promote swoje strony z każdego miejsca na jimbo77.org.  
**Decyzja:** Dodano linki/ikony do: Navbar (desktop + mobile), Footer (badges), Sidebars.jsx (home), Community.jsx (oba sidebary). ZenBrowser dostaje iframe preview (200px, sandboxed). Cloudflare badge w stopce.  
**Konsekwencje:** Każda strona w ekosystemie jest widoczna z poziomu jimbo77.org. Iframe zenbrowsers.org może być blokowany przez ich politykę CSP — sandboxed.  
**Alternatywy:** Osobna strona "Ekosystem" — za mało widoczna, lepiej in-context.

---

---

### ADR-007: Jak działają artykuły blogowe (architektura treści)
**Data:** 2026-03-10  
**Status:** accepted  
**Kontekst:** Artykuł "AI w rolnictwie" miał poprawioną treść w .md ale stare metadane na stronie — bo są dwa źródła danych.

**Architektura artykułów:**

1. **Metadane** (tytuł, opis, autor, data, obraz, tagi) → `src/data/blogPosts.js`
   - Statyczna tablica JS z obiektami
   - Używane przez: `Home.jsx`, `BlogPost.jsx`, `BlogHub.jsx`, `ArticleList.jsx`
   - To stąd bierze się tytuł na liście, karta, SEO, header artykułu

2. **Treść** (body artykułu w Markdown) → `public/blog-content/{slug}.md`
   - Fetch z `/blog-content/{slug}.md` w `BlogPost.jsx` (linia ~74)
   - Renderowany przez `ReactMarkdown` z `remark-gfm` + `rehype-highlight`
   - Frontmatter w .md (title, description, author, date) jest IGNOROWANY — nie jest parsowany!
   - Jedyne co się liczy to body Markdown po `---`

3. **Obrazy** → `public/blog-images/{slug}-hero.webp`
   - Referencja w `blogPosts.js` jako `image: '/blog-images/...'`

4. **R2 Dynamic** (alternatywny flow dla słownikowych ID):
   - Jeśli slug to numer (`/^\d+$/`) → fetch z R2 worker: `${WORKER_URL}/texts/${slug}.md`
   - Metadata generowane dynamicznie (brak wpisu w blogPosts.js)

**Jak dodać nowy artykuł:**
1. Stwórz `public/blog-content/{slug}.md` z treścią
2. Dodaj wpis do `src/data/blogPosts.js` z: id, title, slug, date, sortDate, category, image, tech, description, readTime, author, featured
3. Dodaj hero image do `public/blog-images/{slug}-hero.webp`
4. Commit + push → Vercel auto-deploy

**Jak edytować artykuł:**
1. Zmień treść w `public/blog-content/{slug}.md`
2. **PAMIĘTAJ**: zmień też metadane w `src/data/blogPosts.js` (title, description, author)! Inaczej strona pokaże stare dane.

**Konsekwencje:** Dual-source of truth (metadane ≠ treść). Frontmatter w .md jest ignorowany — jedyny source metadanych to blogPosts.js.  
**Alternatywy:** Parsowanie frontmatter z .md w runtime (np. gray-matter) → single source of truth. TODO na przyszłość.

<!-- Dodawaj nowe decyzje poniżej -->
