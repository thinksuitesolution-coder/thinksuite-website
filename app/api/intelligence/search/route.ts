import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/news/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // No native full-text search — fetch recent published articles and
    // filter in JS.
    const articles = await getPublishedArticles({ limit: 300 });

    const qLower = q.toLowerCase();
    const results = articles
      .filter(a =>
        a.title?.toLowerCase().includes(qLower) ||
        a.summary?.toLowerCase().includes(qLower) ||
        a.company?.toLowerCase().includes(qLower) ||
        a.tags?.some((t: string) => t.toLowerCase().includes(qLower)) ||
        a.category?.toLowerCase().includes(qLower)
      )
      .slice(0, 20)
      .map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        company: a.company,
        category: a.category,
        importanceScore: a.importanceScore,
        publishedAt: a.publishedAt,
      }));

    return NextResponse.json({ results, query: q });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
