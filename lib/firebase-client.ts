import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy singletons — module-scope init would throw auth/invalid-api-key
// during Next.js SSG prerendering because NEXT_PUBLIC_* vars are inlined
// at build time and are only available when set in the build environment.
let _app:  FirebaseApp | undefined;
let _db:   Firestore   | undefined;
let _auth: Auth        | undefined;

function getApp(): FirebaseApp {
  if (!_app) _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export function getClientAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
    if (typeof window !== 'undefined') {
      setPersistence(_auth, browserLocalPersistence).catch(console.error);
    }
  }
  return _auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getClientAuth(), googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getClientAuth());
}

export { onAuthStateChanged };
export type { User };
