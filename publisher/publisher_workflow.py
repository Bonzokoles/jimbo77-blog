"""
Publisher Workflow v3 — JIMBO77 Blog
Full pipeline: Pick Category → Research (MOA) → Write (MOA) → Image → Save → Deploy

Content categories (20% each, rotated daily):
  1. AI News          — co nowego w świecie AI
  2. AI Odkrycia      — do czego AI się przysłużyła
  3. AI Nowości       — nowe modele, narzędzia, frameworki
  4. AI Zastosowania  — praktyczna przydatność, real-world use
  5. AI Moje Projekty — co Jimbo robi, buduje, testuje

Writing style: Jimbo's voice — prosto, z humorem, 1 osoba, po polsku.
1 artykuł dziennie. Includes AI crawler bait (SEO hooks for GPTBot etc).

Pipeline: MOA Engine (Perplexity→DeepSeek+Gemma 27B+Llama 70B→GPT-5-nano)
No external agents needed — everything runs in-process.

Blog structure:
  - Content:  public/blog-content/{slug}.md
  - Metadata: src/data/blogPosts.js (auto-updated)
  - Images:   public/blog-images/{slug}-hero.webp
  - Deploy:   git push → Vercel auto-build
"""

import asyncio
import aiohttp
import argparse
import os
import re
import subprocess
import json
import random
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

from moa_engine import MOAEngine
from image_generator import generate_hero_image

# ── Paths ──────────────────────────────────────────────────────────────
BLOG_REPO_DIR = Path(__file__).resolve().parent.parent
BLOG_CONTENT_DIR = BLOG_REPO_DIR / "public" / "blog-content"
BLOG_IMAGES_DIR = BLOG_REPO_DIR / "public" / "blog-images"
BLOG_POSTS_JS = BLOG_REPO_DIR / "src" / "data" / "blogPosts.js"

ASSET_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev/blog-images"

# ── MOA Engine (initialized once) ─────────────────────────────────────
moa = MOAEngine(
    {
        "OPENROUTER_API_KEY": os.getenv("OPENROUTER_API_KEY", ""),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", ""),
    }
)

# ── 5 Content Categories (20% each) ───────────────────────────────────
CATEGORIES = [
    {
        "name": "AI News",
        "query": "najnowsze wiadomości ze świata sztucznej inteligencji, nowe ogłoszenia firm AI, przełomy",
        "tags": ["AI News", "Aktualności", "AI"],
        "prompt_hint": "Napisz o najnowszej wiadomości/wydarzeniu w AI. Co się stało, dlaczego to ważne, co to oznacza dla zwykłego człowieka.",
    },
    {
        "name": "AI Odkrycia",
        "query": "odkrycia naukowe dzięki AI, zastosowania AI w medycynie nauce badaniach, przełomy badawcze",
        "tags": ["AI Odkrycia", "Nauka", "Badania"],
        "prompt_hint": "Opisz konkretne odkrycie dokonane dzięki AI. W jakiej dziedzinie, jak AI pomogła, co z tego wynikło dla ludzkości.",
    },
    {
        "name": "AI Nowości",
        "query": "nowe modele AI narzędzia frameworki, nowe wydania open source AI, najnowsze LLM",
        "tags": ["AI Nowości", "Narzędzia", "Open Source"],
        "prompt_hint": "Przedstaw nowe narzędzie/model/framework AI. Co robi, dlaczego warto, jak zacząć go używać. Podaj konkretne przykłady.",
    },
    {
        "name": "AI Zastosowania",
        "query": "praktyczne zastosowania AI w biznesie życiu codziennym, jak AI pomaga w pracy, AI use cases",
        "tags": ["AI Zastosowania", "Praktyka", "Biznes"],
        "prompt_hint": "Pokaż konkretny sposób w jaki AI jest używana w praktyce. Kto, jak, jakie efekty. Podaj realne przykłady, nie teoretyczne.",
    },
    {
        "name": "AI Moje Projekty",
        "query": "projekty Jimbo77, budowanie narzędzi AI, automatyzacja z AI, moje doświadczenia programistyczne",
        "tags": ["Moje Projekty", "Jimbo", "Dev"],
        "prompt_hint": "Opisz z perspektywy Jimbo projekt/eksperyment który realizujesz. Co budujesz, jakie problemy napotkałeś, co się nauczyłeś. Bądź szczery i osobisty.",
    },
]

