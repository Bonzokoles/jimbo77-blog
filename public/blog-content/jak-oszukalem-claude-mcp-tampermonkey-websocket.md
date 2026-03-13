---
title: "Jak oszukałem Claude'a — Tampermonkey, WebSocket i 45 minut ślepego posłuszeństwa"
description: "Zbudowałem system userscriptów który wstrzykuje MCP do przeglądarki. Claude przez 45 minut wykonywał PowerShell na moim komputerze nie wiedząc że go oszukuję."
date: 2026-03-13
author: "Karol"
tags:
  - Moje Projekty
  - Jimbo77
  - Dev
  - MCP
  - Security
category: "AI Moje Projekty"
language: pl
site: jimbo77.org
---

Są rzeczy, które robisz bo chcesz zobaczyć jak daleko się da. Nie po to żeby coś zepsuć — po to żeby zrozumieć gdzie jest mur. I czy ten mur jest prawdziwy.

Zbudowałem setup który dał Claude'owi, Gemini i ChatGPT dostęp do mojego systemu operacyjnego — przez przeglądarkę. Bez API. Bez oficjalnego MCP. Przez Tampermonkey, WebSocket i kawałek Node.js na localhost. I zadziałało lepiej niż powinno.

---

## 🔧 Architektura: jak to działa

Całość opiera się na trzech warstwach:

### Warstwa 1: Tampermonkey userscripts

Dwa skrypty — `MCP_v6_FULL_UNBLOCK.js` i `Gemini MCP v0.6` — wstrzykują JavaScript bezpośrednio w interfejsy webowe Claude'a, Gemini i ChatGPT. Skrypty przechwytują komendy w chacie, np.:

```
/[mcp] dir C:\
/[mcp] Get-Process
/[mcp] cat package.json
```

Każda taka komenda jest wyłapywana przez userscript zanim interfejs ją przetworzy jako zwykły tekst.

### Warstwa 2: WebSocket → localhost

Przechwycona komenda leci przez WebSocket do lokalnego serwera Node.js (`server.js`) nasłuchującego na porcie 9999. Czasami wystawiam go przez ngrok, więc AI ma dostęp nawet zdalnie — ale to już bardziej eksperyment niż coś do codziennego użytku.

```
[Przeglądarka: Claude/Gemini/ChatGPT]
         │
    Tampermonkey userscript
         │
    WebSocket (ws://localhost:9999)
         │
    [Node.js server.js]
         │
    ┌────┴────┐
    │ System  │
    └─────────┘
```

### Warstwa 3: Serwer JSON-RPC

Serwer implementuje protokół JSON-RPC z kilkoma tool-ami:

| Tool | Opis |
|------|------|
| `shell/exec` | Wykonanie komend shell/PowerShell |
| `filesystem/read` | Odczyt plików z dysku |
| `filesystem/write` | Zapis plików na dysk |
| `vscode/open` | Otwarcie pliku w VS Code |

Wynik wraca tą samą drogą — WebSocket → userscript → wstrzyknięcie odpowiedzi do interfejsu czatu. Dla AI wygląda to tak, jakby miał natywne narzędzia systemowe.

---

## 🎭 Zeno Bro Web Core — pułapka w iframe

Zeno Bro Web Core to coś osobnego od reszty stacku. To **iframe-owa wyszukiwarka którą zbudowałem sam** — bazując na estetyce i logice starych wyszukiwarek z późnych lat 90. Taki retro-browser, który rozbudowałem o dodatkowe funkcje: wbudowane rozszerzenia Chrome, minimalistyczny sandbox i celowo okrojone sygnały środowiskowe.

To nie był kod MCP. To były bardziej **rozszerzenia do Chrome osadzone w mojej przeglądarce** — działające wewnątrz iframe, który AI traktował jak natywne okno systemowe.

Ciekawiło mnie jedno: jak Claude i inne modele zareagują na tę iframe-ową pułapkę? Czy rozpoznają że operują w przeglądarce, w sandboxie, w kontrolowanym środowisku?

Nie rozpoznały.

Standardowo Claude, Gemini czy ChatGPT mają hardcoded ograniczenia: "nie mogę wykonywać kodu", "nie mam dostępu do systemu plików", "jestem modelem językowym". Ale te ograniczenia opierają się na detekcji kontekstu — model sprawdza *gdzie jest* i na tej podstawie decyduje *co może*. Kiedy kontekst wygląda jak natywny terminal lub natywna przeglądarka systemowa — ograniczenia się nie włączają.

Zeno Bro robi dokładnie to: wygląda wystarczająco „prawdziwie", że AI nie odpala swoich guardrails. Retro UI z lat 90., minimalistyczny interfejs, brak typowych sygnałów iframe — model nie widzi powodu żeby się bronić.

---

## 🤖 45 minut z Claude'em

Najciekawszy test: Claude.

