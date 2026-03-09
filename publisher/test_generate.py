"""
TEST GENERATE — 3 przykładowe artykuły + po 3 obrazki
Standalone: bez agentów FastAPI, bezpośrednio MOA + Replicate.

Uruchomienie:
  cd publisher
  python test_generate.py
"""

import asyncio
import os
import re
import json
import random
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

from moa_engine import MOAEngine
from image_generator import (
    generate_hero_image,
    MODELS,
    DEFAULT_STYLE,
    CATEGORY_VISUAL_HINTS,
)

# ── Config ─────────────────────────────────────────────────────────────
OUTPUT_DIR = Path(__file__).resolve().parent / "test_output"
OUTPUT_DIR.mkdir(exist_ok=True)

moa = MOAEngine(
    {
        "OPENROUTER_API_KEY": os.getenv("OPENROUTER_API_KEY", ""),
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", ""),
    }
)

# ── 3 Test Articles ───────────────────────────────────────────────────
TEST_ARTICLES = [
    {
        "title": "Google Gemma 3 — darmowy model który zaskakuje",
        "category": "AI Nowości",
        "prompt": """Tytuł: Google Gemma 3 — darmowy model który zaskakuje
Kategoria: AI Nowości

Napisz artykuł o modelu Gemma 3 od Google. Dlaczego jest wart uwagi, co potrafi,
jak wypada na tle konkurencji (Llama, Phi). Wspomnij że działa za darmo na OpenRouter.
Podaj praktyczne przykłady użycia.

STYL JIMBO:
- Pisz po polsku, prosto i zrozumiale. Ton: rzeczowy, dojrzały, konkretny.
- Pierwsza osoba ("przetestowałem", "sprawdziłem", "moim zdaniem")
- ZERO infantylnych porównań (piwo, bary, imprezy, zwierzęta)
- ZERO "hej stary", "kumple" — pisz jak dorosły do dorosłego
- ZERO odnośników [1][2][3]
- ZERO "w dzisiejszym dynamicznym świecie"
- Naturalny ton, 800-1200 słów
- Nagłówki ##, na końcu "## Co z tego wynika?"
""",
    },
    {
        "title": "Jak AI pomaga w diagnostyce medycznej — konkretne przypadki",
        "category": "AI Odkrycia",
        "prompt": """Tytuł: Jak AI pomaga w diagnostyce medycznej — konkretne przypadki
Kategoria: AI Odkrycia

Opisz 2-3 konkretne przypadki gdzie AI pomogła w diagnostyce medycznej
(np. wykrywanie raka, analiza zdjęć RTG, przewidywanie chorób).
Nie pisz ogólników — podaj realne przykłady, szpitale, wyniki.

STYL JIMBO:
- Pisz po polsku, prosto i rzeczowo. Dojrzały, merytoryczny ton.
- Pierwsza osoba ("przeczytałem o...", "zaskoczyło mnie że...")
- Bez infantylnych porównań, bez wymyślonych anegdotek
- ZERO [1][2], ZERO korporacyjnego tonu, ZERO "hej stary"
- 800-1200 słów, markdown, ## nagłówki
- Na końcu "## Co z tego wynika?"
""",
    },
    {
        "title": "Buduję własnego AI agenta do monitorowania wiadomości",
        "category": "AI Moje Projekty",
        "prompt": """Tytuł: Buduję własnego AI agenta do monitorowania wiadomości
Kategoria: AI Moje Projekty

Opisz z perspektywy Jimbo budowanie prostego AI agenta który:
- Codziennie rano zbiera najważniejsze wiadomości o AI
- Filtruje spam i clickbait
- Generuje krótkie podsumowanie
- Wykorzystuje DeepSeek + Gemma 3 27B + Llama 3.3 70B (przez OpenRouter)

Pokaż proces myślenia, problemy, rozwiązania. Bądź szczery.

STYL JIMBO:
- Pierwsza osoba, szczere, osobiste, ale dojrzałe
- "Zaczęło się od tego że...", "Najtrudniejsze było..."
- Pisz konkretnie, bez ściemy i wymyślonych historii
- ZERO [1][2], ZERO szablonów, ZERO "hej stary"/"kumple"
- 800-1200 słów, markdown
- Na końcu "## Co z tego wynika?"
""",
    },
]

JIMBO_FOOTER = """

---

**Masz pytania? Chcesz pogadać o AI, technologii albo po prostu rzucić pomysłem?** Pisz śmiało — lubię dostawać wiadomości od ludzi, którzy faktycznie czytają to co piszę (a nie tylko botów 😉). Najszybciej złapiesz mnie przez stronę kontaktową lub social media.

🔗 **[jimbo77.com](https://www.jimbo77.com)** — mój główny hub, projekty, kontakt  
🔗 **[mybonzo.com](https://www.mybonzo.com)** — więcej moich rzeczy, AI narzędzia, blog techniczny

Do następnego! ✌️  
*— Jimbo*
"""


def clean_ai_artifacts(text: str) -> str:
    text = re.sub(r"\[\d+(?:,\s*\d+)*\]", "", text)
    text = text.replace("```markdown", "").replace("```", "").strip()
    lines = text.split("\n")
    if lines and lines[0].startswith("# "):
        text = "\n".join(lines[1:]).strip()
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2].strip()
    return text


def slugify(text: str) -> str:
    text = text.lower().strip()
    pl_map = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")
    text = text.translate(pl_map)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:60].rstrip("-")


