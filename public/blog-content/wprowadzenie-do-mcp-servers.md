# Wprowadzenie do MCP Servers - Model Context Protocol

> Poznaj Model Context Protocol - nowy standard komunikacji dla AI agentów. Dowiedz się jak tworzyć własne serwery MCP i integrować je z aplikacjami.

## 🎯 Wprowadzenie

Model Context Protocol (MCP) to rewolucyjny standard otwartej komunikacji między aplikacjami a agentami AI, opracowany przez Anthropic. W świecie, gdzie każda aplikacja tworzy własne API dla AI, MCP proponuje zunifikowane podejście - podobnie jak USB standaryzował łączenie urządzeń.

Wyobraź sobie świat, w którym Twój asystent AI może bezproblemowo:
- Czytać pliki z Twojego dysku lokalnego 📁
- Wykonywać zapytania do bazy danych 🗄️
- Pobierać dane z API zewnętrznych 🌐
- Uruchamiać narzędzia deweloperskie 🛠️

Wszystko to bez konieczności pisania dedykowanych integracji dla każdego narzędzia. To właśnie obiecuje MCP!

### Dlaczego MCP jest ważny?

Przed MCP każda aplikacja AI musiała implementować własny protokół komunikacji:
- VSCode Copilot ma własne API
- ChatGPT używa plugin architecture
- Claude miał własny system narzędzi

MCP to **USB dla AI** - jeden standard, który działa wszędzie.

## 📐 Architektura MCP

### Trzy główne komponenty

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │ ◄──► │  MCP Server  │ ◄──► │  Resources  │
│ (AI Agent)  │      │  (Protocol)  │      │  (Tools)    │
└─────────────┘      └──────────────┘      └─────────────┘
```

1. **MCP Client** - aplikacja AI (np. Claude Desktop, custom agent)
2. **MCP Server** - serwer implementujący protokół MCP
3. **Resources** - narzędzia, bazy danych, API, pliki

### Przykład prostego MCP Server

```python
# simple_mcp_server.py
from mcp import Server, Tool
from mcp.types import TextContent

# Inicjalizacja serwera MCP
server = Server("my-first-mcp-server")

@server.tool()
async def get_weather(city: str) -> TextContent:
    """
    Pobiera pogodę dla podanego miasta.
    
    Args:
        city: Nazwa miasta (np. 'Warsaw', 'London')
    
    Returns:
        TextContent z informacją o pogodzie
    """
    # Symulacja API call (w prawdziwej implementacji użyłbyś prawdziwego API)
    weather_data = {
        "Warsaw": "☀️ Słonecznie, 22°C",
        "London": "🌧️ Deszczowo, 15°C",
        "Berlin": "⛅ Częściowo pochmurno, 18°C"
    }
    
    result = weather_data.get(city, f"Brak danych dla miasta: {city}")
    return TextContent(type="text", text=result)

@server.tool()
async def calculate(expression: str) -> TextContent:
    """
    Bezpieczny kalkulator matematyczny.
    
    Args:
        expression: Wyrażenie matematyczne (np. '2 + 2', '10 * 5')
    
    Returns:
        TextContent z wynikiem obliczeń
    """
    try:
        # Bezpieczne obliczenie (tylko podstawowe operacje)
        result = eval(expression, {"__builtins__": {}}, {})
        return TextContent(type="text", text=f"Wynik: {result}")
    except Exception as e:
        return TextContent(type="text", text=f"Błąd: {str(e)}")

# Uruchomienie serwera
if __name__ == "__main__":
    server.run()
