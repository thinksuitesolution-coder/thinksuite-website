import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/news/db';
import { generateNewsletter, NewsletterEdition, NewsletterRole } from '@/lib/news/newsletter';

export async function POST(req: NextRequest) {
  const { edition = 'daily', role = 'general' } = await req.json();

  // Auth check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cutoff = new Date(
      Date.now() - (edition === 'daily' ? 864e5 : 864e5 * 7)
    ).toISOString();

    const articles = (await getPublishedArticles({ limit: 300 }))
      .filter(a => a.publishedAt >= cutoff)
      .slice(0, 30);
    const newsletter = await generateNewsletter(articles, edition as NewsletterEdition, role as NewsletterRole);

    return NextResponse.json(newsletter);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
