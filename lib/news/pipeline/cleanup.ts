import { purgeArticlesOlderThan, purgeProcessedUrlsOlderThan } from '../db';

const ARTICLE_RETENTION_DAYS = 30;

// Deliberately longer than the article retention, where it used to be equal.
// processed_urls is the pipeline's memory of what it has already ingested, so
// dropping a URL from it is what lets that story be fetched and published
// again. A feed still listing a five-week-old item would otherwise reappear as
// new the moment its article aged out. These rows are a URL and a date, so
// keeping them past the article costs nothing.
const PROCESSED_URL_RETENTION_DAYS = 90;

function cutoff(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export async function cleanupOldNews(): Promise<{
  articlesPurged: number;
  processedUrlsPurged: number;
}> {
  const [articlesPurged, processedUrlsPurged] = await Promise.all([
    purgeArticlesOlderThan(cutoff(ARTICLE_RETENTION_DAYS)),
    purgeProcessedUrlsOlderThan(cutoff(PROCESSED_URL_RETENTION_DAYS)),
  ]);

  return { articlesPurged, processedUrlsPurged };
}