```

### Konfiguracja klienta MCP

Aby połączyć się z serwerem MCP, klient potrzebuje konfiguracji:

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "my-weather-server": {
      "command": "python",
      "args": ["simple_mcp_server.py"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 🛠️ Wymagania wstępne

Przed rozpoczęciem pracy z MCP upewnij się, że masz:

1. **Python 3.10+** lub **Node.js 18+**
   ```bash
   # Sprawdź wersję Python
   python --version
   
   # Lub Node.js
   node --version
   ```

2. **Zainstaluj MCP SDK**
   ```bash
   # Python
   pip install mcp
   
   # Node.js
   npm install @modelcontextprotocol/sdk
   ```

3. **Klient MCP** - np. Claude Desktop, lub własny klient

## 🚀 Tworzenie własnego MCP Server krok po kroku

### Krok 1: Struktura projektu

```bash
my-mcp-server/
├── src/
│   ├── __init__.py
│   ├── server.py          # Główny plik serwera
│   └── tools/
│       ├── __init__.py
│       ├── file_tools.py  # Narzędzia do plików
│       └── db_tools.py    # Narzędzia do bazy danych
├── tests/
│   └── test_server.py
├── requirements.txt
└── README.md
```

### Krok 2: Implementacja narzędzi do plików

```python
# src/tools/file_tools.py
from mcp import Tool
from mcp.types import TextContent
from pathlib import Path
import json

class FileTools:
    """Narzędzia do operacji na plikach."""
    
    def __init__(self, allowed_dirs: list[str]):
        """
        Args:
            allowed_dirs: Lista dozwolonych katalogów (security!)
        """
        self.allowed_dirs = [Path(d) for d in allowed_dirs]
    
    def is_path_allowed(self, path: Path) -> bool:
        """Sprawdza czy ścieżka jest w dozwolonych katalogach."""
        return any(
            path.resolve().is_relative_to(allowed_dir.resolve())
            for allowed_dir in self.allowed_dirs
        )
    
    async def read_file(self, filepath: str) -> TextContent:
        """
        Czyta zawartość pliku.
        
        Args:
            filepath: Ścieżka do pliku
            
        Returns:
            Zawartość pliku jako TextContent
        """
        path = Path(filepath)
        
        # Security check
        if not self.is_path_allowed(path):
            return TextContent(
                type="text",
                text=f"❌ Błąd: Dostęp do {filepath} jest zabroniony"
            )
        
        try:
            content = path.read_text(encoding='utf-8')
            return TextContent(
                type="text",
                text=f"📄 Zawartość {filepath}:\n\n{content}"
            )
        except FileNotFoundError:
            return TextContent(
                type="text",
                text=f"❌ Plik {filepath} nie istnieje"
            )
        except Exception as e:
            return TextContent(
                type="text",
                text=f"❌ Błąd odczytu: {str(e)}"
            )
    
    async def list_directory(self, dirpath: str) -> TextContent:
        """
        Listuje zawartość katalogu.
        
        Args:
            dirpath: Ścieżka do katalogu
            
        Returns:
            Lista plików i katalogów
        """
        path = Path(dirpath)
        
        if not self.is_path_allowed(path):
            return TextContent(
                type="text",
                text=f"❌ Błąd: Dostęp do {dirpath} jest zabroniony"
            )
        
        try:
            items = []
            for item in path.iterdir():
                icon = "📁" if item.is_dir() else "📄"
                items.append(f"{icon} {item.name}")
            
            result = "\n".join(items) if items else "(pusty katalog)"
            return TextContent(
                type="text",
                text=f"📂 Zawartość {dirpath}:\n\n{result}"
            )
        except Exception as e:
            return TextContent(
                type="text",
                text=f"❌ Błąd: {str(e)}"
            )
```

### Krok 3: Serwer główny z rejestracją narzędzi

```python
# src/server.py
from mcp import Server
from tools.file_tools import FileTools
import os

# Inicjalizacja serwera
server = Server("file-management-mcp")

# Utwórz narzędzia z dozwolonymi katalogami
allowed_dirs = [
    os.path.expanduser("~/Documents"),
    os.path.expanduser("~/Projects")
]
file_tools = FileTools(allowed_dirs)

# Rejestracja narzędzi jako MCP tools
@server.tool()
async def read_file(filepath: str):
    """Czyta zawartość pliku z dozwolonego katalogu."""
    return await file_tools.read_file(filepath)

