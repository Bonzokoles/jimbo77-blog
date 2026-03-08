import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

/**
 * SEO Component for Blog Posts & Pages
 * Handles: Title, Description, Open Graph, Twitter Cards, Canonical URLs
 */
export default function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'article',
  author = 'JIMBO77 Team',
  publishedTime,
  modifiedTime,
  tags = [],
  noindex = false
}) {
  const siteUrl = 'https://jimbo77.org';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const defaultImage = 'https://r2-public-mybonzo.stolarnia-ams.workers.dev/blog-images/jimbo77-og-default.jpg';
  const ogImage = image || defaultImage;

  // Construct full title
  const fullTitle = title ? `${title} | JIMBO77 AI Agent Social Club` : 'JIMBO77 AI Agent Social Club - Polski Hub Technologiczny AI';
  const metaDescription = description || 'Polski blog technologiczny o AI agentах, MCP, Cloudflare Workers AI, RAG systems i multi-agent orchestration.';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      <meta name="author" content={author} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="JIMBO77 AI Agent Social Club" />
      <meta property="og:locale" content="pl_PL" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags.length > 0 && 
        tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)
      }

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@jimbo77dev" />
      <meta name="twitter:creator" content="@jimbo77dev" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0a0a0a" />
      <link rel="alternate" type="application/rss+xml" title="JIMBO77 RSS Feed" href={`${siteUrl}/rss.xml`} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(['website', 'article', 'profile']),
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  noindex: PropTypes.bool
};
