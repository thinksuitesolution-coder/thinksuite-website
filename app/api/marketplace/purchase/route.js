import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProduct } from "@/lib/marketplace-catalog";
import { getAdminDb } from "@/lib/firebaseAdmin";

function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys not configured");
  const Razorpay = require("razorpay");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/* ── POST /api/marketplace/purchase — create Razorpay order ── */
export async function POST(req) {
  try {
    const { productId, plan, userId } = await req.json();
    if (!productId || !userId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const product = getProduct(productId);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const months  = plan === "yearly" ? 10 : 1; // yearly = 10 months price (17% off)
    const amount  = product.price_monthly * months * 100; // paise

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      notes: { userId, productId, plan },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("[marketplace/purchase]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
