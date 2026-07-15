import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { notifyNewSubscription } from '@/lib/adminNotifier';

export const runtime = 'nodejs';

async function activateSubscription(opts: {
  userId: string;
  toolSlug: string;
  planType?: string;
  leadPlanType?: string;
  paymentId: string;
  amountUsd: number;
  isSubscription: boolean;
}) {
  const { userId, toolSlug, planType, leadPlanType, paymentId, amountUsd, isSubscription } = opts;

  const subRef = adminDb.collection('users').doc(userId).collection('subscriptions').doc(toolSlug);
  const existing = await subRef.get();
  if (existing.exists && existing.data()?.paymentId === paymentId) {
    return; // already processed
  }

  const now = Date.now();
  const months = planType === 'annual' ? 12 : planType === 'sixmonth' ? 6 : null;
  const expiresAt = !isSubscription && months ? now + months * 30 * 24 * 60 * 60 * 1000 : null;
  const planLabel = isSubscription
    ? 'tool_monthly'
    : planType === 'annual' ? 'tool_annual' : 'tool_sixmonth';

  const doc: Record<string, unknown> = {
    status: 'active',
    provider: 'stripe',
    paymentId,
    activatedAt: now,
    toolSlug,
    plan: planLabel,
    amountUsd,
    ...(expiresAt ? { expiresAt } : {}),
    ...(leadPlanType ? { leadPlanType } : {}),
  };
  await subRef.set(doc, { merge: true });
  await adminDb.collection('users').doc(userId).set({
    toolSubscriptions: { [toolSlug]: 'active' },
  }, { merge: true });

  const userSnap = await adminDb.collection('users').doc(userId).get();
  notifyNewSubscription({
    userId,
    userEmail: userSnap.data()?.email || userId,
    toolSlug,
    plan: planLabel,
    amount: amountUsd,
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { toolSlug, userId, planType, leadPlanType } = session.metadata || {};
        if (!toolSlug || !userId) break;

        const paymentId = (session.subscription as string) || (session.payment_intent as string) || session.id;
        const amountUsd = (session.amount_total ?? 0) / 100;

        await activateSubscription({
          userId,
          toolSlug,
          planType,
          leadPlanType,
          paymentId,
          amountUsd,
          isSubscription: session.mode === 'subscription',
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const { toolSlug, userId } = sub.metadata || {};
        if (!toolSlug || !userId) break;

        await adminDb.collection('users').doc(userId).collection('subscriptions').doc(toolSlug)
          .set({ status: 'cancelled' }, { merge: true });
        await adminDb.collection('users').doc(userId).set({
          toolSubscriptions: { [toolSlug]: 'cancelled' },
        }, { merge: true });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subDetails = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subDetails === 'string' ? subDetails : subDetails?.id;
        if (!subId) break;
        const sub = await stripe.subscriptions.retrieve(subId);
        const { toolSlug, userId } = sub.metadata || {};
        if (!toolSlug || !userId) break;

        await adminDb.collection('users').doc(userId).collection('subscriptions').doc(toolSlug)
          .set({ status: 'past_due' }, { merge: true });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook handler error (${event.type}):`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
