/**
 * WhatsApp Cloud API (Meta) integration
 * Env vars needed:
 *   WHATSAPP_PHONE_ID   — from Meta Business > WhatsApp > API Setup
 *   WHATSAPP_TOKEN      — Permanent system user token
 *
 * Free tier: 1000 conversations/month with verified business.
 * To get these: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
 */

const API_BASE = "https://graph.facebook.com/v19.0";

/**
 * Send a plain text WhatsApp message.
 * @param {string} to      — phone number with country code, no +, no spaces e.g. "919876543210"
 * @param {string} message — text body (max 4096 chars)
 */
export async function sendWhatsApp(to, message) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token   = process.env.WHATSAPP_TOKEN;

  if (!phoneId || !token) {
    throw new Error("WHATSAPP_PHONE_ID and WHATSAPP_TOKEN are not set");
  }

  // Normalize phone: strip +, spaces, dashes
  const phone = to.replace(/[^0-9]/g, "");

  const res = await fetch(`${API_BASE}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp API error ${res.status}: ${JSON.stringify(err)}`);
  }

  return res.json();
}

/**
 * Send multiple messages in sequence (with a short delay between each).
 * Use for delivering multiple result items to WhatsApp.
 */
export async function sendWhatsAppBatch(to, messages, delayMs = 1000) {
  const results = [];
  for (const msg of messages) {
    try {
      const r = await sendWhatsApp(to, msg);
      results.push({ ok: true, data: r });
    } catch (e) {
      results.push({ ok: false, error: e.message });
    }
    if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return results;
}
