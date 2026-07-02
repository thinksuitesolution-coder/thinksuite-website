import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/* Singleton init - avoids "already initialized" errors in Next.js hot reload */
function ensureApp() {
  if (getApps().length > 0) return;

  // Support both FIREBASE_SERVICE_ACCOUNT_KEY and FIREBASE_SERVICE_ACCOUNT_JSON
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    || process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    || "{}";

  const serviceAccount = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key
      .replace(/\\n/g, "\n")                          // double-escaped \n → real newline
      .replace(/^[- \t]*(BEGIN PRIVATE KEY)[- \t]*$/mg, "-----$1-----")  // normalize full header line
      .replace(/^[- \t]*(END PRIVATE KEY)[- \t]*$/mg, "-----$1-----");   // normalize full footer line
  }

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "thinksuite-website.firebasestorage.app",
  });
}

function getAdmin() {
  ensureApp();
  return { auth: getAuth, firestore: getFirestore, storage: getStorage };
}

export function getAdminDb() {
  ensureApp();
  return getFirestore();
}

export function getAdminStorage() {
  ensureApp();
  return getStorage();
}

// Compat shim for call sites using the old admin.firestore.FieldValue.* static namespace
export const firebaseAdmin = { firestore: { FieldValue } };
export default getAdmin;
