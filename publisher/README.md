# JIMBO77 Publisher — MOA v2 (Mixture of Agents)

Automatyczny system generowania i publikowania artykułów na **jimbo77.org**.
Pisze jako **Jimbo** — prosto, z humorem, po polsku. 1 artykuł dziennie.

## Architektura

```
publisher/
├── LAUNCH_PUBLISHER.bat       # Windows launcher (.bat)
├── LAUNCH_PUBLISHER.ps1       # PowerShell launcher
├── publisher_workflow.py      # Pipeline: Category → Research → SEO → Write → Image → Deploy
├── base_agent.py              # FastAPI agent framework
├── moa_engine.py              # MOA v2: DeepSeek + Gemma 3 + Phi-4
├── image_generator.py         # Replicate FLUX image generation
├── requirements.txt           # Python deps
├── .env.example               # API keys template
└── agents/
    ├── writer_agent.py        # Port 6030 — Jimbo voice content (MOA)
    ├── seo_agent.py           # Port 6031 — SEO + GEO (AI crawler bait)
    └── research_agent.py      # Port 6062 — trend research
```

## Modele AI

| Provider | Model | Rola | Koszt |
|----------|-------|------|-------|
| OpenRouter | DeepSeek V3 | Główny pisarz | ~$0.001/post |
| Cloudflare | Gemma 3 12B | Drugi głos | Free |
| Cloudflare | Phi-4 | Trzeci głos + research | Free |
| OpenAI | GPT-4o | Synteza (opcjonalnie) | ~$0.02/post |
| Replicate | FLUX Schnell | Obrazki hero | ~$0.003/img |

## Content Categories (5 × 20%)

| # | Kategoria | Opis |
|---|-----------|------|
| 1 | AI News | Co nowego w świecie AI |
| 2 | AI Odkrycia | Do czego AI się przysłużyła |
| 3 | AI Nowości | Nowe modele, narzędzia, frameworki |
| 4 | AI Zastosowania | Praktyczna przydatność, real-world |
| 5 | AI Moje Projekty | Co Jimbo buduje i testuje |

Kategorie rotują wg dnia roku (dzień % 5).

## Setup

```bash
cd publisher
copy .env.example .env          # uzupełnij klucze API
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Użycie

### 1. Start agentów
```bash
LAUNCH_PUBLISHER.bat            # lub: .\LAUNCH_PUBLISHER.ps1
```

### 2. Generuj artykuł
```bash
# Codzienny auto-publish (rotacja kategorii):
python publisher_workflow.py --daily --deploy

# Wymuś kategorię:
python publisher_workflow.py --daily --category "AI Odkrycia" --deploy

# Bezpośredni temat:
python publisher_workflow.py --topic "Mój nowy projekt z Cloudflare" --deploy

# Bez deploy (przegląd):
python publisher_workflow.py --daily
```

### 3. Po wygenerowaniu
1. Plik `.md` → `public/blog-content/{slug}.md`
2. Wyświetla snippet → wklejasz do `src/data/blogPosts.js`
3. Z `--deploy`: auto git push → Vercel redeploy

## Styl Jimbo

- Polska, codzienna polszczyzna
- Pierwsza osoba ("sprawdziłem", "testuję")
- Humor, anegdotki, porównania
- Zero [1][2][3] — żadnych citation markers
- Zero korporacyjnego żargonu
- 800-1200 słów na artykuł

## Agent Ports

| Agent | Port | Role |
|-------|------|------|
| Writer | 6030 | Content (MOA: DeepSeek + Gemma + Phi) |
| SEO | 6031 | Keywords, meta, GEO hooks |
| Research | 6062 | Trend research, context |
