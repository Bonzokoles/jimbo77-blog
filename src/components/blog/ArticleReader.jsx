import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css';
import './ArticleReader.css';

const ArticleReader = ({ article, onBack, onEdit }) => {
  if (!article) {
    return (
      <div className="article-reader">
        <div className="reader-error">
          <h2>Article not found</h2>
          <button className="btn-back" onClick={onBack}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Calculate read time
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
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="article-reader">
      <div className="reader-header">
        <div className="reader-nav">
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <button className="btn-edit" onClick={onEdit}>
            Edit Article
          </button>
        </div>
      </div>

      <article className="reader-content">
        {article.coverImage && (
          <div className="reader-cover">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        <header className="reader-article-header">
          <h1 className="reader-title">{article.title}</h1>
          
          <div className="reader-meta">
            <span className="meta-date">
              {formatDate(article.createdAt || Date.now())}
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-read-time">
              {calculateReadTime(article.content)} min read
            </span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="reader-tags">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="reader-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="reader-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default ArticleReader;
