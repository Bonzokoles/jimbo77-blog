import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
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
