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

// Checks only the specific URLs collected this run (one doc-get each) instead of
// scanning up to 2000 arbitrary processedUrls docs on every run — that scan was
// the single biggest Firestore read-cost driver in this pipeline.
export async function filterAlreadyProcessedByUrl<T extends ScoredEvent>(events: T[]): Promise<T[]> {
  // One malformed/empty URL throwing here must not take down the whole run —
  // treat it as "not yet processed" (worst case: a rare duplicate) rather
  // than failing every event in the batch.
  const flags = await Promise.all(
    events.map(e => {
      if (!e.url) return Promise.resolve({ exists: false });
      return processedUrlsCol().doc(urlDocId(e.url)).get().catch(() => ({ exists: false }));
    })
  );
  return events.filter((_, i) => !flags[i].exists);
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
