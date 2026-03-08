-- JIMBO77 Social Club Database Schema
-- Stock po środku - główna baza danych

-- Posty blogowe
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  tags TEXT, -- JSON array
  published BOOLEAN DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Komentarze
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  parent_id INTEGER, -- dla nested comments
  approved BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Odwiedziny crawlerów AI (kluczowe dla projektu!)
CREATE TABLE IF NOT EXISTS crawler_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crawler_name TEXT, -- np. 'ChatGPT', 'Claude', 'Perplexity'
  url TEXT NOT NULL,
  user_agent TEXT,
  ip TEXT,
  metadata TEXT, -- JSON z dodatkowymi danymi
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Użytkownicy (dla komentarzy i społeczności)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  github_id TEXT UNIQUE, -- OAuth
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Globalne statystyki
CREATE TABLE IF NOT EXISTS global_stats (
  key TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Webhooki między aplikacjami
CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_app TEXT NOT NULL, -- np. 'my-bonzo-ai-blog', 'luc-de-zen-on'
  event_type TEXT NOT NULL, -- np. 'post.published', 'product.updated'
  payload TEXT NOT NULL, -- JSON
  processed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_crawler_visits_time ON crawler_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_crawler_name ON crawler_visits(crawler_name);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);

-- Insert początkowe dane
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_posts', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_views', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('crawler_visits', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('unique_crawlers', 0);
