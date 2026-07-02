import getAdmin from "@/lib/firebaseAdmin";

/**
 * Verifies the Firebase ID token from the Authorization header and returns
 * the authenticated uid. Returns null if missing or invalid.
 *
 * All lead-gen routes MUST call this and reject requests where it returns null.
 * Never trust a userId from the request body - that is trivially forgeable.
 */
export async function verifyUser(request) {
  const auth  = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    console.error("[verifyUser] no Authorization header/token on request to", request.url);
    return null;
  }
  try {
    const decoded = await getAdmin().auth().verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    console.error("[verifyUser] verifyIdToken failed:", e.code, e.message);
    return null;
  }
}
