import { adminDb, articlesCol, processedUrlsCol } from '../../firebase-admin';
import { BlogArticle, ScoredEvent } from '../types';
import { generateBlogArticle } from './writer';

export async function publishArticle(article: BlogArticle): Promise<string> {
  // Check slug uniqueness
  const existing = await articlesCol().where('slug', '==', article.slug).limit(1).get();
  if (!existing.empty) {
    article.slug = `${article.slug}-${Date.now()}`;
  }

  await articlesCol().doc(article.id).set(article);

  // Mark URL as processed
  await processedUrlsCol().doc(Buffer.from(article.originalUrl).toString('base64').slice(0, 100)).set({
    url: article.originalUrl,
    articleId: article.id,
    processedAt: new Date().toISOString(),
  });

  console.log(`Published: "${article.title}" [${article.slug}]`);
  return article.id;
}

export async function getProcessedUrls(): Promise<Set<string>> {
  const snap = await processedUrlsCol().limit(2000).get();
  const urls = new Set<string>();
  snap.forEach(doc => urls.add(doc.data().url));
  return urls;
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
