"""
MOA Engine — Mixture of Agents v2
Jimbo77 Blog Publisher

Orchestrates parallel calls to multiple AI providers and synthesizes the best result.

Providers:
  - DeepSeek (via OpenRouter) — main writer, strong Polish
  - Google Gemma 3 27B (via OpenRouter, free) — second voice
  - Meta Llama 3.3 70B (via OpenRouter) — third voice, different perspective
  - OpenAI GPT-5-nano (optional) — premium synthesis

Strategy: All models get the same prompt → parallel execution → aggregation.
"""

import os
import logging
import asyncio
import aiohttp
import time
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MOAEngine")


@dataclass
class MOAResponse:
    content: str
    provider: str
    model: str
    tokens: int = 0
    latency: float = 0.0


class MOAEngine:
    """
    Mixture of Agents engine.
    Calls 2-4 models in parallel, then synthesizes the best article.
    """

    def __init__(self, config: Dict[str, str]):
        """
        config keys:
          OPENROUTER_API_KEY   — required (DeepSeek, Gemma, Llama)
          OPENAI_API_KEY        — optional (better synthesis)
        """
        self.config = config
        self.logger = logger

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    async def generate_response(self, prompt: str, task_type: str = "general") -> str:
        self.logger.info(f"MOA Engine starting for task: {task_type}")

        # ── PHASE 1: RESEARCH (Perplexity Sonar) ──
        research = ""
        if self.config.get("OPENROUTER_API_KEY"):
            try:
                self.logger.info("Phase 1: Perplexity research...")
                research_prompt = (
                    f"You are a research assistant for a Polish tech blog. "
                    f"Search the web IN ENGLISH for the latest information, news, "
                    f"breakthroughs, and concrete examples about this topic. "
                    f"Then write your findings IN POLISH — natural, clear Polish. "
                    f"Return:\n"
                    f"- Konkretne fakty z datami i nazwami (np. firm, produktów, naukowców)\n"
                    f"- Najnowsze doniesienia i przełomy (2025-2026)\n"
                    f"- Liczby, statystyki, benchmarki jeśli są\n"
                    f"- Źródła (nazwy serwisów, nie URLe)\n"
                    f"Format: punkty po polsku, zwięźle, max 15 punktów.\n\n"
                    f"TEMAT: {prompt[:500]}"
                )
                res = await self._call_openrouter(
                    research_prompt,
                    time.time(),
                    model_id="perplexity/sonar",
                    name="perplexity-sonar",
                )
                research = res.content
                self.logger.info(f"Phase 1 done: {len(research)} chars of research")
            except Exception as e:
                self.logger.warning(f"Perplexity research failed (continuing): {e}")

        # ── PHASE 2: PARALLEL WRITING ──
        # Inject research context into prompt for writers
        if research:
            enriched_prompt = (
                f"{prompt}\n\n"
                f"--- AKTUALNE INFORMACJE Z WEBA (użyj jako kontekst, NIE kopiuj dosłownie) ---\n"
                f"{research}\n"
                f"--- KONIEC KONTEKSTU ---"
            )
        else:
            enriched_prompt = prompt

        writers = ["deepseek", "gemma", "llama"]
        self.logger.info(f"Phase 2: {len(writers)} writers in parallel...")
        tasks = [self._call_model(p, enriched_prompt) for p in writers]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        ok: List[MOAResponse] = [r for r in results if isinstance(r, MOAResponse)]
        for r in results:
            if not isinstance(r, MOAResponse):
                self.logger.error(f"Writer failed: {r}")

        if not ok:
            return "Error: All writers failed."

        self.logger.info(f"Phase 2: {len(ok)}/{len(writers)} writers responded")
        if len(ok) == 1:
            return ok[0].content

        # ── PHASE 3: SYNTHESIS ──
        return await self._aggregate(ok, prompt, research)

    # ------------------------------------------------------------------
    # Dispatcher
    # ------------------------------------------------------------------
    async def _call_model(self, provider: str, prompt: str) -> MOAResponse:
        t0 = time.time()
        if provider == "deepseek":
            return await self._call_deepseek(prompt, t0)
        elif provider == "gemma":
            return await self._call_openrouter(
                prompt,
                t0,
                model_id="google/gemma-3-27b-it:free",
                name="gemma-3-27b",
            )
        elif provider == "llama":
            # Primary: Llama 3.3 70B, fallback: WizardLM-2-8x22b
            try:
                return await self._call_openrouter(
                    prompt,
                    t0,
                    model_id="meta-llama/llama-3.3-70b-instruct",
                    name="llama-3.3-70b",
                )
            except Exception as e:
                self.logger.warning(
                    f"Llama 3.3 failed ({e}), trying WizardLM fallback..."
                )
                return await self._call_openrouter(
                    prompt,
                    t0,
                    model_id="microsoft/wizardlm-2-8x22b",
                    name="wizardlm-2-8x22b",
                )
        elif provider == "openai":
            return await self._call_openai(prompt, t0)
        raise ValueError(f"Unknown provider: {provider}")

    # ------------------------------------------------------------------
    # Provider: OpenRouter (generic — DeepSeek, Qwen, etc.)
    # ------------------------------------------------------------------
    async def _call_openrouter(
        self,
        prompt: str,
        t0: float,
        model_id: str = "deepseek/deepseek-chat",
        name: str = "deepseek",
    ) -> MOAResponse:
        key = self.config.get("OPENROUTER_API_KEY")
        if not key:
            raise ValueError("OPENROUTER_API_KEY missing")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://jimbo77.org",
            "X-Title": "Jimbo Publisher MOA",
        }
        data = {
            "model": model_id,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.75,
        }
        async with aiohttp.ClientSession() as s:
            async with s.post(
                url,
                headers=headers,
                json=data,
                timeout=aiohttp.ClientTimeout(total=120),
            ) as r:
                if r.status != 200:
                    err = await r.text()
                    raise Exception(
                        f"OpenRouter Error ({name}, {r.status}): {err[:200]}"
                    )
                body = await r.json()
                return MOAResponse(
                    content=body["choices"][0]["message"]["content"],
                    provider=f"openrouter-{name}",
                    model=name,
                    latency=time.time() - t0,
                )

    async def _call_deepseek(self, prompt: str, t0: float) -> MOAResponse:
        """Shortcut for DeepSeek — main voice."""
        return await self._call_openrouter(
            prompt, t0, "deepseek/deepseek-chat", "deepseek-chat"
        )

    # ------------------------------------------------------------------
    # Provider: OpenAI (optional premium)
    # ------------------------------------------------------------------
    async def _call_openai(self, prompt: str, t0: float) -> MOAResponse:
        key = self.config.get("OPENAI_API_KEY")
        if not key:
            raise ValueError("OPENAI_API_KEY missing")

        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        data = {
            "model": "gpt-5-nano",
            "messages": [{"role": "user", "content": prompt}],
            "max_completion_tokens": 8192,
        }

        async with aiohttp.ClientSession() as s:
            async with s.post(
                url, headers=headers, json=data, timeout=aiohttp.ClientTimeout(total=90)
            ) as r:
                if r.status != 200:
                    err_text = await r.text()
                    raise Exception(f"OpenAI Error ({r.status}): {err_text[:200]}")
                body = await r.json()
                return MOAResponse(
                    content=body["choices"][0]["message"]["content"],
                    provider="openai",
                    model="gpt-5-nano",
                    latency=time.time() - t0,
                )

    # ------------------------------------------------------------------
    # Aggregation / Synthesis — "Jimbo's voice"
    # ------------------------------------------------------------------
    async def _aggregate(
        self, responses: List[MOAResponse], original: str, research: str = ""
    ) -> str:
        self.logger.info(f"Phase 3: Synthesizing {len(responses)} MOA responses...")

        combined = "\n\n---\n\n".join(
            [f"[{r.provider}]:\n{r.content}" for r in responses]
        )

        research_block = ""
        if research:
            research_block = f"""\n\nAKTUALNE FAKTY Z WEBA (Perplexity):\n{research}\n\nUżyj tych faktów żeby artykuł był aktualny i wiarygodny.\n"""

        synthesis_prompt = f"""Jesteś Jimbo — 48-letni polski bloger technologiczny i programista. Masz {len(responses)} wersje tekstu.{research_block}

ZADANIE: Stwórz JEDEN gotowy artykuł na bloga, łącząc najlepsze fragmenty.

STYL JIMBO (OBOWIĄZKOWY):
- Pisz po polsku, prosto i zrozumiale. Ton: rzeczowy, konkretny, dojrzały.
- Minimum ciężkich technicznych terminów. Jak musisz użyć — wyjaśnij krótko.
- Pisz w pierwszej osobie ("sprawdziłem", "przetestowałem", "moim zdaniem", "z mojego doświadczenia").
- NIGDY nie używaj odnośników w nawiasach kwadratowych typu [1], [2].
- NIGDY nie pisz "w dzisiejszym dynamicznym świecie" ani "podsumowując powyższe".
- NIGDY nie wymyślaj infantylnych porównań (piwo, bary, imprezy, zwierzęta, karzeł na szczudłach itp.).
- NIGDY nie pisz "hej stary", "kumple", "ziomki" — pisz jak dorosły do dorosłego.
- Jeśli chcesz użyć porównania — niech będzie rzeczowe, z IT/technologii.
- Naturalny, ludzki ton ale z klasą i powagą.

STRUKTURA:
- Markdown: ## nagłówki, **pogrubienia**, listy punktowane
- Na końcu sekcja "## Co z tego wynika?" (zamiast sztampowego "Podsumowanie")
- 800-1200 słów

MATERIAŁ ŹRÓDŁOWY:
{combined}

Wygeneruj TYLKO gotowy artykuł (bez komentarzy, bez "oto artykuł"):"""

        # Prefer OpenAI for synthesis, fallback to DeepSeek
        synthesizer = "openai" if self.config.get("OPENAI_API_KEY") else "deepseek"
        try:
            res = await self._call_model(synthesizer, synthesis_prompt)
            # Guard: if synthesis is too short (< 200 words), use longest writer response
            word_count = len(res.content.split())
            if word_count < 200:
                self.logger.warning(
                    f"Synthesis too short ({word_count} words), using longest writer response"
                )
                longest = max(responses, key=lambda x: len(x.content))
                return longest.content
            return res.content
        except Exception as e:
            self.logger.error(f"Aggregation failed: {e}")
            return max(responses, key=lambda x: len(x.content)).content
