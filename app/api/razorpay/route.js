import { NextResponse } from "next/server";
import crypto from "crypto";
import { notifyNewSubscription } from "@/lib/adminNotifier";
import { addCallCredits, CREDIT_PACKS } from "@/lib/aiCallingCredits";

/* ── Lazy Razorpay init (avoids crash when env vars not set at build time) ── */
function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local");
  }
  if (keyId.includes("YOUR_KEY") || keySecret.includes("YOUR_KEY")) {
    throw new Error("Razorpay keys not properly set. Replace placeholder values in .env.local");
  }
  if (!keyId.startsWith("rzp_")) {
    throw new Error("Invalid RAZORPAY_KEY_ID format. Should start with 'rzp_'");
  }
  if (keySecret.length < 20) {
    throw new Error(`Invalid RAZORPAY_KEY_SECRET. Length is ${keySecret.length}, should be 24+. Key appears truncated -copy the full secret from Razorpay dashboard.`);
  }

  const Razorpay = require("razorpay");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, toolSlug, userId } = body;

    /* ── Create one-time order for 6-month or annual plan ── */
    if (action === "create_order") {
      const { planType } = body; // "sixmonth" | "annual"
      if (!["sixmonth", "annual"].includes(planType)) {
        return NextResponse.json({ error: "Invalid planType" }, { status: 400 });
      }
      const razorpay = getRazorpay();

      // Fetch per-tool pricing from Firestore
      const adminMod = await import("@/lib/firebaseAdmin");
      const adminApp = adminMod.default();
      let tp = null;
      if (adminApp) {
        const snap = await adminApp.firestore().doc("config/pricing").get();
        if (snap.exists) tp = snap.data().tools?.[toolSlug];
      }
      const baseMonthly = tp?.monthly ?? (toolSlug === "lead-generation" ? 5000 : 999);
      const months      = planType === "annual" ? 12 : 6;
      const discount    = planType === "annual" ? (tp?.annualDiscount ?? 0) : (tp?.sixMonthDiscount ?? 0);
      const amountRupees = Math.round(baseMonthly * months * (1 - discount / 100));
      const amountPaise  = amountRupees * 100;

      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        notes: { toolSlug, userId, planType },
      });

      return NextResponse.json({ orderId: order.id, amount: amountPaise, amountRupees });
    }

    /* ── Create monthly subscription ── */
    if (action === "create_subscription") {
      const { leadPlanType } = body; // "starter" | "unlimited" (only for lead-generation)
      const razorpay = getRazorpay();

      // Fetch per-tool monthly price from Firestore (admin-configurable)
      const adminMod2 = await import("@/lib/firebaseAdmin");
      const adminApp2 = adminMod2.default();
      let baseMonthly = toolSlug === "lead-generation" ? 5000 : 999;
      if (adminApp2) {
        const pSnap = await adminApp2.firestore().doc("config/pricing").get();
        if (pSnap.exists) {
          const stored = pSnap.data();
          const tp = stored.tools?.[toolSlug];
          if (tp?.monthly) baseMonthly = tp.monthly;

          // For lead-generation unlimited plan, use unlimited.monthly + GST
          if (toolSlug === "lead-generation" && leadPlanType === "unlimited") {
            const ulCfg = stored.leadGenPlans?.unlimited || {};
            const ulMonthly  = ulCfg.monthly    ?? 8000;
            const ulGst      = ulCfg.gstPercent ?? 18;
            baseMonthly = Math.round(ulMonthly * (1 + ulGst / 100));
          }
        }
      }
      const amountPaise = baseMonthly * 100;
      const priceLabel  = baseMonthly.toString();

      let planId = process.env[`RAZORPAY_PLAN_${toolSlug?.toUpperCase().replace(/-/g, "_")}`];

      if (!planId) {
        const plan = await razorpay.plans.create({
          period: "monthly",
          interval: 1,
          item: {
            name: `Thinksuite ${toolSlug} ₹${priceLabel}/month`,
            amount: amountPaise,
            unit_amount: amountPaise,
            currency: "INR",
          },
          notes: { toolSlug },
        });
        planId = plan.id;
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        notes: { toolSlug, userId },
      });

      return NextResponse.json({ subscriptionId: subscription.id, planId });
    }

    /* ── Verify payment & activate ── */
    if (action === "verify_payment") {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, type, planType, toolSlug: tSlug, userId: uId } = body;

      console.log("[verify_payment] Request:", { userId: uId, toolSlug: tSlug, type, paymentId: razorpay_payment_id, orderId: razorpay_order_id });

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: "Missing payment verification data" }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.length < 20) {
        console.error("[verify_payment] Invalid KEY_SECRET:", { exists: !!keySecret, length: keySecret?.length });
        return NextResponse.json({ success: false, error: "Server misconfiguration -invalid Razorpay secret" }, { status: 500 });
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      console.log("[verify_payment] Signature comparison:", {
        expected: expectedSig.slice(0, 10) + "...",
        received: razorpay_signature.slice(0, 10) + "...",
        match: expectedSig === razorpay_signature,
      });

      if (expectedSig !== razorpay_signature) {
        console.error("[verify_payment] ✗ SIGNATURE MISMATCH!", { order: razorpay_order_id, payment: razorpay_payment_id });
        return NextResponse.json({ success: false, error: "Payment verification failed. Signature mismatch." }, { status: 400 });
      }

      console.log("[verify_payment] ✓ Signature verified!");

      const status = "active";

      const adminModule = await import("@/lib/firebaseAdmin");
      const adminApp = adminModule.default();

      if (!adminApp) {
        console.error("[verify_payment] Firebase Admin not configured");
        return NextResponse.json({ success: false, error: "Server misconfiguration -Firebase Admin not configured" }, { status: 500 });
      }

      const adminDb = adminApp.firestore();

      // Idempotency check -if this paymentId was already processed, skip write
      const existingDoc = await adminDb.collection("users").doc(uId).collection("subscriptions").doc(tSlug).get();
      if (existingDoc.exists && existingDoc.data().paymentId === razorpay_payment_id) {
        console.log("[verify_payment] Idempotent -paymentId already processed:", { paymentId: razorpay_payment_id, userId: uId, toolSlug: tSlug });
        return NextResponse.json({ success: true, status: existingDoc.data().status });
      }

      try {
        const now = Date.now();

        // Compute expiry for 6-month / annual one-time orders
        const months    = planType === "annual" ? 12 : planType === "sixmonth" ? 6 : null;
        const expiresAt = months ? now + months * 30 * 24 * 60 * 60 * 1000 : null;

        // Fetch per-tool pricing to store correct amount
        let storedAmount = tSlug === "lead-generation" ? 5000 : 999;
        if (months) {
          try {
            const pricingSnap = await adminDb.doc("config/pricing").get();
            const tp = pricingSnap.exists ? pricingSnap.data().tools?.[tSlug] : null;
            const base     = tp?.monthly ?? storedAmount;
            const discount = planType === "annual" ? (tp?.annualDiscount ?? 0) : (tp?.sixMonthDiscount ?? 0);
            storedAmount   = Math.round(base * months * (1 - discount / 100));
          } catch (_) { /* fallback to default */ }
        }

        const planLabel = planType === "annual" ? "tool_annual" : planType === "sixmonth" ? "tool_sixmonth" : "tool_monthly";

        const { leadPlanType: lptPay } = body;
        const paySubDoc = {
          status,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          trialEnd: null,
          activatedAt: now,
          ...(expiresAt ? { expiresAt } : {}),
          toolSlug: tSlug,
          plan: planLabel,
          amount: storedAmount,
        };
        if (tSlug === "lead-generation" && lptPay) paySubDoc.leadPlanType = lptPay;
        await adminDb.collection("users").doc(uId).collection("subscriptions").doc(tSlug).set(paySubDoc, { merge: true });

        await adminDb.collection("users").doc(uId).set({
          toolSubscriptions: { [tSlug]: status },
        }, { merge: true });

        console.log("[verify_payment] ✓ Firestore write successful:", { userId: uId, toolSlug: tSlug, status, paymentId: razorpay_payment_id, orderId: razorpay_order_id });

        // Notify admin fire and forget
        const userSnap = await adminDb.collection("users").doc(uId).get();
        notifyNewSubscription({
          userId: uId,
          userEmail: userSnap.data()?.email || uId,
          toolSlug: tSlug,
          plan: planLabel,
          amount: storedAmount,
        }).catch(() => {});
      } catch (fsErr) {
        console.error("[verify_payment] Firestore write failed:", { error: fsErr.message, userId: uId, toolSlug: tSlug, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
        return NextResponse.json({ success: false, error: `Database write failed. Payment captured. Contact support with Payment ID: ${razorpay_payment_id}` }, { status: 500 });
      }

      return NextResponse.json({ success: true, status });
    }

    /* ── Verify subscription payment ── */
    if (action === "verify_subscription") {
      const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, toolSlug: tSlug, userId: uId } = body;

      console.log("[verify_subscription] Request:", { userId: uId, toolSlug: tSlug, paymentId: razorpay_payment_id, subscriptionId: razorpay_subscription_id });

      if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: "Missing subscription verification data" }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.length < 20) {
        console.error("[verify_subscription] Invalid KEY_SECRET:", { exists: !!keySecret, length: keySecret?.length });
        return NextResponse.json({ success: false, error: "Server misconfiguration -invalid Razorpay secret" }, { status: 500 });
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
        .digest("hex");

      console.log("[verify_subscription] Signature comparison:", {
        expected: expectedSig.slice(0, 10) + "...",
        received: razorpay_signature.slice(0, 10) + "...",
        match: expectedSig === razorpay_signature,
      });

      if (expectedSig !== razorpay_signature) {
        console.error("[verify_subscription] ✗ SIGNATURE MISMATCH!", { subscriptionId: razorpay_subscription_id, payment: razorpay_payment_id });
        return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
      }

      const adminModule3 = await import("@/lib/firebaseAdmin");
      const adminApp3 = adminModule3.default();

      if (!adminApp3) {
        console.error("[verify_subscription] Firebase Admin not configured");
        return NextResponse.json({ success: false, error: "Server misconfiguration -Firebase Admin not configured" }, { status: 500 });
      }

      const adminDb3 = adminApp3.firestore();

      // Idempotency check -if this paymentId was already processed, skip write
      const existingDoc3 = await adminDb3.collection("users").doc(uId).collection("subscriptions").doc(tSlug).get();
      if (existingDoc3.exists && existingDoc3.data().paymentId === razorpay_payment_id) {
        console.log("[verify_subscription] Idempotent -paymentId already processed:", { paymentId: razorpay_payment_id, userId: uId, toolSlug: tSlug });
        return NextResponse.json({ success: true, status: existingDoc3.data().status });
      }

      try {
        const now = Date.now();

        const { leadPlanType: lpt3 } = body;
        const subDoc3 = {
          status: "active",
          subscriptionId: razorpay_subscription_id,
          paymentId: razorpay_payment_id,
          activatedAt: now,
          toolSlug: tSlug,
          plan: "tool_monthly",
          amount: tSlug === "lead-generation" ? 5000 : 999,
        };
        if (tSlug === "lead-generation" && lpt3) subDoc3.leadPlanType = lpt3;
        await adminDb3.collection("users").doc(uId).collection("subscriptions").doc(tSlug).set(subDoc3, { merge: true });

        await adminDb3.collection("users").doc(uId).set({
          toolSubscriptions: { [tSlug]: "active" },
        }, { merge: true });

        console.log("[verify_subscription] ✓ Firestore write successful:", { userId: uId, toolSlug: tSlug, paymentId: razorpay_payment_id, subscriptionId: razorpay_subscription_id });

        // Notify admin fire and forget
        const userSnap3 = await adminDb3.collection("users").doc(uId).get();
        notifyNewSubscription({
          userId: uId,
          userEmail: userSnap3.data()?.email || uId,
          toolSlug: tSlug,
          plan: "tool_monthly",
          amount: tSlug === "lead-generation" ? 5000 : 999,
        }).catch(() => {});
      } catch (fsErr) {
        console.error("[verify_subscription] Firestore write failed:", { error: fsErr.message, userId: uId, toolSlug: tSlug, paymentId: razorpay_payment_id, subscriptionId: razorpay_subscription_id });
        return NextResponse.json({ success: false, error: `Database write failed. Payment captured. Contact support with Payment ID: ${razorpay_payment_id}` }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: "active" });
    }

    /* ── Get subscription status ── */
    if (action === "get_status") {
      const adminModule2 = await import("@/lib/firebaseAdmin");
      const adminApp2 = adminModule2.default();
      if (!adminApp2) {
        console.warn("[get_status] Firebase Admin not configured");
        return NextResponse.json({ status: "none", error: "Firebase Admin not configured" }, { status: 503 });
      }
      const adminDb = adminApp2.firestore();
      const doc = await adminDb.collection("users").doc(userId).collection("subscriptions").doc(toolSlug).get();

      if (!doc.exists) {
        return NextResponse.json({ status: "none" });
      }

      const data = doc.data();
      const now = Date.now();

      if (data.status === "trial" && data.trialEnd && now > data.trialEnd) {
        // Trial expired
        await doc.ref.update({ status: "expired" });
        return NextResponse.json({ status: "expired" });
      }

      return NextResponse.json({ status: data.status, trialEnd: data.trialEnd, data });
    }

    /* ── Buy AI Calling credit pack ── */
    if (action === "buy_ai_credits") {
      const { packId } = body;
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

      const razorpay    = getRazorpay();
      const amountPaise = pack.priceINR * 100;

      const order = await razorpay.orders.create({
        amount:   amountPaise,
        currency: "INR",
        notes:    { type: "ai_credits", packId, calls: pack.calls, userId },
      });

      return NextResponse.json({ orderId: order.id, amount: amountPaise, amountRupees: pack.priceINR, pack });
    }

    /* ── Verify AI credits payment ── */
    if (action === "verify_ai_credits") {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, packId } = body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: "Missing payment data" }, { status: 400 });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || keySecret.length < 20) {
        return NextResponse.json({ success: false, error: "Server misconfiguration - invalid Razorpay secret" }, { status: 500 });
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSig !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
      }

      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (!pack) return NextResponse.json({ success: false, error: "Invalid pack" }, { status: 400 });

      await addCallCredits(userId, pack.calls, `razorpay:${razorpay_payment_id}`);

      // Look up actual user email for admin notification
      let creditUserEmail = userId;
      try {
        const credAdminMod = await import("@/lib/firebaseAdmin");
        const credAdminApp = credAdminMod.default();
        if (credAdminApp) {
          const userSnap = await credAdminApp.firestore().collection("users").doc(userId).get();
          creditUserEmail = userSnap.data()?.email || userId;
        }
      } catch {}

      notifyNewSubscription({
        userId,
        userEmail: creditUserEmail,
        toolSlug:  "ai-calling",
        plan:      `credits_${packId}`,
        amount:    pack.priceINR,
      }).catch(() => {});

      return NextResponse.json({ success: true, creditsAdded: pack.calls });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Razorpay API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
