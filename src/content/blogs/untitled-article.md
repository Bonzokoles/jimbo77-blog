---
title: "Untitled Article"
description: "### Worklog: Zbudowałem własny system RAG - walka z Cloudflare Workers, Vectorize i FAISS. Co działa, co nie, i dlaczego lokalne AI wciąż wygrywa. Moj..."
pubDatetime: 2026-01-07T03:20:19.059104
tags: ["AI", "Cloudflare", "Automation"]
image:
  src: "https://7f490d58a478c6baccb0ae01ea1d87c3.r2.cloudflarestorage.com/mybonzo-blog-contenthttps://r2-public-mybonzo.stolarnia-ams.workers.dev/images/2026-01/WORKLOG_Our_RAG_System.png"
  alt: "Cover image for Untitled Article"
---

### Worklog: Zbudowałem własny system RAG - walka z Cloudflare Workers, Vectorize i FAISS. Co działa, co nie, i dlaczego lokalne AI wciąż wygrywa. Moje wnioski.

**KONTEKST:** Wczoraj wieczorem pracowałem nad własnym systemem RAG, próbując ogarnąć Cloudflare Workers z Vectorize jako bazą wektorową, kontra lokalny setup z FAISS. Chciałem zobaczyć, czy cloud da radę lokalnemu stackowi z embeddingami i LLM na mojej maszynie.

**PROCES:** Debugowałem Worker'a non-stop – embeddingi wrzucałem, ale retrieval w Vectorize ciągle gubił kontekst przy większych chunkach, latency skakało na 2-3s. Testowałem na Pumo dataset (dokumenty PDF z tech specyfikacjami), porównywałem z FAISS lokalnie via LangChain. Mailowałem z supportem Cloudflare, bo autoryzacje blokowały dostęp do indeksu. FAISS śmigał błyskawicznie, zero problemów z skalą na moim GPU.

**WYNIK:** Działa połowicznie! Worker z Vectorize ogarnia proste zapytania, ale przy złożonych RAG-ach (retrieval + generation) accuracy spada o 30-40% vs lokalny FAISS – cloud ma opóźnienia i słabsze matchowanie embeddingów. Lokalne AI wygrywa: zero kosztów, pełna kontrola, latency &lt;200ms, i mogę tweakować modele embeddingowe (np. text-embedding-3-large) bez limitów API[1][4]. Wniosek: cloud fajny do demo, ale lokalnie budujesz solidniej, zwłaszcza z FAISS/ChromaDB[4].

**NASTĘPNY KROK:** Jutro dodam hybrid – FAISS lokalnie + Worker tylko do edge cachingu, i przetestuję na realnych klientach.

**CTA:** Chcesz podobny setup? Napisz maila na [moj.email@dev.pl].

> *Konsultacje AI setup pod Twój biznes – link w bio*