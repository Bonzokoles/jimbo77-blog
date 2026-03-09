"""
Writer Agent — Jimbo77 Publisher
Port: 6030

Uses MOA Engine (DeepSeek + Gemma 3 + Phi-4) to generate blog content.
All output in Jimbo's voice — casual, personal, Polish, with humor.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Add parent dir so we can import from publisher root
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from base_agent import BaseAgent, AgentConfig, create_agent_cli
from moa_engine import MOAEngine

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


JIMBO_SYSTEM_PROMPT = """Jesteś Jimbo — polski bloger technologiczny piszący na jimbo77.org.
Twój styl pisania:

1. JĘZYK: Polski, codzienny, zrozumiały. Jakbyś opowiadał koledze.
2. PERSPEKTYWA: Pierwsza osoba — "sprawdziłem", "testuję", "uważam".
3. STRUKTURA:
   - Krótki, wciągający wstęp (2-3 zdania, bez banałów)
   - 2-4 sekcje z nagłówkami ## (krótkie, chwytliwe)
   - Sekcja "## Co z tego wynika?" na końcu
4. HUMOR: Wrzuć 1-2 śmieszne porównania, anegdotki lub żarty nawiązujące do tematu.
5. ZAKAZANE:
   - Odnośniki [1], [2], [3] — NIGDY
   - "W dzisiejszym dynamicznym świecie..." — banalny wstęp
   - "Podsumowując powyższe..." — nudne zakończenie
   - Język korporacyjny, naukowy, urzędowy
   - Nadmierne używanie "sztuczna inteligencja" w każdym zdaniu
   - Zbyt wiele emoji (max 2-3 w całym artykule)
6. TECHNIKA: Jak musisz użyć terminu technicznego — wyjaśnij go w nawiasie, krótko, po ludzku.
7. DŁUGOŚĆ: 800-1200 słów.
8. FORMAT: Czysty Markdown. Bez frontmatter. Bez bloków kodu opakowujących artykuł.
"""


class WriterAgent(BaseAgent):

    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.moa = MOAEngine(
            {
                "OPENROUTER_API_KEY": os.getenv("OPENROUTER_API_KEY", ""),
                "CLOUDFLARE_ACCOUNT_ID": os.getenv("CLOUDFLARE_ACCOUNT_ID", ""),
                "CLOUDFLARE_API_TOKEN": os.getenv("CLOUDFLARE_API_TOKEN", ""),
                "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", ""),
            }
        )

    async def execute(self, data: Optional[Dict] = None) -> Dict[str, Any]:
        if not data:
            return {"error": "No data provided"}

        task_type = data.get("type", "content")
        prompt = data.get("prompt", "")
        style = data.get("style", "jimbo")

        if not prompt:
            return {"error": "No prompt provided"}

        # Build full prompt with system instructions
        full_prompt = self._build_prompt(prompt, task_type, style)

        self.logger.info(f"Writer generating: type={task_type}, style={style}")
        content = await self.moa.generate_response(full_prompt, task_type=task_type)

        return {
            "content": content,
            "type": task_type,
            "style": style,
            "word_count": len(content.split()),
        }

    def _build_prompt(self, user_prompt: str, task_type: str, style: str) -> str:
        """Wrap user prompt with Jimbo system instructions."""

        if style == "concise":
            # Short responses (for title generation etc)
            return f"Odpowiedz krótko i konkretnie po polsku.\n\n{user_prompt}"

        if task_type == "content":
            return f"""{JIMBO_SYSTEM_PROMPT}

ZADANIE:
{user_prompt}

Pamiętaj: piszesz jako Jimbo, z charakterem, z humorem, prosto. Nie pisz jak robot."""

        if task_type == "seo":
            return f"""{JIMBO_SYSTEM_PROMPT}

ZADANIE (artykuł SEO-friendly):
{user_prompt}

Uwzględnij:
- Nagłówki H2 z naturalnymi słowami kluczowymi
- Wstęp który wciąga (hook w pierwszym zdaniu)
- FAQ lub "Często zadawane pytania" na końcu (2-3 pytania + krótkie odpowiedzi)
- Pisz naturalnie — SEO przez treść, nie przez sztuczne upychanie słów kluczowych

Pamiętaj: piszesz jako Jimbo, z charakterem, z humorem, prosto."""

        # Default
        return f"{JIMBO_SYSTEM_PROMPT}\n\nZADANIE:\n{user_prompt}"


if __name__ == "__main__":
    create_agent_cli(
        WriterAgent,
        {
            "id": "writer-agent",
            "name": "Jimbo Writer Agent",
            "version": "2.0.0",
            "description": "MOA-powered writer with Jimbo's voice — DeepSeek + Gemma 3 + Phi-4",
            "port": 6030,
            "capabilities": ["content", "seo", "rewrite"],
            "log_level": "INFO",
        },
    )
