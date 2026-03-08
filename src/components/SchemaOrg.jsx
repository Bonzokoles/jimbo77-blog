import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

/**
 * Schema.org JSON-LD Component for Rich Snippets
 * Supports: BlogPosting, Article, Organization, WebSite, BreadcrumbList
 */
export default function SchemaOrg({ type, data }) {
  const siteUrl = 'https://jimbo77.org';

  // Organization Schema (for homepage)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JIMBO77 AI Agent Social Club",
    "url": siteUrl,
    "logo": `${siteUrl}/jimbo77-logo.png`,
    "description": "Polski hub technologiczny AI & DevOps - blog z case studies, architekturami systemów AI",
    "sameAs": [
      "https://github.com/Bonzokoles/jimbo77-blog",
      "https://twitter.com/jimbo77dev"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "stolarnia.ams@gmail.com",
      "contactType": "Technical Support"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JIMBO77 AI Agent Social Club",
    "url": siteUrl,
    "description": "Polski blog technologiczny o AI agentach, MCP, Cloudflare Workers AI, RAG systems",
    "inLanguage": "pl",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // BlogPosting Schema (for articles)
  const blogPostingSchema = data ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description,
    "image": data.image || `${siteUrl}/og-default.jpg`,
    "author": {
      "@type": data.author === "Jimbo" ? "Person" : "Organization",
      "name": data.author || "JIMBO77 Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JIMBO77 AI Agent Social Club",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/jimbo77-logo.png`
      }
    },
    "datePublished": data.publishedTime || new Date().toISOString(),
    "dateModified": data.modifiedTime || data.publishedTime || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/${data.slug}`
    },
    "keywords": data.tech ? data.tech.join(', ') : '',
    "articleSection": data.category || "Technologia",
    "inLanguage": "pl",
    "timeRequired": data.readTime ? `PT${data.readTime}M` : undefined
  } : null;

  // BreadcrumbList Schema
  const breadcrumbSchema = data ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": data.category || "Blog",
        "item": `${siteUrl}/category/${data.category?.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.title,
        "item": `${siteUrl}/${data.slug}`
      }
    ]
  } : null;

  // Select schema based on type
  let schema;
  switch (type) {
    case 'organization':
      schema = organizationSchema;
      break;
    case 'website':
      schema = websiteSchema;
      break;
    case 'blogPosting':
      schema = [blogPostingSchema, breadcrumbSchema].filter(Boolean);
      break;
    default:
      schema = websiteSchema;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
}

SchemaOrg.propTypes = {
  type: PropTypes.oneOf(['organization', 'website', 'blogPosting']).isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string,
    author: PropTypes.string,
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    tech: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    readTime: PropTypes.number
  })
};
