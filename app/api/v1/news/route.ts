import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/news/db';

/**
 * ThinkSuite Public AI News API v1
 * GET /api/v1/news
 * Query params: limit, page, category, company, from (ISO date), to (ISO date)
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const limit = Math.min(parseInt(p.get('limit') || '10'), 50);
  const page  = Math.max(parseInt(p.get('page')  || '1'), 1);
  const category = p.get('category');
  const company  = p.get('company');

  try {
    const combinedDocs = await getPublishedArticles({ limit: 500 }) as unknown as Record<string, unknown>[];

    let all = combinedDocs.map((data) => {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        company: data.company,
        category: data.category,
        eventType: data.eventType,
        importanceScore: data.importanceScore,
        tags: data.tags,
        sourceName: data.sourceName,
        originalUrl: data.originalUrl,
        publishedAt: data.publishedAt,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${data.slug}`,
      };
    });

    if (category) all = all.filter(a => a.category === category);
    if (company)  all = all.filter(a => a.company === company);

    const paginated = all.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      meta: {
        total: all.length,
        page,
        limit,
        hasMore: page * limit < all.length,
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
