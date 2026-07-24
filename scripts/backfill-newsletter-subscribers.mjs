// One-time backfill: copies newsletter_subscribers from the (now retired)
// news Firestore project into the Turso newsletter_subscribers table. Run
// once, before deleting the Firestore project, then delete this script.
//
// Usage: node scripts/backfill-newsletter-subscribers.mjs
// Requires NEWS_FIREBASE_SERVICE_ACCOUNT_KEY + TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
// (reads them from .env.local if not already in the environment).

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
const app = initializeApp({ credential: cert(sa) }, 'subscriber-backfill');
const db = getFirestore(app);

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await turso.execute(`
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    email TEXT PRIMARY KEY,
    role TEXT,
    edition TEXT,
    subscribed_at TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  )
`);

async function main() {
  const snap = await db.collection('newsletter_subscribers').get();
  if (snap.empty) {
    console.log('No subscribers found in Firestore — nothing to backfill.');
    return;
  }

  const batch = snap.docs.map(doc => {
    const s = doc.data();
    return {
      sql: `INSERT INTO newsletter_subscribers (email, role, edition, subscribed_at, active)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET role = excluded.role, edition = excluded.edition, active = excluded.active`,
      args: [
        String(s.email ?? ''),
        s.role ?? 'general',
        s.edition ?? 'daily',
        String(s.subscribedAt ?? new Date().toISOString()),
        s.active === false ? 0 : 1,
      ],
    };
  });

  await turso.batch(batch, 'write');
  console.log(`Backfill complete — ${batch.length} subscribers mirrored into Turso.`);
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
