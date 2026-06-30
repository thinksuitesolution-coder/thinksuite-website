import { NextResponse } from "next/server";
import crypto from "crypto";
import { getWallet, addToWallet } from "@/lib/leadWallet";
import { notifyNewSubscription } from "@/lib/adminNotifier";
import { getAdminDb } from "@/lib/firebaseAdmin";

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

async function createRazorpayOrder(amount, notes = {}) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) throw new Error("Razorpay keys not configured");
  const creds = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method:  "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ amount: Math.round(amount) * 100, currency: "INR", notes }),
    signal:  AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.description || "Razorpay order creation failed");
  return data;
}

async function getWalletConfig() {
  try {
    const db   = getAdminDb();
    const snap = await db.doc("config/pricing").get();
    const cfg  = snap.exists ? (snap.data().leadGenPlans?.starter || {}) : {};
    return {
      walletPerLeadCost: cfg.walletPerLeadCost ?? 18,
      walletMinTopup:    cfg.walletMinTopup    ?? 500,
    };
  } catch {
    return { walletPerLeadCost: 18, walletMinTopup: 500 };
  }
}

/* ── GET /api/lead-wallet?userId=xxx ── */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const [wallet, cfg] = await Promise.all([getWallet(userId), getWalletConfig()]);
    return NextResponse.json({ ...wallet, ...cfg });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST /api/lead-wallet ── */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, userId } = body;

    /* ── Create Razorpay order for wallet top-up ── */
    if (action === "create_topup") {
      const { amount } = body;
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      const cfg = await getWalletConfig();
      if (!amount || amount < cfg.walletMinTopup) {
        return NextResponse.json({ error: `Minimum top-up is ₹${cfg.walletMinTopup}` }, { status: 400 });
      }
      const order = await createRazorpayOrder(amount, { type: "lead_wallet_topup", userId, amount: String(amount) });
      return NextResponse.json({ orderId: order.id, amount: order.amount, amountRupees: amount });
    }

    /* ── Verify top-up payment & credit wallet ── */
    if (action === "verify_topup") {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = body;
      if (!userId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.length < 20) {
        return NextResponse.json({ success: false, error: "Server misconfiguration" }, { status: 500 });
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSig !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
      }

      const rupees = Number(amount);
      if (!rupees || rupees <= 0) {
        return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
      }

      await addToWallet(userId, rupees, razorpay_payment_id);

      notifyNewSubscription({
        userId,
        userEmail: userId,
        toolSlug:  "lead-generation",
        plan:      "wallet_topup",
        amount:    rupees,
      }).catch(() => {});

      const updatedWallet = await getWallet(userId);
      return NextResponse.json({ success: true, balance: updatedWallet.balance });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[lead-wallet]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
