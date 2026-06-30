import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProduct } from "@/lib/marketplace-catalog";
import { getAdminDb } from "@/lib/firebaseAdmin";

/* ── POST /api/marketplace/purchase/verify — verify payment and activate ── */
export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      userId,
      plan,
    } = await req.json();

    // Signature verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const product = getProduct(productId);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const db  = getAdminDb();
    const now = Date.now();

    // Save purchase to Firestore
    await db.collection("marketplace_purchases").add({
      userId,
      productId,
      productName:   product.name,
      industry:      product.industry,
      department:    product.department,
      type:          product.type,
      plan,
      status:        "active",
      paymentId:     razorpay_payment_id,
      orderId:       razorpay_order_id,
      amount:        product.price_monthly * (plan === "yearly" ? 10 : 1),
      purchasedAt:   now,
      expiresAt:     plan === "yearly"
        ? now + 365 * 24 * 60 * 60 * 1000
        : now + 30  * 24 * 60 * 60 * 1000,
    });

    // Also write to user's active agents collection for dashboard
    await db.collection("users").doc(userId).collection("active_agents").doc(productId).set({
      productId,
      productName: product.name,
      industry:    product.industry,
      department:  product.department,
      type:        product.type,
      icon:        product.icon,
      tagline:     product.tagline,
      plan,
      status:      "active",
      activatedAt: now,
      runCount:    0,
      lastRunAt:   null,
      config:      {},
    }, { merge: true });

    return NextResponse.json({ success: true, productId });
  } catch (err) {
    console.error("[marketplace/purchase/verify]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
