/* ═══════════════════════════════════════════════════════════════════════════
   ERROR CODES
   ═══════════════════════════════════════════════════════════════════════════ */
export const ERROR_CODES = {
  INVALID_PHOTO_FORMAT:    "INVALID_PHOTO_FORMAT",
  INSUFFICIENT_CREDITS:    "INSUFFICIENT_CREDITS",
  UNAUTHORIZED:            "UNAUTHORIZED",
  SERVICE_UNAVAILABLE:     "SERVICE_UNAVAILABLE",
  PROCESSING_TIMEOUT:      "PROCESSING_TIMEOUT",
  INVALID_JSON_FROM_CLAUDE:"INVALID_JSON_FROM_CLAUDE",
  ELEVENLABS_ERROR:        "ELEVENLABS_ERROR",
  REPLICATE_ERROR:         "REPLICATE_ERROR",
  PEXELS_ERROR:            "PEXELS_ERROR",
  RAILWAY_SERVICE_DOWN:    "RAILWAY_SERVICE_DOWN",
  FIREBASE_UPLOAD_FAILED:  "FIREBASE_UPLOAD_FAILED",
  INVALID_REQUEST:         "INVALID_REQUEST",
};

/* ── Human-readable messages for each code ───────────────────────────────── */
const USER_MESSAGES = {
  [ERROR_CODES.INVALID_PHOTO_FORMAT]:    "We couldn't read your photo. Try a different file (JPG, PNG, or WebP, max 10 MB).",
  [ERROR_CODES.INSUFFICIENT_CREDITS]:    "You don't have enough credits. Upgrade to Pro for unlimited videos.",
  [ERROR_CODES.UNAUTHORIZED]:            "Please sign in to continue.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]:     "Our video service is temporarily busy. Please try again in a few minutes.",
  [ERROR_CODES.PROCESSING_TIMEOUT]:      "Processing took too long. Your video will be ready soon check back in 5 minutes.",
  [ERROR_CODES.INVALID_JSON_FROM_CLAUDE]: "Scene generation failed. Please rephrase your topic and try again.",
  [ERROR_CODES.ELEVENLABS_ERROR]:        "Voice generation failed. Try again or choose a different voice.",
  [ERROR_CODES.REPLICATE_ERROR]:         "Lip-sync model failed. Please try again.",
  [ERROR_CODES.FIREBASE_UPLOAD_FAILED]:  "Video upload failed. We'll retry automatically check your history in a few minutes.",
  [ERROR_CODES.RAILWAY_SERVICE_DOWN]:    "Video assembly service is unavailable right now. Please try again shortly.",
  [ERROR_CODES.INVALID_REQUEST]:         "Invalid request. Please check your inputs and try again.",
};

const HTTP_STATUS = {
  [ERROR_CODES.INVALID_PHOTO_FORMAT]:    400,
  [ERROR_CODES.INSUFFICIENT_CREDITS]:    402,
  [ERROR_CODES.UNAUTHORIZED]:            401,
  [ERROR_CODES.SERVICE_UNAVAILABLE]:     503,
  [ERROR_CODES.PROCESSING_TIMEOUT]:      504,
  [ERROR_CODES.INVALID_JSON_FROM_CLAUDE]: 500,
  [ERROR_CODES.ELEVENLABS_ERROR]:        500,
  [ERROR_CODES.REPLICATE_ERROR]:         500,
  [ERROR_CODES.FIREBASE_UPLOAD_FAILED]:  500,
  [ERROR_CODES.RAILWAY_SERVICE_DOWN]:    503,
  [ERROR_CODES.INVALID_REQUEST]:         400,
};

/* ═══════════════════════════════════════════════════════════════════════════
   ERROR RESPONSE BUILDER
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Build a standard { success:false, error:{...} } response object.
 * @param {string} code        One of ERROR_CODES
 * @param {string} [detail]    Technical detail (logged, not shown to user)
 * @returns {{ body: object, status: number }}
 */
export function buildErrorResponse(code, detail = "") {
  const status  = HTTP_STATUS[code] || 500;
  const message = USER_MESSAGES[code] || "Something went wrong. Please try again.";
  return {
    status,
    body: {
      success: false,
      error: {
        code,
        message,
        detail:     detail || undefined,
        statusCode: status,
        timestamp:  Date.now(),
      },
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RETRY WITH EXPONENTIAL BACKOFF
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Run `fn` up to `maxRetries+1` times.
 * Waits baseDelay * 2^attempt ms between retries.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {number} [maxRetries=3]
 * @param {number} [baseDelay=1000]  ms
 * @returns {Promise<T>}
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

/* ═══════════════════════════════════════════════════════════════════════════
   REPLICATE POLLING WITH TIMEOUT
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Poll a Replicate prediction until succeeded/failed or timeout.
 *
 * @param {string} predictionId
 * @param {string} replicateToken
 * @param {number} [maxDurationMs=300000]  5 minutes default
 * @param {number} [pollIntervalMs=5000]
 * @returns {Promise<object>}  The final prediction object
 */
export async function pollReplicateUntilDone(
  predictionId,
  replicateToken,
  maxDurationMs = 5 * 60 * 1000,
  pollIntervalMs = 5000,
) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxDurationMs) {
    await new Promise(r => setTimeout(r, pollIntervalMs));

    const res  = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { "Authorization": `Token ${replicateToken}` },
    });

    if (!res.ok) throw new Error(`Replicate poll error ${res.status}`);

    const data = await res.json();

    if (data.status === "succeeded") return data;
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Replicate prediction ${data.status}: ${data.error || "no details"}`);
    }
    // status === "starting" | "processing" → keep polling
  }

  throw new Error(`Replicate polling timed out after ${maxDurationMs / 60000} minutes`);
}
