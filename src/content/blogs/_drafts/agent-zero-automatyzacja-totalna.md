---
title: "Automatyzacja z Agent Zero - Kompletny Przewodnik"
description: "Twój pierwszy autonomiczny kolega AI. Instalacja, konfiguracja i tworzenie zaawansowanych agentów w Dockerze."
pubDatetime: 2026-01-25T15:30:00Z
slug: "agent-zero-automatyzacja-totalna"
featured: true
draft: false
tags:
  - agent-zero
  - ai
  - automation
  - docker
  - python
---

> **Agent Zero** to nowoczesny framework do tworzenia autonomicznych AI agentów. Ten artykuł pokazuje jak zainstalować Agent Zero, skonfigurować pierwszego agenta i tworzyć zaawansowane zadania automatyzacji z integracją GitHub Actions.

---

## 🎯 Wprowadzenie

**Agent Zero** to rewolucyjny framework stworzony w marcu 2024, który pozwala tworzyć autonomiczne agenty AI działające w izolowanym środowisku Docker. Główna różnica między Agent Zero a innymi frameworkami:

✅ **Nie wymaga predefiniowanych agentów** - agent tworzy sobie narzędzia "w locie"  
✅ **Pełny dostęp do Linux** - wykonywanie kodu, instalacja pakietów, przeglądanie sieci  
✅ **100% open-source** - żadnych ograniczeń, pracuje lokalnie na Twoim komputerze  
✅ **Multi-agent cooperation** - agenty mogą razem pracować nad złożonymi zadaniami  
✅ **Pełna przejrzystość** - widzisz każdy krok, każdą decyzję agenta  

**Problem który rozwiązuje:**

Tradycyjne chatboty AI mają ograniczenia:
- Nie mogą pisać i uruchamiać kodu bezpośrednio
- Nie mogą zainstalować nowego oprogramowania
- Nie mogą odczytać plików z systemu
- Nie mogą się uczyć i adaptować do zmian

Agent Zero to **AI kolega pracujący 24/7**, który autonomicznie rozwiązuje zadania bez interwencji człowieka.

---

## 📊 Jak to działa - Architektura Agent Zero

### Wizualizacja architektury:

![Agent Zero Architecture](agent_zero_architecture.svg)

