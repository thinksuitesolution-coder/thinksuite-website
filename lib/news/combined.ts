import { unstable_cache } from 'next/cache';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticles } from '@/lib/news/archive-db';
import { BlogArticle } from '@/lib/news/types';

// Firestore (recent, 0-14 days) + Turso archive (14 days-3 months) combined,
// deduped by id, sorted newest first. Shared by sitemap.ts, rss.xml, and the
// category hub pages so they all see the same article set.
//
// Cached (10 min) because this is hit by crawlers (Googlebot, Bingbot, AI
// crawlers via llms.txt, RSS readers) far more often than real users, and
// each uncached call was up to 500 Firestore reads — that was the single
// biggest Firestore-quota consumer on the free Spark plan, since crawler
// traffic doesn't respect the app's normal cadence the way real users do.
async function fetchCombinedArticles(limit: number): Promise<BlogArticle[]> {
  const [snap, archived] = await Promise.all([
    articlesCol().where('status', '==', 'published').limit(limit).get(),
    getArchivedArticles(limit).catch(() => []),
  ]);

  const recent = snap.docs.map((d) => d.data()) as unknown as BlogArticle[];
  const seenIds = new Set(recent.map((a) => a.id));
  const combined = [...recent, ...(archived as unknown as BlogArticle[]).filter((a) => !seenIds.has(a.id))];

  combined.sort((a, b) => +new Date(b.publishedAt || 0) - +new Date(a.publishedAt || 0));
  return combined;
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
