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
import { ChevronLeft, ChevronRight, Home, Calendar, Clock } from 'lucide-react';
import BlogLayout from '../layouts/BlogLayout';
import JimboArticleFrame from '../components/JimboArticleFrame';

const WORKER_URL = "https://r2-public-mybonzo.stolarnia-ams.workers.dev";
...
        <Divider className="mb-10 bg-white/10" />

        {/* HERO IMAGE - Now with High-Tech Frame */}
        <JimboArticleFrame
          src={blog.image}
          alt={blog.title}
          className="mb-16 -mx-4 md:-mx-8 lg:-mx-16 aspect-video md:aspect-[21/9]"
        />

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