<details>
<summary>📂 Kliknij tutaj, aby pobrać kod źródłowy grafiki (agent_zero_architecture.svg)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#0f172a"/>
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#38bdf8" />
    </marker>
  </defs>
  <text x="600" y="40" font-size="32" font-weight="bold" fill="#38bdf8" text-anchor="middle">🤖 Agent Zero Architecture</text>
  <rect x="150" y="80" width="900" height="650" fill="none" stroke="#38bdf8" stroke-width="3" rx="10"/>
  <text x="170" y="110" font-size="18" font-weight="bold" fill="#38bdf8">Docker Container (Linux Environment)</text>
  <rect x="200" y="140" width="800" height="120" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <text x="600" y="165" font-size="20" font-weight="bold" fill="#38bdf8" text-anchor="middle">Agent Zero Framework</text>
  <circle cx="300" cy="210" r="35" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="300" y="215" font-size="12" fill="#cbd5e1" text-anchor="middle">Chat UI</text>
  <circle cx="450" cy="210" r="35" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="450" y="213" font-size="11" fill="#cbd5e1" text-anchor="middle">AI Model</text>
  <text x="450" y="226" font-size="9" fill="#94a3b8" text-anchor="middle">Integration</text>
  <circle cx="600" cy="210" r="35" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="600" y="213" font-size="11" fill="#cbd5e1" text-anchor="middle">Decision</text>
  <text x="600" y="226" font-size="9" fill="#94a3b8" text-anchor="middle">Engine</text>
  <circle cx="750" cy="210" r="35" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="750" y="213" font-size="11" fill="#cbd5e1" text-anchor="middle">Tools</text>
  <text x="750" y="226" font-size="9" fill="#94a3b8" text-anchor="middle">Manager</text>
  <circle cx="900" cy="210" r="35" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="900" y="213" font-size="11" fill="#cbd5e1" text-anchor="middle">Multi-Agent</text>
  <text x="900" y="226" font-size="9" fill="#94a3b8" text-anchor="middle">Coordinator</text>
  <line x1="600" y1="260" x2="600" y2="290" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowhead)"/>
  <rect x="200" y="300" width="380" height="200" fill="#1e293b" stroke="#06b6d4" stroke-width="2" rx="8"/>
  <text x="390" y="325" font-size="16" font-weight="bold" fill="#06b6d4" text-anchor="middle">Tools Engine</text>
  <rect x="220" y="340" width="160" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="300" y="365" font-size="13" fill="#cbd5e1" text-anchor="middle">🖥️ Terminal/Bash</text>
  <rect x="400" y="340" width="160" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="480" y="365" font-size="13" fill="#cbd5e1" text-anchor="middle">📁 File System</text>
  <rect x="220" y="390" width="160" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="300" y="415" font-size="13" fill="#cbd5e1" text-anchor="middle">🌐 Web Browser</text>
  <rect x="400" y="390" width="160" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="480" y="415" font-size="13" fill="#cbd5e1" text-anchor="middle">📦 Package Mgr</text>
  <rect x="220" y="440" width="340" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="390" y="465" font-size="13" fill="#cbd5e1" text-anchor="middle">⚙️ Dynamic Tool Creation (on-the-fly)</text>
  <rect x="620" y="300" width="380" height="200" fill="#1e293b" stroke="#06b6d4" stroke-width="2" rx="8"/>
  <text x="810" y="325" font-size="16" font-weight="bold" fill="#06b6d4" text-anchor="middle">Linux Environment</text>
  <rect x="640" y="340" width="85" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="682" y="365" font-size="12" fill="#cbd5e1" text-anchor="middle">🐍 Python</text>
  <rect x="740" y="340" width="85" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="782" y="365" font-size="12" fill="#cbd5e1" text-anchor="middle">⚡ Node.js</text>
  <rect x="840" y="340" width="140" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="910" y="365" font-size="12" fill="#cbd5e1" text-anchor="middle">🐚 Bash/Shell</text>
  <rect x="640" y="390" width="90" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="685" y="415" font-size="11" fill="#cbd5e1" text-anchor="middle">Ubuntu</text>
  <rect x="745" y="390" width="125" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="807" y="415" font-size="11" fill="#cbd5e1" text-anchor="middle">Code Runtime</text>
  <rect x="640" y="440" width="340" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="810" y="465" font-size="12" fill="#cbd5e1" text-anchor="middle">📦 Package Managers: apt, npm, pip, cargo</text>
  <rect x="200" y="530" width="800" height="80" fill="#1e293b" stroke="#06b6d4" stroke-width="2" rx="8"/>
  <text x="600" y="555" font-size="16" font-weight="bold" fill="#06b6d4" text-anchor="middle">💾 Persistent Storage (/a0/usr)</text>
  <rect x="220" y="570" width="170" height="30" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="305" y="592" font-size="12" fill="#cbd5e1" text-anchor="middle">Chat History</text>
  <rect x="410" y="570" width="170" height="30" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="495" y="592" font-size="12" fill="#cbd5e1" text-anchor="middle">Configuration</text>
  <rect x="600" y="570" width="170" height="30" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="685" y="592" font-size="12" fill="#cbd5e1" text-anchor="middle">Projects/Files</text>
  <rect x="790" y="570" width="170" height="30" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="875" y="592" font-size="12" fill="#cbd5e1" text-anchor="middle">API Keys</text>
  <line x1="390" y1="260" x2="330" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <line x1="600" y1="260" x2="600" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <line x1="810" y1="260" x2="870" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <text x="600" y="750" font-size="12" fill="#94a3b8" text-anchor="middle">Port 50080: Web UI | Port 50022: SSH | Volumes: ~/agent-zero-data:/a0/usr</text>
