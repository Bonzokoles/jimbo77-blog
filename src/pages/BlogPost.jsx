import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { blogPosts as staticPosts } from '../data/blogPosts';
import {
  Skeleton,
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Divider,
  Chip,
  Image,
  Spinner
} from "@heroui/react";
import { ChevronLeft, ChevronRight, Home, Calendar, Clock } from 'lucide-react';
import BlogLayout from '../layouts/BlogLayout';

const WORKER_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev";

const BlogSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
    <div className="space-y-3">
      <Skeleton className="w-1/4 h-4 rounded-lg bg-slate-800" />
      <Skeleton className="w-3/4 h-12 rounded-lg bg-slate-800" />
    </div>
    <Skeleton className="w-full h-96 rounded-2xl bg-slate-800" />
  </div>
);

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Try to find metadata (R2 or Static)
        let metadata = staticPosts.find(b => b.slug === slug);
        let contentUrl = `/blog-content/${slug}.md`;

        // If it looks like a numeric ID (e.g. 001, 002), try R2 first
        if (/^\d+$/.test(slug)) {
          contentUrl = `${WORKER_URL}/texts/${slug}.md`;
          metadata = {
            title: `Article #${slug}`,
            category: "R2 Dynamic Hub",
            date: "Recent",
            readTime: 10,
            image: `${WORKER_URL}/hero/${slug}.jpg`
          };
        }

        if (!metadata) {
            throw new Error('Artykuł nie został znaleziony');
        }
        setBlog(metadata);

        // 2. Fetch Markdown content
        const res = await fetch(contentUrl);
        if (!res.ok) throw new Error('Nie można załadować treści z R2/Lokalnie');
        const text = await res.text();
        setContent(text);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
    window.scrollTo(0, 0);
  }, [slug]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4 text-white">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <Button as={Link} to="/" variant="flat" color="primary">Wróć do strony głównej</Button>
      </div>
    );
  }

  if (loading || !blog) return <BlogSkeleton />;

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="mb-8">
          <Breadcrumbs variant="flat" classNames={{ list: "bg-slate-900/50 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full" }}>
            <BreadcrumbItem startContent={<Home size={14} />} href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/">{blog.category}</BreadcrumbItem>
            <BreadcrumbItem isCurrent className="text-cyan-400">{blog.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <header className="mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <Chip size="sm" variant="flat" color="primary" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {blog.category}
            </Chip>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
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

        {/* Hero Image - MOVED ABOVE DIVIDER WITH HIGH Z-INDEX */}
        <div className="mb-10 -mx-4 md:-mx-8 lg:-mx-16 relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl z-50">
          <Image
            src={blog.image}
            alt={blog.title}
            loading="eager"
            as="img"
            className="w-full aspect-video md:aspect-[21/9] object-cover transition-transform duration-1000 group-hover:scale-105 relative z-50"
            radius="none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-50 pointer-events-none" />
        </div>

        <Divider className="mb-10 bg-white/10" />

        <article className="prose prose-invert lg:prose-xl max-w-none mb-16">
          <Suspense fallback={<Spinner />}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </Suspense>
        </article>

        <Divider className="mb-12 bg-white/5" />
      </div>
    </BlogLayout>
  );
};

export default BlogPost;
