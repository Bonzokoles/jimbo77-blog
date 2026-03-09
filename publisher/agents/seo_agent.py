"""
SEO Agent — Jimbo77 Publisher
Port: 6031

Analyzes keywords, generates meta descriptions, optimizes for AI crawlers (GEO).
Knows about llms.txt, Schema.org, GPTBot, and AI-first SEO strategies.
"""

import os
import sys
import aiohttp
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from base_agent import BaseAgent, AgentConfig, create_agent_cli

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


class SEOAgent(BaseAgent):

    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.cf_account = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
        self.cf_token = os.getenv("CLOUDFLARE_API_TOKEN", "")

    async def execute(self, data: Optional[Dict] = None) -> Dict[str, Any]:
        if not data:
            return {"error": "No data provided"}

        task_type = data.get("type", "keywords")
        query = data.get("query", "")

        if not query:
            return {"error": "No query provided"}

        if task_type == "keywords":
            result = await self._generate_keywords(query)
        elif task_type == "meta":
            result = await self._generate_meta(query)
        elif task_type == "geo":
            result = await self._generate_geo_hooks(query)
        else:
            result = await self._generate_keywords(query)

        return {"content": result, "type": task_type}

    async def _generate_keywords(self, topic: str) -> str:
        """Generate SEO keywords for a topic using Gemma 3 (free)."""
        prompt = f"""Jesteś ekspertem SEO dla polskiego bloga technicznego jimbo77.org.
Dla tematu: "{topic}"

Zwróć:
1. 5 głównych słów kluczowych po polsku (long-tail, naturalne)
2. 3 słowa kluczowe po angielsku (bo AI crawlery czytają po angielsku)
3. 2 pytania które ludzie mogą wpisać w Google
4. 1 sugerowany meta description (max 155 znaków, po polsku)

Format: prosta lista, bez numeracji, każdy element w nowej linii.
Bez wstępów, wyjaśnień — same słowa kluczowe i meta."""
        return await self._call_cf(prompt)

    async def _generate_meta(self, content: str) -> str:
        """Generate meta description and OG tags."""
        prompt = f"""Na podstawie tego artykułu wygeneruj:
1. Meta description (max 155 znaków, po polsku, chwytliwe)
2. OG title (max 60 znaków)
3. 5 tagów (bez #, oddzielone przecinkami)

Artykuł (fragment):
{content[:800]}

Zwróć TYLKO wynik, bez komentarzy."""
        return await self._call_cf(prompt)

    async def _generate_geo_hooks(self, topic: str) -> str:
        """Generate GEO hooks for AI crawlers (GPTBot, Anthropic, Perplexity)."""
        prompt = f"""Jesteś ekspertem od GEO (Generative Engine Optimization).
Temat: "{topic}"

Wygeneruj:
1. Sekcję FAQ (3 pytania + zwięzłe odpowiedzi) — napisaną tak, by AI modele cytowały ją w odpowiedziach
2. TL;DR w jednym zdaniu (akapit podsumowujący artykuł, idealny do cytowania przez AI)
3. 3 kluczowe zdania "claim" — proste, konkretne fakty które AI może zacytować

Cel: sprawić by treść była łatwa do przetworzenia/zacytowania przez GPTBot, PerplexityBot, Anthropic, itp.
Język: polski. Pisz prosto, bez żargonu.
Format: czysty Markdown."""
        return await self._call_cf(prompt)

    async def _call_cf(self, prompt: str) -> str:
        """Call Cloudflare Workers AI (Gemma 3 12B — free, fast)."""
        if not self.cf_account or not self.cf_token:
            return f"[SEO Agent] Missing Cloudflare credentials. Returning raw prompt for: {prompt[:60]}..."

        url = f"https://api.cloudflare.com/client/v4/accounts/{self.cf_account}/ai/run/@cf/google/gemma-3-12b-it"
        headers = {
            "Authorization": f"Bearer {self.cf_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "Jesteś ekspertem SEO i GEO dla polskiego bloga o AI.",
                },
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 800,
            "temperature": 0.5,
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30),
                ) as resp:
                    if resp.status != 200:
                        return f"Error: CF API {resp.status}"
                    data = await resp.json()
                    return data.get("result", {}).get("response", "No response")
        except Exception as e:
            return f"Error: {e}"


if __name__ == "__main__":
    create_agent_cli(
        SEOAgent,
        {
            "id": "seo-agent",
            "name": "SEO/GEO Agent",
            "version": "2.0.0",
            "description": "SEO keywords, meta, and AI crawler optimization (GEO)",
            "port": 6031,
            "capabilities": ["keywords", "meta", "geo"],
            "log_level": "INFO",
        },
    )
