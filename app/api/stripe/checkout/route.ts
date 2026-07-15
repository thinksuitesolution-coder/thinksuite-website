import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebaseAdmin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

// Rough USD parity with the INR prices hardcoded in components/tools/ToolSubscribeModal.tsx
// (content/voice/imagestudio 999, video 1499). Override per tool via
// config/pricing.tools[toolSlug].usdMonthly in Firestore once real USD pricing is decided.
const FALLBACK_USD_MONTHLY: Record<string, number> = {
  content: 12,
  voice: 12,
  imagestudio: 12,
  video: 18,
};
function fallbackUsdMonthly(toolSlug: string) {
  return FALLBACK_USD_MONTHLY[toolSlug] ?? 12;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolSlug, planType, userId, userEmail, leadPlanType } = body as {
      toolSlug: string;
      planType: 'monthly' | 'sixmonth' | 'annual';
      userId: string;
      userEmail?: string;
      leadPlanType?: string;
    };

    if (!toolSlug || !planType || !userId) {
      return NextResponse.json({ error: 'Missing toolSlug, planType, or userId' }, { status: 400 });
    }

    const stripe = getStripe();

    const pricingSnap = await getAdminDb().doc('config/pricing').get();
    const tp = pricingSnap.exists ? pricingSnap.data()?.tools?.[toolSlug] : null;

    const usdMonthly = tp?.usdMonthly ?? fallbackUsdMonthly(toolSlug);
    const productName = `ThinkSuite ${toolSlug}`;

    const metadata = {
      toolSlug,
      userId,
      planType,
      ...(leadPlanType ? { leadPlanType } : {}),
    };

    const successUrl = `${SITE_URL}/dashboard/${toolSlug}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${SITE_URL}/dashboard/${toolSlug}?payment=cancelled`;

    if (planType === 'monthly') {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(usdMonthly * 100),
            recurring: { interval: 'month' },
            product_data: { name: `${productName} (Monthly)` },
          },
          quantity: 1,
        }],
        customer_email: userEmail,
        client_reference_id: userId,
        metadata,
        subscription_data: { metadata },
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        billing_address_collection: 'required',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return NextResponse.json({ url: session.url });
    }

    // One-time sixmonth/annual order
    const months = planType === 'annual' ? 12 : 6;
    const discount = planType === 'annual' ? (tp?.annualDiscount ?? 0) : (tp?.sixMonthDiscount ?? 0);
    const amountUsd = Math.round(usdMonthly * months * (1 - discount / 100) * 100) / 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(amountUsd * 100),
          product_data: { name: `${productName} (${planType === 'annual' ? '12' : '6'} months)` },
        },
        quantity: 1,
      }],
      customer_email: userEmail,
      customer_creation: 'always',
      client_reference_id: userId,
      metadata,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
