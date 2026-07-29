import type { MetadataRoute } from 'next';
import { getCombinedArticles } from '@/lib/news/combined';
import { NEWS_CATEGORIES, categoryToSlug } from '@/lib/news/categories';
import { projects } from './projects/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

const STATIC_ROUTES = [
  '', 'about', 'services', 'saas-products', 'tools', 'tools/content', 'tools/imagestudio',
  'tools/lead-generation', 'tools/video', 'tools/voice', 'ai-news', 'blog', 'faq', 'careers',
  'contact', 'team', 'projects', 'ecosystem', 'ecosystem/mythinkai', 'ecosystem/thinkvirtual',
  'ecosystem/visibility', 'ecosystem/wavcart',
  // Services
  'software-development', 'custom-software', 'web-development', 'mobile-app-development',
  'ai-tools-development', 'ai-automation', 'chatbot-solutions', 'workflow-automation',
  'digital-marketing', 'seo-optimization', 'social-media-marketing', 'google-meta-ads',
  'content-marketing', 'influencer-marketing', 'ai-marketing-systems', 'pr-campaigns',
  'branding-design', 'brand-identity', 'graphic-design', 'product-design', 'ui-ux-design',
  'media-advertising', 'indoor-advertising', 'outdoor-advertising',
  'consulting-growth', 'business-strategy', 'startup-consulting', 'growth-planning', 'market-research',
  // Legal
  'privacy-policy', 'terms-and-conditions', 'refund-cancellation', 'shipping-policy',
  'pricing-policy', 'child-safety-policy', 'delete-account',
];

// Last real content-edit date per route (from git history), not a fabricated "now".
// Bump a route's date here when its page content actually changes.
const ROUTE_LAST_MODIFIED: Record<string, string> = {
  '': '2026-07-15',
  about: '2026-07-20',
  services: '2026-07-15',
  'saas-products': '2026-07-15',
  tools: '2026-07-15',
  'tools/content': '2026-07-15',
  'tools/imagestudio': '2026-07-15',
  'tools/lead-generation': '2026-07-15',
  'tools/video': '2026-07-15',
  'tools/voice': '2026-07-15',
  'ai-news': '2026-07-24',
  blog: '2026-07-01',
  faq: '2026-07-15',
  careers: '2026-07-15',
  contact: '2026-07-15',
  team: '2026-07-15',
  projects: '2026-07-22',
  ecosystem: '2026-07-20',
  'ecosystem/mythinkai': '2026-07-13',
  'ecosystem/thinkvirtual': '2026-07-15',
  'ecosystem/visibility': '2026-07-13',
  'ecosystem/wavcart': '2026-07-13',
  'software-development': '2026-07-15',
  'custom-software': '2026-07-15',
  'web-development': '2026-07-15',
  'mobile-app-development': '2026-07-15',
  'ai-tools-development': '2026-07-15',
  'ai-automation': '2026-07-15',
  'chatbot-solutions': '2026-07-15',
  'workflow-automation': '2026-07-15',
  'digital-marketing': '2026-07-15',
  'seo-optimization': '2026-07-15',
  'social-media-marketing': '2026-07-15',
  'google-meta-ads': '2026-07-15',
  'content-marketing': '2026-07-15',
  'influencer-marketing': '2026-07-15',
  'ai-marketing-systems': '2026-07-15',
  'pr-campaigns': '2026-07-15',
  'branding-design': '2026-07-15',
  'brand-identity': '2026-07-15',
  'graphic-design': '2026-07-15',
  'product-design': '2026-07-15',
  'ui-ux-design': '2026-07-15',
  'media-advertising': '2026-07-15',
  'indoor-advertising': '2026-07-15',
  'outdoor-advertising': '2026-07-15',
  'consulting-growth': '2026-07-15',
  'business-strategy': '2026-07-15',
  'startup-consulting': '2026-07-15',
  'growth-planning': '2026-07-15',
  'market-research': '2026-07-15',
  'privacy-policy': '2026-07-15',
  'terms-and-conditions': '2026-07-15',
  'refund-cancellation': '2026-07-15',
  'shipping-policy': '2026-07-15',
  'pricing-policy': '2026-07-13',
  'child-safety-policy': '2026-07-13',
  'delete-account': '2026-07-13',
};

const PROJECTS_DATA_LAST_MODIFIED = '2026-07-22';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: new Date(ROUTE_LAST_MODIFIED[route] || ROUTE_LAST_MODIFIED['']),
    changeFrequency: route === '' || route === 'ai-news' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = NEWS_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/ai-news/category/${categoryToSlug(c)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: new Date(PROJECTS_DATA_LAST_MODIFIED),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const combined = await getCombinedArticles(500);
    newsEntries = combined
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${SITE_URL}/ai-news/${a.slug}`,
        lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));
  } catch {
    newsEntries = [];
  }

  return [...staticEntries, ...categoryEntries, ...projectEntries, ...newsEntries];
}
