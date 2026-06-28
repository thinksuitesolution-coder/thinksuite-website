import { NextRequest, NextResponse } from 'next/server';
import { articlesCol } from '@/lib/firebase-admin';
import { generateTrendReport } from '@/lib/news/pipeline/trends';

export async function GET(req: NextRequest) {
  const horizon = (req.nextUrl.searchParams.get('horizon') || '90d') as '30d' | '90d' | '180d';

  try {
    const snap = await articlesCol()
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(50)
      .get();

    const titles = snap.docs.map(d => d.data().title as string);
    const report = await generateTrendReport(titles, horizon);

    return NextResponse.json({ success: true, data: report }, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=3600' },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
