import { NextRequest, NextResponse } from 'next/server';
import { deactivateSubscriber } from '@/lib/news/db';
import { unsubscribeToken } from '@/lib/newsletterMailer';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const token = req.nextUrl.searchParams.get('token');

  if (!email || !token || token !== unsubscribeToken(email)) {
    return new NextResponse('Invalid or expired unsubscribe link.', { status: 400 });
  }

  await deactivateSubscriber(email);

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px 20px">
      <h2>You've been unsubscribed</h2>
      <p>${email} will no longer receive the ThinkSuite AI Pulse newsletter.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
