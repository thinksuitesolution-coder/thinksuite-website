import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;
let _db: Firestore | null = null;

function getCredential() {
  // Prefer JSON service account blob (set in .env.local as FIREBASE_SERVICE_ACCOUNT_KEY)
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    const sa = JSON.parse(raw);
    if (sa.private_key) {
      sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    }
    return cert(sa);
  }
  // Fallback: individual env vars
  return cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  });
}

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0];
    return _app;
  }
  _app = initializeApp({ credential: getCredential() });
  return _app;
}

function getAdminDb(): Firestore {
  if (_db) return _db;
  getAdminApp();
  _db = getFirestore();
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
