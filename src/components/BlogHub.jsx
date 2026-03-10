import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleList from './blog/ArticleList';
import ArticleEditor from './blog/ArticleEditor';
import ArticleReader from './blog/ArticleReader';
import { blogPosts as staticPosts } from '../data/blogPosts';
import './BlogHub.css';

const STORAGE_KEY = 'bonzo_blog_articles';

// ─── Default seed articles (MIT News — translated to Polish) ──────────────
const DEFAULT_ARTICLES = [
  {
    id: 'mit-seed-1',
    title: 'Algorytm AI umożliwia śledzenie kluczowych szlaków istoty białej w mózgu',
    content: `## Nowe okno na pień mózgu\n\nNaukowcy z MIT opracowali nowe narzędzie AI, które w sposób niezawodny i precyzyjny rozpoznaje poszczególne wiązki nerwowe w skanach dyfuzyjnego MRI wykonywanych na żywo.\n\nAlgorytm otwiera nowe możliwości diagnostyczne — potrafi wykrywać oznaki uszkodzeń i chorób, takich jak choroba Alzheimera czy Parkinsona, na bardzo wczesnym etapie.\n\n### Jak to działa?\n\nModel wykorzystuje uczenie maszynowe do segmentacji wiązek nerwowych w pniu mózgu, co do tej pory było niezwykle trudne ze względu na mały rozmiar i skomplikowaną strukturę tego regionu. Dzięki temu lekarze mogą śledzić zmiany w istotie białej w czasie rzeczywistym.\n\n> „To narzędzie pozwala nam zobaczyć struktury, które wcześniej były praktycznie niewidoczne w standardowych skanach MRI" — Mark Olchanyi, główny autor badania\n\n---\n\n🔗 **Źródło:** [MIT News — AI algorithm enables tracking of vital white matter pathways](https://news.mit.edu/2026/new-window-on-brainstem-ai-algorithm-enables-tracking-white-matter-pathways-0210)`,
    tags: ['ai', 'news', 'neuroscience'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202601/mit-picower-brain-imaging.jpg?itok=Z83SrzkF',
    createdAt: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'mit-seed-2',
    title: 'Jak generatywna AI pomaga naukowcom syntetyzować złożone materiały',
    content: `## Model DiffSyn — przepisy na nowe materiały\n\nBadacze z MIT stworzyli model generatywnej AI o nazwie **DiffSyn**, który proponuje obiecujące metody syntezy nowych materiałów, przyspieszając drogę od hipotezy do zastosowania.\n\n### Problem\n\nTradycyjne odkrywanie materiałów to proces żmudny i kosztowny — naukowcy muszą eksperymentować setkami kombinacji, zanim znajdą właściwą recepturę.\n\n### Rozwiązanie\n\nDiffSyn generuje „przepisy" na syntezę zupełnie nowych materiałów, dając naukowcom solidny punkt wyjścia do dalszych eksperymentów.\n\n> „Model daje bardzo dobre wstępne propozycje przepisów syntezy dla zupełnie nowych materiałów" — Elton Pan, współautor badania\n\nTechnologia ta ma potencjał do radykalnego skrócenia czasu projektowania nowych materiałów — od baterii i ogniw słonecznych po zaawansowane stopy metali.\n\n---\n\n🔗 **Źródło:** [MIT News — How generative AI can help scientists synthesize complex materials](https://news.mit.edu/2026/how-generative-ai-can-help-scientists-synthesize-complex-materials-0202)`,
    tags: ['ai', 'news', 'tutorial'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202601/MIT-DiffSyn-01.jpg?itok=7TQIoUod',
    createdAt: '2026-02-02T12:00:00.000Z'
  },
  {
    id: 'mit-seed-3',
    title: 'EnCompass: jak pomóc agentom AI wyciągnąć maksimum z LLM-ów',
    content: `## Nowy system z MIT CSAIL\n\nNaukowcy z MIT CSAIL opracowali system **EnCompass**, który pozwala agentom AI na bardziej efektywne korzystanie z dużych modeli językowych (LLM).\n\n### Jak działa EnCompass?\n\nKiedy program napotyka błąd ze strony LLM, EnCompass automatycznie cofa się (backtracking) i próbuje ponownie. System potrafi też tworzyć klony środowiska uruchomieniowego, aby testować wiele prób równolegle i wybrać najlepsze rozwiązanie.\n\n### Dla kogo?\n\nEnCompass jest szczególnie przydatny dla programistów pracujących z agentami AI:\n\n- **Automatyczny backtracking** — nie musisz ręcznie obsługiwać błędów LLM\n- **Równoległe próby** — system sam szuka optymalnego zestawu odpowiedzi\n- **Lepsze wyniki** — więcej poprawnych odpowiedzi przy mniejszym wysiłku\n\n> „EnCompass pomaga programistom pracować z agentami AI znacznie wydajniej" — Alex Shipps, MIT CSAIL\n\n---\n\n🔗 **Źródło:** [MIT News — Helping AI agents search to get the best results out of LLMs](https://news.mit.edu/2026/helping-ai-agents-search-to-get-best-results-from-llms-0205)`,
    tags: ['ai', 'coding', 'tutorial'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202602/encompass2-mit-00_0.png?itok=O0CEx68x',
    createdAt: '2026-02-05T12:00:00.000Z'
  },
  {
    id: 'mit-seed-4',
    title: 'Badanie: platformy rankingowe LLM-ów mogą być niewiarygodne',
    content: `## Rankingi LLM — czy można im ufać?\n\nNowe badanie z MIT pokazuje, że popularne platformy rankingowe, które oceniają najnowsze modele językowe (LLM), mogą dawać **mylące wyniki**.\n\n### Kluczowe odkrycie\n\nUsunięcie zaledwie niewielkiego ułamka danych crowdsourcingowych, na których opierają się platformy rankingowe, może **znacząco zmienić pozycje** poszczególnych modeli.\n\n### Co to oznacza?\n\n- Rankingi LLM opierają się na danych od użytkowników, które mogą być stronnicze\n- Kilka „gorących" promptów może drastycznie wpłynąć na pozycję modelu\n- Użytkownik nie może ślepo ufać rankingom przy wyborze najlepszego LLM-a\n\n> „Użytkownik chce wiedzieć, czy wybiera najlepszy LLM. Jeśli tylko kilka promptów napędza ten ranking, to sugeruje, że ranking może nie być ostateczną odpowiedzią" — Tamara Broderick, prof. MIT\n\n### Rekomendacja\n\nZamiast polegać wyłącznie na rankingach publicznych, warto testować modele na **własnych zadaniach** i z **własnymi danymi**.\n\n---\n\n🔗 **Źródło:** [MIT News — Study: Platforms that rank the latest LLMs can be unreliable](https://news.mit.edu/2026/study-platforms-rank-latest-llms-can-be-unreliable-0209)`,
    tags: ['ai', 'news'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202602/MIT-LLM-Rankings-01-press.jpg?itok=sfZTuiuE',
    createdAt: '2026-02-09T12:00:00.000Z'
  },
  {
    id: 'mit-seed-5',
    title: 'Biologia syntetyczna i AI w walce z antybiotykoopornością',
    content: `## Globalne zagrożenie\n\nOporność na antybiotyki (AMR) to jedno z największych zagrożeń zdrowia publicznego XXI wieku. Nadużywanie i niewłaściwe stosowanie antybiotyków sprawia, że infekcje oporne na leki gwałtownie rosną, podczas gdy rozwój nowych narzędzi antybakteryjnych zwolnił.\n\n### Odpowiedź MIT\n\nNaukowcy z MIT, w tym profesor **Jim Collins**, łączą siły biologii syntetycznej i sztucznej inteligencji, aby:\n\n- **Identyfikować nowe związki antybakteryjne** za pomocą modeli ML\n- **Projektować syntetyczne organizmy** zdolne do zwalczania opornych bakterii\n- **Przyspieszać testy laboratoryjne** dzięki predykcji AI\n\n### Dlaczego to ważne?\n\nWedług WHO, do 2050 roku AMR może zabijać nawet 10 milionów ludzi rocznie — więcej niż rak. Połączenie AI z biologią syntetyczną daje nadzieję na przełamanie tego trendu.\n\n---\n\n🔗 **Źródło:** [MIT News — Using synthetic biology and AI to address global antimicrobial resistance](https://news.mit.edu/2026/using-synthetic-biology-ai-address-global-antimicrobial-resistance-0211)`,
    tags: ['ai', 'news'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202602/mit-jameel-research.jpg?itok=bPU1OnEK',
    createdAt: '2026-02-11T12:00:00.000Z'
  },
  {
    id: 'mit-seed-6',
    title: 'AI przyspiesza odkrywanie i projektowanie leków terapeutycznych',
    content: `## 3 pytania do prof. Jamesa Collinsa\n\nProfesor James Collins z MIT — ekspert od inżynierii biologicznej — opowiada o tym, jak sztuczna inteligencja rewolucjonizuje proces odkrywania leków.\n\n### Jak AI zmienia odkrywanie leków?\n\nTradycyjny pipeline odkrywania leków trwa **10-15 lat** i kosztuje miliardy dolarów. AI pozwala:\n\n1. **Przewidywać struktury molekularne** — modele generatywne projektują kandydatów na leki\n2. **Symulować interakcje** — zamiast kosztownych eksperymentów, AI modeluje jak lek działa na komórkę\n3. **Optymalizować dawkowanie** — algorytmy ML pomagają dobrać optymalną dawkę\n\n### Rola współpracy\n\n> „Współpraca z ekspertami z różnych dziedzin jest kluczowa. Łączymy przewidywania obliczeniowe z nowymi platformami eksperymentalnymi" — James Collins\n\nCollins podkreśla, że AI nie zastępuje naukowców — to narzędzie, które **drastycznie skraca czas** od pomysłu do leku gotowego do testów klinicznych.\n\n---\n\n🔗 **Źródło:** [MIT News — Using AI to accelerate the discovery and design of therapeutic drugs](https://news.mit.edu/2026/3-questions-using-ai-to-accelerate-discovery-design-therapeutic-drugs-0204)`,
    tags: ['ai', 'news'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202602/jim-collins-mit-00.jpg?itok=JTgq5F3D',
    createdAt: '2026-02-04T12:00:00.000Z'
  },
  {
    id: 'mit-seed-7',
    title: 'Przyspieszanie nauki dzięki AI i symulacjom',
    content: `## Profesor Rafael Gómez-Bombarelli o punkcie zwrotnym\n\nProfesor MIT **Rafael Gómez-Bombarelli** całą swoją karierę poświęcił zastosowaniu AI do usprawniania odkryć naukowych. Teraz uważa, że jesteśmy w **punkcie przełomowym**.\n\n### AI dla nauki — najbardziej ekscytujące zastosowanie\n\n> „AI dla nauki to jedno z najbardziej ekscytujących i ambitnych zastosowań AI. Inne zastosowania mają więcej wad i niejasności. AI dla nauki polega na przybliżaniu lepszej przyszłości" — Gómez-Bombarelli\n\n### Co się zmienia?\n\n- **Symulacje molekularne** — AI przyspiesza obliczenia miliardkrotnie\n- **Odkrywanie materiałów** — zamiast lat, nowe materiały można projektować w tygodnie\n- **Interdyscyplinarność** — AI łączy fizykę, chemię i inżynierię materiałową\n\n### Punkt zwrotny\n\nGómez-Bombarelli wskazuje, że dopiero teraz modele AI osiągnęły wystarczającą dokładność, by naukowcy mogli im **naprawdę zaufać** w swoich badaniach. To zmienia reguły gry.\n\n---\n\n🔗 **Źródło:** [MIT News — Accelerating science with AI and simulations](https://news.mit.edu/2026/accelerating-science-ai-and-simulations-rafael-gomez-bombarelli-0212)`,
    tags: ['ai', 'news'],
    coverImage: 'https://news.mit.edu/sites/default/files/styles/news_article__cover_image__original/public/images/202602/MIT-Rafael-Gomez-Bombarelli-01-press.jpg?itok=vCsnmt-Q',
    createdAt: '2026-02-12T12:00:00.000Z'
  }
];

const BlogHub = () => {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'editor', 'reader'
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const tags = ['all', 'tutorial', 'devlog', 'news', 'cyberpunk', 'ai', 'coding'];

  // Load articles from localStorage on mount; seed with defaults if empty
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setArticles(parsed.length > 0 ? parsed : DEFAULT_ARTICLES);
      } catch (e) {
        console.error('Error loading articles:', e);
        setArticles(DEFAULT_ARTICLES);
      }
    } else {
      setArticles(DEFAULT_ARTICLES);
    }
  }, []);

  // Save articles to localStorage whenever they change
  useEffect(() => {
    if (articles.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles]);

  // Filter articles based on search and tag
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || article.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNew = () => {
    setCurrentArticle(null);
    setView('editor');
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setView('editor');
  };

  const handleRead = (article) => {
    setCurrentArticle(article);
    setView('reader');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleSave = (articleData) => {
    if (currentArticle) {
      // Update existing article
      setArticles(articles.map(a => 
        a.id === currentArticle.id ? { ...articleData, id: currentArticle.id } : a
      ));
    } else {
      // Create new article
      const newArticle = {
        ...articleData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setArticles([newArticle, ...articles]);
    }
    setView('list');
  };

  const handleCancel = () => {
    setView('list');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <div className="blog-hub">
      {view === 'list' && (
        <>
          <div className="blog-header">
            <h1 className="blog-title">
              <span className="glow">BLOG</span> HUB
            </h1>
            <button className="btn-create" onClick={handleCreateNew}>
              + New Article
            </button>
          </div>

          <div className="blog-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="tag-filters">
              {tags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <ArticleList
            articles={filteredArticles}
            onRead={handleRead}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* --- ARTYKUŁY Z BLOGA (kafelki) --- */}
          {staticPosts.length > 0 && (
            <div className="blog-tiles-section">
              <h2 className="tiles-header">
                <span className="glow">ARTYKUŁY</span> Z BLOGA
              </h2>
              <div className="tiles-grid">
                {staticPosts.slice(0, 12).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="blog-tile"
                  >
                    {post.image && (
                      <div className="tile-image">
                        <img src={post.image} alt={post.title} loading="lazy" />
                      </div>
                    )}
                    <div className="tile-content">
                      <span className="tile-category">{post.category}</span>
                      <h3 className="tile-title">{post.title}</h3>
                      <div className="tile-meta">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'editor' && (
        <ArticleEditor
          article={currentArticle}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {view === 'reader' && (
        <ArticleReader
          article={currentArticle}
          onBack={handleBackToList}
          onEdit={() => handleEdit(currentArticle)}
        />
      )}
    </div>
  );
};

export default BlogHub;
