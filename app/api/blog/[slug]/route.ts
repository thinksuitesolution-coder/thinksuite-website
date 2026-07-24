import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/news/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await getArticleBySlug(params.slug, { publishedOnly: true });
    if (article) return NextResponse.json(article);

    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
