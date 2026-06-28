import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const company = searchParams.get('company');
  const tag = searchParams.get('tag');

  try {
    let query = articlesCol()
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc');

    if (category) query = query.where('category', '==', category) as typeof query;
    if (company) query = query.where('company', '==', company) as typeof query;

    const snap = await query.limit(limit * page).get();
    const all = snap.docs.map(d => d.data());

    // Tag filter (Firestore doesn't support array-contains with other filters easily)
    const filtered = tag ? all.filter(a => a.tags?.includes(tag)) : all;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      articles: paginated,
      total: filtered.length,
      page,
      hasMore: page * limit < filtered.length,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
