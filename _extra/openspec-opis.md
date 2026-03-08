# OpenSpec — CLI do specyfikacji projektów dla agentów AI

## Co to jest

**OpenSpec** to narzędzie CLI (linia komend) napisane w TypeScript, które tworzy i zarządza **ustrukturyzowanymi specyfikacjami projektów** w formacie Markdown — tak, żeby **agenty AI** (Copilot, Cursor, Claude, itp.) mogły lepiej rozumieć Twój projekt i efektywniej w nim pracować.

Innymi słowy: zamiast za każdym razem tłumaczyć AI "jak działa mój projekt", tworzysz raz zestaw plików specyfikacji, a AI czyta je automatycznie.

## Po co to jest

### Problem
Agenty AI (Copilot, Claude, itd.) nie znają kontekstu Twojego projektu — nie wiedzą jaka jest architektura, jakie konwencje stosujesz, co jest w trakcie implementacji, a co gotowe. Za każdym razem musisz im to opisywać od nowa.

### Rozwiązanie
OpenSpec tworzy katalog `openspec/` w projekcie z:
- **Specyfikacjami** (specs/) — opisy funkcji, modułów, API w Markdown
- **Zmianami** (changes/) — co jest w trakcie, co zaplanowane (change-driven development)
- **Konfiguracją** (config.yaml) — stack technologiczny, konwencje, reguły
- **Schematami** (schemas/) — szablony jak pisać speki

AI narzędzia czytają te pliki i od razu wiedzą: jaki stack, jakie konwencje, co robić, czego nie ruszać.

## Jak to działa — w praktyce

```bash
# 1. Inicjalizacja w projekcie
opsx init

# 2. Tworzy się struktura:
# openspec/
#   config.yaml      — stack, reguły, kontekst projektu
#   project.md       — opis projektu
#   specs/            — specyfikacje funkcji
#   changes/          — zmiany w toku

# 3. AI agent (Copilot/Claude) czyta openspec/ i wie co robić
```

## Kluczowe funkcje

| Funkcja | Opis |
|---|---|
| `opsx init` | Inicjalizuje OpenSpec w projekcie — tworzy strukturę plików |
| `opsx spec` | Zarządza specyfikacjami (tworzenie, edycja) |
| `opsx change` | Zarządza zmianami (change-driven workflow) |
| `opsx validate` | Sprawdza poprawność specyfikacji |
| `opsx list` | Listuje speki i zmiany |
| `opsx show` | Pokazuje szczegóły specyfikacji |
| `opsx archive` | Archiwizuje zakończone zmiany |
| `opsx config` | Zarządza konfiguracją |
| **Skills** | Generuje "umiejętności" (slash commands) dla różnych AI providerów |
| **Artifact graph** | Śledzi powiązania między plikami i specyfikacjami |
| **Multi-provider** | Działa z Copilot, Cursor, Claude, i innymi |

## Stack technologiczny

- **TypeScript** (ESM modules)
- **Node.js** ≥20.19
- **pnpm** (package manager)
- **Commander.js** (framework CLI)
- **@inquirer/prompts** (interaktywne prompty)
- **chalk** + **ora** (kolorowy output w terminalu)
- Dystrybucja jako pakiet **npm**
- Cross-platform: Windows, macOS, Linux

## Lokalizacja kodu

`S:\OpenSpec`

## Dlaczego to może być przydatne dla AI Agent Social Club

1. **Standaryzacja pracy z AI agentami** — każdy projekt ma jasną specyfikację, AI nie zgaduje
2. **Change-driven development** — dokumentujesz zmiany zanim AI je implementuje
3. **Multi-agent workflow** — różne AI (Copilot, Claude) czytają te same speki
4. **Powtarzalność** — nowy agent dostaje pełny kontekst projektu bez onboardingu
5. **Walidacja** — sprawdzasz czy speki są kompletne zanim AI zacznie kodować

## Przykład config.yaml

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, Node.js (≥20.19.0), ESM modules
  Package manager: pnpm
  CLI framework: Commander.js

rules:
  specs:
    - Include scenarios for Windows path handling
  tasks:
    - Add Windows CI verification when changes involve file paths
  design:
    - Document any platform-specific behavior
```

## Powiązanie z AI agentami

OpenSpec rozwiązuje jeden z głównych problemów pracy z AI agentami: **brak trwałego kontekstu**. Zamiast polegać na pamięci sesji czy długich promptach, tworzysz **pliki specyfikacji**, które agent czyta przy każdej interakcji. To jak "instrukcja obsługi projektu" dla AI.

---

*Zapisano: 2026-03-08 | Źródło: S:\OpenSpec*
