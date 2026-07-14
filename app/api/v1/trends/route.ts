import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { generateTrendReport } from '@/lib/news/pipeline/trends';

export async function GET(req: NextRequest) {
  const horizon = (req.nextUrl.searchParams.get('horizon') || '90d') as '30d' | '90d' | '180d';

  try {
    // Single-field where, sorted/limited in JS — avoids needing a composite
    // Firestore index for (status ==, publishedAt orderBy).
    const snap = await articlesCol().where('status', '==', 'published').limit(300).get();
    const sorted = snap.docs
      .map(d => d.data())
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, 50);
    const titles = sorted.map(a => a.title as string);
    const report = await generateTrendReport(titles, horizon);

    return NextResponse.json({ success: true, data: report }, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=3600' },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
