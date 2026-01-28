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
  Spinner
} from "@heroui/react";
import { Home, Calendar, Clock } from 'lucide-react';
import BlogLayout from '../layouts/BlogLayout';
import JimboArticleFrame from '../components/JimboArticleFrame';

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
        let metadata = staticPosts.find(b => b.slug === slug);
        let contentUrl = `/blog-content/${slug}.md`;

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

        if (!metadata) throw new Error('Artykuł nie został znaleziony');
        setBlog(metadata);

        const res = await fetch(contentUrl);
        if (!res.ok) throw new Error('Błąd ładowania treści');
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

  if (error) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] text-center text-white">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-slate-400 mb-8">{error}</p>
      <Button as={Link} to="/" variant="flat" color="primary">Home</Button>
    </div>
  );

  if (loading || !blog) return <BlogSkeleton />;

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 pb-24 text-white">
        <div className="mb-8">
          <Breadcrumbs variant="flat" classNames={{ list: "bg-slate-900/50 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full" }}>
            <BreadcrumbItem startContent={<Home size={14} />} href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/">{blog.category}</BreadcrumbItem>
            <BreadcrumbItem isCurrent className="text-cyan-400">{blog.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <header className="mb-8">
          <Chip size="sm" variant="flat" color="primary" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 uppercase font-mono tracking-widest text-[10px]">
            {blog.category}
          </Chip>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight uppercase font-mono">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 text-slate-400 text-xs font-mono">
            <div className="flex items-center gap-2"><Calendar size={14} className="text-cyan-500/50" /><span>{blog.date}</span></div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-cyan-500/50" /><span>{blog.readTime} MIN_READ</span></div>
          </div>
        </header>

        <Divider className="mb-10 bg-white/10" />

        {/* HERO IMAGE FRAME - NOW PERFECTLY POSITIONED */}
        <JimboArticleFrame
          src={blog.image}
          alt={blog.title}
          className="mb-12 -mx-4 md:-mx-8 aspect-video md:aspect-[21/9] shadow-2xl shadow-cyan-500/5"
        />

        <article className="prose prose-invert lg:prose-xl max-w-none mb-16 font-sans leading-relaxed">
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
