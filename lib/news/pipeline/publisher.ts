import { FieldPath } from 'firebase-admin/firestore';
import { adminDb, articlesCol, processedUrlsCol } from '../../firebase-admin';
import { BlogArticle, ScoredEvent } from '../types';
import { generateBlogArticle } from './writer';

// base64url (not plain base64) — plain base64's `/` character is a path
// separator to Firestore and makes `.doc()` throw for any URL whose hash
// happens to contain one.
export function urlDocId(url: string): string {
  return Buffer.from(url).toString('base64url').slice(0, 100);
}

export async function publishArticle(article: BlogArticle): Promise<string> {
  // Check slug uniqueness
  const existing = await articlesCol().where('slug', '==', article.slug).limit(1).get();
  if (!existing.empty) {
    article.slug = `${article.slug}-${Date.now()}`;
  }

  await articlesCol().doc(article.id).set(article);

  // Mark URL as processed
  await processedUrlsCol().doc(urlDocId(article.originalUrl)).set({
    url: article.originalUrl,
    articleId: article.id,
    processedAt: new Date().toISOString(),
  });

  console.log(`Published: "${article.title}" [${article.slug}]`);
  return article.id;
}

// Checks which of this run's URLs were already processed, batched via `in` on
// document ID (30 per query — Firestore's cap) instead of one .get() per event.
// On a run with ~150 candidate events that's ~5 reads instead of 150 — the
// per-event version was still the single biggest Firestore read driver in this
// pipeline (12 runs/day × up to ~150 reads each ate deep into the free-tier
// daily quota on its own).
export async function filterAlreadyProcessedByUrl<T extends ScoredEvent>(events: T[]): Promise<T[]> {
  const withIds = events.map(e => ({ event: e, id: e.url ? urlDocId(e.url) : null }));
  const existing = new Set<string>();

  const idsToCheck = withIds.filter(x => x.id !== null).map(x => x.id as string);
  for (let i = 0; i < idsToCheck.length; i += 30) {
    const chunk = idsToCheck.slice(i, i + 30);
    try {
      const snap = await processedUrlsCol().where(FieldPath.documentId(), 'in', chunk).get();
      snap.forEach(d => existing.add(d.id));
    } catch {
      // A failed chunk lookup must not take down the whole run — worst case
      // is a rare duplicate slips through, not the whole batch getting dropped.
    }
  }

  return withIds.filter(x => x.id === null || !existing.has(x.id)).map(x => x.event);
}

export async function processAndPublishEvents(events: ScoredEvent[]): Promise<{
  published: number;
  failed: number;
  skipped: number;
}> {
  let published = 0;
  let failed = 0;
  let skipped = 0;

  // Process top events (max 10 per cron run to control API costs)
  const topEvents = events
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 10);

  for (const event of topEvents) {
    try {
      const article = await generateBlogArticle(event);
      if (!article) { failed++; continue; }

      await publishArticle(article);
      published++;

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`Failed to process event "${event.title}":`, (err as Error).message);
      failed++;
    }
  }

  return { published, failed, skipped };
}
