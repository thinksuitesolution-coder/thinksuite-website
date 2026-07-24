import { purgeArticlesOlderThan, purgeProcessedUrlsOlderThan } from '../db';

const RETENTION_DAYS = 90;

export async function cleanupOldNews(): Promise<{
  articlesPurged: number;
  processedUrlsPurged: number;
}> {
  const cutoffIso = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [articlesPurged, processedUrlsPurged] = await Promise.all([
    purgeArticlesOlderThan(cutoffIso),
    purgeProcessedUrlsOlderThan(cutoffIso),
  ]);

  return { articlesPurged, processedUrlsPurged };
}