@server.tool()
async def list_directory(dirpath: str):
    """Listuje zawartość katalogu."""
    return await file_tools.list_directory(dirpath)

@server.tool()
async def search_files(directory: str, pattern: str):
    """
    Wyszukuje pliki pasujące do wzorca.
    
    Args:
        directory: Katalog do przeszukania
        pattern: Wzorzec nazwy (np. '*.py', 'test_*.json')
    """
    from pathlib import Path
    from mcp.types import TextContent
    
    path = Path(directory)
    
    if not file_tools.is_path_allowed(path):
        return TextContent(
            type="text",
            text=f"❌ Błąd: Dostęp zabroniony"
        )
    
    try:
        matches = list(path.glob(pattern))
        if not matches:
            return TextContent(
                type="text",
                text=f"🔍 Brak plików pasujących do '{pattern}'"
            )
        
        results = "\n".join(f"📄 {m.name}" for m in matches)
        return TextContent(
            type="text",
            text=f"🔍 Znaleziono {len(matches)} plików:\n\n{results}"
        )
    except Exception as e:
        return TextContent(
            type="text",
            text=f"❌ Błąd wyszukiwania: {str(e)}"
        )

# Uruchomienie serwera
if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run())
```

## 🔐 Bezpieczeństwo w MCP

### Najważniejsze zasady

1. **Whitelisting katalogów** ✅
   ```python
   # DOBRZE: Ograniczenie dostępu
   allowed_dirs = ["/home/user/safe_dir"]
   
   # ŹLE: Dostęp do całego systemu
   allowed_dirs = ["/"]
   ```

2. **Walidacja inputów** ✅
   ```python
   def validate_filepath(path: str) -> bool:
       # Sprawdź czy nie ma path traversal
       if ".." in path:
           return False
       # Sprawdź czy nie ma absolute path
       if path.startswith("/"):
           return False
       return True
   ```

3. **Rate limiting** ✅
   ```python
   from functools import wraps
   import time
   
   def rate_limit(max_calls: int, period: int):
       """Decorator do rate limiting."""
       calls = []
       
       def decorator(func):
           @wraps(func)
           async def wrapper(*args, **kwargs):
               now = time.time()
               # Usuń stare wywołania
               calls[:] = [c for c in calls if c > now - period]
               
               if len(calls) >= max_calls:
                   raise Exception(f"Rate limit exceeded: {max_calls}/{period}s")
               
               calls.append(now)
               return await func(*args, **kwargs)
           return wrapper
       return decorator
   
   @rate_limit(max_calls=10, period=60)  # 10 wywołań na minutę
   @server.tool()
   async def expensive_operation():
       pass
   ```

## 🧪 Testowanie MCP Server

```python
# tests/test_server.py
import pytest
from src.server import file_tools

@pytest.mark.asyncio
async def test_read_file_success():
    """Test odczytu istniejącego pliku."""
    # Utwórz tymczasowy plik
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        f.write("Test content")
        filepath = f.name
    
    # Testuj odczyt
    result = await file_tools.read_file(filepath)
    assert "Test content" in result.text
    
    # Cleanup
    import os
    os.unlink(filepath)

@pytest.mark.asyncio
async def test_read_file_not_found():
    """Test odczytu nieistniejącego pliku."""
    result = await file_tools.read_file("/non/existent/file.txt")
    assert "nie istnieje" in result.text

@pytest.mark.asyncio
async def test_security_path_traversal():
    """Test zabezpieczenia przed path traversal."""
    result = await file_tools.read_file("../../../etc/passwd")
    assert "zabroniony" in result.text
```

Uruchomienie testów:
```bash
pytest tests/ -v
```

## 🌐 Integracja z aplikacjami

### Claude Desktop

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// %APPDATA%\Claude\claude_desktop_config.json (Windows)
{
  "mcpServers": {
    "file-manager": {
      "command": "python",
      "args": ["/path/to/src/server.py"],
      "env": {
        "PYTHONPATH": "/path/to/my-mcp-server"
      }
    }
  }
}
```