</svg>
```
</details>

**Komponenty:**

- **Docker Container**: Całość działa w izolowanym środowisku Linux (Ubuntu 22.04).
- **Core Framework**: Zarządza interfejsem czatu i komunikacją z modelami AI.
- **Tools Engine**: Silnik wykonawczy, który dynamicznie tworzy i uruchamia narzędzia.
- **Persistent Storage**: Twoje dane są bezpieczne na lokalnym dysku, nawet jak wyłączysz kontener.

### Request Flow - Jak Agent Zero rozwiązuje zadania:

![Request Flow Diagram](agent_zero_flow.svg)

<details>
<summary>📂 Kliknij tutaj, aby pobrać kod źródłowy grafiki (agent_zero_flow.svg)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1000 1200" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1200" fill="#0f172a"/>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#38bdf8" />
    </marker>
  </defs>
  <text x="500" y="40" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">📊 Agent Zero - Request Flow (How it Works)</text>
  <rect x="250" y="80" width="500" height="80" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="10"/>
  <text x="500" y="110" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">Step 1️⃣: User Input</text>
  <text x="500" y="140" font-size="12" fill="#cbd5e1" text-anchor="middle">"Write Python script to scrape weather data"</text>
  <line x1="500" y1="160" x2="500" y2="190" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="250" y="190" width="500" height="80" fill="#334155" stroke="#06b6d4" stroke-width="2" rx="10"/>
  <text x="500" y="220" font-size="14" font-weight="bold" fill="#06b6d4" text-anchor="middle">Step 2️⃣: Web UI Processing</text>
  <text x="500" y="250" font-size="12" fill="#cbd5e1" text-anchor="middle">Capture input → Send to Agent Core</text>
  <line x1="500" y1="270" x2="500" y2="300" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="250" y="300" width="500" height="100" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="10"/>
  <text x="500" y="330" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">Step 3️⃣: Agent Core - Analysis</text>
  <text x="500" y="355" font-size="11" fill="#cbd5e1" text-anchor="middle">✓ Parse task requirements</text>
  <text x="500" y="373" font-size="11" fill="#cbd5e1" text-anchor="middle">✓ Identify available tools (Terminal, Browser, File System)</text>
  <line x1="500" y="400" x2="500" y2="430" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="250" y="430" width="500" height="120" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="10"/>
  <text x="500" y="460" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">Step 4️⃣: AI Model (OpenAI/Claude)</text>
  <text x="500" y="490" font-size="11" fill="#cbd5e1" text-anchor="middle">Context: Task + Available Tools</text>
  <text x="500" y="510" font-size="11" fill="#cbd5e1" text-anchor="middle">↓ Generate Action Plan ↓</text>
  <text x="500" y="530" font-size="11" fill="#cbd5e1" text-anchor="middle">"1. Create script 2. Install requests lib 3. Execute 4. Return output"</text>
  <line x1="500" y="550" x2="500" y2="580" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="150" y="580" width="700" height="180" fill="#1e293b" stroke="#06b6d4" stroke-width="2" rx="10"/>
  <text x="500" y="610" font-size="14" font-weight="bold" fill="#06b6d4" text-anchor="middle">Step 5️⃣: Tools Engine - Execution</text>
  <rect x="180" y="630" width="140" height="50" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="250" y="655" font-size="11" fill="#cbd5e1" text-anchor="middle">🖥️ Terminal</text>
  <text x="250" y="673" font-size="9" fill="#94a3b8" text-anchor="middle">create_file.py</text>
  <rect x="340" y="630" width="140" height="50" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="410" y="655" font-size="11" fill="#cbd5e1" text-anchor="middle">📦 Package Manager</text>
  <text x="410" y="673" font-size="9" fill="#94a3b8" text-anchor="middle">pip install</text>
  <rect x="500" y="630" width="140" height="50" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="570" y="655" font-size="11" fill="#cbd5e1" text-anchor="middle">📁 File System</text>
  <text x="570" y="673" font-size="9" fill="#94a3b8" text-anchor="middle">Read/Write</text>
  <rect x="660" y="630" width="140" height="50" fill="#334155" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="730" y="655" font-size="11" fill="#cbd5e1" text-anchor="middle">🌐 Web Browser</text>
  <text x="730" y="673" font-size="9" fill="#94a3b8" text-anchor="middle">Playwright</text>
  <text x="500" y="705" font-size="11" fill="#34d399" text-anchor="middle">✅ Terminal: requirements.txt created</text>
  <text x="500" y="723" font-size="11" fill="#34d399" text-anchor="middle">✅ Package Manager: requests installed successfully</text>
  <text x="500" y="741" font-size="11" fill="#34d399" text-anchor="middle">✅ Terminal: Script executed, output captured</text>
  <line x1="500" y="760" x2="500" y2="790" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="250" y="790" width="500" height="100" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="10"/>
  <text x="500" y="820" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">Step 6️⃣: Feedback Loop</text>
  <text x="500" y="845" font-size="11" fill="#cbd5e1" text-anchor="middle">Agent checks: Is task complete?</text>
  <text x="500" y="865" font-size="11" fill="#cbd5e1" text-anchor="middle">NO → Plan next steps, retry from Step 4</text>
  <text x="500" y="883" font-size="11" fill="#cbd5e1" text-anchor="middle">YES → Proceed to Step 7</text>
  <line x1="500" y="890" x2="500" y2="920" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="250" y="920" width="500" height="100" fill="#334155" stroke="#10b981" stroke-width="2" rx="10"/>
  <text x="500" y="950" font-size="14" font-weight="bold" fill="#34d399" text-anchor="middle">Step 7️⃣: Return Result</text>
  <text x="500" y="975" font-size="11" fill="#cbd5e1" text-anchor="middle">Display output + Full execution logs</text>
  <text x="500" y="995" font-size="11" fill="#cbd5e1" text-anchor="middle">Save to Persistent Storage</text>
  <g transform="translate(50, 1050)">
    <text x="0" y="0" font-size="12" font-weight="bold" fill="#38bdf8">Legend:</text>
    <circle cx="20" cy="25" r="6" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <text x="35" y="30" font-size="11" fill="#cbd5e1">Primary Flow</text>
    <circle cx="20" cy="55" r="6" fill="none" stroke="#06b6d4" stroke-width="2"/>
    <text x="35" y="60" font-size="11" fill="#cbd5e1">Decision Point</text>
    <circle cx="20" cy="85" r="6" fill="none" stroke="#10b981" stroke-width="2"/>
    <text x="35" y="90" font-size="11" fill="#cbd5e1">Success/Complete</text>
  </g>
</svg>
```
</details>

