import { groqJSON, groqJSONFast } from '../../llm';
import { BlogArticle } from '../types';

export interface SEOPackage {
  // Classic Google SEO
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  keywords: string[];
  focusKeyword: string;

  // AI Search Engine Optimization (ChatGPT, Gemini, Perplexity, Claude)
  conversationalQueries: string[];    // How people ask AI assistants
  aiSearchSnippet: string;            // Optimized for AI overview
  entityRelationships: string[];      // For knowledge graph

  // Schema.org Markup
  articleSchema: Record<string, unknown>;
  faqSchema: Record<string, unknown> | null;
  breadcrumbSchema: Record<string, unknown>;

  // Social
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;

  // Internal Linking
  suggestedInternalLinks: string[];   // URL paths to link to

  // Readability
  readingTimeMinutes: number;
  wordCount: number;
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateSEOPackage(
  article: Partial<BlogArticle>,
  siteUrl = 'https://thinksuite.in'
): Promise<SEOPackage> {
  const content = article.content || '';
  const title = article.title || '';
  const wordCount = content.split(/\s+/).length;
  const slug = article.slug || '';

  let aiSEO: Partial<SEOPackage> = {};

  try {
    const prompt = `You are an SEO expert specializing in both traditional Google SEO and AI-native search (ChatGPT, Gemini, Perplexity, Claude AI Overviews).

Article:
Title: ${title}
Summary: ${article.summary || ''}
Content excerpt: ${content.slice(0, 500)}
Company: ${article.company}
Category: ${article.category}

Generate SEO package as JSON:
{
  "metaTitle": "<60 chars, includes primary keyword>",
  "metaDescription": "<150-160 chars, compelling, includes keyword>",
  "focusKeyword": "<primary keyword phrase>",
  "keywords": ["kw1","kw2","kw3","kw4","kw5","kw6","kw7","kw8"],
  "conversationalQueries": [
    "What did [company] announce?",
    "How does this affect [industry]?",
    "Is [product] better than competitors?",
    "What should developers know about [topic]?"
  ],
  "aiSearchSnippet": "<2-3 sentence direct answer optimized for AI overview, factual, structured, answer-first>",
  "entityRelationships": ["Company:OpenAI", "Product:GPT-5", "Concept:Reasoning"],
  "ogTitle": "<engaging social title>",
  "ogDescription": "<engaging 2-line social description>",
  "twitterTitle": "<punchy twitter title>",
  "twitterDescription": "<twitter description>",
  "suggestedInternalLinks": ["/blog", "/ai-automation", "/ai-tools-development"]
}`;

    aiSEO = await groqJSONFast(prompt, 600);
  } catch {
    aiSEO = {
      metaTitle: title.slice(0, 60),
      metaDescription: article.summary?.slice(0, 155) || '',
      focusKeyword: article.company || 'AI',
      keywords: article.tags || [],
      conversationalQueries: [`What is ${article.company} doing?`],
      aiSearchSnippet: article.summary || '',
      ogTitle: title,
      ogDescription: article.summary || '',
      twitterTitle: title,
      twitterDescription: article.summary || '',
      suggestedInternalLinks: ['/blog', '/ai-automation'],
    };
  }

  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const faqs = article.faqs || [];

  return {
    metaTitle: aiSEO.metaTitle || title.slice(0, 60),
    metaDescription: aiSEO.metaDescription || '',
    slug,
    canonicalUrl,
    keywords: aiSEO.keywords || [],
    focusKeyword: aiSEO.focusKeyword || '',
    conversationalQueries: aiSEO.conversationalQueries || [],
    aiSearchSnippet: aiSEO.aiSearchSnippet || '',
    entityRelationships: aiSEO.entityRelationships || [],
    ogTitle: aiSEO.ogTitle || title,
    ogDescription: aiSEO.ogDescription || '',
    twitterTitle: aiSEO.twitterTitle || title,
    twitterDescription: aiSEO.twitterDescription || '',
    suggestedInternalLinks: aiSEO.suggestedInternalLinks || [],
    readingTimeMinutes: estimateReadTime(content),
    wordCount,
    articleSchema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: article.summary,
      image: article.heroImageUrl,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { '@type': 'Organization', name: 'ThinkSuite AI' },
      publisher: {
        '@type': 'Organization',
        name: 'ThinkSuite',
        url: siteUrl,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/img/favicon.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      keywords: (aiSEO.keywords || []).join(', '),
      articleSection: article.category,
      wordCount,
    },
    faqSchema: faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    } : null,
    breadcrumbSchema: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'AI News', item: `${siteUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: article.company, item: canonicalUrl },
      ],
    },
  };
}