Po restarcie Claude Desktop, Twoje narzędzia będą dostępne w asystencie! 🎉

### Własna aplikacja (Python)

```python
# my_app.py
import asyncio
from mcp.client import Client

async def main():
    # Połącz z serwerem MCP
    client = Client()
    await client.connect("stdio://python src/server.py")
    
    # Wywołaj narzędzie
    result = await client.call_tool("read_file", {
        "filepath": "~/Documents/example.txt"
    })
    
    print(result.content[0].text)
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## 📊 Przykłady zaawansowane

### MCP Server z bazą danych

```python
# src/tools/db_tools.py
from mcp import Server
from mcp.types import TextContent
import sqlite3

server = Server("database-mcp")

@server.tool()
async def query_database(sql: str) -> TextContent:
    """
    Wykonuje zapytanie SQL (tylko SELECT!).
    
    Args:
        sql: Zapytanie SQL
        
    Returns:
        Wyniki zapytania
    """
    # Security: tylko SELECT
    if not sql.strip().upper().startswith("SELECT"):
        return TextContent(
            type="text",
            text="❌ Dozwolone są tylko zapytania SELECT"
        )
    
    try:
        conn = sqlite3.connect("my_database.db")
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        conn.close()
        
        # Formatuj wyniki
        if not results:
            return TextContent(type="text", text="📊 Brak wyników")
        
        output = "\n".join(str(row) for row in results)
        return TextContent(
            type="text",
            text=f"📊 Wyniki zapytania:\n\n{output}"
        )
    except Exception as e:
        return TextContent(
            type="text",
            text=f"❌ Błąd SQL: {str(e)}"
        )
```

## 💡 Best Practices

1. **Zawsze waliduj input** - nigdy nie ufaj danym od użytkownika
2. **Używaj type hints** - ułatwia dokumentację i debugowanie
3. **Loguj operacje** - szczególnie te wrażliwe
4. **Testuj edge cases** - co jeśli plik jest pusty? Bardzo duży? Binary?
5. **Dokumentuj narzędzia** - docstringi są wyświetlane użytkownikom
6. **Rate limiting** - chroń przed nadużyciami
7. **Graceful degradation** - zwracaj sensowne błędy, nie crashuj serwera

## 🎓 Podsumowanie

Model Context Protocol to przełom w integracji AI z narzędziami:

✅ **Standardowy protokół** - jeden API dla wszystkich
✅ **Bezpieczeństwo** - kontrola dostępu i walidacja
✅ **Elastyczność** - łatwe dodawanie nowych narzędzi
✅ **Reużywalność** - jeden serwer, wiele klientów
✅ **Open source** - rozwijany przez społeczność

**Następne kroki:**
1. Stwórz prosty MCP server z 2-3 narzędziami
2. Przetestuj go z Claude Desktop
3. Dodaj własne, specyficzne dla Twojego projektu narzędzia
4. Podziel się serwerem z społecznością (GitHub)

## 🔗 Przydatne linki

- [MCP Documentation](https://modelcontextprotocol.io) - Oficjalna dokumentacja
- [MCP GitHub](https://github.com/modelcontextprotocol) - Kod źródłowy i przykłady
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers) - Gotowe serwery MCP
- [Claude Desktop](https://claude.ai/download) - Klient MCP od Anthropic
- [MCP Python SDK](https://pypi.org/project/mcp/) - SDK dla Pythona
- [MCP TypeScript SDK](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - SDK dla Node.js
- [JIMBO77 Hub](https://github.com/77Jimbo77/JIMBO_devz_inc_HUB) - Nasze przykłady MCP

---

**Autor:** JIMBO77 AI Social Club  
**Data:** 2026-01-25  
**Kategoria:** AI & Automation  
**Tagi:** #MCP #AI #Protocol #Python #Integration

Pytania? Dołącz do dyskusji na [GitHub 77Jimbo77](https://github.com/77Jimbo77)! 🚀
