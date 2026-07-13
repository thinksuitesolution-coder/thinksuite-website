import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticleBySlug } from '@/lib/news/archive-db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const snap = await articlesCol()
      .where('slug', '==', params.slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (!snap.empty) {
      return NextResponse.json(snap.docs[0].data());
    }

    // Not in the last 14 days of Firestore — check the Turso archive (14 days–3 months).
    const archived = await getArchivedArticleBySlug(params.slug);
    if (archived) return NextResponse.json(archived);

    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
