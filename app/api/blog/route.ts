import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticles } from '@/lib/news/archive-db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const company = searchParams.get('company');
  const tag = searchParams.get('tag');

  try {
    // Fetch all published articles without composite index (client-side sort/filter),
    // plus the Turso archive (14 days-3 months old) so pagination isn't limited to
    // whatever's currently live in Firestore.
    const [snap, archived] = await Promise.all([
      articlesCol().where('status', '==', 'published').get(),
      getArchivedArticles(500).catch(() => []),
    ]);

    const recent = snap.docs.map(d => d.data());
    const seenIds = new Set(recent.map((a: { id?: string }) => a.id));
    let all = [...recent, ...archived.filter(a => !seenIds.has(a.id))];

    // Sort by publishedAt descending (avoids composite index requirement)
    all.sort((a, b) => {
      const aTime = a.publishedAt?.toMillis?.() ?? new Date(a.publishedAt || 0).getTime();
      const bTime = b.publishedAt?.toMillis?.() ?? new Date(b.publishedAt || 0).getTime();
      return bTime - aTime;
    });

    if (category) all = all.filter(a => a.category === category);
    if (company)  all = all.filter(a => a.company === company);
    if (tag)      all = all.filter(a => a.tags?.includes(tag));

    const paginated = all.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      articles: paginated,
      total: all.length,
      page,
      hasMore: page * limit < all.length,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
