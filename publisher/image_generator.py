"""
Image Generator — Replicate AI Integration
Jimbo77 Publisher

Generates hero images for blog posts using MULTIPLE Replicate models.
Style: sci-fi, cyber art, computer art — dark, mature, NOT cartoon/childish.
Models rotate: DreamShaper, FLUX Pro, Proteus v0.3, SDXL-Lightning, Kandinsky, etc.
Mix of paid & free — rotates for variety.
"""

import os
import asyncio
import aiohttp
import re
import time
import random
from pathlib import Path
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env", override=True)

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ── Sci-Fi / Cyber Art Style (NOT childish/cartoon) ───────────────────
DEFAULT_STYLE = (
    "sci-fi digital art, cyberpunk aesthetic, dark moody atmosphere, "
    "neon glow accents, circuit board patterns, holographic elements, "
    "computer art, glitch art influences, deep shadows, high contrast, "
    "cinematic composition, 16:9 widescreen, photorealistic details, "
    "dark background with technological elements, NOT cartoon, NOT cute, "
    "mature sophisticated tech aesthetic"
)

# ── Category Visual Hints (sci-fi themed) ─────────────────────────────
CATEGORY_VISUAL_HINTS = {
    "AI News": "holographic news broadcast, data streams, floating screens in dark space, digital information flow",
    "AI Odkrycia": "scientific visualization, molecular structures glowing neon, deep space laboratory, epic discovery moment",
    "AI Nowości": "emerging technology, crystalline structure forming, digital birth, new creation from light particles",
    "AI Zastosowania": "human silhouette interfacing with digital systems, augmented reality overlay, practical tech in action",
    "AI Moje Projekty": "lone programmer workstation with multiple holographic monitors, code reflected in glasses, late night hacking session",
}

# ── Model Pool (rotate for variety) ───────────────────────────────────
# Each model entry: { "id": replicate model path, "name": display name, "params": extra input params }
MODELS = [
    {
        "id": "black-forest-labs/flux-pro",
        "name": "FLUX Pro",
        "endpoint": "models",
        "params": {
            "aspect_ratio": "16:9",
            "output_format": "webp",
            "output_quality": 90,
            "safety_tolerance": 5,
        },
    },
    {
        "id": "black-forest-labs/flux-schnell",
        "name": "FLUX Schnell (free)",
        "endpoint": "models",
        "params": {
            "aspect_ratio": "16:9",
            "output_format": "webp",
            "output_quality": 85,
        },
    },
    {
        "id": "black-forest-labs/flux-1.1-pro",
        "name": "FLUX 1.1 Pro",
        "endpoint": "models",
        "params": {
            "aspect_ratio": "16:9",
            "output_format": "webp",
            "output_quality": 90,
        },
    },
    {
        "id": "black-forest-labs/flux-1.1-pro-ultra",
        "name": "FLUX 1.1 Pro Ultra",
        "endpoint": "models",
        "params": {
            "aspect_ratio": "16:9",
            "output_format": "jpg",
            "output_quality": 95,
            "raw": False,
        },
    },
    # ── OpenAI Image Models (via OPENAI_API_KEY) ──────────────────────
    {
        "id": "openai/gpt-image-1",
        "name": "GPT Image 1 (OpenAI)",
        "endpoint": "openai",
        "params": {
            "size": "1536x1024",
            "quality": "high",
        },
    },
    {
        "id": "openai/gpt-image-1-mini",
        "name": "GPT Image 1 Mini (OpenAI)",
        "endpoint": "openai",
        "params": {
            "size": "1536x1024",
            "quality": "medium",
        },
    },
    {
        "id": "openai/dall-e-3",
        "name": "DALL-E 3 (OpenAI)",
        "endpoint": "openai",
        "params": {
            "size": "1792x1024",
            "quality": "hd",
            "style": "vivid",
        },
    },
]


def pick_model() -> Dict:
    """Pick a random model from the pool — only from those with valid API keys."""
    available = []
    for m in MODELS:
        if m.get("endpoint") == "openai" and OPENAI_API_KEY:
            available.append(m)
        elif m.get("endpoint") != "openai" and REPLICATE_API_TOKEN:
            available.append(m)
    if not available:
        # Fallback: try anything
        available = MODELS
    return random.choice(available)


async def generate_hero_image(
    title: str,
    category: str = "AI",
    style: str = None,
    output_dir: str = None,
    model_override: str = None,
) -> tuple:
    """
    Generate a hero image via Replicate (rotating models).
    Returns (filename, model_name, prompt) or (None, None, None) on failure.
    """
    if not REPLICATE_API_TOKEN and not OPENAI_API_KEY:
        print("⚠️  No image API keys set (REPLICATE_API_TOKEN or OPENAI_API_KEY)")
        return None, None, None

    visual_hint = CATEGORY_VISUAL_HINTS.get(
        category, "artificial intelligence concept, digital neural network"
    )
    custom_style = style or DEFAULT_STYLE

    prompt = f"{title}, {visual_hint}, {custom_style}"
    prompt = prompt[:500]  # Keep under limit

    # Pick model
    if model_override:
        model = next(
            (m for m in MODELS if model_override.lower() in m["name"].lower()), None
        )
        if not model:
            model = pick_model()
    else:
        model = pick_model()

    print(f"🖼️  Model: {model['name']}")
    print(f"🖼️  Prompt: {prompt[:80]}...")

    try:
        # Route to correct API based on model type
        if model.get("endpoint") == "openai":
            image_url = await _run_openai_image(prompt, model)
        else:
            image_url = await _run_replicate(prompt, model)

        active_model = model
        if not image_url:
            # Retry with fallback model (FLUX Schnell — always works)
            print("⚠️  Retry with FLUX Schnell fallback...")
            fallback = next(m for m in MODELS if "schnell" in m["id"])
            image_url = await _run_replicate(prompt, fallback)
            if image_url:
                active_model = fallback

        if not image_url:
            return None, None, None

        # Safe slug (no Polish chars, no special chars)
        raw = title.lower()[:50]
        pl_map = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")
        slug = raw.translate(pl_map)
        slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")[:40].rstrip("-")
        ext = "png" if active_model.get("endpoint") == "openai" else "webp"
        filename = f"{slug}-hero.{ext}"

        if output_dir:
            save_path = Path(output_dir) / filename
        else:
            save_path = (
                Path(__file__).resolve().parent.parent
                / "public"
                / "blog-images"
                / filename
            )

        save_path.parent.mkdir(parents=True, exist_ok=True)
        await _download_image(image_url, save_path)
        print(f"✅ Image saved: {save_path} (model: {active_model['name']})")
        return filename, active_model["name"], prompt

    except Exception as e:
        print(f"❌ Image generation failed: {e}")
        return None, None, None


