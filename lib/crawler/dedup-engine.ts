// Duplicate Detection Engine
// Uses: URL normalization → SimHash → Title similarity → Embedding cosine sim

const TRACKING_PARAMS = new Set([
  'utm_source','utm_medium','utm_campaign','utm_content','utm_term',
  'ref','source','via','fbclid','gclid','mc_cid','mc_eid','_ga',
  'share','referrer','twclid','igshid','s','si','t','gi',
  'trk','trkCampaign','linkId','sr','_hsenc','_hsmi',
]);

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove tracking params
    TRACKING_PARAMS.forEach(p => u.searchParams.delete(p));
    // Lowercase host
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
    // Remove trailing slash
    let path = u.pathname.replace(/\/+$/, '') || '/';
    // Remove common suffixes
    path = path.replace(/\.(html|htm|php|asp|aspx)$/, '');
    u.pathname = path;
    // Remove fragment
    u.hash = '';
    return u.toString();
  } catch {
    return url.toLowerCase().trim();
  }
}

// SimHash for near-duplicate detection (32-bit)
export function simHash(text: string): number {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const words = normalized.split(/\s+/).filter(w => w.length > 2);

  const bits = new Array(32).fill(0);

  for (const word of words) {
    const hash = fnv32(word);
    for (let i = 0; i < 32; i++) {
      bits[i] += (hash >> i) & 1 ? 1 : -1;
    }
  }

  let fingerprint = 0;
  for (let i = 0; i < 32; i++) {
    if (bits[i] > 0) fingerprint |= (1 << i);
  }
  return fingerprint >>> 0;
}

function fnv32(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

export function hammingDistance(a: number, b: number): number {
  let xor = (a ^ b) >>> 0;
  let dist = 0;
  while (xor) { dist += xor & 1; xor >>>= 1; }
  return dist;
}

// Jaccard similarity on word sets (fast, no embedding needed)
export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const setB = new Set(b.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  let intersection = 0;
  setA.forEach(w => { if (setB.has(w)) intersection++; });
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Normalize title for comparison
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface DedupResult {
  isDuplicate: boolean;
  reason?: string;
  similarity?: number;
  matchedUrl?: string;
}

export class DedupEngine {
  private seenUrls = new Map<string, string>(); // normalizedUrl → originalUrl
  private seenSimhashes = new Map<number, { url: string; title: string }>();
  private seenTitles = new Map<string, string>(); // normalizedTitle → url

  check(url: string, title: string, content: string): DedupResult {
    // 1. Exact URL match
    const normUrl = normalizeUrl(url);
    if (this.seenUrls.has(normUrl)) {
      return { isDuplicate: true, reason: 'exact_url', matchedUrl: this.seenUrls.get(normUrl) };
    }

    // 2. Exact title match
    const normTitle = normalizeTitle(title);
    if (this.seenTitles.has(normTitle)) {
      return { isDuplicate: true, reason: 'exact_title', matchedUrl: this.seenTitles.get(normTitle) };
    }

    // 3. SimHash near-duplicate (hamming distance ≤ 3 = 90%+ similar)
    const hash = simHash(title + ' ' + content.slice(0, 500));
    for (const [existingHash, meta] of this.seenSimhashes) {
      const dist = hammingDistance(hash, existingHash);
      if (dist <= 3) {
        return { isDuplicate: true, reason: 'simhash', similarity: 1 - dist / 32, matchedUrl: meta.url };
      }
    }

    // 4. Jaccard title similarity (≥ 0.85 = near duplicate)
    const sim = this.checkTitleSimilarity(normTitle);
    if (sim.similarity >= 0.85) {
      return { isDuplicate: true, reason: 'title_jaccard', similarity: sim.similarity, matchedUrl: sim.url };
    }

    // Not a duplicate — register it
    this.register(url, normUrl, title, normTitle, hash);
    return { isDuplicate: false };
  }

  private checkTitleSimilarity(normTitle: string): { similarity: number; url: string } {
    let best = { similarity: 0, url: '' };
    for (const [existingTitle, url] of this.seenTitles) {
      const sim = jaccardSimilarity(normTitle, existingTitle);
      if (sim > best.similarity) best = { similarity: sim, url };
    }
    return best;
  }

  private register(url: string, normUrl: string, title: string, normTitle: string, hash: number) {
    this.seenUrls.set(normUrl, url);
    this.seenTitles.set(normTitle, url);
    this.seenSimhashes.set(hash, { url, title });
  }

  get stats() {
    return { urls: this.seenUrls.size, titles: this.seenTitles.size, hashes: this.seenSimhashes.size };
  }

  reset() {
    this.seenUrls.clear();
    this.seenTitles.clear();
    this.seenSimhashes.clear();
  }
}
