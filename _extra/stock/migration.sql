-- ═══════════════════════════════════════════════════════
-- MIGRATION: Napraw D1 po zmianach
-- Uruchom przez: wrangler d1 execute jimbo77-social-db --file=migration.sql
-- ═══════════════════════════════════════════════════════

-- 1. Nowe tabele (IF NOT EXISTS = bezpieczne)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS post_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'oferuję',
  contact TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL DEFAULT 'news',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crawler_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crawler_name TEXT,
  url TEXT NOT NULL,
  user_agent TEXT,
  ip TEXT,
  metadata TEXT,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_stats (
  key TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_app TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  processed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Przebuduj users (D1/SQLite nie wspiera ALTER TABLE ADD COLUMN w pełni)
-- Tworzymy nową tabelę i migrujemy dane

CREATE TABLE IF NOT EXISTS users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  website TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  skills TEXT DEFAULT '',
  dashboard_sections TEXT DEFAULT '[]',
  role TEXT DEFAULT 'member',
  totp_enabled INTEGER DEFAULT 0,
  totp_secret TEXT,
  email_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skopiuj istniejących userów (jeśli tabela users istnieje)
INSERT OR IGNORE INTO users_new (id, username, email, avatar_url, bio, created_at)
  SELECT id, username, email, COALESCE(avatar_url,''), COALESCE(bio,''), created_at
  FROM users;

DROP TABLE IF EXISTS users;
ALTER TABLE users_new RENAME TO users;

-- 3. Przebuduj posts
CREATE TABLE IF NOT EXISTS posts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  category_id INTEGER,
  is_pinned INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skopiuj istniejące posty (mapuj stare kolumny na nowe)
INSERT OR IGNORE INTO posts_new (id, title, content, author_id, view_count, like_count, created_at, updated_at)
  SELECT id, title, COALESCE(content,''), 
         COALESCE(author_id, 1),
         COALESCE(view_count, COALESCE(views, 0)),
         COALESCE(like_count, COALESCE(likes, 0)),
         created_at, COALESCE(updated_at, created_at)
  FROM posts;

DROP TABLE IF EXISTS posts;
ALTER TABLE posts_new RENAME TO posts;

-- 4. Przebuduj comments
CREATE TABLE IF NOT EXISTS comments_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO comments_new (id, post_id, author_id, content, created_at)
  SELECT id, post_id, COALESCE(author_id, 1), content, created_at
  FROM comments;

DROP TABLE IF EXISTS comments;
ALTER TABLE comments_new RENAME TO comments;

-- 5. Indexy
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_author ON listings(author_id);
CREATE INDEX IF NOT EXISTS idx_community_news_type ON community_news(type);
CREATE INDEX IF NOT EXISTS idx_crawler_visits_time ON crawler_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_crawler_name ON crawler_visits(crawler_name);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);

-- 6. Seed data
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_posts', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_views', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('crawler_visits', 0);
INSERT OR IGNORE INTO global_stats (key, value) VALUES ('unique_crawlers', 0);

INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Ogólne', 'ogolne', 1);
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('AI & ML', 'ai-ml', 2);
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Web Dev', 'web-dev', 3);
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('DevOps', 'devops', 4);
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Projekty', 'projekty', 5);

INSERT OR IGNORE INTO community_news (type, title, content)
VALUES ('rules', 'Zasady Community', '## Zasady JIMBO77 Community

1. **Szanuj innych** — brak hejtu, trollingu, spamu
2. **Pisz po polsku lub angielsku**
3. **Brak NSFW** — to forum techniczne
4. **Nie spamuj linkami** — marketing = ban
5. **Baw się dobrze** — dziel się wiedzą!');
