import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticles } from '@/lib/news/archive-db';
import { BlogArticle } from '@/lib/news/types';

// Firestore (recent, 0-14 days) + Turso archive (14 days-3 months) combined,
// deduped by id, sorted newest first. Shared by sitemap.ts, rss.xml, and the
// category hub pages so they all see the same article set.
export async function getCombinedArticles(limit = 500): Promise<BlogArticle[]> {
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
