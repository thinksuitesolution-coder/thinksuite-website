import { NextResponse } from 'next/server';
import { getCombinedArticles } from '@/lib/news/combined';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let items = '';
  try {
    const articles = (await getCombinedArticles(100)).slice(0, 100);
    items = articles
      .filter((a) => a.slug && a.title)
      .map((a) => {
        const url = `${SITE_URL}/ai-news/${a.slug}`;
        const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString();
        return `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${escapeXml(a.summary || '')}</description>
    ${a.category ? `<category>${escapeXml(a.category)}</category>` : ''}
    ${a.sourceName ? `<source url="${escapeXml(a.originalUrl || url)}">${escapeXml(a.sourceName)}</source>` : ''}
  </item>`;
      })
      .join('\n');
  } catch {
    items = '';
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>ThinkSuite AI Pulse — Real-Time AI News</title>
  <link>${SITE_URL}/ai-news</link>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <description>Real-time AI industry news, fact-checked and analyzed — model releases, funding, research, open source, and policy.</description>
  <language>en-us</language>
  <ttl>120</ttl>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300',
    },
  });
}