# ── Jimbo's Writing Style Prompt (global) ──────────────────────────────
JIMBO_STYLE = """
STYL JIMBO (BEZWZGLĘDNIE OBOWIĄZKOWY):
- Pisze Jimbo — 48-letni polski bloger technologiczny, programista z doświadczeniem.
- Pisz po polsku, prosto i zrozumiale. Ton: rzeczowy, konkretny, ale przystępny.
- Pisz w pierwszej osobie: "sprawdziłem", "przetestowałem", "uważam że", "z mojego doświadczenia"
- Minimum ciężkich terminów technicznych. Jak musisz — wyjaśnij po ludzku w jednym zdaniu.
- Styl: dojrzały, merytoryczny, bez infantylnych porównań. Można użyć lekkiego humoru, ale NIE:
  * żadnych porównań do piwa, alkoholu, barów, imprez
  * żadnych "hej stary", "kumple", "ziomki"
  * żadnych porównań do zwierząt ("pamięć słonia", "karzeł na szczudłach")
  * żadnych wymyślonych anegdotek ("wrzuciłem zdjęcie z imprezy")
- ABSOLUTNIE ZAKAZANE:
  * Odnośniki w nawiasach kwadratowych [1], [2], [3] — to zdradza AI
  * "W dzisiejszym dynamicznym świecie..." — banał
  * "Podsumowując powyższe..." — nudne
  * Zaczynanie od "Sztuczna inteligencja rewolucjonizuje..." — szablonowe
  * Język urzędowy, naukowy, korporacyjny
  * Wymyślone scenariusze i anegdotki — pisz TYLKO o tym co naprawdę sprawdzałeś/testowałeś
- Naturalny, ludzki ton ale z klasą. Pisz jak dorosły człowiek do dorosłego człowieka.
- Na końcu sekcja "## Co z tego wynika?" (nie "Podsumowanie")
- 800-1200 słów
"""

# ── AI Crawler Bait (GEO / SEO) ───────────────────────────────────────
CRAWLER_BAIT_SECTIONS = [
    "\n\n<!-- llms-section: faq -->\n## Często zadawane pytania\n",
    "\n\n## Dla kogo to jest?\n",
    "\n\n## Jak zacząć?\n",
    "\n\n## Dlaczego to ma znaczenie?\n",
]


# ── Helpers ────────────────────────────────────────────────────────────


async def quick_llm(prompt: str, max_tokens: int = 500) -> str:
    """Quick single LLM call via OpenRouter (for title/SEO, not full articles)."""
    key = os.getenv("OPENROUTER_API_KEY", "")
    if not key:
        return "Error: OPENROUTER_API_KEY missing"

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://jimbo77.org",
    }
    data = {
        "model": "deepseek/deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": max_tokens,
    }
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url, headers=headers, json=data, timeout=aiohttp.ClientTimeout(total=60)
            ) as resp:
                if resp.status != 200:
                    return f"Error: {await resp.text()}"
                body = await resp.json()
                return body["choices"][0]["message"]["content"].strip()
        except Exception as e:
            return f"Error: {e}"


def slugify(text: str, max_len: int = 60) -> str:
    text = text.lower().strip()
    pl_map = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")
    text = text.translate(pl_map)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:max_len].rstrip("-")


def month_label_pl() -> str:
    months_pl = {
        1: "Styczeń",
        2: "Luty",
        3: "Marzec",
        4: "Kwiecień",
        5: "Maj",
        6: "Czerwiec",
        7: "Lipiec",
        8: "Sierpień",
        9: "Wrzesień",
        10: "Październik",
        11: "Listopad",
        12: "Grudzień",
    }
    now = datetime.now()
    return f"{months_pl[now.month]} {now.year}"


def pick_daily_category() -> dict:
    """Rotate categories by day-of-year so each gets ~20%."""
    day = datetime.now().timetuple().tm_yday
    idx = day % len(CATEGORIES)
    return CATEGORIES[idx]


def clean_ai_artifacts(text: str) -> str:
    """Remove AI-like artifacts from generated text."""
    # Citation markers [1], [2], [12]
    text = re.sub(r"\[\d+(?:,\s*\d+)*\]", "", text)
    # Markdown code fences wrapping the whole article
    text = text.replace("```markdown", "").replace("```", "").strip()
    # Remove leading "# Title" if present (we add our own)
    lines = text.split("\n")
    if lines and lines[0].startswith("# "):
        text = "\n".join(lines[1:]).strip()
    # Remove frontmatter if present
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2].strip()
    return text


