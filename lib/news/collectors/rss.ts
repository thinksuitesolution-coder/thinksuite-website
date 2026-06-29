import Parser from 'rss-parser';
import { RawEvent, NewsSource } from '../types';
import { v4 as uuidv4 } from 'uuid';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'ThinkSuite AI News Bot/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchRSSSource(source: NewsSource): Promise<RawEvent[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const events: RawEvent[] = [];

    for (const item of feed.items.slice(0, 20)) {
      if (!item.link || !item.title) continue;

      const content = stripHtml(
        item.content || item.contentSnippet || item.summary || ''
      );

      events.push({
        id: uuidv4(),
        source: source.url,
        sourceName: source.name,
        title: item.title.trim(),
        url: item.link,
        content: content.slice(0, 2000),
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        imageUrl: extractImageFromContent(item.content || ''),
      });
    }

    return events;
  } catch (err) {
    console.error(`RSS fetch failed for ${source.name}:`, (err as Error).message);
    return [];
  }
}

function extractImageFromContent(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

export async function fetchAllRSSSources(sources: NewsSource[]): Promise<RawEvent[]> {
  const rssSources = sources.filter(s => s.type === 'rss');

  const results = await Promise.allSettled(
    rssSources.map(source => fetchRSSSource(source))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<RawEvent[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);
}
