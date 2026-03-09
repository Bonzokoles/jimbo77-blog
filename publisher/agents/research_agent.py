"""
Research Agent — Jimbo77 Publisher
Port: 6062

Finds trending AI topics via web search / news APIs.
Provides context for the writer agent to create relevant, timely articles.
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


class ResearchAgent(BaseAgent):

    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.cf_account = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
        self.cf_token = os.getenv("CLOUDFLARE_API_TOKEN", "")

    async def execute(self, data: Optional[Dict] = None) -> Dict[str, Any]:
        if not data:
            return {"error": "No data provided"}

        task_type = data.get("type", "trends")
        query = data.get("query", "")

        if not query:
            return {"error": "No query provided"}

        if task_type == "trends":
            result = await self._find_trends(query)
        elif task_type == "deep":
            result = await self._deep_research(query)
        elif task_type == "sources":
            result = await self._find_sources(query)
        else:
            result = await self._find_trends(query)

        return {"content": result, "type": task_type}

    async def _find_trends(self, query: str) -> str:
        """Use AI model to brainstorm current trends based on query."""
        prompt = f"""Jesteś AI research assistant dla polskiego bloga technicznego jimbo77.org.

Zapytanie: "{query}"

Na podstawie swojej wiedzy (do daty odcięcia) wygeneruj:
1. TOP 5 najgorętszych tematów/trendów pasujących do tego zapytania
2. Dla każdego tematu: 1-2 zdania kontekstu (co, kto, kiedy, dlaczego to ważne)
3. 3 potencjalne tytuły artykułów blogowych (chwytliwe, po polsku)

Skup się na:
- Świeżych tematach (nowe modele, narzędzia, odkrycia)
- Rzeczach które mogą zainteresować polskiego czytelnika  
- Tematach gdzie jest "story" — nie suche fakty, ale coś ciekawego

Format: czysta lista, Markdown, bez zbędnych wstępów."""

        return await self._call_cf(prompt)

    async def _deep_research(self, topic: str) -> str:
        """Deeper dive into a specific topic."""
        prompt = f"""Jesteś ekspertem AI robiącym research na temat:
"{topic}"

Przygotuj briefing dla blogera (Jimbo), który ma napisać artykuł na ten temat.
Uwzględnij:
1. Kluczowe fakty i tło (kto, co, kiedy)
2. Dlaczego to jest ważne / interesujące
3. Kontrowersje lub ciekawe opinie
4. 2-3 konkretne przykłady / case studies
5. Co to znaczy dla "zwykłego człowieka" (nie tylko dla techników)

Max 500 słów. Po polsku. Konkretnie, bez lania wody.
Nie dodawaj [numerów] odnośników."""

        return await self._call_cf(prompt)

    async def _find_sources(self, query: str) -> str:
        """Find relevant sources and references."""
        prompt = f"""Dla tematu: "{query}"

Zaproponuj:
1. 5 wiarygodnych źródeł do sprawdzenia (nazwy stron/blogów/kanałów, bez URL)
2. 3 kluczowe pojęcia do wyjaśnienia w artykule
3. 2 powiązane tematy na przyszłe artykuły

Krótko, po polsku, bez wstępów."""

        return await self._call_cf(prompt)

    async def _call_cf(self, prompt: str) -> str:
        """Call Cloudflare Workers AI (Phi-4 — good at analysis/reasoning)."""
        if not self.cf_account or not self.cf_token:
            return f"[Research Agent] Missing Cloudflare credentials. Query was: {prompt[:100]}..."

        url = f"https://api.cloudflare.com/client/v4/accounts/{self.cf_account}/ai/run/@cf/microsoft/phi-4"
        headers = {
            "Authorization": f"Bearer {self.cf_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "Jesteś research assistant dla polskiego bloga technicznego o AI. Odpowiadaj po polsku, zwięźle i merytorycznie.",
                },
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 1200,
            "temperature": 0.7,
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=45),
                ) as resp:
                    if resp.status != 200:
                        err = await resp.text()
                        return f"Error: CF API {resp.status} — {err[:200]}"
                    data = await resp.json()
                    return data.get("result", {}).get(
                        "response", "No response from model"
                    )
        except Exception as e:
            return f"Error: {e}"


if __name__ == "__main__":
    create_agent_cli(
        ResearchAgent,
        {
            "id": "research-agent",
            "name": "Research Agent",
            "version": "2.0.0",
            "description": "AI trend research — feeds context to the writer",
            "port": 6062,
            "capabilities": ["trends", "deep", "sources"],
            "log_level": "INFO",
        },
    )
