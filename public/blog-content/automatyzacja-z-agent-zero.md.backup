# 🤖 Automatyzacja z Agent Zero - kompletny przewodnik

> Agent Zero to nowoczesny framework do tworzenia autonomicznych AI agentów. Ten artykuł pokazuje jak zainstalować Agent Zero, skonfigurować pierwszego agenta i tworzyć zaawansowane zadania automatyzacji z integracją GitHub Actions.

---

## 🎯 Wprowadzenie

**Agent Zero** to revolucyjny framework stworzony w marcu 2024, który pozwala tworzyć autonomiczne agenty AI działające w izolowanym środowisku Docker. Główna różnica między Agent Zero a innymi frameworkami:

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

## 🛠️ Wymagania wstępne

Przed rozpoczęciem upewnij się, że masz:

- **Docker Desktop** (najnowsza wersja) - [Pobierz](https://docker.com)
- **Port 50080** dostępny na Twojej maszynie (Agent Zero UI)
- **Klucze API** do co najmniej jednego modelu AI:
  - OpenAI (ChatGPT) - https://platform.openai.com/api-keys
  - Anthropic (Claude) - https://console.anthropic.com
  - Google (Gemini) - https://ai.google.dev
  - Perplexity - https://www.perplexity.ai/settings/api
- **Przeglądarka internetowa** (Chrome, Firefox, Safari - dowolna nowoczesna)
- **Podstawowa wiedza o terminalu/PowerShell**

---

## 🚀 Instalacja krok po kroku

### Krok 1: Instalacja Docker Desktop

#### Na Windows:

```powershell
# 1. Pobierz Docker Desktop ze strony https://docker.com
# 2. Otwórz installer i kliknij "Install"
# 3. Po instalacji, uruchom Docker Desktop z menu Start
# 4. Poczekaj aż Docker załaduje się w tle (zielona ikonka w systemtray)

# Weryfikacja instalacji - otwórz PowerShell i wpisz:
docker --version
docker ps
```

#### Na macOS:

```bash
# 1. Pobierz Docker Desktop https://docker.com
# 2. Otwórz .dmg i przeciągnij Docker do Applications
# 3. Uruchom Docker z Applications
# 4. WAŻNE: Settings → Advanced → zaznacz "Allow the default Docker socket"

# Weryfikacja:
docker --version
docker ps
```

#### Na Linuxie (Ubuntu/Debian):

```bash
# Instalacja Docker CE
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Dodaj użytkownika do grupy docker (bez sudo)
sudo usermod -aG docker $USER
newgrp docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

### Krok 2: Uruchomienie Agent Zero

```bash
# Podstawowa komenda (bez persistent storage)
docker run -p 50080:80 agent0ai/agent-zero

# Z persistent storage (ZALECANE)
docker run -p 50080:80 \
  -v ~/agent-zero-data:/a0/usr \
  --name agent-zero \
  agent0ai/agent-zero

# Na Windows PowerShell:
docker run -p 50080:80 `
  -v C:\agent-zero-data:/a0/usr `
  --name agent-zero `
  agent0ai/agent-zero
```

**Co się dzieje:**
- `-p 50080:80` - mapowanie portu (Web UI dostępne na localhost:50080)
- `-v ~/agent-zero-data:/a0/usr` - persistent storage dla chatów i konfiguracji
- `--name agent-zero` - nazwa kontenera (łatwiej zarządzać)

### Krok 3: Sprawdzenie instalacji

```bash
# Sprawdź czy kontener działa
docker ps

# Powinno pokazać:
# CONTAINER ID   IMAGE                  STATUS    PORTS
# abc123def456   agent0ai/agent-zero    Up 2min   0.0.0.0:50080->80/tcp
```

### Krok 4: Dostęp do Web UI

1. Otwórz przeglądarkę
2. Wejdź na: **http://localhost:50080**
3. Powinieneś zobaczyć interfejs Agent Zero z:
   - Lewym panelem (lista chatów)
   - Głównym oknem czatu
   - Prawym panelem (settings)
   - Zielony status indicator (✅ Agent ready)

---

## 📊 Jak to działa - Architektura Agent Zero

### Wizualizacja architektury:

![Agent Zero Architecture](https://raw.githubusercontent.com/77Jimbo77/agent-zero-examples/main/docs/architecture.svg)

**Komponenty:**

```
┌─ Twój komputer
├─ Docker Desktop (wirtualizacja)
│  └─ Linux Container (Ubuntu 22.04)
│     ├─ Agent Zero Framework
│     │  ├─ Chat Interface (Web UI)
│     │  ├─ AI Integration (OpenAI/Claude/Gemini)
│     │  ├─ Decision Engine (ReAct pattern)
│     │  ├─ Tools Management
│     │  └─ Multi-Agent Coordinator
│     │
│     └─ Linux Environment
│        ├─ Python 3.10+
│        ├─ Node.js 18+
│        ├─ Bash/Shell
│        ├─ Package Managers (apt, npm, pip)
│        ├─ Virtual Browser (playwright)
│        └─ File System (/a0/usr - persistent)
```

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
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#38bdf8" />
    </marker>
  </defs>
  <line x1="390" y1="260" x2="330" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <line x1="600" y1="260" x2="600" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <line x1="810" y1="260" x2="870" y2="300" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
  <text x="600" y="750" font-size="12" fill="#94a3b8" text-anchor="middle">Port 50080: Web UI | Port 50022: SSH | Volumes: ~/agent-zero-data:/a0/usr</text>
</svg>
```

### Request Flow - Jak Agent Zero rozwiązuje zadania:

**Krok po kroku:**

1. **Ty:** "Napisz i uruchom Python script do scraping strony"
2. **Web UI:** Wysyła zadanie do Agent Core
3. **Agent Core:** Analizuje zadanie, identyfikuje potrzebne narzędzia
4. **AI Model (OpenAI/Claude):** Generuje plan działania:
   ```
   1. Utwórz plik requirements.txt
   2. Zainstaluj biblioteki (requests, beautifulsoup4)
   3. Napisz Python script
   4. Uruchom script
   ```
5. **Tools Engine:** Wykonuje każdy krok sekwencyjnie
6. **Feedback Loop:** Agent sprawdza czy zadanie zakończone
   - NIE → Planuje następne kroki, wraca do kroku 4
   - TAK → Przechodzi do kroku 7
7. **Wynik:** Prezentujesz wyniki + logi wszystkich kroków

---

## ⚙️ Konfiguracja AI Model

### Setup OpenAI (ChatGPT):

1. Przejdź do **Settings** → **Agent Settings**
2. Chat Model: **"OpenAI"**
3. API Key: wklej klucz z https://platform.openai.com/api-keys
4. API Base URL: `https://api.openai.com/v1` (domyślne)
5. Model: `gpt-4o` (lub `gpt-4-turbo`)
6. Kliknij **"Save"**

### Setup Anthropic (Claude):

1. Settings → Agent Settings
2. Chat Model: **"Anthropic"**
3. API Key: wklej klucz z https://console.anthropic.com
4. Model: `claude-3-5-sonnet-20241022`
5. Save

### Setup lokalnie z Ollama:

```bash
# Najpierw zainstaluj Ollama: https://ollama.ai

# Uruchom model lokalnie (bez API key):
ollama run llama2

# W Agent Zero:
# Settings → Agent Settings
# Provider: "Ollama"
# API Base URL: http://host.docker.internal:11434
# Model: llama2
```

---

## 🎯 Pierwszy Agent - Hello World

### Najprościej - chat z agentem:

1. W lewym panelu kliknij **"New Chat"**
2. W polu czatu wpisz: **"Cześć! Jaki jest dzisiaj dzień tygodnia?"**
3. Agent Zero wykorzysta dostępne narzędzia i odpowie

**Co się dzieje w tle:**
- Agent pobiera systemowy czas
- Oblicza dzień tygodnia
- Formatuje odpowiedź
- Wysyła Ci wynik

### Bardziej interesujące zadania:

```
# Agent Zero będzie pisać kod i wykonywać go
"Napisz i uruchom Python script, który sprawdza najnowszą wersję Node.js z npm"

# Przeglądanie web
"Przejdź na https://github.com/77Jimbo77 i powiedz mi ile mam repozytoriów"

# Analiza danych
"Utwórz CSV z 10 rekordami danych sprzedażowych i przeanalizuj najlepszy miesiąc"

# Kodowanie
"Napisz aplikację TODO app w HTML/CSS/JS i pokaż mi wynik"
```

---

## 🔧 Agent do automatyzacji deploymentu

### Scenario: Automatyczne wdrożenie na Cloudflare Workers

**Krok 1: Utwórz projekt deployment-agent**

1. W Agent Zero: **New Project** → `"deployment-agent"`
2. W lewym panelu dodaj **"Prompt Configuration"**
3. Wpisz poniższy prompt:

```markdown
Jesteś agentem do zarządzania wdrożeniami. Twoje zadania:

1. Sprawdzić aktualną wersję z package.json
2. Uruchomić `npm run build`
3. Wdrożyć na Cloudflare Workers używając wrangler CLI
4. Sprawdzić status deploymentu
5. Przesłać logi z deploymentu

Dostępne narzędzia:
- Terminal (bash/sh)
- File System access (/workspace)
- npm/yarn package manager

Zawsze:
- Sprawdzaj czy deployment się powiódł
- Loguj wszystkie błędy
- Wyślij notyfikację o statusie
```

**Krok 2: Kod agenta deployment**

Utwórz plik `deploy_agent.py` w woluminie Agent Zero:

```python
# /a0/usr/agents/deploy_agent.py
import subprocess
import json
import os
from datetime import datetime

class DeploymentAgent:
    def __init__(self, project_path):
        self.project_path = project_path
        self.log_file = f"/a0/usr/logs/deploy_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    
    def log(self, message):
        """Zapisz log do pliku"""
        with open(self.log_file, 'a') as f:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            f.write(f"[{timestamp}] {message}\n")
        print(message)
    
    def check_version(self):
        """Sprawdź wersję z package.json"""
        package_json = os.path.join(self.project_path, 'package.json')
        with open(package_json, 'r') as f:
            data = json.load(f)
            version = data.get('version', 'unknown')
            self.log(f"✅ Aktualna wersja: {version}")
            return version
    
    def build(self):
        """Uruchom build"""
        self.log("🔨 Rozpoczynam build...")
        result = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=self.project_path,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            self.log("✅ Build zakończony sukcesem")
            return True
        else:
            self.log(f"❌ Build failed: {result.stderr}")
            return False
    
    def deploy(self):
        """Deploy do Cloudflare Workers"""
        self.log("🚀 Rozpoczynam deployment...")
        result = subprocess.run(
            ['npx', 'wrangler', 'deploy'],
            cwd=self.project_path,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            self.log(f"✅ Deployment zakończony: {result.stdout}")
            return True
        else:
            self.log(f"❌ Deployment failed: {result.stderr}")
            return False
    
    def verify_deployment(self):
        """Sprawdź status deploymentu"""
        self.log("🔍 Weryfikuję deployment...")
        # Tutaj możesz dodać sprawdzenie HTTP endpoint
        # lub status z Cloudflare API
        return True
    
    def run(self):
        """Główna funkcja - uruchom cały proces"""
        self.log("🤖 Agent Deployment startuje...")
        
        # 1. Sprawdź wersję
        version = self.check_version()
        
        # 2. Build
        if not self.build():
            self.log("❌ Proces przerwany - build failed")
            return False
        
        # 3. Deploy
        if not self.deploy():
            self.log("❌ Proces przerwany - deployment failed")
            return False
        
        # 4. Weryfikacja
        if self.verify_deployment():
            self.log(f"🎉 Deployment {version} zakończony sukcesem!")
            return True
        
        return False

# Użycie:
if __name__ == "__main__":
    agent = DeploymentAgent("/a0/usr/projects/my-worker")
    success = agent.run()
    exit(0 if success else 1)
```

**Krok 3: Uruchom agenta**

W Agent Zero chat:

```
"Uruchom /a0/usr/agents/deploy_agent.py dla projektu my-worker"
```

---

## 🔗 Integracja z GitHub Actions

### Workflow automatycznego deploymentu

Utwórz `.github/workflows/agent-deploy.yml`:

```yaml
name: Deploy with Agent Zero

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  agent-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Trigger Agent Zero Deployment
        env:
          AGENT_ZERO_URL: ${{ secrets.AGENT_ZERO_URL }}
          AGENT_ZERO_KEY: ${{ secrets.AGENT_ZERO_API_KEY }}
        run: |
          # Wyślij zadanie do Agent Zero przez API
          curl -X POST $AGENT_ZERO_URL/api/task \
            -H "Authorization: Bearer $AGENT_ZERO_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "deployment-agent",
              "task": "Build i deploy do Cloudflare Workers",
              "project": "${{ github.repository }}",
              "branch": "${{ github.ref_name }}",
              "commit": "${{ github.sha }}"
            }'
      
      - name: Check deployment status
        run: |
          # Sprawdź status przez Agent Zero API
          curl -X GET $AGENT_ZERO_URL/api/status/${{ github.run_id }} \
            -H "Authorization: Bearer ${{ secrets.AGENT_ZERO_API_KEY }}"
```

**Konfiguracja GitHub Secrets:**

1. Przejdź do **Settings** → **Secrets and variables** → **Actions**
2. Dodaj:
   - `AGENT_ZERO_URL`: `http://your-agent-zero.com`
   - `AGENT_ZERO_API_KEY`: Twój API key

---

## 💡 Best Practices

### 1. **Bezpieczeństwo - API Keys**

```python
# ✅ DOBRZE - użyj .env file
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

# ❌ ŹLE - hardcoded API key
api_key = "sk-abc123..."  # NIGDY TAK NIE RÓB!
```

**W Agent Zero:**
- Settings → Agent Settings → wpisz API key tam
- Klucz jest zapamiętywany lokalnie w `/a0/usr/`
- NIE commituj do git

### 2. **Error Handling**

```python
# Agent powinien gracefully obsługiwać błędy
try:
    result = agent.execute_task()
except Exception as e:
    log_error(f"Task failed: {e}")
    send_notification("admin@example.com", f"Agent error: {e}")
    # Retry logic
    retry_count = 3
    for i in range(retry_count):
        time.sleep(5)
        try:
            result = agent.execute_task()
            break
        except:
            if i == retry_count - 1:
                raise
```

### 3. **Monitoring i logi**

```python
# Użyj structured logging
import logging
import json

logger = logging.getLogger('agent_zero')
logger.setLevel(logging.INFO)

# Log do pliku + console
file_handler = logging.FileHandler('/a0/usr/logs/agent.log')
console_handler = logging.StreamHandler()

formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Użycie:
logger.info("Agent started", extra={'task': 'deployment', 'version': '1.2.3'})
```

### 4. **Performance - Optymalizacja**

```markdown
# Długie zadania → podziel na etapy
"Najpierw zbuduj strukturę, potem pisz kod, potem testuj"

# Cachuj wyniki
"Jeśli już liczyłeś ten raport, weź z cache"

# Użyj szybszych modeli dla prostych zadań:
# - Claude 3.5 Sonnet → złożona logika
# - GPT-4o → szybkie zadania
# - Llama 2 (Ollama) → proste operacje (bez kosztów API)
```

---

## 🎓 Podsumowanie

**Czego się nauczyłeś:**

✅ Instalacja Agent Zero w Docker (Windows/macOS/Linux)  
✅ Konfiguracja modelu AI (OpenAI, Claude, Ollama)  
✅ Tworzenie chatów i projektów  
✅ Budowanie custom agentów do automatyzacji  
✅ Integracja z Python dla zaawansowanych scenariuszy  
✅ Multi-agent cooperation  
✅ Best practices dla produkcji  
✅ Integracja z GitHub Actions dla CI/CD  

**Następne kroki:**

1. **Eksperymentuj**: Stwórz agenta dla Twojego use case
2. **Automatyzuj**: Podłącz do GitHub Actions dla CI/CD
3. **Integruj**: Połącz z innymi narzędziami (Slack, Discord, Supabase)
4. **Skaluj**: Uruchom multiple agentów dla parallel processing

---

## 🔗 Przydatne linki

- [Agent Zero GitHub](https://github.com/77Jimbo77/agent-zero-examples) - Oficjalne repo z przykładami
- [Agent Zero Docs](https://agent-zero.ai) - Oficjalna dokumentacja
- [Docker Hub - agent0ai/agent-zero](https://hub.docker.com/r/agent0ai/agent-zero) - Docker image
- [OpenAI API Keys](https://platform.openai.com/api-keys) - Dla ChatGPT integration
- [Anthropic Console](https://console.anthropic.com) - Dla Claude integration
- [JIMBO77 Hub](https://github.com/77Jimbo77/JIMBO_devz_inc_HUB) - Nasze projekty i przykłady
- [Agent Zero YouTube Tutorial](https://www.youtube.com/watch?v=2GeXd8u8EKo) - Visual guide
- [VS Code Setup Guide](https://code.visualstudio.com/docs/setup/setup-overview) - Dev environment

---

**Autor:** JIMBO77 AI Social Club  
**Data:** 2026-01-25  
**Kategoria:** AI & Automation  
**Tagi:** #Agent-Zero #AI #Automation #Docker #OpenAI #DevOps #Python

Pytania? Dołącz do dyskusji na [GitHub 77Jimbo77](https://github.com/77Jimbo77)! 🚀
