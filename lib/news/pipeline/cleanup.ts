import { articlesCol, processedUrlsCol } from '../../firebase-admin';
import { archiveArticles, purgeArchivedOlderThan } from '../archive-db';

const FIRESTORE_RETENTION_DAYS = 14;
const ARCHIVE_RETENTION_DAYS = 90;

async function deleteDocsOlderThan(
  col: ReturnType<typeof processedUrlsCol>,
  dateField: string,
  cutoffIso: string
): Promise<number> {
  let deleted = 0;
  // Firestore batch delete caps at 500 ops — loop until nothing old is left.
  for (;;) {
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
  for (;;) {
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
