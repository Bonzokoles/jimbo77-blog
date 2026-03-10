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

## Backlog
- localStorage dla stanu sidebarów
- Paginacja marketplace
- User auth flow
- SEO meta/Open Graph
- Blog posts z OneLink