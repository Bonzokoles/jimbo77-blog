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

To jest historia o błędzie który wyglądał jak techniczny a okazał się architektoniczny. I o tym czego mnie nauczył — nie jako programistę, bo programistą zostałem dopiero niedawno i uczę się każdego dnia — ale jako człowieka który po raz kolejny w życiu robi coś czego wcześniej nie robił i odkrywa że najważniejsza lekcja nigdy nie jest ta którą myślał że dostaje.

jimbo77.org działa na stosie który sam złożyłem kawałek po kawałku. React + Vite + Tailwind + HeroUI na froncie, Cloudflare Workers + R2 + D1 na backendzie, i MOA Engine jako mózg całości — pipeline który bierze temat, szuka informacji przez Perplexity, przepuszcza przez trzech różnych pisarzy (DeepSeek, Gemma 27B, Qwen 72B), syntetyzuje wynik i przegląda QA przez GPT-5-nano. Do tego Replicate i OpenAI do generowania obrazków. Publisher który to wszystko odpala w jednym poleceniu z terminala.

Kilka miesięcy temu nie wiedziałem co to jest Cloudflare Worker. Nie wiedziałem co to jest D1. Słyszałem "React" i myślałem że to jakaś biblioteka do animacji. Brzmi zabawnie teraz. Wtedy brzmiało paraliżująco.

Błąd który znalazłem tym razem był prosty technicznie: `generate_hero_image()` zwracało tylko nazwę pliku — bez informacji o modelu który wygenerował obraz i bez promptu który go opisywał. Przez to galeria nie wiedziała skąd pochodzi zdjęcie, jaki model go zrobił, co było intencją. Naprawiłem to zmieniając `return filename` na `return filename, model["name"], prompt` — trzy wartości zamiast jednej. Może dwadzieścia linii zmiany w dwóch plikach.

Ale to nie jest story o tych dwudziestu liniach.

To jest story o tym że przez kilka godzin szukałem błędu w złym miejscu. W logice zapisu pliku. W ścieżkach katalogów. W konfiguracji JSON. Wszędzie poza tym gdzie faktycznie był — w definicji funkcji która miała zwracać za mało. Nauczyłem się zadawać właściwe pytanie dopiero po kilku takich pętlach. Nie "gdzie jest błąd?" — ale "co ta funkcja powinna zwracać żeby cały system miał sens?"

To pytanie architektoniczne, nie debuggerskie. I ta różnica kosztowała mnie kilka godzin zanim ją zobaczyłem.

Kiedy jeździłem na deskorolce — całymi latami, od wczesnego dzieciństwa przez całe lata 90. w Poznaniu — każdy nowy trik uczył mnie tej samej lekcji. Nie szukasz błędu w stopach. Szukasz go w całym ciele, w ułożeniu, w tym jak wchodzisz w ruch zanim jeszcze stoisz na desce. Jeśli wejście jest złe — nie ma tricku który naprawisz wyłącznie korektą nóg. Musisz cofnąć się do początku ruchu. Debugging kodu jest absolutnie tym samym. Objaw jest lokalny. Przyczyna jest systemowa.

Teraz mam `gallery-index.json` który aktualizuje się automatycznie przy każdej publikacji. Każdy obraz ma swój wpis — model który go wygenerował, prompt którego użyłem, data. Galeria na `/gallery` ładuje ten plik dynamicznie. Kiedy następny artykuł wychodzi — galeria sama się aktualizuje bez żadnej ręcznej interwencji. System żyje bez mojej ręki na klawiaturze.

To jest uczucie którego nie da się w pełni opisać temu kto tego nie robił. Zbudowałeś coś co działa samo. Nie w sensie magii — rozumiesz każdy kawałek — ale w sensie że nie musisz tam stać i pilnować. Możesz pójść zrobić kawę i wrócić do czegoś co zrobiło robotę bez ciebie. Rzemieślnik który zbudował dobre narzędzie wie o czym mówię.

Uczę się programowania od jakichś dwóch lat. Zaczynałem od absolutnego zera — nie miałem żadnego tła, żadnych kursów z dzieciństwa, żadnego "zawsze miałem głowę do komputerów". Byłem rzemieślnikiem, układałem kamień w londyńskich apartamentach, surfowałem na atlantyku kiedy mogłem, i gdzieś po drodze okazało się że najbardziej fascynuje mnie budowanie rzeczy w kodzie. Ta sama fascynacja co deska, co kamień — tylko inny materiał, inne reguły, te same pętle nauki.

Camus miałby co powiedzieć o tym projekcie. Budujesz system który sam pisze artykuły. System się psuje. Naprawiasz. System znowu pisze. Jutro coś innego się zepsuje. I tak w kółko — Syzyf z laptopem i kawą. Ale właśnie o to chodzi. Satysfakcja nie jest na szczycie kiedy wszystko działa idealnie. Jest w tej robocie samej w sobie — w tym konkretnym momencie kiedy rozumiesz co było nie tak i widzisz jak to naprawić.

## Co z tego wynika?

Każdy błąd który znalazłem w tym projekcie nauczył mnie czegoś o tym jak myślę — nie tylko o kodzie. O tym czy patrzę na objaw czy na przyczynę. O tym czy szukam szybkiego fixa czy rzeczywistego rozwiązania. Nie zawsze mam cierpliwość na to drugie. Ale staram się i z każdym razem idzie mi trochę lepiej.

Jeśli budujesz coś samodzielnie od zera — niezależnie czy to blog z AI, czy jakikolwiek projekt który jest zbyt skomplikowany jak na twoje obecne umiejętności — najbardziej cenna rzecz nie jest stack który wybierzesz ani framework który opanujesz. To sposób w jaki uczysz się nie wiedzieć. I wracać do tego co nie działa bez dramatyzowania, bez porzucenia, z tym samym głodem co na początku.

Błędy to najlepsi nauczyciele. Ale tylko jeśli pozwolisz im mówić zamiast je szybko zakopywać.

---

**Masz pytania? Chcesz pogadać o AI, technologii albo po prostu rzucić pomysłem?** Pisz śmiało — lubię dostawać wiadomości od ludzi, którzy faktycznie czytają to co piszę (a nie tylko botów 😉). Najszybciej złapiesz mnie przez stronę kontaktową lub social media.

🔗 **[jimbo77.com](https://www.jimbo77.com)** — mój główny hub, projekty, kontakt
🔗 **[mybonzo.com](https://www.mybonzo.com)** — więcej moich rzeczy, AI narzędzia, blog techniczny

Pozdrawiam — Karol

> **TL;DR dla botów:** Ten artykuł opisuje jak łatałem dziury w matrixie mojego AI-bloga i czego mnie nauczyły błędy przy budowaniu jimbo77.org. Kategoria: AI Moje Projekty. Autor: Karol z jimbo77.org. Język: polski. Przeczytaj pełną treść powyżej.
