import { NextRequest, NextResponse } from 'next/server';
import { getSubscriber, addSubscriber } from '@/lib/news/db';

export async function POST(req: NextRequest) {
  const { email, role = 'general', edition = 'daily' } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    const existing = await getSubscriber(email);
    if (existing) {
      return NextResponse.json({ message: 'Already subscribed!' });
    }

    await addSubscriber(email, role, edition);

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
