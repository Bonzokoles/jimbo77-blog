# Mikrousługi AI

Artykuł wyjaśniający architekturę, wzorce i sposoby wdrażania mikrousług AI w stylu MOA. Opisuje budowę modularnych agentów, komunikację API, orkiestrację z MCP oraz wzorce skalowania i wysokiej dostępności.

## Najważniejsze cechy
- Modularność, SRP, API-first
- Orkiestracja przez MCP
- Skalowanie poziome i bezpieczeństwo

## Przykład kodu (FastAPI)
```python
from fastapi import FastAPI
@app.get('/health')
def health():
    return {'status': 'ok'}
```
