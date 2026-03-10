import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleList from './blog/ArticleList';
import ArticleEditor from './blog/ArticleEditor';
import ArticleReader from './blog/ArticleReader';
import { blogPosts as staticPosts } from '../data/blogPosts';
import './BlogHub.css';

const STORAGE_KEY = 'bonzo_blog_articles';

const BlogHub = () => {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'editor', 'reader'
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const tags = ['all', 'tutorial', 'devlog', 'news', 'cyberpunk', 'ai', 'coding'];

  // Load articles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setArticles(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading articles:', e);
      }
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