1. **Ty:** "Napisz i uruchom Python script do scraping strony"
2. **Web UI:** Wysyła zadanie do Agent Core
3. **Agent Core:** Analizuje zadanie, identyfikuje potrzebne narzędzia
4. **AI Model (OpenAI/Claude):** Generuje plan działania
5. **Tools Engine:** Wykonuje każdy krok sekwencyjnie
6. **Feedback Loop:** Agent sprawdza czy zadanie zakończone
7. **Wynik:** Prezentujesz wyniki + logi wszystkich kroków

---

## 🛠️ Wymagania wstępne

Przed rozpoczęciem upewnij się, że masz:

- **Docker Desktop** (najnowsza wersja)
- **Port 50080** dostępny na Twojej maszynie
- **Klucze API** (OpenAI, Anthropic, Google)

---

## 🚀 Instalacja krok po kroku

Oto wizualny proces instalacji:

![Installation Steps](agent_zero_installation.svg)

<details>
<summary>📂 Kliknij tutaj, aby pobrać kod źródłowy grafiki (agent_zero_installation.svg)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 900 1400" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="1400" fill="#0f172a"/>
  <defs>
    <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#38bdf8" />
    </marker>
  </defs>
  <text x="450" y="40" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">🚀 Agent Zero Installation Steps</text>
  <rect x="100" y="80" width="700" height="90" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="130" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="140" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">1</text>
  <text x="250" y="110" font-size="14" font-weight="bold" fill="#38bdf8">Download Docker Desktop</text>
  <text x="250" y="135" font-size="11" fill="#cbd5e1">https://docker.com → Windows, macOS, or Linux</text>
  <line x1="450" y1="170" x2="450" y2="200" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="210" width="700" height="90" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="260" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="270" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">2</text>
  <text x="250" y="240" font-size="14" font-weight="bold" fill="#38bdf8">Install & Launch Docker</text>
  <text x="250" y="265" font-size="11" fill="#cbd5e1">Run installer → wait for Docker desktop to load</text>
  <line x1="450" y1="300" x2="450" y2="330" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="340" width="700" height="100" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="395" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="405" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">3</text>
  <text x="250" y="365" font-size="14" font-weight="bold" fill="#38bdf8">Pull Agent Zero Image</text>
  <text x="250" y="390" font-size="11" fill="#cbd5e1">docker pull agent0ai/agent-zero:latest</text>
  <line x1="450" y1="440" x2="450" y2="470" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="480" width="700" height="110" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="540" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="550" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">4</text>
  <text x="250" y="510" font-size="14" font-weight="bold" fill="#38bdf8">Create Storage Directory</text>
  <text x="250" y="535" font-size="11" fill="#cbd5e1">mkdir -p ~/agent-zero-data</text>
  <line x1="450" y1="590" x2="450" y2="620" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="630" width="700" height="120" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="695" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="705" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">5</text>
  <text x="250" y="660" font-size="14" font-weight="bold" fill="#38bdf8">Run Agent Zero Container</text>
  <text x="250" y="685" font-size="10" fill="#cbd5e1">docker run -d -p 50080:80 \...</text>
  <line x1="450" y1="750" x2="450" y2="780" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="790" width="700" height="100" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="840" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="850" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">6</text>
  <text x="250" y="815" font-size="14" font-weight="bold" fill="#38bdf8">Verify Container is Running</text>
  <text x="250" y="840" font-size="11" fill="#cbd5e1">docker ps | grep agent-zero</text>
  <line x1="450" y1="890" x2="450" y2="920" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="930" width="700" height="90" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="980" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="990" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">7</text>
  <text x="250" y="955" font-size="14" font-weight="bold" fill="#38bdf8">Access Agent Zero UI</text>
  <text x="250" y="980" font-size="12" fill="#10b981">http://localhost:50080 ✅</text>
  <line x1="450" y1="1020" x2="450" y2="1050" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="1060" width="700" height="100" fill="#334155" stroke="#38bdf8" stroke-width="2" rx="8"/>
  <circle cx="150" cy="1110" r="25" fill="#38bdf8" stroke="none"/>
  <text x="150" y="1120" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">8</text>
  <text x="250" y="1085" font-size="14" font-weight="bold" fill="#38bdf8">Configure AI Model</text>
  <text x="250" y="1110" font-size="11" fill="#cbd5e1">Settings → Agent Settings → Add API Key</text>
  <line x1="450" y1="1160" x2="450" y2="1190" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowblue)"/>
  <rect x="100" y="1200" width="700" height="60" fill="#10b981" fill-opacity="0.2" stroke="#34d399" stroke-width="2" rx="8"/>
  <circle cx="150" cy="1230" r="25" fill="#34d399" stroke="none"/>
  <text x="150" y="1240" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">✅</text>
  <text x="250" y="1235" font-size="14" font-weight="bold" fill="#34d399">Ready! Start using Agent Zero</text>
