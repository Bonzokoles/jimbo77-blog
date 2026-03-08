import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { blogPosts } from '../data/blogPosts';
import {
  Skeleton,
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Divider,
  Card,
  CardBody,
  Chip
} from "@heroui/react";
import { ChevronLeft, ChevronRight, Home, Calendar, Clock, Tag } from 'lucide-react';
import BlogLayout from '../layouts/BlogLayout';

// Dynamically import ReactMarkdown to code-split
const ReactMarkdown = lazy(() => import('react-markdown'));

const BlogSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
    <div className="space-y-3">
      <Skeleton className="w-1/4 h-4 rounded-lg bg-slate-800" />
      <Skeleton className="w-3/4 h-12 rounded-lg bg-slate-800" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="w-24 h-6 rounded-full bg-slate-800" />
      <Skeleton className="w-24 h-6 rounded-full bg-slate-800" />
    </div>
    <Skeleton className="w-full h-96 rounded-2xl bg-slate-800" />
    <div className="space-y-4">
      <Skeleton className="w-full h-4 rounded-lg bg-slate-800" />
      <Skeleton className="w-full h-4 rounded-lg bg-slate-800" />
      <Skeleton className="w-5/6 h-4 rounded-lg bg-slate-800" />
    </div>
  </div>
);

const BlogPost = () => {
  const { slug } = useParams();
  const blogIndex = blogPosts.findIndex(b => b.slug === slug);
  const blog = blogPosts[blogIndex];

  const nextPost = blogIndex > 0 ? blogPosts[blogIndex - 1] : null;
  const prevPost = blogIndex < blogPosts.length - 1 ? blogPosts[blogIndex + 1] : null;

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
        setError('Nie udało się załadować artykułu');
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, [slug, blog]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
        <h2 className="text-4xl font-bold text-slate-200 mb-4">404</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <Button as={Link} to="/" variant="flat" color="primary">Wróć do strony głównej</Button>
      </div>
    );
  }

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 pb-24">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            variant="flat"
            classNames={{
              list: "bg-slate-900/50 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full"
            }}
          >
            <BreadcrumbItem startContent={<Home size={14} />} href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/">{blog.category}</BreadcrumbItem>
            <BreadcrumbItem isCurrent className="text-cyan-400">{blog.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-3 mb-6">
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            >
              {blog.category}
            </Chip>
            {blog.tech?.map((t, i) => (
              <Chip key={i} size="sm" variant="dot" className="border-slate-800 text-slate-400">{t}</Chip>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-cyan-500/60" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-500/60" />
              <span>{blog.readTime} min czytania</span>
            </div>
          </div>
        </header>

        <Divider className="mb-12 bg-white/5" />

        {/* Article Content */}
        <article className="prose prose-invert lg:prose-xl max-w-none mb-16">
          <Suspense fallback={<BlogSkeleton />}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mb-8 text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-bold mt-16 mb-6 text-white border-l-4 border-cyan-500 pl-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-bold mt-10 mb-4 text-slate-100">{children}</h3>,
                p: ({ children }) => <p className="text-lg leading-relaxed mb-6 text-slate-300/90">{children}</p>,
                a: ({ href, children }) => (
                  <Link to={href} className="text-cyan-400 hover:text-cyan-300 transition-colors decoration-cyan-500/30 underline-offset-4 underline">
                    {children}
                  </Link>
                ),
                code: ({ inline, className, children }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return inline ? (
                    <code className="bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-white/5">
                      {children}
                    </code>
                  ) : (
                    <div className="relative group my-8">
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <pre className="relative bg-slate-900/90 border border-white/10 rounded-xl p-6 overflow-x-auto">
                        <code className={`${className} text-slate-300 text-sm font-mono`}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                ul: ({ children }) => <ul className="list-none mb-8 space-y-3">{children}</ul>,
                li: ({ children, ordered }) => (
                  <li className="flex gap-3 text-slate-300">
                    <span className="text-cyan-500 mt-1.5">•</span>
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyan-500/50 pl-6 py-4 my-10 bg-cyan-500/5 rounded-r-2xl italic text-slate-200 text-xl font-serif">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <Card className="my-10 bg-slate-900/40 border-white/5 backdrop-blur-sm overflow-hidden">
                    <CardBody className="p-0">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          {children}
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                ),
                th: ({ children }) => (
                  <th className="bg-white/5 text-cyan-400 font-bold px-6 py-4 text-left border-b border-white/5 uppercase tracking-wider text-xs">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 border-b border-white/5 text-slate-300">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </Suspense>
        </article>

        <Divider className="mb-12 bg-white/5" />

        {/* Post Navigation */}
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug}`} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-2 text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors">
                <ChevronLeft size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Poprzedni</span>
              </div>
              <div className="text-lg font-bold text-slate-200 group-hover:text-white">{prevPost.title}</div>
            </Link>
          ) : <div />}

          {nextPost && (
            <Link to={`/blog/${nextPost.slug}`} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all text-right">
              <div className="flex items-center gap-2 text-slate-500 mb-2 group-hover:text-cyan-400 transition-colors justify-end">
                <span className="text-sm font-bold uppercase tracking-widest">Następny</span>
                <ChevronRight size={18} />
              </div>
              <div className="text-lg font-bold text-slate-200 group-hover:text-white">{nextPost.title}</div>
            </Link>
          )}
        </nav>
      </div>
    </BlogLayout>
  );
};

export default BlogPost;
