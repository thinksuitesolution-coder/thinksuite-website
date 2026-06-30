// Shared fetch helpers for lead generation API calls

export async function safeJson(res) {
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); return data; }
  catch {
    if (res.status === 504 || res.status === 503)
      throw new Error("Request timed out — server is busy. Please try again in a moment.");
    if (res.status === 402)
      throw new Error(walletErrMsg(data || {}));
    throw new Error(`Server error (${res.status}). Please try again in a moment.`);
  }
}

// Attach Firebase ID token as Authorization header
export async function leadPost(url, user, body) {
  let authHeader = {};
  if (user) {
    try {
      const token = await user.getIdToken(/* forceRefresh */ false);
      authHeader = { Authorization: `Bearer ${token}` };
    } catch (e) {
      console.warn("[leadPost] getIdToken failed:", e?.message);
    }
  }
  try {
    return await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(58000),
    });
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      throw new Error("Request timed out — server is busy. Please try again in a moment.");
    }
    throw err;
  }
}

export function walletErrMsg(data) {
  const bal     = data?.walletBalance ?? null;
  const topup   = data?.walletMinTopup ?? 500;
  const perLead = data?.walletPerLeadCost ?? 18;
  if (bal !== null) {
    return `Wallet balance ₹${bal} is too low (₹${perLead}/lead). Top up ₹${topup}+ to continue.`;
  }
  return `Insufficient wallet balance. Top up ₹${topup}+ to continue.`;
}
