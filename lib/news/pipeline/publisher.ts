import { checkProcessedUrls } from '../db';
import { ScoredEvent } from '../types';

// Checks which of this run's URLs were already processed. SQLite handles
// hundreds of bind params per query, so this is a single lookup (or a
// couple of chunked ones) instead of the per-event Firestore reads this used
// to require.
export async function filterAlreadyProcessedByUrl<T extends ScoredEvent>(events: T[]): Promise<T[]> {
  const urls = events.filter(e => e.url).map(e => e.url);
  const existing = await checkProcessedUrls(urls);
  return events.filter(e => !e.url || !existing.has(e.url));
}
