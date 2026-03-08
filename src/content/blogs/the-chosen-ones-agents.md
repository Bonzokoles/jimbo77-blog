# Architektura Systemu Multi-Agentowego: Jimbo OS v1.3

Wdrożenie kompleksowego systemu orkiestracji agentów AI wymaga czegoś więcej niż tylko API. To symbioza warstwy obliczeniowej, dynamicznego storage'u i inteligentnych bramek sieciowych. Oto techniczny breakdown obecnego stacku na BonzoMachine.

---

## 🛠️ Warstwy Systemu (The Stack)

### 1. Orchestrator: Agent Zero (Podman Container)
Centralna pętla decyzyjna działająca w izolowanym środowisku Podman. 
- **Endpoint:** `http://4940:5080`
- **Środowisko:** Miniconda / Python 3.13.
- **Zadanie:** Rozbijanie złożonych zadań na pod-zadania i delegacja do wyspecjalizowanych procesów.

### 2. Compute Layer: CUDA Acceleration
Warstwa odpowiedzialna za ciężkie operacje na modelach lokalnych i Transformersach.
- **Zasoby:** Biblioteki NVIDIA CUDA zintegrowane z hostem.
- **Obciążenie:** Instalacja i inicjalizacja ciężkich wag modeli (m.in. dla Tencent GraphRAG). To tutaj procesor "drży" podczas kompilacji bibliotek.

### 3. Data Engine: Dynamic R2 Hub
System "No-Deploy CMS" oparty na Cloudflare R2 i Workerach.
- **Backend:** `r2-public-worker` (Cloudflare Workers).
- **Protokół:** Numeryczne mapowanie zasobów (`/texts/*.md` <-> `/hero/*.jpg`).
- **Automatyzacja:** Wykorzystanie `env.R2_BUCKET.list()` do budowania dynamicznego indeksu postów w czasie rzeczywistym.

### 4. Network Gateway: Cloudflared & Custom Ports
Zarządzanie dostępem i bindowaniem usług.
- **Brama:** Host `4940`.
- **Sidecar Service:** Serwer GraphRAG działający na porcie `8099` (izolacja od portu `8000`).
- **Komunikacja:** WebSockets dla real-time logs i HTTP dla API calls.

---

## 🚀 Optymalizacja Operacyjna
Zastosowanie **DeepSeek-Chat** jako głównego silnika dla agentów operacyjnych pozwoliło na:
- Redukcję kosztów o ~85% względem GPT-4o.
- Obsługę gigantycznego kontekstu (do 128k tokenów) przy zadaniach takich jak Smol-Scout (15-krokowy research sieciowy).

## 📋 Definition of Done (DoD)
System uznajemy za stabilny, gdy:
- Wszystkie 6 mikroserwisów zwraca status 200 OK.
- Latencja na bramie `4940` nie przekracza 50ms.
- Wykonanie `pip install` nie powoduje restartu kontenera przez OOM (Out of Memory).

---
*Dokumentacja techniczna Jimbo OS | 2026-01-28*
