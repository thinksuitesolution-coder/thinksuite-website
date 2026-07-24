import { unstable_cache } from 'next/cache';
import { getPublishedArticles } from '@/lib/news/db';
import { BlogArticle } from '@/lib/news/types';

// All published articles, newest first, from Turso. Shared by sitemap.ts,
// rss.xml, and the category hub pages so they all see the same article set.
//
// Cached (10 min) because this is hit by crawlers (Googlebot, Bingbot, AI
// crawlers via llms.txt, RSS readers) far more often than real users.
async function fetchCombinedArticles(limit: number): Promise<BlogArticle[]> {
  return getPublishedArticles({ limit });
}

const cachedByLimit = new Map<number, ReturnType<typeof unstable_cache>>();

export async function getCombinedArticles(limit = 500): Promise<BlogArticle[]> {
  let cached = cachedByLimit.get(limit);
  if (!cached) {
    cached = unstable_cache(
      () => fetchCombinedArticles(limit),
      [`ai-news-combined-articles-${limit}`],
      { revalidate: 600 }
    );
    cachedByLimit.set(limit, cached);
  }
  return cached() as Promise<BlogArticle[]>;
}
