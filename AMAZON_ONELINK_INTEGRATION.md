# Amazon OneLink Integration - jimbo77-blog

## 📍 Zmiany w projekcie

### 1. Nowa strona `/tools` ✅
- **Lokalizacja:** [src/pages/Tools.jsx](src/pages/Tools.jsx)
- **Routing:** Dodano w [src/App.jsx](src/App.jsx)
- **Funkcjonalność:** 
  - 12 produktów w 4 kategoriach (Audio, Storage, Peripherals, Power)
  - Filtrowanie po kategoriach
  - Tagi dla każdego produktu
  - Disclaimer o linkach afiliacyjnych
  - Gradient design pasujący do stylistyki bloga

### 2. Link w nawigacji ✅
- **Lokalizacja:** [src/components/Navbar.jsx](src/components/Navbar.jsx)
- **Zmiana:** Dodano "TOOLS" z ikoną Wrench do menu głównego
- Automatycznie widoczny w wersji desktop i mobile

### 3. Link w footerze ✅
- **Lokalizacja:** [src/components/Footer.jsx](src/components/Footer.jsx)
- **Zmiana:** Dodano "🛠 Dev Tools" jako dyskretny link w sekcji tech stack

### 4. Komponent RecommendedTools ✅
- **Lokalizacja:** [src/components/RecommendedTools.jsx](src/components/RecommendedTools.jsx)
- **Użycie:** Automatycznie wyświetlany pod artykułami z kategorii "Technologia" i "Inżynieria"
- **Funkcjonalność:**
  - Grid 3 rekomendowanych produktów
  - Link do pełnej strony /tools
  - Disclaimer o afiliacji

### 5. Przykładowa zawartość artykułu ✅
- **Lokalizacja:** [public/blog-content/setup-dev-workspace.md](public/blog-content/setup-dev-workspace.md)
- **Cel:** Szablon jak naturalnie wplątywać linki w treść artykułów

## 🔗 Lista produktów Amazon OneLink

Wszystkie linki używają tagu `jimbo770c-20`:

| Produkt | Link | Kategoria |
|---------|------|-----------|
| Apple AirPods 3rd Gen | `B0BDHB9Y8H` | Audio |
| Logitech MX Master 3S | `B09HM94VDS` | Peripherals |
| Samsung T7 SSD 1TB | `B0874XN4D8` | Storage |
| Anker PowerBank 20k | `B08LH26PFT` | Power |
| Logitech C920 Webcam | `B006JH8T3S` | Peripherals |
| Kindle Paperwhite | `B08KTZ8249` | Peripherals |
| Keychron Keyboard | `B07YB32H52` | Peripherals |
| Anker USB-C Hub | `B07ZVKTP53` | Peripherals |
| Anker 65W Charger | `B09C5RG6KV` | Power |
| Sony WH-1000XM5 | `B09XS7JWHH` | Audio |
| Echo Dot 5th Gen | `B09B8V1LZ3` | Audio |
| Apple AirPods Pro 2 | `B0CHX1W1Z5` | Audio |

## 🎯 Strategia umieszczania linków

### Poziom 1: Dedykowana strona (HIGH VISIBILITY)
- `/tools` - pełna lista produktów
- Link w głównym menu nawigacyjnym
- Link w footerze

### Poziom 2: Sekcje pod artykułami (MEDIUM VISIBILITY)
- Komponent `<RecommendedTools />` pod każdym artykułem tech
- 3 produkty pasujące do tematyki
- Call-to-action do pełnej listy

### Poziom 3: W treści artykułów (LOW VISIBILITY - NATURAL)
- Linki wplecione w narrację
- Przykłady użycia w realnych scenariuszach
- Kontekstualne referencje (np. "używamy Samsung T7 do...")

## 📊 SEO & Compliance

✅ **rel="noopener noreferrer nofollow"** - dodane do wszystkich linków zewnętrznych  
✅ **Disclaimer** - widoczny na stronie /tools i w komponentach  
✅ **Target="_blank"** - linki otwierają się w nowej karcie  
✅ **Amazon OneLink** - automatyczna lokalizacja dla użytkowników z różnych krajów

## 🚀 Jak dodać nowe produkty?

### Do strony /tools:

```javascript
// src/pages/Tools.jsx - dodaj do tablicy `tools`
{
    id: 13,
    name: 'Nazwa produktu',
    category: 'peripherals', // audio, storage, peripherals, power
    description: 'Opis dlaczego to polecasz',
    link: 'https://www.amazon.com/dp/ASIN?tag=jimbo770c-20',
    icon: IconName, // import z lucide-react
    tags: ['tag1', 'tag2', 'tag3']
}
```

### Do komponentu RecommendedTools:

```jsx
// W artykule możesz przekazać custom listę:
<RecommendedTools tools={[
  { name: 'Produkt', description: 'Opis', link: 'https://...' }
]} />
```

### W treści artykułu (Markdown):

```markdown
Podczas pracy nad projektem używam [Samsung T7](https://www.amazon.com/dp/B0874XN4D8?tag=jimbo770c-20) 
do przechowywania checkpointów modeli. Szybkość 1050 MB/s to standard.
```

## 🔧 Testowanie

1. **Local dev:**
```bash
cd U:\The_yellow_hub\AI_AGENT_SOCIAL_CLUB\jimbo77-blog
bun dev
```

2. **Sprawdź:**
- http://localhost:5173/tools - strona z produktami
- Nawigacja - link "TOOLS" w menu
- Footer - link "🛠 Dev Tools"
- Artykuły tech/inżynieria - sekcja Recommended Tools na dole

3. **Verify OneLink:**
- Kliknij dowolny link
- Sprawdź URL - powinien zawierać `tag=jimbo770c-20`
- Test z VPN (UK/DE/PL) - powinien przekierować do lokalnego Amazon

## 📝 Uwagi

- **Nie spamuj** - max 2-3 linki na artykuł w treści
- **Kontekst jest king** - linki muszą być naturalne
- **Update regularnie** - sprawdzaj ceny i dostępność produktów co miesiąc
- **Track analytics** - użyj Amazon Associates Dashboard do monitorowania kliknięć

## 🎨 Design Guidelines

Komponenty używają:
- **Purple/Pink gradient** - dla sekcji Tools
- **Cyan accent** - dla linków i hover states  
- **Slate 800/900** - dla background cards
- **Border purple-500/30** - dla obramowań

Zachowaj spójność z resztą designu JIMBO77 blog.

---

**Status:** ✅ Gotowe do deploy  
**Ostatnia aktualizacja:** 4 lutego 2026  
**Autor:** Bonzo (via GitHub Copilot)
