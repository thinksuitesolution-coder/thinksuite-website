import type { MetadataRoute } from 'next';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticles } from '@/lib/news/archive-db';
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === 'ai-news' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const [snap, archived] = await Promise.all([
      articlesCol().where('status', '==', 'published').limit(500).get(),
      getArchivedArticles(500).catch(() => []),
    ]);
    const recent = snap.docs.map((d) => d.data());
    const seenIds = new Set(recent.map((a: { id?: string }) => a.id));
    const combined = [...recent, ...archived.filter((a) => !seenIds.has(a.id))] as unknown as Record<string, unknown>[];

    newsEntries = combined
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${SITE_URL}/ai-news/${a.slug}`,
        lastModified: a.publishedAt ? new Date(a.publishedAt as string) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));
  } catch {
    newsEntries = [];
  }

  return [...staticEntries, ...projectEntries, ...newsEntries];
}
