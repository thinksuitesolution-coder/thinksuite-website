import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const BASE = 'https://api.dataforseo.com';
const AUTH = Buffer.from(
  `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
).toString('base64');

const AI_KEYWORDS = [
  'OpenAI GPT', 'Anthropic Claude', 'Google Gemini', 'Meta AI Llama',
  'artificial intelligence news', 'AI model release', 'machine learning breakthrough',
  'AI funding startup', 'NVIDIA AI', 'Microsoft Copilot AI',
  'AI research paper', 'large language model', 'AI agent autonomous',
  'generative AI', 'AI India news',
];

async function fetchNewsForKeyword(keyword: string): Promise<RawEvent[]> {
  try {
    const res = await fetch(`${BASE}/v3/serp/google/news/live/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        keyword,
        location_code: 2840, // USA
        language_code: 'en',
        depth: 10,
        search_param: 'tbs=qdr:d', // last 24 hours
      }]),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.tasks?.[0]?.result?.[0]?.items || [];

    return items
      .filter((item: Record<string, unknown>) => item.type === 'news_search' || item.type === 'news_element')
      .map((item: Record<string, unknown>) => ({
        id: uuidv4(),
        source: (item.source as string) || 'Google News',
        sourceName: (item.source as string) || 'Google News',
        title: (item.title as string) || '',
        url: (item.url as string) || (item.relative_url as string) || '',
        content: (item.snippet as string) || (item.description as string) || '',
        publishedAt: (item.timestamp as string) || new Date().toISOString(),
        imageUrl: (item.image_url as string) || undefined,
        imageCredit: item.image_url ? `Image: ${(item.source as string) || 'Google News'}` : undefined,
        imageSourceUrl: (item.url as string) || undefined,
      }))
      .filter((e: RawEvent) => e.title && e.url);
  } catch {
    return [];
  }
}

export async function fetchDataForSEONews(): Promise<RawEvent[]> {
  const login = process.env.DATAFORSEO_LOGIN;
  const pass = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pass) {
    console.log('[DataForSEO] Credentials missing, skipping');
    return [];
  }

  console.log('[DataForSEO] Fetching Google News for AI keywords...');

  // Fetch 5 keywords in parallel (avoid overloading API)
  const batches = [
    AI_KEYWORDS.slice(0, 5),
    AI_KEYWORDS.slice(5, 10),
    AI_KEYWORDS.slice(10),
  ];

  const results: RawEvent[] = [];
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(kw => fetchNewsForKeyword(kw)));
    results.push(...batchResults.flat());
    await new Promise(r => setTimeout(r, 500));
  }

  // Dedupe by URL
  const seen = new Set<string>();
  const deduped = results.filter(e => {
    if (!e.url || seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  console.log(`[DataForSEO] Fetched ${deduped.length} unique news items`);
  return deduped;
}