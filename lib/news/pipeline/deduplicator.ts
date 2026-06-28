import { ScoredEvent } from '../types';

// Simple Jaccard similarity, no paid vector DB needed
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const aArr = Array.from(a);
  const bArr = Array.from(b);
  const intersectionSize = aArr.filter(x => b.has(x)).length;
  const unionSize = new Set(aArr.concat(bArr)).size;
  if (unionSize === 0) return 0;
  return intersectionSize / unionSize;
}

export function deduplicateEvents(events: ScoredEvent[]): ScoredEvent[] {
  const deduplicated: ScoredEvent[] = [];
  const seen: { tokens: Set<string>; url: string }[] = [];

  // Sort by importance so we keep highest-importance version
  const sorted = [...events].sort((a, b) => b.importanceScore - a.importanceScore);

  for (const event of sorted) {
    const tokens = tokenize(`${event.title} ${event.content.slice(0, 300)}`);

    const isDuplicate = seen.some(({ tokens: seenTokens, url }) => {
      if (url === event.url) return true;
      return jaccardSimilarity(tokens, seenTokens) > 0.55;
    });

    if (isDuplicate) {
      event.isDuplicate = true;
    } else {
      seen.push({ tokens, url: event.url });
      deduplicated.push(event);
    }
  }

  return deduplicated;
}

// Filter out URLs we've already processed (checked against Firebase)
export function filterAlreadyProcessed(
  events: ScoredEvent[],
  processedUrls: Set<string>
): ScoredEvent[] {
  return events.filter(e => !processedUrls.has(e.url));
}
