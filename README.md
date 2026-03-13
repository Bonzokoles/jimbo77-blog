<p align="center">
  <img src="https://raw.githubusercontent.com/Bonzokoles/jimbo77-blog/main/public/jimbo77-logo.svg" alt="JIMBO77 Logo" width="120" />
</p>

<h1 align="center">JIMBO77 — AI Social Club</h1>

<p align="center">
  <strong>Polski hub technologiczny dla developerów, AI entuzjastów i kreatorów.</strong><br/>
  Community-driven blog & knowledge portal z autorską, dark-tech tożsamością wizualną.
</p>

<p align="center">
  <a href="https://jimbo77.org">jimbo77.org</a> · 
  <a href="https://github.com/Bonzokoles/jimbo77-blog">GitHub</a> · 
  <a href="https://jimbo77.org/community">Community Hub</a>
</p>

---

## O projekcie

**JIMBO77** to polski portal technologiczny łączący blog wiedzy, forum społeczności i narzędzia AI w jednym miejscu. Projekt został zbudowany od zera jako SPA z autorską, dark-tech estetyką — ciemny motyw, glassmorphism, neonowe akcenty — i jest hostowany na edge dzięki Cloudflare Pages.

Portal jest skierowany do polskich developerów i twórców zainteresowanych sztuczną inteligencją, web developmentem, DevOps i automatyzacją. Cała treść jest po polsku, kod i identyfikatory techniczne po angielsku.

## Funkcjonalności

### Blog & Knowledge Hub
- Artykuły techniczne renderowane z Markdown (GFM, syntax highlighting)
- System kategorii: Neural Networks, Python Core, React Frontend, DevOps/CI, Security
- 3-kolumnowy community grid layout inspirowany dev.to
- Nerve Center — lewy sidebar z nawigacją i szybkimi linkami
- Table of Contents generowany automatycznie z nagłówków

### Community Hub
- Forum społeczności z postami, komentarzami i reakcjami
- System rejestracji i logowania (Cloudflare Workers backend)
- Real-time Shoutbox
- Marketplace (ogłoszenia: szukam / oferuję)
- Filtrowanie postów: Ogólne, AI & ML, Web Dev, DevOps, Projekty
- Gazetka i Quick Links w sidebarach

### AI & Narzędzia
- AI Image Generator (Replicate API)
- Terminal Chat — konwersacyjny interfejs AI
- Knowledge Graph — interaktywna wizualizacja powiązań (XYFlow/React Flow)
- Tools — rekomendowane narzędzia deweloperskie

### SEO & Discoverability
- Generative Engine Optimization (`llms.txt` dla crawlerów AI)
- Schema.org markup (JSON-LD)
- Komponent SEO z Open Graph i meta tagami
- Zoptymalizowany `robots.txt`

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| **Framework** | React 18 + React Router 6 |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 3 + custom glassmorphism |
| **Animacje** | Framer Motion |
| **Markdown** | react-markdown + remark-gfm + rehype-highlight |
| **Grafy** | @xyflow/react (React Flow) |
| **UI Kit** | HeroUI |
| **AI** | Replicate API |
| **Storage** | Cloudflare R2 (dynamiczne assety) |
| **Hosting** | Cloudflare Pages (auto-deploy z GitHub) |
| **Domena** | jimbo77.org |
| **Testy** | Vitest + Testing Library |
| **Node** | >= 22.12.0 |

## Architektura

```
jimbo77-blog/
├── public/                    # Static assets, llms.txt, blog-content/
├── publisher/                 # Narzędzia do publikacji treści
├── scripts/                   # Skrypty pomocnicze
├── templates/                 # Szablony artykułów
├── src/
│   ├── api/                   # Client-side API integrations
│   ├── components/
│   │   ├── Background.jsx     # Animated dark-tech background
│   │   ├── BlogHub.jsx        # 3-column community grid
│   │   ├── BlogCard.jsx       # Article preview cards
│   │   ├── KnowledgeGraph.jsx # Interactive node graph
│   │   ├── Navbar.jsx         # Main navigation (desktop + mobile)
│   │   ├── Sidebars.jsx       # Nerve Center + Community panel
│   │   ├── SEO.jsx            # Meta tags, OG, structured data
│   │   ├── SchemaOrg.jsx      # JSON-LD schema
│   │   ├── TerminalChat.jsx   # AI chat interface
│   │   └── blog/              # Blog-specific sub-components
│   ├── data/                  # Static data, blog metadata
│   ├── hooks/                 # Custom React hooks
│   ├── layouts/               # Page layout wrappers
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── BlogPost.jsx       # Single article view
│   │   ├── Community.jsx      # Community forum
│   │   ├── Core.jsx           # Knowledge base
│   │   ├── Gallery.jsx        # AI-generated image gallery
│   │   ├── Graph.jsx          # Knowledge graph visualization
│   │   ├── Logs.jsx           # System/dev logs
│   │   ├── Tools.jsx          # Recommended dev tools
│   │   └── AdminPanel.jsx     # Content management
│   ├── styles/                # CSS modules, animations
│   ├── tests/                 # Vitest test suites
│   ├── App.jsx                # Root router
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Szybki start

```bash
# Klonuj repozytorium
git clone https://github.com/Bonzokoles/jimbo77-blog.git
cd jimbo77-blog

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
# → http://localhost:5173

# Zbuduj wersję produkcyjną
npm run build
# → dist/
```

## Deploy

Projekt jest automatycznie deployowany na **Cloudflare Pages** przy każdym pushu do `main`:

1. Push do `main` → Cloudflare automatycznie uruchamia build
2. `npm run build` → folder `dist/`
3. Preview URL dla pull requestów
4. Custom domena: **jimbo77.org**

```
Build command:    npm run build
Output directory: dist
Framework preset: Vite
Node version:     22.x
```

## Design System

Portal wykorzystuje unikalny styl **Dark-Tech Elite**:

- **Tło**: Animowane cząsteczki + gradienty (Background.jsx)
- **Glass**: `backdrop-blur-xl` + `bg-black/40` — glassmorphism na sidebarach i kartach
- **Kolory**: Cyan (`#00ffff`) accent, purple/pink gradienty, `slate-800/900` bazy
- **Typografia**: Kenyan Coffee (nagłówki), SF TransRobotics (dane), system font stack (body)
- **Borders**: `border-white/5` strukturalne, `border-red-500/20` lub `border-cyan-500/30` akcentowe
- **Hover**: Neonowy glow (`shadow-[0_0_15px_cyan]`) na elementach interaktywnych

## Powiązane projekty

| Projekt | Opis | URL |
|---|---|---|
| **ZENON Biznes HUB** | Platforma ERP/CRM dla polskich MŚP z AI Doradcą | [mybonzo.com](https://mybonzo.com) |
| **MyBonzoAI Blog** | Blog techniczny Astro SSR + Cloudflare | [mybonzoai.com](https://mybonzoai.com) |

---

<p align="center">
  Zbudowane w Polsce z React, Vite i dużą ilością kawy.<br/>
  <sub>JIMBO77 AI Social Club &copy; 2025-2026</sub>
</p>
