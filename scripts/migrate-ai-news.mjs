// One-time migration: copies ai_articles / ai_raw_events / ai_processed_urls
// from the OLD (main platform) Firebase project into the NEW (news-only, free
// Spark) Firebase project. Run this BEFORE switching NEWS_FIREBASE_* env vars
// over in production — it needs the old project's credentials to still work.
//
// Usage:
//   node scripts/migrate-ai-news.mjs
//
// Requires these env vars to be set (e.g. via `.env.local`, loaded with
// `node --env-file=.env.local scripts/migrate-ai-news.mjs`):
//   FIREBASE_SERVICE_ACCOUNT_KEY       - old project's service account JSON
//   NEWS_FIREBASE_SERVICE_ACCOUNT_KEY  - new project's service account JSON
//
// Doc IDs are preserved so nothing gets duplicated if you run it twice.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const COLLECTIONS = ['ai_articles', 'ai_raw_events', 'ai_processed_urls'];
const PAGE_SIZE = 500;

function loadCredential(envVarName) {
  const raw = process.env[envVarName];
  if (!raw) {
    throw new Error(`Missing env var ${envVarName}. Set it to the service account JSON (as a string).`);
  }
  const sa = JSON.parse(raw);
  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
  return cert(sa);
}

async function migrateCollection(oldDb, newDb, name) {
  console.log(`\n[${name}] starting...`);
  let migrated = 0;
  let lastDoc = null;

  for (;;) {
    let query = oldDb.collection(name).orderBy('__name__').limit(PAGE_SIZE);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snap = await query.get();
    if (snap.empty) break;

    const batch = newDb.batch();
    for (const doc of snap.docs) {
      batch.set(newDb.collection(name).doc(doc.id), doc.data());
    }
    await batch.commit();

    migrated += snap.size;
    lastDoc = snap.docs[snap.docs.length - 1];
    console.log(`[${name}] migrated ${migrated} so far...`);

    if (snap.size < PAGE_SIZE) break;
  }

  console.log(`[${name}] done — ${migrated} documents migrated.`);
  return migrated;
}

async function main() {
  const oldApp = initializeApp({ credential: loadCredential('FIREBASE_SERVICE_ACCOUNT_KEY') }, 'old-project');
  const newApp = initializeApp({ credential: loadCredential('NEWS_FIREBASE_SERVICE_ACCOUNT_KEY') }, 'new-project');

  const oldDb = getFirestore(oldApp);
  const newDb = getFirestore(newApp);

  const results = {};
  for (const name of COLLECTIONS) {
    results[name] = await migrateCollection(oldDb, newDb, name);
  }

  console.log('\nMigration complete:', results);
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
