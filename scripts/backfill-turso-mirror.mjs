// One-time backfill: copies every article still sitting in the (now retired)
// news Firestore project's `ai_articles` collection into Turso's `articles`
// table. The real-time mirror added earlier only covers articles published
// AFTER that fix went in — everything published before it never made it to
// Turso. Now that Firestore is fully removed from the app, those older
// articles need this backfill or they stay invisible on the site.
//
// Safe to run more than once — upserts by slug (ON CONFLICT DO UPDATE).
//
// Usage: node scripts/backfill-turso-mirror.mjs
// Requires NEWS_FIREBASE_SERVICE_ACCOUNT_KEY + TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
// (reads them from .env.local if not already in the environment).
// NOTE: this reads the full ai_articles collection, which costs Firestore
// reads — don't run this while quota is still exhausted for the day.

import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createClient } from '@libsql/client';

for (const key of ['NEWS_FIREBASE_SERVICE_ACCOUNT_KEY', 'TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN']) {
  if (process.env[key]) continue;
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
  break;
}

const sa = JSON.parse(process.env.NEWS_FIREBASE_SERVICE_ACCOUNT_KEY);
if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
const app = initializeApp({ credential: cert(sa) }, 'backfill');
const db = getFirestore(app);

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await turso.execute(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    company TEXT,
    category TEXT,
    event_type TEXT,
    importance_score INTEGER,
    status TEXT,
    published_at TEXT NOT NULL,
    archived_at TEXT NOT NULL,
    data TEXT NOT NULL
  )
`);

async function main() {
  let migrated = 0;
  let lastDoc = null;
  const now = new Date().toISOString();

  for (;;) {
    let query = db.collection('ai_articles').orderBy('__name__').limit(500);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snap = await query.get();
    if (snap.empty) break;

    const batch = snap.docs.map(doc => {
      const a = doc.data();
      return {
        sql: `INSERT INTO articles (id, slug, title, company, category, event_type, importance_score, status, published_at, archived_at, data)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(slug) DO UPDATE SET data = excluded.data, status = excluded.status`,
        args: [
          String(a.id ?? ''),
          String(a.slug ?? ''),
          String(a.title ?? ''),
          a.company ?? null,
          a.category ?? null,
          a.eventType ?? null,
          a.importanceScore ?? 0,
          a.status ?? 'published',
          String(a.publishedAt ?? now),
          now,
          JSON.stringify(a),
        ],
      };
    });

    await turso.batch(batch, 'write');
    migrated += snap.size;
    lastDoc = snap.docs[snap.docs.length - 1];
    console.log(`migrated ${migrated} so far...`);

    if (snap.size < 500) break;
  }

  console.log(`Backfill complete — ${migrated} articles mirrored into Turso.`);
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