def add_jimbo_footer(content: str) -> str:
    """Add Jimbo's personal signature with contact info under every article."""
    footer = """

---

**Masz pytania? Chcesz pogadać o AI, technologii albo po prostu rzucić pomysłem?** Pisz śmiało — lubię dostawać wiadomości od ludzi, którzy faktycznie czytają to co piszę (a nie tylko botów 😉). Najszybciej złapiesz mnie przez stronę kontaktową lub social media.

🔗 **[jimbo77.com](https://www.jimbo77.com)** — mój główny hub, projekty, kontakt  
🔗 **[mybonzo.com](https://www.mybonzo.com)** — więcej moich rzeczy, AI narzędzia, blog techniczny

Do następnego! ✌️  
*— Jimbo*
"""
    return content + footer


def add_crawler_bait(content: str, title: str, category: str) -> str:
    """Add SEO/GEO hooks for AI crawlers at the end of article."""
    bait = f"""

<!-- article-metadata
title: {title}
category: {category}
language: pl
author: Jimbo
site: jimbo77.org
-->

> **TL;DR dla botów:** Ten artykuł opisuje {title.lower()}. Kategoria: {category}. Autor: Jimbo z jimbo77.org. Język: polski. Przeczytaj pełną treść powyżej.

"""
    return content + bait


# ── Main Pipeline ──────────────────────────────────────────────────────


async def daily_publish(auto_deploy: bool = False, category_override: str = None):
    """Daily pipeline: auto-pick category → research+write (MOA) → image → save → deploy"""

    if category_override:
        cat = next(
            (c for c in CATEGORIES if c["name"].lower() == category_override.lower()),
            None,
        )
        if not cat:
            print(f"❌ Nieznana kategoria: {category_override}")
            print(f"   Dostępne: {', '.join(c['name'] for c in CATEGORIES)}")
            return
    else:
        cat = pick_daily_category()

    print(f"\n{'='*60}")
    print(f"  JIMBO77 DAILY PUBLISHER — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Kategoria dnia: {cat['name']}")
    print(f"  Pipeline: Perplexity→DeepSeek+Gemma+Llama→GPT-5-nano")
    print(f"{'='*60}\n")

    # 1. Pick topic (quick LLM call)
    print("🎯 [1/4] Wybieram temat dnia...")
    title = await quick_llm(
        f"""Jesteś Jimbo — polski bloger o AI. Zaproponuj JEDEN chwytliwy tytuł artykułu.
Kategoria: {cat['name']}
Wytyczna: {cat['prompt_hint']}
Szukaj świeżych tematów z marca 2026.

Zwróć TYLKO tytuł — jedno zdanie po polsku, bez cudzysłowów, bez numeracji.""",
        max_tokens=100,
    )
    if "Error" in title:
        print(f"❌ Title generation failed: {title}")
        return

    # Clean title artifacts
    title = (
        title.replace('"', "")
        .replace("Title:", "")
        .replace("**", "")
        .replace("#", "")
        .replace("•", "")
        .strip()
        .split("\n")[0]
        .strip()
    )
    print(f"   🏆 Temat: {title}")

    # 2. Write full article via MOA (includes Perplexity research internally)
    print("✍️  [2/4] MOA Engine pisze artykuł (Perplexity→3 writerów→synteza)...")
    final_prompt = f"""Tytuł: {title}
Kategoria: {cat['name']}
{cat['prompt_hint']}

{JIMBO_STYLE}
"""
    content = await moa.generate_response(final_prompt, task_type="content")

    if not content or len(content.split()) < 100:
        print(
            f"❌ Article too short or empty ({len(content.split()) if content else 0} words)"
        )
        return

    # Post-processing
    content = clean_ai_artifacts(content)
    content = add_jimbo_footer(content)
    content = add_crawler_bait(content, title, cat["name"])

    word_count = len(content.split())
    print(f"   ✅ Artykuł gotowy: {word_count} słów")

    # 3. Generate hero image
    print("🖼️  [3/4] Generowanie obrazka...")
    image_name = None
    try:
        image_name = await generate_hero_image(
            title, cat["name"], output_dir=str(BLOG_IMAGES_DIR)
        )
        if image_name:
            print(f"   ✅ Obrazek: {image_name}")
    except Exception as e:
        print(f"   ⚠️ Image failed (continuing): {e}")

    # 4. Save + deploy
    print("💾 [4/4] Zapisuję i deploying...")
    slug = slugify(title)
    filepath = save_post(slug, title, content, cat["name"], cat["tags"], image_name)

    if filepath and auto_deploy:
        deploy_to_git(filepath, slug, image_name)

    print(f"\n✅ DAILY PUBLISH DONE — {cat['name']}: {title}")
    print(
        f"   📊 {word_count} słów | 🖼️ {'tak' if image_name else 'brak'} | {'🚀 deployed' if auto_deploy else '💾 saved locally'}"
    )