</svg>
```
</details>

1. **Pobierz Docker Desktop**
2. **Uruchom Docker**
3. **Pobierz obraz Agent Zero**
4. **Stwórz folder na dane** (persistent storage)
5. **Uruchom kontener** (komenda `docker run`)
6. **Sprawdź status** (czy działa?)
7. **Otwórz Web UI** (http://localhost:50080)
8. **Skonfiguruj API Key** (OpenAI/Anthropic)

---

## ⚙️ Konfiguracja AI Model

### Setup OpenAI (ChatGPT):
1. Przejdź do **Settings** → **Agent Settings**
2. Klucz z https://platform.openai.com/api-keys
3. Model: `gpt-4o`

### Setup Anthropic (Claude):
1. Settings → Agent Settings
2. Klucz z https://console.anthropic.com
3. Model: `claude-3-5-sonnet-20241022`

---

## 🎯 Pierwszy Agent - Hello World

### Najprościej - chat z agentem:
Wpisz: **"Cześć! Jaki jest dzisiaj dzień tygodnia?"** - Agent wykona systemową komendę `date`.

### Scenariusz: Deployment
Możesz nakazać agentowi: **"Napisz skrypt w Pythonie, który sprawdzi package.json, zbuduje projekt i wdroży go na Cloudflare Workers"**. Agent Zero sam zainstaluje `wrangler`, zaloguje się (jeśli podasz token) i wykona deployment.

---

## 💡 Porównanie z tradycyjnymi Chatbotami

Dlaczego warto używać Agent Zero zamiast zwykłego ChatuGPT?

![Comparison: Agent Zero vs Traditional](agent_zero_comparison.svg)

<details>
<summary>📂 Kliknij tutaj, aby pobrać kod źródłowy grafiki (agent_zero_comparison.svg)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#0f172a"/>
  <defs>
    <marker id="arrowCheck" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#34d399" />
    </marker>
    <marker id="arrowX" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
    </marker>
  </defs>
  <text x="600" y="40" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">🔄 Agent Zero vs Traditional AI Chatbots</text>
  <rect x="50" y="80" width="500" height="680" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="10"/>
  <text x="300" y="115" font-size="20" font-weight="bold" fill="#ef4444" text-anchor="middle">❌ Traditional Chatbot</text>
  <text x="300" y="140" font-size="12" fill="#94a3b8" text-anchor="middle">(ChatGPT, Claude, Gemini)</text>
  <rect x="70" y="160" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="160" x2="500" y2="210" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="185" font-size="13" fill="#cbd5e1">Execute Code Locally</text>
  <rect x="70" y="220" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="220" x2="500" y2="270" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="245" font-size="13" fill="#cbd5e1">File System Access</text>
  <rect x="70" y="280" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="280" x2="500" y2="330" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="305" font-size="13" fill="#cbd5e1">Install Dependencies (apt, pip, npm)</text>
  <rect x="70" y="340" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="340" x2="500" y2="390" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="365" font-size="13" fill="#cbd5e1">Autonomous Decision Making</text>
  <rect x="70" y="400" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="400" x2="500" y2="450" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="425" font-size="13" fill="#cbd5e1">Multiple Tools (Dynamic Creation)</text>
  <rect x="70" y="460" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="460" x2="500" y2="510" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="485" font-size="13" fill="#cbd5e1">Multi-Agent Coordination</text>
  <rect x="70" y="520" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="520" x2="500" y2="570" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="545" font-size="13" fill="#cbd5e1">Offline/Local Operation</text>
  <rect x="70" y="580" width="460" height="50" fill="#334155" stroke="#64748b" stroke-width="1" rx="5"/>
  <line x1="500" y1="580" x2="500" y2="630" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowX)"/>
  <text x="85" y="605" font-size="13" fill="#cbd5e1">Full Transparency (see all steps)</text>
  <rect x="650" y="80" width="500" height="680" fill="#1e293b" stroke="#34d399" stroke-width="2" rx="10"/>
  <text x="900" y="115" font-size="20" font-weight="bold" fill="#34d399" text-anchor="middle">✅ Agent Zero</text>
  <text x="900" y="140" font-size="12" fill="#94a3b8" text-anchor="middle">(Autonomous AI Agent)</text>
  <rect x="670" y="160" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="185" x2="620" y2="185" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="185" font-size="13" fill="#34d399">✅ Execute Code Locally</text>
  <rect x="670" y="220" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="245" x2="620" y2="245" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="245" font-size="13" fill="#34d399">✅ Full File System Access</text>
  <rect x="670" y="280" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="305" x2="620" y2="305" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="305" font-size="13" fill="#34d399">✅ Install Dependencies Auto</text>
  <rect x="670" y="340" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="365" x2="620" y2="365" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="365" font-size="13" fill="#34d399">✅ Fully Autonomous (24/7)</text>
  <rect x="670" y="400" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="425" x2="620" y2="425" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="425" font-size="13" fill="#34d399">✅ 10+ Tools (Dynamic)</text>
  <rect x="670" y="460" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="485" x2="620" y2="485" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="485" font-size="13" fill="#34d399">✅ Multiple Agents Work Together</text>
  <rect x="670" y="520" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="545" x2="620" y2="545" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="545" font-size="13" fill="#34d399">✅ Hybrid: Online + Offline</text>
  <rect x="670" y="580" width="460" height="50" fill="#334155" stroke="#34d399" stroke-width="1" rx="5"/>
  <line x1="670" y1="605" x2="620" y2="605" stroke="#34d399" stroke-width="2" marker-end="url(#arrowCheck)"/>
  <text x="685" y="605" font-size="13" fill="#34d399">✅ 100% Transparent Logs</text>
  <rect x="50" y="780" width="1100" height="40" fill="#0ea5e9" fill-opacity="0.1" stroke="#38bdf8" stroke-width="1" rx="5"/>
  <text x="600" y="807" font-size="12" fill="#cbd5e1" text-anchor="middle">📌 Agent Zero = Complete Autonomy with Full System Access | Traditional Chatbot = Text Generation Only</text>
</svg>
```
</details>

**Agent Zero**:
*   Wykonywanie kodu lokalnie (Python, Node, Bash)
*   Dostęp do plików
*   Samodzielna instalacja bibliotek
*   W pełni autonomiczny

**Tradycyjny Chatbot:**
*   Tylko generuje tekst
*   Brak dostępu do systemu
*   Nie może nic "zrobić" poza oknem czatu

---

## 🔗 Przydatne linki

- [Agent Zero GitHub](https://github.com/77Jimbo77/agent-zero-examples)
- [Docker Hub](https://hub.docker.com/r/agent0ai/agent-zero)
- [OpenAI API Keys](https://platform.openai.com/api-keys)

---

**Autor:** JIMBO77 AI Social Club  
**Tagi:** #Agent-Zero #AI #Automation #Docker #Guide
