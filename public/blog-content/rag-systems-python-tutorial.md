# 🔍 RAG Systems w Pythonie - Kompletny Przewodnik 2025

## Wprowadzenie

**Retrieval-Augmented Generation (RAG)** to najważniejsza architektura AI w 2025 roku. Pozwala LLM-om na dostęp do aktualnych, dokładnych informacji z Twoich własnych baz danych. W tym artykule nauczysz się budować production-ready RAG systemy od zera.

---

## Co To Jest RAG?

### Problem Ze Zwykłym LLM-em

```
User: "Jaka jest polityka zwrotów?"
LLM: "Nie mam aktualnych informacji w mojej wiedzy treningowej"
❌ Wynik: Przestarzałe lub błędne informacje
```

### Rozwiązanie: RAG

```
User Query
    ↓
Retrieve: Szukaj w swojej bazie (wektory)
    ↓
Augment: Dodaj kontekst do promptu
    ↓
Generate: LLM odpowiada z kontekstem
    ↓
✓ Wynik: Dokładna, aktualna, uzasadniona odpowiedź
```

### Architektura RAG

```
┌─────────────────────────────────────────┐
│  INGESTION PIPELINE (Offline)           │
├─────────────────────────────────────────┤
│ 1. Load Documents (PDF, Docs, Websites) │
│ 2. Chunk Text (Smart Chunking)          │
│ 3. Create Embeddings (Semantic)         │
│ 4. Store in Vector Database             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  RETRIEVAL PIPELINE (Query Time)        │
├─────────────────────────────────────────┤
│ 1. User Query                           │
│ 2. Query Embedding                      │
│ 3. Similarity Search (Top K)            │
│ 4. Reranking (Optional but Important)   │
│ 5. Return Relevant Chunks               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  GENERATION PIPELINE                    │
├─────────────────────────────────────────┤
│ 1. Build Prompt: Query + Context        │
│ 2. Call LLM                             │
│ 3. Stream Response                      │
│ 4. Return with Sources                  │
└─────────────────────────────────────────┘
```

---

## Krok 1: Ingestion - Przygotowanie Danych

### Instalacja

```bash
pip install langchain openai faiss-cpu sentence-transformers python-dotenv
```

### Load & Chunk Documents

```python
from langchain.document_loaders import PDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Załaduj PDF
loader = PDFLoader("documents/policy.pdf")
documents = loader.load()

# Smart Chunking (512 tokens, overlap 20%)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=102,
    separators=["\n\n", "\n", " ", ""]
)

chunks = splitter.split_documents(documents)
print(f"✓ Created {len(chunks)} chunks")
```

### Create Embeddings

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.huggingface import HuggingFaceEmbeddings

# Opcja 1: OpenAI (lepsze wyniki, płatne)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Opcja 2: Open Source (darmowe, lokalne)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Osadź chunki
chunk_embeddings = embeddings.embed_documents(
    [chunk.page_content for chunk in chunks]
)
print(f"✓ Created embeddings for {len(chunk_embeddings)} chunks")
```

### Store in Vector Database

```python
from langchain.vectorstores import FAISS

# FAISS (szybki, lokalny)
vector_store = FAISS.from_documents(chunks, embeddings)
vector_store.save_local("faiss_index")

# Lub: Pinecone (cloud, skalabilne)
from langchain.vectorstores import Pinecone
import pinecone

pinecone.init(api_key="...", environment="...")
vector_store = Pinecone.from_documents(
    chunks, 
    embeddings, 
    index_name="rag-index"
)
```

---

## Krok 2: Retrieval - Szukanie Kontekstu

### Basic Retrieval

```python
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

# Load vector store
embeddings = OpenAIEmbeddings()
vector_store = FAISS.load_local("faiss_index", embeddings)

# Query
query = "Jaka jest polityka zwrotów?"
results = vector_store.similarity_search(query, k=3)

for i, doc in enumerate(results):
    print(f"\n{i+1}. Score: {doc.metadata}")
    print(doc.page_content[:200])
```

### Hybrid Search (Keyword + Semantic)

```python
from langchain.retrievers import BM25Retriever, EnsembleRetriever
from langchain.vectorstores import FAISS

# Vector Search (semantic)
vector_retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

# Keyword Search (BM25)
keyword_retriever = BM25Retriever.from_documents(chunks)

# Combine both
ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, keyword_retriever],
    weights=[0.6, 0.4]  # 60% semantic, 40% keyword
)

results = ensemble_retriever.get_relevant_documents(query)
```

### Reranking (Important!)

```python
from langchain.retrievers.contextual_compression import (
    ContextualCompressionRetriever
)
from langchain.retrievers.document_compressors import CohereReranker
from cohere import Client