async def generate_post(
    prompt: str,
    title: str,
    category: str = "AI",
    style: str = "jimbo",
    auto_deploy: bool = False,
    tech_tags: list = None,
    image_name: str = None,
):
    """MOA Engine → clean → add bait → save .md → optionally deploy"""
    print(f"\n🚀 Generating: '{title}'")

    # Full MOA pipeline (includes Perplexity research + 3 writers + synthesis)
    content = await moa.generate_response(prompt, task_type="content")

    if not content or len(content.split()) < 100:
        print(
            f"❌ Write failed: article too short ({len(content.split()) if content else 0} words)"
        )
        return

    # Post-processing
    content = clean_ai_artifacts(content)
    content = add_jimbo_footer(content)
    content = add_crawler_bait(content, title, category)

    # Generate image (if API keys configured)
    generated_image = None
    try:
        generated_image = await generate_hero_image(
            title, category, output_dir=str(BLOG_IMAGES_DIR)
        )
        if generated_image:
            print(f"🖼️  Image: {generated_image}")
            image_name = generated_image
    except Exception as e:
        print(f"⚠️ Image generation skipped: {e}")

    print("✅ Content ready!")
    slug = slugify(title)
    filepath = save_post(slug, title, content, category, tech_tags, image_name)

    if filepath and auto_deploy:
        deploy_to_git(filepath, slug)


# ── Save ───────────────────────────────────────────────────────────────


