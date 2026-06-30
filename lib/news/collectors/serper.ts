import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const AI_QUERIES = [
  'OpenAI news today',
  'Anthropic Claude news',
  'Google DeepMind AI',
  'AI startup funding 2026',
  'new AI model release',
  'artificial intelligence breakthrough',
  'AI India technology news',
  'machine learning research',
];

export async function fetchSerperNews(): Promise<RawEvent[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) {
    console.log('[Serper] API key missing, skipping');
    return [];
  }

  console.log('[Serper] Fetching Google News results...');

  const results: RawEvent[] = [];

  // Fetch 4 queries in parallel
  const batches = [AI_QUERIES.slice(0, 4), AI_QUERIES.slice(4)];

  for (const batch of batches) {
    const fetched = await Promise.all(
      batch.map(async (q) => {
        try {
          const res = await fetch('https://google.serper.dev/news', {
            method: 'POST',
            headers: {
              'X-API-KEY': key,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q, num: 10, tbs: 'qdr:d' }), // last 24h
            signal: AbortSignal.timeout(10000),
          });

          if (!res.ok) return [];
          const data = await res.json();
          const news = data?.news || [];

          return news.map((item: Record<string, unknown>) => ({
            id: uuidv4(),
            source: (item.source as string) || 'Google News',
            sourceName: (item.source as string) || 'Google News',
            title: (item.title as string) || '',
            url: (item.link as string) || '',
            content: (item.snippet as string) || '',
            publishedAt: (item.date as string)
              ? new Date(item.date as string).toISOString()
              : new Date().toISOString(),
            imageUrl: (item.imageUrl as string) || undefined,
            imageCredit: item.imageUrl ? `Image: ${(item.source as string) || 'Serper'}` : undefined,
            imageSourceUrl: (item.link as string) || undefined,
          })).filter((e: RawEvent) => e.title && e.url);
        } catch {
          return [];
        }
      })
    );
    results.push(...fetched.flat());
    await new Promise(r => setTimeout(r, 300));
  }

  // Dedupe by URL
  const seen = new Set<string>();
  const deduped = results.filter(e => {
    if (!e.url || seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  console.log(`[Serper] Fetched ${deduped.length} unique news items`);
  return deduped;
}
