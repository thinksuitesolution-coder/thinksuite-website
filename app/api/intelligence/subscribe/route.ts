import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { email, role = 'general', edition = 'daily' } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    const subscribersCol = adminDb.collection('newsletter_subscribers');
    const existing = await subscribersCol.where('email', '==', email).limit(1).get();

    if (!existing.empty) {
      return NextResponse.json({ message: 'Already subscribed!' });
    }

    await subscribersCol.add({
      email,
      role,
      edition,
      subscribedAt: new Date().toISOString(),
      active: true,
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
