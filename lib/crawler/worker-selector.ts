import { CrawlSource, WorkerDecision } from './types';

// ──────────────────────────────────────────────
// 4-LAYER WORKER SELECTION ENGINE
//
// Layer 1: RSS / Atom feed (fastest, zero cost)
// Layer 2: HTTP Fetch + HTML Parse (fast, cheap)
// Layer 3: Jina Reader (markdown extraction, free tier)
// Layer 4: Browser (Playwright) - only when necessary
// ──────────────────────────────────────────────

const BROWSER_REQUIRED_DOMAINS = new Set([
  'x.com', 'twitter.com',
  'linkedin.com',
  'github.com/trending',
  'github.com/topics',
  'huggingface.co/models',
  'huggingface.co/spaces',
  'huggingface.co/datasets',
  'openreview.net',
  'producthunt.com',
  'bloomberg.com',
  'ft.com',
  'wsj.com',
  'theinformation.com',
  'businessinsider.com',
  'the-ken.com',
  'semanticscholar.org',
]);

const JINA_PREFERRED_DOMAINS = new Set([
  'arxiv.org',
  'paperswithcode.com',
  'medium.com',
  'substack.com',
  'notion.so',
  'docs.google.com',
]);

const HIGH_ANTI_BOT_DOMAINS = new Set([
  'bloomberg.com', 'ft.com', 'wsj.com', 'wired.com',
  'technologyreview.com', 'theinformation.com', 'fortune.com',
  'businessinsider.com', 'nytimes.com', 'washingtonpost.com',
  'theatlantic.com', 'reuters.com', 'cnbc.com',
]);

const RECOMMENDED_HEADERS: Record<string, Record<string, string>> = {
  reddit: {
    'User-Agent': 'Mozilla/5.0 (compatible; ThinkSuiteBot/1.0; +https://thinksuite.in/bot)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  github: {
    'User-Agent': 'ThinkSuite-Crawler/1.0',
    'Accept': 'application/atom+xml',
    'Authorization': `token ${process.env.GITHUB_TOKEN || ''}`,
  },
  default: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
  },
  rss: {
    'User-Agent': 'ThinkSuite-RSSReader/1.0 (compatible; +https://thinksuite.in)',
    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
  },
};

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

export function selectWorker(source: CrawlSource, url: string): WorkerDecision {
  const domain = getDomain(url);

  // Layer 1: RSS is always preferred — zero render cost
  if (source.supports_rss && source.rss_feed && !url.includes('/article/')) {
    return {
      worker: 'rss',
      extractor: 'rss',
      reason: 'RSS feed available — preferred path',
      headers: RECOMMENDED_HEADERS.rss,
      delay: 500,
    };
  }

  // Layer 1b: GitHub Atom feeds for orgs/releases
  if (url.includes('github.com') && (url.includes('.atom') || url.includes('/releases'))) {
    return {
      worker: 'rss',
      extractor: 'rss',
      reason: 'GitHub Atom feed',
      headers: RECOMMENDED_HEADERS.github,
      delay: 1000,
    };
  }

  // Layer 4 (early exit): Domains that require JS rendering
  if (source.browser_required || BROWSER_REQUIRED_DOMAINS.has(domain)) {
    if (HIGH_ANTI_BOT_DOMAINS.has(domain)) {
      return {
        worker: 'firecrawl',
        extractor: 'readability',
        reason: 'High anti-bot risk — Firecrawl stealth mode',
        fallback: 'browser',
        delay: 3000,
      };
    }
    return {
      worker: 'browser',
      extractor: 'jsonld',
      reason: 'JavaScript rendering required',
      fallback: 'jina',
      headers: RECOMMENDED_HEADERS.default,
      delay: 2000,
    };
  }

  // Layer 3: Jina Reader for article extraction (free, handles complex layouts)
  if (JINA_PREFERRED_DOMAINS.has(domain) || url.includes('/paper/') || url.includes('/abs/')) {
    return {
      worker: 'jina',
      extractor: 'readability',
      reason: 'Jina Reader preferred for this domain/content type',
      fallback: 'http',
      delay: 1000,
    };
  }

  // Paywalled content — skip or use Firecrawl if score is high enough
  if (source.paywall) {
    return {
      worker: 'firecrawl',
      extractor: 'readability',
      reason: 'Paywall detected — Firecrawl for extraction',
      fallback: 'jina',
      delay: 2000,
    };
  }

  // Layer 2: Default HTTP fetch (handles most RSS-originated article URLs)
  const headers = domain.includes('reddit') ? RECOMMENDED_HEADERS.reddit
    : domain.includes('github') ? RECOMMENDED_HEADERS.github
    : RECOMMENDED_HEADERS.default;

  return {
    worker: 'http',
    extractor: source.extractor_type === 'rss' ? 'jsonld' : source.extractor_type,
    reason: 'Standard HTTP fetch with HTML extraction',
    fallback: 'jina',
    headers,
    delay: source.anti_bot_risk === 'medium' ? 1500 : 600,
  };
}

// Decision rules for full article enrichment (called after RSS gives URL)
export function shouldEnrichArticle(
  importanceScore: number,
  contentLength: number,
  workerCostBudget: 'free' | 'low' | 'medium' | 'high'
): { enrich: boolean; worker: WorkerDecision['worker']; reason: string } {
  // Never enrich low-score articles
  if (importanceScore < 50) return { enrich: false, worker: 'http', reason: 'Low score — skip enrichment' };
  // Already has enough content
  if (contentLength > 1200) return { enrich: false, worker: 'http', reason: 'Content already sufficient' };
  // High priority: use Jina (free)
  if (importanceScore >= 70 && workerCostBudget !== 'high') {
    return { enrich: true, worker: 'jina', reason: 'High score, short content — Jina enrichment' };
  }
  // Very high priority: Firecrawl (cost-justified)
  if (importanceScore >= 85 && workerCostBudget === 'high') {
    return { enrich: true, worker: 'firecrawl', reason: 'Very high score — Firecrawl deep extraction' };
  }
  return { enrich: true, worker: 'http', reason: 'Medium priority HTTP enrichment' };
}
