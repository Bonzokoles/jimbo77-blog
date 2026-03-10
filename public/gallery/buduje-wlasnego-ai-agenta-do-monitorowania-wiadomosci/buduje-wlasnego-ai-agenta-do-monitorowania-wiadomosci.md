# Buduję własnego AI agenta do monitorowania wiadomości

## Buduję własnego AI agenta do monitorowania wiadomości

Zaczęło się od tego, że mam fioła na punkcie AI, ale skrzynka zapchana po brzegi newsletterami potrafiła mnie wyprowadzić z równowagi. Chciałem mieć świeże, najważniejsze informacje o AI, bez przewijania ton śmieci. I tak narodził się pomysł na własnego AI agenta, który rano przyniesie mi zwięzłe podsumowania. W 2025 roku okazuje się, że narzędzia takie jak Cloudflare Workers AI i modele DeepSeek są na wyciągnięcie ręki – więc czemu by nie spróbować?

### Jak to w ogóle działało

Najpierw ustawiłem sobie prostą rzecz: zbieranie newsów z kilkunastu sprawdzonych źródeł RSS, które regularnie trafiają do mojej bazy. Nie chciałem przeglądać całego netu – raczej skupić się na treściach, które wnoszą coś do rozmowy o AI. A tu pojawił się pierwszy wyzwanie: spam i clickbaity. No bo wiecie, nagłówki potrafią zrobić więcej huku niż rzeczy wartościowych.

Dlatego na start wykorzystałem **DeepSeek-R1-Distill-Qwen-32B** dostępny w Cloudflare Workers AI. To model, który naprawdę dobrze się sprawdza w zadaniach klasyfikacyjnych – potrafi odróżnić wartościowy materiał od bełkotu. I tu zaczyna się zabawa: ustawienie parametrów, filtracja i testy.

### Filtrowanie i klasyfikacja – dwa etapy, czyli mniej chaosu

Początkujący popełniają błędy, więc ja też kilka popełniłem. W pierwszym etapie DeepSeek-R1 oznaczał artykuły jako wartościowe albo spam. Potem dodałem drugi filtr, który analizował nie tylko nagłówki, ale i pierwsze kilka zdań artykułu. Dzięki temu fałszywe pozytywy spadały, a najważniejsze treści trafiały do listy „do przeczytania”.

Wyobraź sobie to tak: najpierw ocena „czy to coś wnosi?”, a potem zoom na treść – czy w treści jest konkret, a nie tylko język marketingowy. To trochę jak selekcja w relacjach: pierwszy weryfikuje „czy ma to sens?”, drugi – „czy jest konkretne”.

### Generowanie krótkich podsumowań – w sam raz na kawę

Gdy mam już czystą listę, przychodzi czas na skracanie materiału do strawnego formatu. Tu znów w ruch idzie DeepSeek-R1, który nieźle radzi sobie z kompresją i generowaniem zwięzłych streszczeń. Ustawiłem parametry, by podsumowania były treściwe: 3–4 zdania na artykuł, bez zbędnego lania wody.

Oczywiście, czasem podsumowania były zbyt ogólne albo pomijały istotne niuanse. Wtedy dopasowywałem temperaturę i top_k – 0.7 i top_k na 20 to „złoty środek” dla mnie: treściwie, ale nadal z charakterem.

### Integracja z Cloudflare Workers AI – bez bólu i bez kluczy

Najbardziej zaskoczyło mnie, jak proste to było. Cloudflare Workers AI ma darmowy próg aż do 10 milionów neuronów miesięcznie, a potem kosztuje tylko 0,011 USD za każde 1 tysiące neuronów. Nie trzeba mieć klucza API ani ogarniać skomplikowanego procesu autoryzacji. Wystarczyło stworzyć Workera, dodać binding "@cf/meta/llama-3.1-8b-instruct" i wkleić kod generowany przez Grok3. Gotowe w kilka minut.

Jeśli zastanawiacie się, czy to „dziwne” narzędzie – tak, to brzmi futurystycznie, ale działa naprawdę szybko. Kiedy liczba źródeł rośnie, cały proces nadal działa płynnie, a ja nie płacę fortuny za utrzymanie skrzynki w ruchu.

### Codzienna automatyzacja – z rana na talerzu

Klimat porannego przeglądu miał być prosty: 6:00, skrypt rozjeżdża się po RSS, filtruje i generuje podsumowania, a ja dostaję je na maila. Nie trzeba wylewać kawy na klawiaturę; to AI robi robotę, ja piję kawę i tylko przekręcam wzrok, żeby spojrzeć na krótkie zestawienie. Oczywiście, czasem zdarzają się drobne opóźnienia – nic poważnego, a w razie czego można łatwo poprawić skrypt i ponownie uruchomić.

### Kilka praktycznych wniosków z eksperymentu

