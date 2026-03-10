# .workspace_meta — Workspace Intelligence Layer

> **Wersja:** 1.0.0 | **Autor:** Bonzokoles  
> **Utworzono:** 14.02.2026  
> **Cel:** Uniwersalny meta-folder dołączany do KAŻDEGO nowego workspace

---

## Co to jest?

`.workspace_meta` to folder-standard który zapewnia każdemu workspace:
1. **Spójną strukturę** — ten sam układ w każdym projekcie
2. **Definition of Done** — interaktywny dashboard (HTML) ze skillami i task listą
3. **Specyfikację workspace** — maszynowo-czytelny opis projektu
4. **Konfigurację MCP** — gotowy template serwerów MCP
5. **Notes** — ustrukturyzowane miejsce na decyzje i notatki

## Jak użyć?

### Nowy workspace:
```powershell
# Skopiuj cały folder do roota nowego workspace
Copy-Item -Recurse "C:\WORKSPACE_META_TEMPLATE\.workspace_meta" "ŚCIEŻKA_DO_WORKSPACE\.workspace_meta"
```

### Po skopiowaniu:
1. Otwórz `workspace.spec.json` → wypełnij pola `metadata.*`
2. Otwórz `mcp/config.json` → dodaj swoje serwery MCP
3. Otwórz `Definition_of_done.html` w przeglądarce → gotowy dashboard
4. Zacznij dokumentować decyzje w `notes/decisions.md`

## Struktura

```
.workspace_meta/
├── README.md                    ← ten plik
├── Definition_of_done.html      ← Jimbo OS Dashboard (skills + tasks + DoD)
├── workspace.spec.json          ← specyfikacja projektu (template)
├── mcp/
│   └── config.json              ← konfiguracja MCP serwerów (template)
└── notes/
    ├── decisions.md             ← ADR — Architecture Decision Records
    └── snapshots.md             ← snapshoty stanu projektu
```

## Zasady

- **NIE commituj** `.workspace_meta/mcp/config.json` jeśli zawiera klucze API
- **ZAWSZE** aktualizuj `workspace.spec.json` po zmianie architektury
- **Definition_of_done.html** działa standalone — zero zależności, localStorage
- **notes/** — generuj snapshot co ~2h aktywnej pracy

---

*Template managed by Bonzokoles workspace system*
