import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Fetch recent articles and do client-side text search + sort
    // (Firestore doesn't have native full-text search; single-field where
    // avoids needing a composite index for status == + publishedAt orderBy)
    const snap = await articlesCol().where('status', '==', 'published').limit(300).get();

    const qLower = q.toLowerCase();
    const results = snap.docs
      .map(d => d.data())
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
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