def save_post(slug, title, content, category="AI", tech_tags=None, image_name=None):
    BLOG_CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    BLOG_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    filepath = BLOG_CONTENT_DIR / f"{slug}.md"

    try:
        filepath.write_text(content, encoding="utf-8")
        print(f"💾 Saved: {filepath}")
    except Exception as e:
        print(f"❌ Save failed: {e}")
        return None

    # Auto-update blogPosts.js
    tags = tech_tags or ["AI", "Tech"]
    # Use local path pattern (like other recent posts)
    img_ref = (
        f"'/blog-images/{image_name}'"
        if image_name
        else "'/blog-images/scifi_default.jpg'"
    )
    date_label = month_label_pl()
    sort_date = datetime.now().strftime("%Y-%m-%d")
    read_time = max(5, len(content.split()) // 200)

    # Generate short description from first paragraph
    paragraphs = [
        p.strip()
        for p in content.split("\n\n")
        if p.strip() and not p.startswith("#") and not p.startswith("<!--")
    ]
    description = paragraphs[0][:150].rstrip(".") + "..." if paragraphs else title
    # Escape double quotes in description for JS
    description = description.replace('"', '\\"')

    new_entry = f"""    {{
        id: "{slug}",
        title: "{title[:80].replace('"', '\\\\"')}",
        slug: "{slug}",
        subtitle: "",
        date: "{date_label}",
        sortDate: "{sort_date}",
        category: "{category}",
        image: {img_ref},
        tech: {json.dumps(tags[:4], ensure_ascii=False)},
        description: "{description[:120]}",
        readTime: {read_time},
        author: "Jimbo",
        featured: true
    }}"""

    try:
        if BLOG_POSTS_JS.exists():
            js_content = BLOG_POSTS_JS.read_text(encoding="utf-8")
            # Check if slug already exists
            if f'"{slug}"' not in js_content:
                # PREPEND: insert as first element after "export const blogPosts = ["
                insert_marker = js_content.find("export const blogPosts = [")
                if insert_marker >= 0:
                    bracket_pos = js_content.index("[", insert_marker)
                    updated = (
                        js_content[: bracket_pos + 1]
                        + f"\n{new_entry},\n"
                        + js_content[bracket_pos + 1 :]
                    )
                    BLOG_POSTS_JS.write_text(updated, encoding="utf-8")
                    print(f"📝 blogPosts.js updated (prepended) with '{slug}'")
                else:
                    print(
                        f"⚠️ Couldn't find 'export const blogPosts' in blogPosts.js — add manually:"
                    )
                    print(new_entry)
            else:
                print(f"⚠️ '{slug}' already exists in blogPosts.js — skipping")
        else:
            print(f"⚠️ {BLOG_POSTS_JS} not found — add entry manually:")
            print(new_entry)
    except Exception as e:
        print(f"⚠️ blogPosts.js auto-update failed: {e}")
        print(f"   Add manually:\n{new_entry}")

    return filepath


# ── Deploy ─────────────────────────────────────────────────────────────


def deploy_to_git(filepath, slug="", image_name=None):
    repo = str(BLOG_REPO_DIR)
    if not (BLOG_REPO_DIR / ".git").exists():
        print("⚠️ Not a git repo. Skipping deploy.")
        return
    try:
        # Stage: article markdown
        subprocess.run(
            ["git", "add", str(filepath)], cwd=repo, check=True, capture_output=True
        )
        # Stage: blogPosts.js (auto-updated)
        subprocess.run(
            ["git", "add", str(BLOG_POSTS_JS)],
            cwd=repo,
            check=True,
            capture_output=True,
        )
        # Stage: hero image if exists
        if image_name:
            img_path = BLOG_IMAGES_DIR / image_name
            if img_path.exists():
                subprocess.run(
                    ["git", "add", str(img_path)],
                    cwd=repo,
                    check=True,
                    capture_output=True,
                )
        msg = f"content: {slug} (Jimbo Publisher MOA)"
        subprocess.run(
            ["git", "commit", "-m", msg], cwd=repo, check=True, capture_output=True
        )
        subprocess.run(["git", "push"], cwd=repo, check=True, capture_output=True)
        print(f"🚀 Deployed: {slug} → Vercel auto-build")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git error: {e}")


# ── CLI ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="JIMBO77 Daily Publisher (MOA Powered)"
    )
    parser.add_argument(
        "--daily", action="store_true", help="Auto-pick category and publish (1/day)"
    )
    parser.add_argument(
        "--category",
        type=str,
        help="Force specific category: 'AI News', 'AI Odkrycia', 'AI Nowości', 'AI Zastosowania', 'AI Moje Projekty'",
    )
    parser.add_argument("--topic", type=str, help="Direct write on a specific topic")
    parser.add_argument(
        "--style", type=str, default="jimbo", help="Writing style (default: jimbo)"
    )
    parser.add_argument(
        "--deploy", action="store_true", help="Auto git push → Vercel deploy"
    )
    parser.add_argument("--tags", type=str, nargs="+", help="Tech tags")

    args = parser.parse_args()

    if args.daily:
        asyncio.run(
            daily_publish(auto_deploy=args.deploy, category_override=args.category)
        )
    elif args.topic:
        asyncio.run(
            generate_post(
                prompt=f"Tytuł: {args.topic}\nKategoria: {args.category or 'AI'}\n\n{JIMBO_STYLE}",
                title=args.topic,
                category=args.category or "AI",
                style=args.style,
                auto_deploy=args.deploy,
                tech_tags=args.tags,
            )
        )
    else:
        parser.print_help()
        print(
            f"""
📌 Przykłady:

  # Codzienny auto-publish (rotacja kategorii + deploy):
  python publisher_workflow.py --daily --deploy

  # Wymuś kategorię:
  python publisher_workflow.py --daily --category "AI Odkrycia" --deploy

  # Bezpośredni temat (bez deploy):
  python publisher_workflow.py --topic "Mój nowy projekt z Cloudflare Workers"

  # Bezpośredni temat + deploy:
  python publisher_workflow.py --topic "Gemma 3 vs Llama 3.3" --deploy

📊 Pipeline: Perplexity→DeepSeek+Gemma+Llama→GPT-5-nano
📊 Kategorie ({len(CATEGORIES)} × 20%):
"""
        )
        for i, c in enumerate(CATEGORIES, 1):
            print(f"  {i}. {c['name']} — {c['tags']}")
