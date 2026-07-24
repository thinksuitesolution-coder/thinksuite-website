import { articlesCol, processedUrlsCol } from '../../firebase-admin';
import { archiveArticles, purgeArchivedOlderThan } from '../archive-db';

const FIRESTORE_RETENTION_DAYS = 14;
const ARCHIVE_RETENTION_DAYS = 90;

// Caps how many 500-doc batches a single cron run will churn through. Without
// this, a large backlog (e.g. processedUrls that built up before cleanup was
// running reliably) gets read+deleted in one shot — easily thousands of reads
// and deletes in a single invocation, which can burn the whole free-tier daily
// Firestore quota (and starve the rest of the day's fetch-news/page reads) in
// one 3am run. Capping means a big backlog just drains gradually over several
// days instead of spiking.
const MAX_BATCHES_PER_RUN = 10;

async function deleteDocsOlderThan(
  col: ReturnType<typeof processedUrlsCol>,
  dateField: string,
  cutoffIso: string
): Promise<number> {
  let deleted = 0;
  // Firestore batch delete caps at 500 ops — loop until nothing old is left
  // (or we hit the per-run cap, see MAX_BATCHES_PER_RUN above).
  for (let i = 0; i < MAX_BATCHES_PER_RUN; i++) {
    const snap = await col.where(dateField, '<', cutoffIso).limit(500).get();
    if (snap.empty) break;

    const batch = col.firestore.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    deleted += snap.size;

    if (snap.size < 500) break;
  }
  return deleted;
}

// Moves articles older than FIRESTORE_RETENTION_DAYS into the Turso archive,
// then deletes them from Firestore — keeps Firestore storage bounded on the
// free (Spark) plan while still serving old article URLs from the archive.
async function archiveOldArticles(cutoffIso: string): Promise<number> {
  const col = articlesCol();
  let moved = 0;
  for (let i = 0; i < MAX_BATCHES_PER_RUN; i++) {
    const snap = await col.where('publishedAt', '<', cutoffIso).limit(500).get();
    if (snap.empty) break;

    const docs = snap.docs.map(d => d.data());
    await archiveArticles(docs);

    const batch = col.firestore.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    moved += snap.size;
    if (snap.size < 500) break;
  }
  return moved;
}

export async function cleanupOldNews(): Promise<{
  articlesArchived: number;
  processedUrlsDeleted: number;
  archivedPurged: number;
}> {
  const firestoreCutoff = new Date(Date.now() - FIRESTORE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const archiveCutoff = new Date(Date.now() - ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [articlesArchived, processedUrlsDeleted, archivedPurged] = await Promise.all([
    archiveOldArticles(firestoreCutoff),
    deleteDocsOlderThan(processedUrlsCol(), 'processedAt', firestoreCutoff),
    purgeArchivedOlderThan(archiveCutoff),
  ]);

  return { articlesArchived, processedUrlsDeleted, archivedPurged };
}
