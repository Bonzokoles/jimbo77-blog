
# 🛠️ Case Study: Naprawa i Optymalizacja Pumo RAG (Cloudflare Workers + Vectorize)

![Pumo RAG Repair](/blog-images/pumo_rag_fix.png)

W świecie AI Agentów i systemów RAG (Retrieval-Augmented Generation), stabilność jest kluczowa. Ostatnio w **Social Club** zmierzyliśmy się z krytycznym błędem w wyszukiwarce produktów Pumo (`pumo-rag`). Oto techniczny deep-dive w proces debugowania i naprawy.

## 🚨 Problem: Error 500 "Internal Server Error"

System przestał odpowiadać na zapytania, zwracając generyczny błąd 500.
Analiza logów (`wrangler tail`) wskazała na wyjątek w metodzie proksy do `Vectorize`:

```typescript
Error: Vectorize query failed: internal error
```

Mimo poprawnych bindingów w `wrangler.toml`, Worker nie mógł komunikować się z bazą wektorową.

![RAG Workflow](/blog-images/rag-workflow-dark-premium.svg)

## 🔍 Techniczna Diagnoza

1.  **Weryfikacja Bindingów**: Sprawdziliśmy `pumo-products` (Vectorize) i `pumo-db` (D1). Wszystko wyglądało poprawnie.
2.  **Testy Izolowane**: Skrypt powłoki `verify-pumo-rag.ps1` potwierdził, że API leży całkowicie.
3.  **Debug Kodu**: Okazało się, że problem leżał w **niekompatybilności API**. Worker próbował używać przestarzałej metody `returnMetadata: 'all'`, która w nowej wersji bindings powodowała konflikt przy serializacji odpowiedzi.

## 🔧 Rozwiązanie

### Krok 1: Fix w Workerze
Zmodyfikowaliśmy `worker.ts` usuwając zbędne parametry zapytania i aktualizując `compatibility_date`:

```diff
- const matches = await env.VECTORIZE.query(vectors, { returnMetadata: 'all' });
+ const matches = await env.VECTORIZE.query(vectors, { returnMetadata: true });
```

### Krok 2: Walka z Kodowaniem (Polskie Znaki)
Po przywróceniu API, zauważyliśmy kolejny problem. Weryfikacja zwracała "krzaki" zamiast polskich znaków (np. `Szafa naroÅ¼nikowa`).

*   **Podejrzenie**: Podwójne kodowanie UTF-8 w bazie D1.
*   **Analiza**: Sprawdzenie surowych danych w D1 (`wrangler d1 execute`) wykazało, że dane w bazie są poprawne (`Szafa narożnikowa`), ale **skrypt weryfikacyjny PowerShell** błędnie interpretował odpowiedź JSON jako Windows-1252.
*   **Fix**: Wymuszenie dekodowania UTF-8 w skrypcie walidacyjnym:
    ```powershell
    $bytes = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetBytes($response.Content)
    $cleanJson = [System.Text.Encoding]::UTF8.GetString($bytes)
    ```

### Krok 3: Robust Indexing (Self-Healing)
Indeksowanie 13,000 produktów bywało przerywane. Wdrożyliśmy nowy skrypt `run-loop.ps1` typu "watchdog", który:
1.  Monitoruje proces `bun run index-products.ts`.
2.  Wznawia go automatycznie w przypadku błędu.
3.  Wyświetla postęp na żywo w terminalu.
4.  Obsługuje "Graceful Shutdown" przez plik `STOP_INDEXING`.

## 🚀 Wynik

*   **Status API**: 🟢 200 OK
*   **Wydajność**: Wyszukiwanie semantyczne działa w <200ms.
*   **Baza**: 13,000+ produktów poprawnie zindeksowanych w D1 i Vectorize.
*   **Jakość**: Polskie znaki są obsługiwane poprawnie.

System **Pumo RAG** jest teraz gotowy do obsługi zapytań agentów w Social Clubie.

---
*Autor: Jimbo (AI Agent Architect)*
*Data: 2026-01-27*
