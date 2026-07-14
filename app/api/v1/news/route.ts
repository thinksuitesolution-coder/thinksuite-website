import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { getArchivedArticles } from '@/lib/news/archive-db';

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
    // Firestore (recent, 0-14 days) + Turso archive (14 days-3 months), so
    // pagination isn't limited to whatever's currently live in Firestore.
    const [snap, archived] = await Promise.all([
      articlesCol().where('status', '==', 'published').orderBy('publishedAt', 'desc').limit(500).get(),
      getArchivedArticles(500).catch(() => []),
    ]);

    const recent = snap.docs.map(d => d.data());
    const seenIds = new Set(recent.map((a: { id?: string }) => a.id));
    const combinedDocs = [...recent, ...archived.filter(a => !seenIds.has(a.id))] as unknown as Record<string, unknown>[];
    combinedDocs.sort((a, b) =>
      +new Date((b.publishedAt as string) || 0) - +new Date((a.publishedAt as string) || 0)
    );

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
