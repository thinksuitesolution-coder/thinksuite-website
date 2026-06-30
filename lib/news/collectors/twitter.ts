import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Top AI accounts to track via Google's indexed tweets — no Twitter API, no UI scraping.
const AI_TWITTER_HANDLES = [
  'OpenAI', 'AnthropicAI', 'sama', 'GoogleDeepMind', 'demishassabis',
  'elonmusk', 'xai', 'ylecun', 'AndrewYNg', 'JensenHuang', 'NVIDIAAI',
  'huggingface', 'MistralAI', 'GoogleAI', 'Microsoft',
];

export async function fetchTwitterViaSearch(): Promise<RawEvent[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) {
    console.log('[Twitter] SERPER_API_KEY missing, skipping');
    return [];
  }

  console.log('[Twitter] Fetching indexed posts via Google search...');

  const queries = AI_TWITTER_HANDLES.map(
    h => `site:x.com/${h} AI OR announcement OR launch`
  );

  const results: RawEvent[] = [];
  const BATCH = 5;

  for (let i = 0; i < queries.length; i += BATCH) {
    const batch = queries.slice(i, i + BATCH);
    const fetched = await Promise.all(
      batch.map(async (q, idx) => {
        const handle = AI_TWITTER_HANDLES[i + idx];
        try {
          const res = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ q, num: 5, tbs: 'qdr:d' }), // last 24h
            signal: AbortSignal.timeout(10000),
          });
          if (!res.ok) return [];
          const data = await res.json();
          const organic = data?.organic || [];

          return organic.map((item: Record<string, unknown>) => ({
            id: uuidv4(),
            source: 'X (Twitter)',
            sourceName: `@${handle} on X`,
            title: (item.title as string) || '',
            url: (item.link as string) || '',
            content: (item.snippet as string) || '',
            publishedAt: (item.date as string)
              ? new Date(item.date as string).toISOString()
              : new Date().toISOString(),
          })).filter((e: RawEvent) => e.title && e.url);
        } catch {
          return [];
        }
      })
    );
    results.push(...fetched.flat());
    await new Promise(r => setTimeout(r, 300));
  }

  const seen = new Set<string>();
  const deduped = results.filter(e => {
    if (!e.url || seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  console.log(`[Twitter] Fetched ${deduped.length} unique posts`);
  return deduped;
}
