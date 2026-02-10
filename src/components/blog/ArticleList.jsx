import React from 'react';
import './ArticleList.css';

const ArticleList = ({ articles, onRead, onEdit, onDelete }) => {
  // Calculate read time (average reading speed: 200 words per minute)
  const calculateReadTime = (content) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get excerpt from content (first 150 characters)
  const getExcerpt = (content) => {
    const plainText = content.replace(/[#*`\[\]]/g, '');
    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...' 
      : plainText;
  };

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h2>No articles yet</h2>
        <p>Create your first article to get started!</p>
      </div>
    );
  }

  return (
    <div className="article-grid">
      {articles.map(article => (
        <div key={article.id} className="article-card">
          {article.coverImage && (
            <div className="article-cover">
              <img src={article.coverImage} alt={article.title} />
            </div>
          )}
          
          <div className="article-content">
            <h2 className="article-title">{article.title}</h2>
            
            <div className="article-meta">
              <span className="meta-date">
                {formatDate(article.createdAt || Date.now())}
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-read-time">
                {calculateReadTime(article.content)} min read
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="article-tags">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="article-excerpt">
              {getExcerpt(article.content)}
            </p>

            <div className="article-actions">
              <button 
                className="btn-action btn-read" 
                onClick={() => onRead(article)}
              >
                Read
              </button>
              <button 
                className="btn-action btn-edit" 
                onClick={() => onEdit(article)}
              >
                Edit
              </button>
              <button 
                className="btn-action btn-delete" 
                onClick={() => onDelete(article.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