# Initialize reranker
cohere_client = Client(api_key="...")
reranker = CohereReranker(client=cohere_client)

# Wrap retriever
compression_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=ensemble_retriever
)

# Get best results
results = compression_retriever.get_relevant_documents(query)
```

---

## Krok 3: Generation - Tworzenie Odpowiedzi

### Simple Generation

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)

# Build prompt template
template = """You are a helpful customer service assistant.
Use the provided context to answer the question.
If you don't know, say "I don't have this information".

Context:
{context}

Question: {question}

Answer:"""

prompt = ChatPromptTemplate.from_template(template)

# RAG Chain
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
)

response = rag_chain.invoke("Jaka jest polityka zwrotów?")
print(response.content)
```

### Generation with Citations

```python
from langchain.schema import Document

def generate_with_citations(query, docs, llm):
    # Create context with sources
    context = "\n\n".join([
        f"[Source {i}] {doc.page_content}"
        for i, doc in enumerate(docs)
    ])
    
    prompt = f"""Answer based on context:
    
{context}

Question: {query}

Provide answer with citations like [Source 1], [Source 2]"""
    
    response = llm.invoke(prompt)
    return response.content

answer = generate_with_citations(
    "Jaka jest polityka zwrotów?",
    results,
    llm
)
```

---

## Komplety RAG System - 3 Frameworki

### 1️⃣ LangChain RAG

```python
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import FAISS

vector_store = FAISS.load_local("faiss_index", embeddings)

qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4-turbo"),
    chain_type="stuff",  # or "map_reduce", "refine"
    retriever=vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
)

response = qa_chain.run("Jaka jest polityka zwrotów?")
print(response)
```

### 2️⃣ LlamaIndex RAG

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.llms.openai import OpenAI

# Load documents
documents = SimpleDirectoryReader("./documents").load_data()

# Create index
index = VectorStoreIndex.from_documents(documents)

# Query engine
query_engine = index.as_query_engine(
    similarity_top_k=3,
    response_mode="compact"
)

response = query_engine.query("Jaka jest polityka zwrotów?")
print(response)
```

### 3️⃣ Custom RAG Pipeline (Full Control)

```python
from typing import List
from langchain.schema import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import FAISS

class CustomRAG:
    def __init__(self, vector_store_path: str):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-4-turbo")
        self.vector_store = FAISS.load_local(
            vector_store_path, 
            self.embeddings
        )
    
    def retrieve(self, query: str, k: int = 3) -> List[Document]:
        """Retrieve relevant documents"""
        return self.vector_store.similarity_search(query, k=k)
    
    def generate(self, query: str, docs: List[Document]) -> str:
        """Generate answer with context"""
        context = "\n".join([d.page_content for d in docs])
        
        prompt = f"""Answer based on context:

{context}

Question: {query}"""
        
        response = self.llm.invoke(prompt)
        return response.content
    
    def query(self, question: str) -> dict:
        """Full RAG pipeline"""
        docs = self.retrieve(question)
        answer = self.generate(question, docs)
        
        return {
            "answer": answer,
            "sources": [d.metadata for d in docs]
        }

# Usage
rag = CustomRAG("faiss_index")
result = rag.query("Jaka jest polityka zwrotów?")
print(result["answer"])
print(f"Sources: {result['sources']}")
```

---

## Advanced Techniques

### Query Expansion

```python
def expand_query(query: str, llm) -> List[str]:
    """Generate alternative queries for better retrieval"""
    
    prompt = f"""Generate 3 alternative ways to ask this question:
    Original: {query}
    
    Alternatives:"""
    
    response = llm.invoke(prompt)
    queries = [query] + response.content.strip().split("\n")
    return queries

expanded = expand_query("Jaka jest polityka zwrotów?", llm)
print(expanded)
# ['Jaka jest polityka zwrotów?', 'Jak zwrócić produkt?', 'Jaki jest czas zwrotu?']
```

### Multi-Step Retrieval

```python
def multi_step_retrieval(query: str, retriever, llm, steps: int = 2):
    """Iterative retrieval for complex queries"""
    
    context = []
    current_query = query
    
    for step in range(steps):
        # Retrieve documents
        docs = retriever.get_relevant_documents(current_query)
        context.extend(docs)
        
        # Generate refined query for next step
        combined_context = "\n".join([d.page_content for d in docs])
        
        prompt = f"""Based on these documents, what follow-up question would help answer: {query}?

Context: {combined_context}

Follow-up question:"""
        
        follow_up = llm.invoke(prompt).content
        current_query = follow_up
    
    return context

