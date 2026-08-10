import { NextRequest, NextResponse } from 'next/server';
import { countPublishedArticles, getPublishedArticles } from '@/lib/news/db';

/**
 * ThinkSuite Public AI News API v1
 * GET /api/v1/news
 * Query params: limit, page, category, company, from (ISO date), to (ISO date)
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const limit = Math.min(parseInt(p.get('limit') || '10'), 50);
  const page  = Math.max(parseInt(p.get('page')  || '1'), 1);
  const category = p.get('category') || undefined;
  const company  = p.get('company')  || undefined;

  try {
    // Filtering and paging happen in SQL. This used to read 500 rows and slice
    // them in JS, which meant every cache miss parsed the whole table's JSON
    // blobs to return ten items — ~6.6s of billed function time per call.
    const filters = { category, company };
    const [articles, total] = await Promise.all([
      getPublishedArticles({ ...filters, limit, offset: (page - 1) * limit }),
      countPublishedArticles(filters),
    ]);

    const data = articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      company: a.company,
      category: a.category,
      eventType: a.eventType,
      importanceScore: a.importanceScore,
      tags: a.tags,
      sourceName: a.sourceName,
      originalUrl: a.originalUrl,
      publishedAt: a.publishedAt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${a.slug}`,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        hasMore: page * limit < total,
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
