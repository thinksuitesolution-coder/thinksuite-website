import Parser from 'rss-parser';
import { RawEvent, NewsSource } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Custom fields to capture media images from RSS feeds
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'ThinkSuite AI News Bot/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: {
    item: [
      ['media:content',   'mediaContent',   { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail',  { keepArray: false }],
      ['media:group',     'mediaGroup',      { keepArray: false }],
      ['enclosure',       'enclosure',       { keepArray: false }],
      ['itunes:image',    'itunesImage',     { keepArray: false }],
      ['image',           'image',           { keepArray: false }],
    ],
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

      const rawContent = (item as unknown as Record<string, string | undefined>)['content:encoded'];
      const content = stripHtml(
        rawContent || item.content || item.contentSnippet || item.summary || ''
      );

      const img = extractImage(item, source.name, item.link);

      events.push({
        id: uuidv4(),
        source: source.url,
        sourceName: source.name,
        title: item.title.trim(),
        url: item.link,
        content: content.slice(0, 2000),
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        imageUrl: img?.url,
        imageCredit: img?.credit,
        imageSourceUrl: img?.sourceUrl,
      });
    }

    return events;
  } catch (err) {
    console.error(`RSS fetch failed for ${source.name}:`, (err as Error).message);
    return [];
  }
}

interface ImageResult {
  url: string;
  credit: string;
  sourceUrl: string;
}

// Extract best image from all possible RSS image fields
// Priority: media:content > enclosure > media:thumbnail > <img> in content > og:image meta
function extractImage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any,
  sourceName: string,
  articleUrl: string
): ImageResult | null {
  // 1. media:content (most common in modern feeds like TechCrunch, VentureBeat)
  if (item.mediaContent) {
    const mc = item.mediaContent;
    const url = mc.$ ? mc.$.url : (mc.url || null);
    if (url && isValidImageUrl(url)) {
      return { url, credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
    }
  }

  // 2. media:thumbnail
  if (item.mediaThumbnail) {
    const mt = item.mediaThumbnail;
    const url = mt.$ ? mt.$.url : (mt.url || null);
    if (url && isValidImageUrl(url)) {
      return { url, credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
    }
  }

  // 3. media:group > media:content
  if (item.mediaGroup?.['media:content']) {
    const mc = item.mediaGroup['media:content'];
    const url = mc.$ ? mc.$.url : null;
    if (url && isValidImageUrl(url)) {
      return { url, credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
    }
  }

  // 4. enclosure (standard RSS image attachment)
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
    return {
      url: item.enclosure.url,
      credit: `Image: ${sourceName}`,
      sourceUrl: articleUrl,
    };
  }

  // 5. iTunes image (podcast feeds)
  if (item.itunesImage?.href) {
    return { url: item.itunesImage.href, credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
  }

  // 6. Fallback: first <img> tag in HTML content
  const html = item.content || item['content:encoded'] || '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) {
    return { url: imgMatch[1], credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
  }

  // 7. og:image in content (some feeds include it)
  const ogMatch = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1] && isValidImageUrl(ogMatch[1])) {
    return { url: ogMatch[1], credit: `Image: ${sourceName}`, sourceUrl: articleUrl };
  }

  return null;
}

function isValidImageUrl(url: string): boolean {
  if (!url || url.length < 10) return false;
  if (!url.startsWith('http')) return false;
  // Skip tiny tracking pixels, SVGs, GIFs
  if (url.includes('pixel') || url.includes('tracking') || url.includes('beacon')) return false;
  if (url.endsWith('.gif') && url.length > 200) return false; // skip tiny GIFs
  return true;
}

// Bridge: convert crawler sources to NewsSource format for fetching
function crawlerSourceToNewsSource(cs: import('../../crawler/types').CrawlSource): NewsSource | null {
  if (!cs.rss_feed) return null;
  return { id: cs.id, name: cs.name, url: cs.rss_feed, type: 'rss' };
}

export async function fetchAllRSSSources(sources: NewsSource[]): Promise<RawEvent[]> {
  // Use only the curated, verified legacy RSS list — the 400+ crawler source list
  // has too many dead/broken feeds (404s, malformed XML) which made collection take 2+ minutes.
  // Fresh coverage now comes from DataForSEO + Serper (live Google News) instead.
  const allSources = sources.filter(s => s.type === 'rss');

  // Batch in groups of 15, with a per-source race against a hard 6s cap so one slow
  // feed can't stall an entire batch.
  const BATCH = 15;
  const allResults: RawEvent[] = [];
  for (let i = 0; i < allSources.length; i += BATCH) {
    const batch = allSources.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(s => Promise.race([
        fetchRSSSource(s),
        new Promise<RawEvent[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000)),
      ]))
    );
    const batchEvents = results
      .filter((r): r is PromiseFulfilledResult<RawEvent[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);
    allResults.push(...batchEvents);
  }

  return allResults;
}
