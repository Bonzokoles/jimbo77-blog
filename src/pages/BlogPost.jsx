import { useParams } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { blogPosts } from '../data/blogPosts';

// Dynamically import ReactMarkdown to code-split
const ReactMarkdown = lazy(() => import('react-markdown'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-white"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center min-h-screen text-center">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Błąd: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  </div>
);

const BlogPost = () => {
  const { slug } = useParams();
  console.log('Current slug from URL:', slug); // DEBUG LOG
  console.log('Available posts:', blogPosts.map(p => p.slug)); // DEBUG LOG

  const blog = blogPosts.find(b => b.slug === slug);
  console.log('Found blog object:', blog); // DEBUG LOG

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blog) {
      setError('Artykuł nie został znaleziony');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/blog-content/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Nie można załadować artykułu');
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading article:', err);
        setError('Nie udało się załadować artykułu');
        setLoading(false);
      });
  }, [slug, blog]);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="blog-content">
        {/* Header z małym JIMBO77 */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-sm text-cyan-400 font-bold mb-1">JIMBO77</div>
              <img
                src="/apple-touch-icon.png"
                alt="JIMBO77"
                className="w-16 h-16"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(6, 182, 212, 0.4))'
                }}
              />
            </div>
          </div>
        </div>

        <article className="prose prose-invert lg:prose-xl max-w-4xl mx-auto px-4 pb-12">
          <Suspense fallback={<LoadingSpinner />}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400 border-b border-cyan-500/30 pb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-white flex items-center gap-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-slate-200">{children}</h3>,
                p: ({ children }) => <p className="text-lg leading-relaxed mb-6 text-slate-300">{children}</p>,
                a: ({ href, children }) => (
                  <a href={href} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                code: ({ inline, className, children }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return inline ? (
                    <code className="bg-slate-800 text-cyan-300 px-2 py-1 rounded text-sm font-mono border border-slate-700">
                      {children}
                    </code>
                  ) : (
                    <code className={`${className} block bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto border border-slate-700`}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-6 text-slate-300 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-6 text-slate-300 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyan-500 pl-6 py-2 my-6 bg-slate-800/50 rounded-r-lg italic text-slate-300">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-slate-800 text-cyan-400 font-bold px-4 py-3 text-left border-b border-slate-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 border-b border-slate-700 text-slate-300">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </Suspense>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
