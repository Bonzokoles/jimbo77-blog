# [2026-03-12] Przebudowa backendu Community Hub

> Sesja naprawcza — po zmianach w D1 przestał działać login i wpisy w Community.

---

## Problem

Po zmianach w bazie D1 frontend Community Hub (`Community.jsx`) nie mógł się komunikować z backendem:
- **Login** → "Nieprawidłowy e-mail lub hasło"
- **Wpisy** → nie ładowały się
- **Marketplace / Gazetka** → brak danych

## Diagnoza

1. Stary schemat D1 miał **kompletnie inną strukturę** niż oczekiwał frontend:
   - `posts` używały `slug` / `author` (tekst) / `published` / `views` — frontend oczekiwał `id` / `author_id` (FK) / `view_count` / `like_count`
   - `users` nie miały `password_hash`, `role`, `skills`, `location`, `dashboard_sections`
   - Brakowało tabel: `categories`, `post_likes`, `listings`, `community_news`

2. Trzy krytyczne pliki backendowe **nie istniały** (importowane w `index.ts`, ale nigdy utworzone):
   - `middleware/auth.ts`
   - `routes/webhooks.ts`
   - `db/client.ts`

3. Stary backend miał tylko 2 pliki routów: `posts.ts` (slug-based) i `crawlers.ts`.

## Co zrobiliśmy

### Faza 1: Analiza frontend → backend gap

- Przeczytano **cały** `Community.jsx` (~1600 linii) i zmapowano WSZYSTKIE endpointy API
- Porównano z istniejącym schematem i routami
- Zidentyfikowano 100% niezgodności

### Faza 2: Nowy schemat D1

**Plik:** `_extra/stock/schema.sql`  
**10 tabel:**

| Tabela | Opis |
|--------|------|
| `users` | Z `password_hash`, `role`, `skills`, `location`, `dashboard_sections`, `totp_enabled/secret` |
| `categories` | 5 kategorii (Ogólne, AI&ML, Web Dev, DevOps, Projekty) |
| `posts` | Z `author_id` (FK), `category_id`, `view_count`, `like_count`, `comment_count`, `is_pinned` |
| `comments` | Z `author_id` (FK) |
| `post_likes` | Unique(post_id, user_id) — toggle |
| `listings` | Marketplace (oferuję/szukam) |
| `community_news` | Gazetka (news/video/fact/update/rules) |
| `crawler_visits` | AI bot tracking |
| `global_stats` | Globalne statystyki |
| `webhooks` | Inter-app webhooks |

### Faza 3: Nowe pliki backendowe

Wszystkie pliki w `_extra/api/`:

| Plik | Opis |
|------|------|
| `db/client.ts` | Helper D1 |
| `middleware/auth.ts` | PBKDF2 hash + JWT (HMAC-SHA256, 7 dni) + Hono middleware |
| `routes/auth.ts` | `POST /api/login`, `/api/register`, `/api/user/profile`, `/api/user/change-password`, `GET /api/users/:username/dashboard` |
| `routes/posts.ts` | CRUD + like toggle + komentarze + paginacja + search + filtr kategorii |
| `routes/comments.ts` | `DELETE /api/comments/:id` |
| `routes/categories.ts` | `GET /api/categories` |
| `routes/listings.ts` | CRUD marketplace |
| `routes/news.ts` | `GET /api/community-news` |
| `routes/upload.ts` | Upload obrazów do R2 (max 2MB) |
| `routes/webhooks.ts` | Receive + list |
| `routes/crawlers.ts` | Naprawiony (stare kolumny slug/excerpt → id/content) |
| `index.ts` | Zaktualizowany — montuje wszystkie 9 modułów routów |

### Faza 4: Konfiguracja

**`wrangler.toml` — zmiany:**
- `name` → `jimbo77-community` (zgodne z URL frontendu)
- `main` → `index.ts` (było `api/index.ts` — błędne)
- `database_id` → `7cd9d679-006f-4d12-a003-b1fe8ba921be`
- R2 bucket → `jimbo77-community-images` (istniejący)
- Usunięto `JWT_SECRET` z `[vars]` (przeniesiony do Cloudflare Secrets)
- Usunięto `[[routes]]` z wildcard (Custom Domains nie wspierają `*`)

### Faza 5: Deployment

Wykonano w kolejności:

```bash
# 1. Utworzono bazę D1
wrangler d1 create jimbo77-social-db
# → ID: 7cd9d679-006f-4d12-a003-b1fe8ba921be, region EEUR

# 2. Zaaplikowano schemat (35 queries, 74 rows written)
wrangler d1 execute jimbo77-social-db --file=schema.sql --remote

# 3. Ustawiono JWT secret
echo $secret | wrangler secret put JWT_SECRET

# 4. Zainstalowano zależności
npm install  # hono, wrangler, @cloudflare/workers-types

# 5. Deploy
wrangler deploy
# → https://jimbo77-community.stolarnia-ams.workers.dev
# → Version: 54dc3e3c-874a-43bb-b6b5-3ce1e363c093
```

### Faza 6: Testy

| Endpoint | Metoda | Wynik |
|----------|--------|-------|
| `/health` | GET | `status: ok` |
| `/api/categories` | GET | 5 kategorii |
| `/api/register` | POST | "Rejestracja udana!" |
| `/api/login` | POST | JWT token + user object |
| `/api/posts` | POST (auth) | Post utworzony (id: 1) |
| `/api/posts` | GET | Lista z author_name, category_name |
| `/api/community-news` | GET | Zasady community |

---

## Auth — jak działa

1. **Hasło:** PBKDF2-SHA256, 100k iteracji, 16-byte random salt
2. **Token:** JWT HMAC-SHA256, expiry 7 dni
3. **Format stored:** `salt:hash` (oba hex-encoded)
4. **Middleware:** `authMiddleware()` → checkuje `Authorization: Bearer <token>`, ustawia `c.set('userId', ...)` i `c.set('userRole', ...)`
5. **Secret:** `JWT_SECRET` jest Cloudflare Secret (nie plaintext w vars)

## Ważne informacje

- **Worker URL:** `https://jimbo77-community.stolarnia-ams.workers.dev` — **ten sam co w frontendzie** (zero zmian w React)
- **D1 ID:** `7cd9d679-006f-4d12-a003-b1fe8ba921be`
- **R2 bucket:** `jimbo77-community-images`
- **Region D1:** EEUR (Europa Wschodnia)
- **Testowy user:** `testuser` / `test@jimbo77.org` / `Test1234!`
- **AdminPanel** (`/api/panel/*`) — używa **osobnego workera**, nie jest dotknięty tymi zmianami
- **package.json** utworzony w `_extra/api/` (wcześniej nie istniał)

## Pliki które NIE zostały zmienione

- `src/pages/Community.jsx` — frontend nie wymagał zmian, bo backend został dopasowany do niego
- `src/pages/AdminPanel.jsx` — osobny worker `/api/panel/*`
- `src/components/*` — żadne zmiany

## Znany problem z screena

Login `lissonkarol.msa@gmail.com` daje "Nieprawidłowy e-mail lub hasło" — **bo to stare konto z poprzedniej bazy**. Nowa baza D1 jest czysta. Trzeba się **zarejestrować od nowa** przez formularz rejestracji w Community Hub.
