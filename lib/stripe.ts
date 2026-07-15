import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Stripe keys not configured. Set STRIPE_SECRET_KEY in .env.local');
  }
  if (secretKey.includes('YOUR_KEY')) {
    throw new Error('Stripe key not properly set. Replace placeholder value in .env.local');
  }

  _stripe = new Stripe(secretKey);
  return _stripe;
}