# Usage
docs = multi_step_retrieval(
    "Ile kosztuje wysyłka?",
    retriever,
    llm
)
```

### Reranking with Cross-Encoders

```python
from sentence_transformers import CrossEncoder

# Load cross-encoder for reranking
cross_encoder = CrossEncoder('cross-encoder/qnli-distilroberta-base')

def rerank_results(query: str, docs: List[Document], top_k: int = 3):
    """Rerank documents by relevance"""
    
    # Score all documents
    pairs = [[query, doc.page_content] for doc in docs]
    scores = cross_encoder.predict(pairs)
    
    # Sort by score
    scored_docs = list(zip(docs, scores))
    scored_docs.sort(key=lambda x: x[1], reverse=True)
    
    # Return top K
    return [doc for doc, score in scored_docs[:top_k]]

# Usage
top_docs = rerank_results(query, all_docs)
```

---

## Real-World Example: Customer Support Bot

```python
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import FAISS

# Load vector store
embeddings = OpenAIEmbeddings()
vector_store = FAISS.load_local("faiss_index", embeddings)

# Create chain
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

qa_chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0),
    retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
    memory=memory,
    verbose=True
)

# Chat loop
while True:
    user_input = input("You: ")
    response = qa_chain({"question": user_input})
    print(f"Assistant: {response['answer']}\n")
```

---

## Production Considerations

### 1. **Chunking Strategy**
```
❌ Too small (100 tokens)  → Lost context, more API calls
❌ Too large (2000 tokens) → Slower retrieval, noise
✅ Optimal (512 tokens, 20% overlap) → Balance is key
```

### 2. **Embedding Model Choice**
| Model | Quality | Speed | Cost | Best For |
|-------|---------|-------|------|----------|
| OpenAI text-embedding-3-small | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ | Production |
| all-MiniLM-L6-v2 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | Local |
| BGE-base | ⭐⭐⭐⭐ | ⭐⭐⭐ | Free | Good balance |

### 3. **Vector Database Selection**
```
FAISS → Local, fast, good for <1M docs
Pinecone → Managed, scalable, easy
Weaviate → Open source, flexible
Milvus → High performance, complex
```

### 4. **Monitoring & Evaluation**

```python
def evaluate_rag(test_queries: List[str], expected_answers: List[str]):
    """Evaluate RAG system"""
    
    from langchain.evaluation import load_evaluator
    
    evaluator = load_evaluator("qa")
    
    results = []
    for query, expected in zip(test_queries, expected_answers):
        # Generate answer
        retrieved_docs = retriever.get_relevant_documents(query)
        answer = generate(query, retrieved_docs)
        
        # Evaluate
        score = evaluator.evaluate_strings(
            prediction=answer,
            reference=expected,
            input=query
        )
        
        results.append(score)
    
    avg_score = sum(r["score"] for r in results) / len(results)
    print(f"✓ Average Score: {avg_score}")
    return results
```

---

## Common Pitfalls & Solutions

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|------------|
| **Low relevance** | Zły chunking | Użyj semantic chunking |
| **Hallucinations** | Brak kontekstu | Dodaj retrieval validation |
| **Slow queries** | Duża baza wektorów | Używaj reranking, filters |
| **Expensive** | Dużo API calls | Cache embeddings, batch process |
| **Outdated info** | Stara baza wektorów | Refresh regularly |

---

## Best Practices 2025

1. **Hybrid Search** - zawsze kombinuj semantic + keyword
2. **Reranking** - drugi etap filtrowania z cross-encoders
3. **Query Expansion** - generuj alternatywne pytania
4. **Caching** - cache embeddings i wyniki
5. **Monitoring** - track relevance, latency, costs
6. **Updating** - refresh knowledge base regularnie
7. **Citations** - zawsze pokazuj źródła
8. **Testing** - extensive evaluation framework

---

## Zasoby & Linki

- **LangChain RAG**: https://docs.langchain.com/rag
- **LlamaIndex**: https://docs.llamaindex.ai
- **Vector DB Comparison**: https://www.pinecone.io/learn/vector-database/
- **Embedding Models**: https://huggingface.co/spaces/mteb/leaderboard
- **RAG Evaluation**: https://github.com/explodinggradients/ragas

---

## Podsumowanie

RAG to **przyszłość praktycznych aplikacji AI**. Umożliwia:

- ✅ Dokładne, aktualne odpowiedzi
- ✅ Przezroczyste źródła
- ✅ Niska halucynacja
- ✅ Kontrola nad wiedzą

**Zacznij dzisiaj - RAG system możesz postawić w godzinę!** ⚡

---

**Happy RAG Building!** 🔍✨