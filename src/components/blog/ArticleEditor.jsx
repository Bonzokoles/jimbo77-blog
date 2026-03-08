import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css';
import './ArticleEditor.css';

const ArticleEditor = ({ article, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setCoverImage(article.coverImage || '');
      setContent(article.content || '');
      setTags(article.tags ? article.tags.join(', ') : '');
    }
  }, [article]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required!');
      return;
    }

    const articleData = {
      title: title.trim(),
      coverImage: coverImage.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      updatedAt: new Date().toISOString(),
    };

    onSave(articleData);
  };

  const handleEnhance = async () => {
    if (!content.trim()) {
      alert('Please add some content first!');
      return;
    }

    setIsEnhancing(true);
    
    // This is a placeholder for AI enhancement
    // In a real implementation, this would call OpenAI or Claude API
    // For now, we'll just show a message
    setTimeout(() => {
      alert('AI Enhancement feature requires API key configuration.\nPlease configure OpenAI or Claude API key in Settings.');
      setIsEnhancing(false);
    }, 1000);

    // Example implementation (commented out):
    /*
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        alert('Please configure your OpenAI API key in Settings');
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `Enhance this blog article content while maintaining the original meaning:\n\n${content}`
          }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setContent(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('AI Enhancement error:', error);
      alert('Failed to enhance content. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
    */
  };

  return (
    <div className="article-editor">
      <div className="editor-header">
        <h1 className="editor-title">
          {article ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="editor-actions">
          <button 
            className="btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      <div className="editor-inputs">
        <input
          type="text"
          className="input-title"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="input-cover"
          placeholder="Cover Image URL (optional)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        <input
          type="text"
          className="input-tags"
          placeholder="Tags (comma separated, e.g., tutorial, ai, coding)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="editor-toolbar">
        <button
          className={`btn-toggle ${showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          className="btn-enhance"
          onClick={handleEnhance}
          disabled={isEnhancing}
        >
          {isEnhancing ? 'Enhancing...' : '✨ AI Enhance'}
        </button>
      </div>

      <div className={`editor-content ${showPreview ? 'split-view' : ''}`}>
        <div className="editor-pane">
          <textarea
            className="content-editor"
            placeholder="Write your article content in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {showPreview && (
          <div className="preview-pane">
            <div className="preview-label">Preview</div>
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              >
                {content || '*Preview will appear here...*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
