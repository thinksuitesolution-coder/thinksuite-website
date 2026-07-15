import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { unsubscribeToken } from '@/lib/newsletterMailer';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const token = req.nextUrl.searchParams.get('token');

  if (!email || !token || token !== unsubscribeToken(email)) {
    return new NextResponse('Invalid or expired unsubscribe link.', { status: 400 });
  }

  const snap = await adminDb.collection('newsletter_subscribers').where('email', '==', email).get();
  await Promise.all(snap.docs.map((d) => d.ref.set({ active: false }, { merge: true })));

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px 20px">
      <h2>You've been unsubscribed</h2>
      <p>${email} will no longer receive the ThinkSuite AI Pulse newsletter.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