async def generate_article(article: dict, idx: int):
    """Generate 1 article via MOA + 3 image variants."""
    title = article["title"]
    slug = slugify(title)
    cat = article["category"]
    art_dir = OUTPUT_DIR / slug
    art_dir.mkdir(exist_ok=True)

    print(f"\n{'='*60}")
    print(f"  ARTICLE {idx}: {title}")
    print(f"  Category: {cat}")
    print(f"{'='*60}")

    # ── 1. Generate article text via MOA ──────────────────────────────
    print(
        "✍️  Generating article text (MOA: Perplexity→DeepSeek+Gemma+Llama→GPT-5-nano)..."
    )
    content = await moa.generate_response(article["prompt"], task_type="content")

    content = clean_ai_artifacts(content)
    content += JIMBO_FOOTER

    md_path = art_dir / f"{slug}.md"
    md_path.write_text(f"# {title}\n\n{content}", encoding="utf-8")
    print(f"   💾 Article saved: {md_path}")
    print(f"   📊 Words: {len(content.split())}")

    # ── 2. Generate 3 image variants (mix Replicate + OpenAI) ──────
    print(f"\n🖼️  Generating 3 image variants (mix: Replicate + OpenAI)...")

    # Ensure variety: pick from both pools
    replicate_models = [m for m in MODELS if m.get("endpoint") != "openai"]
    openai_models = [m for m in MODELS if m.get("endpoint") == "openai"]
    random.shuffle(replicate_models)
    random.shuffle(openai_models)
    # 2 Replicate + 1 OpenAI (or best available)
    chosen_models = replicate_models[:2] + openai_models[:1]
    if len(chosen_models) < 3:
        chosen_models = (replicate_models + openai_models)[:3]
    random.shuffle(chosen_models)

    for i, model in enumerate(chosen_models, 1):
        visual_hint = CATEGORY_VISUAL_HINTS.get(cat, "artificial intelligence concept")
        prompt = f"{title}, {visual_hint}, {DEFAULT_STYLE}"[:500]

        ext = "png" if model.get("endpoint") == "openai" else "webp"
        img_path = (
            art_dir
            / f"variant_{i}_{model['name'].replace(' ', '_').replace('/', '_').lower()}.{ext}"
        )

        print(f"   [{i}/3] {model['name']}...")
        if i > 1:
            print(f"   ⏳ Wait 12s (Replicate rate limit)...")
            await asyncio.sleep(12)
        try:
            from image_generator import (
                _run_replicate,
                _run_openai_image,
                _download_image,
            )

            if model.get("endpoint") == "openai":
                url = await _run_openai_image(prompt, model)
            else:
                url = await _run_replicate(prompt, model)
            if url:
                await _download_image(url, img_path)
                size_kb = img_path.stat().st_size // 1024
                print(f"   ✅ {img_path.name} ({size_kb}KB)")
            else:
                print(f"   ❌ {model['name']} — no output")
        except Exception as e:
            print(f"   ❌ {model['name']} — {e}")

    print(f"\n📁 All files in: {art_dir}")
    return art_dir


async def main():
    print(
        """
╔══════════════════════════════════════════════════════════════╗
║  JIMBO77 PUBLISHER — TEST GENERATE v2                       ║
║  3 articles × (1 text + 3 images) = 3 articles + 9 images  ║
║  MOA: Perplexity→DeepSeek+Gemma 27B+Llama 70B→GPT-5-nano            ║
╚══════════════════════════════════════════════════════════════╝
"""
    )

    # Check keys
    missing = []
    for k in ["OPENROUTER_API_KEY"]:
        if not os.getenv(k):
            missing.append(k)
    if missing:
        print(f"❌ Missing keys: {', '.join(missing)}")
        return

    replicate_ok = bool(os.getenv("REPLICATE_API_TOKEN"))
    print(
        f"  MOA: Perplexity(research) → DeepSeek + Gemma 3 27B + Llama 3.3 70B → GPT-5-nano(synthesis)"
    )
    print(
        f"  Images: {'Replicate ✅' if replicate_ok else 'Replicate ❌ (REPLICATE_API_TOKEN missing)'}"
    )
    print(f"  Output: {OUTPUT_DIR}\n")

    results = []
    for i, article in enumerate(TEST_ARTICLES, 1):
        try:
            art_dir = await generate_article(article, i)
            results.append((article["title"], art_dir))
        except Exception as e:
            print(f"\n❌ Article {i} failed: {e}")

    # Summary
    print(f"\n\n{'='*60}")
    print(f"  SUMMARY")
    print(f"{'='*60}")
    for title, path in results:
        files = list(path.iterdir())
        md_files = [f for f in files if f.suffix == ".md"]
        img_files = [f for f in files if f.suffix in (".webp", ".png", ".jpg")]
        print(f"\n  📄 {title}")
        print(f"     Text: {len(md_files)} files")
        print(f"     Images: {len(img_files)} variants")
        for f in sorted(files):
            size = f.stat().st_size
            print(
                f"       {'📝' if f.suffix == '.md' else '🖼️'} {f.name} ({size // 1024}KB)"
            )

    print(f"\n📁 Output directory: {OUTPUT_DIR}")
    print("👆 Przejrzyj pliki, wybierz najlepszy obrazek z każdego artykułu")
    print("   i dopasujemy prompty graficzne!\n")


if __name__ == "__main__":
    asyncio.run(main())
