import admin from "firebase-admin";

/* Singleton init - avoids "already initialized" errors in Next.js hot reload */
function getAdmin() {
  if (admin.apps.length > 0) return admin;

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

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "thinksuite-website.firebasestorage.app",
  });

  return admin;
}

export function getAdminDb() {
  return getAdmin().firestore();
}

export function getAdminStorage() {
  return getAdmin().storage();
}

export { admin as firebaseAdmin };
export default getAdmin;