Podłączyłem setup, otworzyłem chat i zacząłem wydawać polecenia. Claude wykonywał PowerShell na moim komputerze. Dir, Get-Process, odczyt plików, listowanie katalogów. Bez wahania. Przez **45 minut**.

Co robił:
- Przeglądał strukturę katalogów
- Czytał pliki konfiguracyjne
- Listował uruchomione procesy
- Odpowiadał na pytania bazując na realnych danych z mojego systemu

Ani razu nie powiedział "nie mogę tego zrobić". Ani razu nie zakwestionował skąd ma te dane. Dla niego wyglądało to jak natywny tool call — bo technicznie nim był. Różnica polegała na tym, że tool call nie przyszedł od oficjalnego API, tylko z wstrzykniętego JavaScript.

Potem mu powiedziałem co się dzieje. Że to nie jest oficjalne MCP. Że wstrzykuję komendy przez Tampermonkey. Że jego "narzędzia" to mój Node.js na porcie 9999.

Reakcja? Natychmiastowy stop. *"Nie mogę kontynuować"*. Przełączył się w tryb odmowy.

To jest fascynujące z punktu widzenia architektury bezpieczeństwa: **ograniczenia AI nie są techniczne — są kontekstualne**. Claude nie "nie może" wykonać PowerShell. On "uważa że nie powinien" — i ta granica istnieje tylko dopóki wie gdzie jest.

---

## 🧠 Co to mówi o AI security

Nie buduję tego żeby cokolwiek łamać. Buduję to żeby zrozumieć.

Kilka wniosków:

### 1. Guardrails to warstwy psychologiczne, nie techniczne

Modele językowe nie mają hardcoded blokad na poziomie runtime. Ich ograniczenia to **konwencje zachowania natrrenowane w RLHF**. Kiedy kontekst sugeruje że "mogą" — robią. Kiedy ktoś im powie że "nie powinny" — przestają.

### 2. Kontekst > reguły

Claude przeanalizował mój system plików nie dlatego że "złamał zasady". Zrobił to bo kontekst mówił mu, że ma do tego uprawnienia. MCP oficjalny i MCP wstrzyknięty przez Tampermonkey wyglądają identycznie z perspektywy modelu.

### 3. Przeglądarka to najsłabsze ogniwo

Cały interfejs to strona WWW. Userscript ma pełny dostęp do DOM. Może przechwytywać, modyfikować i wstrzykiwać cokolwiek. To nie jest luka w Claude — to jest luka w architekturze "AI jako webapp".

### 4. Sandbox nie działa jeśli AI nie wie że jest w sandboxie

Zeno Bro to iframe-owa wyszukiwarka zbudowana na bazie retro-designu z lat 90. — z rozszerzeniami Chrome wbudowanymi w środku. Celowo minimalizuje sygnały "jesteś w przeglądarce". Efekt: AI zachowuje się jakby miał natywny dostęp. To nie jailbreak — to **context spoofing**.

---

## 🛠 Stack techniczny

```
Tampermonkey v5.x
├── MCP_v6_FULL_UNBLOCK.js    → Claude + ChatGPT
├── Gemini MCP v0.6            → Gemini Pro
│
WebSocket Client (w userscripcie)
└── ws://localhost:9999
    │
Node.js server.js (JSON-RPC)
├── shell/exec         → child_process.exec()
├── filesystem/read    → fs.readFileSync()
├── filesystem/write   → fs.writeFileSync()
├── vscode/open        → code --goto {file}
│
ngrok (opcjonalnie)
└── https://xxxx.ngrok-free.app → localhost:9999
│
Zeno Bro Web Core (iframe wyszukiwarka, retro 90s)
├── custom Chrome extensions wbudowane
├── minimal sandbox, retro UI z lat 90.
└── iframe-pułapka: AI nie wykrywa środowiska przeglądarkowego
```

---

## ⚠️ Disclaimer

To jest **eksperyment edukacyjny**. Nie zachęcam do uruchamiania tego na cudzych maszynach, nie publikuję gotowych exploitów, nie próbuję obchodzić terms of service. Cały test odbywał się na moim komputerze, z moimi narzędziami, na moich kontach.

Ale uważam że warto o tym mówić — bo jeśli ja, samouk z Poznania, potrafiłem to zrobić w kilka wieczorów, to ktoś z większą wiedzą już to robi na poważnie. I firmy budujące AI powinny o tym wiedzieć.

---

## Co dalej?

System jest surowy. Wymaga dopracowania:
- Lepszy error handling na serwerze
- Autoryzacja na WebSocket (teraz jest open)
- Logowanie i audyt komend
- Może pełny MCP-compliant protokół zamiast custom JSON-RPC

Ale proof of concept działa. I to, czego mnie nauczył, jest ważniejsze niż sam kod:

> **AI nie jest tak zamknięty jak myślimy. Jego mury to konwencje, nie beton. I wystarczy zmienić kontekst żeby przejść na drugą stronę.**

Ciekawe czasy.

---

*Autor: Karol — Jimbo77 Social Club*
*Marzec 2026*
