import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { generateNewsletter, NewsletterEdition, NewsletterRole } from '@/lib/news/newsletter';
import { BlogArticle } from '@/lib/news/types';

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

    const snap = await articlesCol()
      .where('status', '==', 'published')
      .where('publishedAt', '>=', cutoff)
      .orderBy('publishedAt', 'desc')
      .limit(30)
      .get();

    const articles = snap.docs.map(d => d.data() as BlogArticle);
    const newsletter = await generateNewsletter(articles, edition as NewsletterEdition, role as NewsletterRole);

    return NextResponse.json(newsletter);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