- DeepSeek-R1-Distill-Qwen-32B w Cloudflare Workers AI świetnie nadaje się do filtracji i streszczania treści. W praktyce to oznacza, że mniej szumu w codziennym raporcie, a więc szybkie zorientowanie, co trzeba przeczytać.
- Praktyczna przyszłość: w 2026 roku pojawiają się szersze możliwości w DeepSeek – DeepSeek-R1 wciąż prowadzi w zakresie rozumowania, ale na horyzoncie są wersje: **DeepSeek-V3** do zadań ogólnych i **DeepSeek-VL2** (MoE, 4.5B aktywnych parametrów) do multimedialnych zadań jak VQA i OCR. Daje to właśnie możliwość łatwej pracy z obrazem i tekstem jednocześnie.
- Do tego nadciąga długo wyczekiwany **DeepSeek-V4** w lutym 2026 – mówi się o stabilnym kontekście wieloetapowym i lepszym kodowaniu inżynieryjnym. Jeśli planujecie automatyzację procesów, to może być game changer.
- W świecie narzędzi nie mogłem przegapić nowości: w Cloudflare AI Week 2025 zapowiedziano nowe modele Leonardo do generowania obrazów i Deepgram do TTS w Workers AI. Tego typu integracje otwierają drzwi do naprawdę skomplikowanych agentów bez konieczności łączenia wielu różnych systemów.
- Opcje „no-code” i integracje z Bubble czy Zapier są gotowe do użycia: wystarczy stworzyć Worker, dodać binding „AI” i wkleić kod – gotowe w kilka minut. Dla kogoś, kto woli szybko prototypować, to prawdziwy skok jakościowy.
- Wspierane funkcje: function calling, LoRA i batch processing – a parametry takie jak temperature (0.001–1) i top_k (1–50) dają możliwość dostosowania „naszego tonu” i precyzji. To realny komfort w codziennym użyciu.
- Dla fanów testów w przeglądarce: Playground Workers AI pozwala uruchomić DeepSeek-R1-Distill-Qwen-32B bez skomplikowanego setupu – wystarczy otworzyć stronę i pograć. Fajny bajer, gdy chce się szybciej zrozumieć możliwości modelu.
- I na koniec: DeepSeek ma również wersje open-source do deployu lokalnego lub przez API. Dla mnie to plus – mogę wybrać, czy chcę mieć pełną kontrolę, czy skorzystać z gotowych usług. Wciąż warto śledzić przewodnik 2026, który porównuje V3 z ChatGPT.

### Co mi daje ta cała zabawa na co dzień

- Mniej czasu na wglebianie w treści newsów – mam codzienne, zwięzłe podsumowania, które pozwalają mi zrozumieć istotę bez czytania stu zdań.
- Elastyczność – mogę łatwo podłączyć to narzędzie do innych systemów (Bubble, Zapier) i stworzyć prostego agenta do różnych zadań, nie tylko do monitorowania AI.
- Skalowalność – darmowy próg 10M neuronów miesięcznie to sporo miejsca na testy i małe projekty; potem koszt rośnie bardzo umiarkowanie.
- Edukacja i zabawa – pracuję na realnych modelach, które w praktyce pokazują, jak daleko zaszliśmy w automatyzacji analizy treści.

### A co z tym wszystkim z perspektywy kumpla?

Przy kawie to brzmi jak bajka: masz swojego asystenta, który sam przegląda wiadomości, odfiltrowuje to najważniejsze, skraca to w 3–4 zdania i wysyła Ci krótkie zestawienie. Bez wstawania z krzesła. A jeśli zechcesz, to możesz go podłączyć do notyfikacji na Slacka, maila, czy jeszcze innego narzędzia. W praktyce często zapominam, że to nie człowiek – to model w chmurze, który pracuje dla mnie.

Pewnie pojawią się kolejne ulepszenia i wersje, a ja będę testować. Może pewnego dnia zamiast samego podsumowania będziemy mieć pełnego agenta, który nie tylko czyta newsy, ale także analizuje ryzyka rynkowe, generuje raporty dla zespołu i podpowiada konkretne działania. Brzmi jak przyszłość? Może. Ale w 2025–2026 to już realność na wyciągnięcie ręki.

## Co z tego wynika?

- Prosto zrobisz własnego AI agenta do monitorowania wiadomości o AI – nawet bez głębokiej wiedzy technicznej.
- DeepSeek i Cloudflare Workers AI dają mocne narzędzia do filtrowania treści, streszczania i automatyzacji bez dużych kosztów.
- Możesz budować całe workflowy bez kodu (Bubble/Zapier) lub z lekkim kodem w Workera – elastyczność dla różnych stylów pracy.
- W 2026 roku czekają jeszcze mocniejsze możliwości: DeepSeek-V3, DeepSeek-VL2 i wersja deep-dive DeepSeek-V4, która będzie lepiej radzić sobie z długim kontekstem i złożonym kodowaniem inżynieryjnym.
- W praktyce to nie tylko narzędzie – to podejście do organizowania informacji w erze nadmiaru treści: filtruj, streszczaj, dostarczaj.

Jeśli macie ochotę, podzielcie się swoimi pomysłami na integracje – chętnie pogadamy o tym, jak wykorzystać takie agenty w codziennej pracy, onboardingach zespołów, czy po prostu w osobistych projektach. Ja już planuję kolejne eksperymenty i testy, bo to dopiero początek zabawy z AI w roli codziennego asystenta.

---

**Masz pytania? Chcesz pogadać o AI, technologii albo po prostu rzucić pomysłem?** Pisz śmiało — lubię dostawać wiadomości od ludzi, którzy faktycznie czytają to co piszę (a nie tylko botów 😉). Najszybciej złapiesz mnie przez stronę kontaktową lub social media.

🔗 **[jimbo77.com](https://www.jimbo77.com)** — mój główny hub, projekty, kontakt  
🔗 **[mybonzo.com](https://www.mybonzo.com)** — więcej moich rzeczy, AI narzędzia, blog techniczny

Do następnego! ✌️  
*— Jimbo*
