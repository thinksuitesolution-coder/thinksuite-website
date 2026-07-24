import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/news/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const company = searchParams.get('company');
  const tag = searchParams.get('tag');

  try {
    let all = await getPublishedArticles({ limit: 500, category: category || undefined, company: company || undefined });
    if (tag) all = all.filter(a => a.tags?.includes(tag));

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
