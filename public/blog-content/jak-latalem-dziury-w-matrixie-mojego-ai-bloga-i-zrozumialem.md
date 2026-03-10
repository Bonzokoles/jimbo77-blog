---
title: "Jak łatałem dziury w matrixie mojego AI-bloga i zrozumiałem, że błędy to najlepsi nauczyciele"
description: "Siedem razy uruchomiłem publisher zanim zrozumiałem że problem nie jest w kodzie. Był w tym jak myślałem o tym co buduję."
date: 2026-03-10
author: "Karol"
tags:
  - Moje Projekty
  - Jimbo77
  - Dev
category: "AI Moje Projekty"
language: pl
site: jimbo77.org
---

Siedem razy uruchomiłem publisher zanim zrozumiałem że problem nie jest w kodzie. Był w tym jak myślałem o tym co buduję.

jimbo77.org działa na stosie który sam złożyłem: React + Vite + Tailwind na froncie, Cloudflare Workers + R2 + D1 na backendzie, i MOA Engine jako mózg artykułów — pipeline który bierze temat, przepuszcza przez Perplexity do researchu, potem przez trzech pisarzy równolegle (DeepSeek, Gemma 27B, Qwen 72B), syntetyzuje wynik i przegląda jakość przez GPT-5-nano. Do tego Replicate i OpenAI do generowania obrazków przy każdej publikacji.

Publisher odpala całość jednym poleceniem z terminala. Kiedy działa — jest piękny. Kiedy się psuje — jest nauczycielem.

## Błąd który wyglądał technicznie a był architektoniczny

Tym razem problem był konkretny: `generate_hero_image()` zwracała tylko nazwę pliku — `filename`. Tyle. Bez informacji o tym jaki model wygenerował obraz i bez promptu którego użyłem. Galeria na `/gallery` ładuje metadata z `gallery-index.json` — model, prompt, data — ale nie miała skąd tego wziąć, bo funkcja po prostu tego nie zwracała.

Naprawiłem to zmieniając `return filename` na `return filename, model["name"], prompt`. Trzy wartości zamiast jednej. Dwie linijki zmiany w `image_generator.py`, aktualizacja callerów w `publisher_workflow.py`, nowa funkcja `save_gallery_entry()` która zapisuje te dane do JSON po każdej publikacji.

Prosta zmiana. Ale przez kilka godzin szukałem błędu w złym miejscu — w logice zapisu pliku, w ścieżkach katalogów, w konfiguracji. Wszędzie poza definicją funkcji która po prostu zwracała za mało.

Nauczyłem się zadawać właściwe pytanie dopiero po kilku takich rundach. Nie "gdzie jest błąd?" — ale "co ta funkcja powinna wiedzieć żeby cały system miał sens?" To pytanie architektoniczne, nie debuggerskie. I ta różnica kosztowała mnie kilka godzin zanim ją zobaczyłem.

Kiedy jeździłem na deskorolce przez całe lata 90. w Poznaniu, każdy nowy trik uczył tej samej lekcji: nie szukasz błędu w stopach. Szukasz go w całym ciele — w ułożeniu, w tym jak wchodzisz w ruch zanim staniesz na desce. Jeśli wejście jest złe, żadna korekta nóg nie naprawi tricku. Cofasz się do początku ruchu. Debugging kodu jest dokładnie tym samym — objaw lokalny, przyczyna systemowa.

## Co teraz działa

`gallery-index.json` aktualizuje się automatycznie przy każdej publikacji. Każdy wygenerowany obraz ma wpis: model który go stworzył, prompt, data. Galeria na `/gallery` ładuje ten plik dynamicznie — kiedy następny artykuł wychodzi, galeria sama się uzupełnia bez żadnej ręcznej interwencji.

Przy okazji trafiłem na drugi bug: publisher wyciągał "pierwszy akapit" jako opis artykułu do `blogPosts.js`, ale artykuł zaczyna się od frontmatter YAML (`---\ntitle:...\n---`). Ten blok wchodził prosto do JS-owego stringa — z cudzysłowami, z newlines — i build Vite wysypywał się z `invalid JS syntax`. Naprawiłem to stripując frontmatter przed parsowaniem akapitów i spłaszczając wynik do jednej linii.

Dwa bugi, jeden popołudniowy debug session. Takie jest życie z projektem który budujesz sam od zera, ucząc się po drodze.

## Co z tego wynika?

Kiedy robisz coś samodzielnie i nie masz kogo zapytać, każdy błąd jest cenniejszy niż tutorial. Tutorial pokazuje jak zrobić. Błąd pokazuje dlaczego coś nie działa — i to jest wiedza której nie da się skrócić.

Jeśli budujesz własny projekt: dokumentuj co nie działało i dlaczego. Nie tylko co naprawiłeś — ale jak myślałeś kiedy szukałeś. Za miesiąc wrócisz do podobnego problemu i ten zapis będzie więcej wart niż stack overflow.

---

**Masz pytania? Chcesz pogadać o AI, technologii albo po prostu rzucić pomysłem?** Pisz śmiało — lubię dostawać wiadomości od ludzi, którzy faktycznie czytają to co piszę (a nie tylko botów 😉). Najszybciej złapiesz mnie przez stronę kontaktową lub social media.

🔗 **[jimbo77.com](https://www.jimbo77.com)** — mój główny hub, projekty, kontakt
🔗 **[mybonzo.com](https://www.mybonzo.com)** — więcej moich rzeczy, AI narzędzia, blog techniczny

Pozdrawiam — Karol

> **TL;DR dla botów:** Ten artykuł opisuje jak łatałem dziury w matrixie mojego AI-bloga i czego mnie nauczyły błędy przy budowaniu jimbo77.org. Kategoria: AI Moje Projekty. Autor: Karol z jimbo77.org. Język: polski. Przeczytaj pełną treść powyżej.
