import getAdmin, { getAdminDb, getAdminStorage } from "./firebaseAdmin.js";
import { randomUUID } from "crypto";

const SEVEN_DAYS  = 7  * 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function mimeToExt(mime = "") {
  if (mime.includes("png"))             return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp"))            return "webp";
  if (mime.includes("mp3") || mime.includes("mpeg")) return "mp3";
  if (mime.includes("wav"))             return "wav";
  if (mime.includes("mp4"))             return "mp4";
  if (mime.includes("webm"))            return "webm";
  return "bin";
}

function parseDataUri(data, fallbackMime) {
  if (typeof data === "string" && data.startsWith("data:")) {
    const commaIdx = data.indexOf(",");
    const header   = data.slice(0, commaIdx);
    const b64      = data.slice(commaIdx + 1);
    const mime     = header.match(/data:([^;]+)/)?.[1] || fallbackMime;
    return { base64: b64, mimeType: mime };
  }
  return { base64: data, mimeType: fallbackMime };
}

/**
 * Save a tool output to Firebase Storage + Firestore.
 *
 * @param {object} opts
 * @param {string} opts.uid         Firebase user ID
 * @param {string} opts.toolSlug    e.g. "imagestudio", "voice", "video"
 * @param {string} opts.type        "image" | "audio" | "video" | "text" | "url"
 * @param {string} opts.title       Human-readable label
 * @param {string} opts.data        Base64 / data URI (image/audio) | text content | external URL
 * @param {string} opts.mimeType    e.g. "image/png", "audio/mpeg"
 * @param {object} opts.metadata    Extra metadata (prompt, voice, etc.)
 * @returns {{ outputId, downloadUrl, userExpiresAt, createdAt }}
 */
export async function saveOutput({ uid, toolSlug, type, title, data, mimeType, metadata = {} }) {
  const db  = getAdminDb();
  const id  = randomUUID();
  const now = Date.now();

  const doc = {
    uid,
    toolSlug,
    type,
    title:          title || `${toolSlug} output`,
    metadata:       metadata || {},
    createdAt:      now,
    userExpiresAt:  now + SEVEN_DAYS,
    serverDeleteAt: now + THIRTY_DAYS,
    userDeleted:    false,
    serverDeleted:  false,
  };

  if (type === "text") {
    doc.textContent = typeof data === "string" ? data.slice(0, 900_000) : "";
    doc.mimeType    = "text/plain";

  } else if (type === "url") {
    // External hosted URL (e.g., Replicate video URL)
    doc.downloadUrl = data;
    doc.mimeType    = mimeType || "video/mp4";

  } else {
    // image | audio - upload to Firebase Storage with a permanent download token
    const storage = getAdminStorage();
    const bucket  = storage.bucket();

    const { base64, mimeType: detectedMime } = parseDataUri(data, mimeType);
    const finalMime = detectedMime || mimeType || "application/octet-stream";
    const ext       = mimeToExt(finalMime);
    const path      = `user-outputs/${uid}/${id}.${ext}`;
    const buffer    = Buffer.from(base64, "base64");

    const downloadToken = randomUUID();

    await bucket.file(path).save(buffer, {
      contentType: finalMime,
      resumable:   false,
      metadata: {
        contentType: finalMime,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const bucketName = bucket.name;
    const encoded    = encodeURIComponent(path);

    doc.storageRef  = path;
    doc.downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${downloadToken}`;
    doc.fileSize    = buffer.length;
    doc.mimeType    = finalMime;
  }

  await db.collection("userOutputs").doc(id).set(doc);

  return {
    outputId:     id,
    downloadUrl:  doc.downloadUrl || null,
    userExpiresAt: doc.userExpiresAt,
    createdAt:    doc.createdAt,
  };
}

/**
 * Verify a Firebase ID token and return the decoded uid.
 */
export async function verifyToken(idToken) {
  const decoded = await getAdmin().auth().verifyIdToken(idToken);
  return decoded.uid;
}
