# Semantic Vector Search

Wyszukiwanie semantyczne oparte na embeddingach umożliwia inteligentne wyszukiwanie podobnych dokumentów, kodu, faktów czy rekordów – także w rozproszonych systemach agentowych. Pozwala na integrację RAG, scoring, hybrydowe workflow agentów.

## Cechy
- Wektoryzacja tekstu, obrazu, kodu
- Indeksy FTS5 SQLite, Redis, Pinecone
- Integracja agentów retriever/generator
- Minimalizacja halucynacji LLM

## Przykład kodu wyszukiwarki
```typescript
const index = await openVectorIndex();
const results = index.search(query, { topK: 3 });
```