async def _run_replicate(prompt: str, model: Dict) -> Optional[str]:
    """
    Call Replicate API with the given model.
    Supports both /models/ endpoint and /predictions endpoint.
    """
    headers = {
        "Authorization": f"Bearer {REPLICATE_API_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait",
    }

    input_params = {"prompt": prompt, **model["params"]}

    async with aiohttp.ClientSession() as session:
        # Models endpoint (preferred — simpler)
        try:
            url = f"https://api.replicate.com/v1/models/{model['id']}/predictions"
            async with session.post(
                url,
                json={"input": input_params},
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=180),
            ) as resp:
                if resp.status in (200, 201):
                    data = await resp.json()
                    output = data.get("output")
                    if output:
                        return output[0] if isinstance(output, list) else output
                    pred_url = data.get("urls", {}).get("get")
                    if pred_url:
                        return await _poll_prediction(session, pred_url, headers)
                elif resp.status == 404:
                    # Model not available via models endpoint, try version-based
                    pass
                else:
                    err = await resp.text()
                    print(f"⚠️ {model['name']} returned {resp.status}: {err[:150]}")
        except asyncio.TimeoutError:
            print(f"⏰ {model['name']} timed out")
        except Exception as e:
            print(f"⚠️ {model['name']} error: {e}")

    return None


async def _run_openai_image(prompt: str, model: Dict) -> Optional[str]:
    """
    Generate image via OpenAI Images API (gpt-image-1, dall-e-3).
    Returns image URL.
    """
    if not OPENAI_API_KEY:
        print("⚠️ OPENAI_API_KEY not set for image generation")
        return None

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    # Extract actual model name from id
    model_name = model["id"].replace("openai/", "")
    params = model.get("params", {})

    payload = {
        "model": model_name,
        "prompt": prompt,
        "n": 1,
        **params,
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                "https://api.openai.com/v1/images/generations",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as resp:
                if resp.status in (200, 201):
                    data = await resp.json()
                    items = data.get("data", [])
                    if items:
                        # gpt-image-1 returns b64_json, dall-e-3 returns url
                        if items[0].get("url"):
                            return items[0]["url"]
                        elif items[0].get("b64_json"):
                            # Save b64 directly, return special marker
                            return f"b64:{items[0]['b64_json']}"
                else:
                    err = await resp.text()
                    print(f"⚠️ OpenAI Image {model_name}: {resp.status} — {err[:200]}")
        except asyncio.TimeoutError:
            print(f"⏰ OpenAI Image {model_name} timed out")
        except Exception as e:
            print(f"⚠️ OpenAI Image {model_name} error: {e}")

    return None


async def _poll_prediction(
    session: aiohttp.ClientSession, url: str, headers: dict, max_wait: int = 90
) -> Optional[str]:
    """Poll Replicate prediction until complete."""
    start = time.time()
    while time.time() - start < max_wait:
        async with session.get(url, headers=headers) as resp:
            data = await resp.json()
            status = data.get("status")
            if status == "succeeded":
                output = data.get("output")
                return output[0] if isinstance(output, list) else output
            elif status in ("failed", "canceled"):
                print(f"❌ Prediction {status}: {data.get('error', '?')}")
                return None
        await asyncio.sleep(2)
    print("⏰ Prediction timed out")
    return None


async def _download_image(url: str, path: Path):
    """Download image from URL or b64 data to local path."""
    import base64

    if url.startswith("b64:"):
        # OpenAI gpt-image-1 returns base64
        b64_data = url[4:]
        img_bytes = base64.b64decode(b64_data)
        path.write_bytes(img_bytes)
        return

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                path.write_bytes(await resp.read())
            else:
                raise Exception(f"Download failed: {resp.status}")


# ── CLI for testing ────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate hero image for blog post")
    parser.add_argument("--title", required=True, help="Article title")
    parser.add_argument("--category", default="AI", help="AI News, AI Odkrycia, etc.")
    parser.add_argument("--style", help="Custom style override")
    parser.add_argument("--model", help="Force specific model name (partial match)")
    parser.add_argument("--output", help="Output directory")
    parser.add_argument(
        "--list-models", action="store_true", help="Show available models"
    )
    args = parser.parse_args()

    if args.list_models:
        print("\n🎨 Available models:\n")
        for i, m in enumerate(MODELS, 1):
            print(f"  {i}. {m['name']:30s} — {m['id']}")
        print(f"\n  Total: {len(MODELS)} models (random rotation by default)")
    else:
        result = asyncio.run(
            generate_hero_image(
                args.title, args.category, args.style, args.output, args.model
            )
        )
        if result:
            print(f"\n✅ Generated: {result}")
        else:
            print("\n❌ No image generated")
