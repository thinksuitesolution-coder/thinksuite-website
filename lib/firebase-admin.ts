import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Named app (not the default one) so this stays on its own Firebase project,
// separate from the default app in lib/firebaseAdmin.js used by auth/leads/
// subscriptions/etc. Keeps the AI-news Firestore load isolated from the rest
// of the platform — see NEWS_FIREBASE_* env vars.
const NEWS_APP_NAME = 'news';

let _app: App | null = null;
let _db: Firestore | null = null;

function getCredential() {
  // Prefer JSON service account blob (set as NEWS_FIREBASE_SERVICE_ACCOUNT_KEY)
  const raw = process.env.NEWS_FIREBASE_SERVICE_ACCOUNT_KEY || process.env.NEWS_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    const sa = JSON.parse(raw);
    if (sa.private_key) {
      sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    }
    return cert(sa);
  }
  // Fallback: individual env vars
  return cert({
    projectId: process.env.NEWS_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEWS_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEWS_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  });
}

function getAdminApp(): App {
  if (_app) return _app;
  const existing = getApps().find(a => a.name === NEWS_APP_NAME);
  if (existing) {
    _app = existing;
    return _app;
  }
  _app = initializeApp({ credential: getCredential() }, NEWS_APP_NAME);
  return _app;
}

function getAdminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  return _db;
}

// Lazy proxy, callers use adminDb.collection(...) without needing to call a function
export const adminDb = new Proxy({} as Firestore, {
  get(_, prop: string | symbol) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const articlesCol      = () => getAdminDb().collection('ai_articles');
export const rawEventsCol     = () => getAdminDb().collection('ai_raw_events');
export const processedUrlsCol = () => getAdminDb().collection('ai_processed_urls');
