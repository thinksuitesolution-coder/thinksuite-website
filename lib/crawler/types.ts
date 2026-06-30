export type WorkerType = 'rss' | 'http' | 'browser' | 'firecrawl' | 'jina' | 'sitemap';
export type ExtractorType = 'rss' | 'jsonld' | 'opengraph' | 'readability' | 'html' | 'llm';
export type CrawlFreq = '1min' | '5min' | '10min' | '15min' | '30min' | '1h' | '2h' | '6h' | '12h' | '24h';
export type AntiBotRisk = 'low' | 'medium' | 'high' | 'very_high';
export type SC =
  | 'official_company' | 'ai_news' | 'research' | 'github' | 'community'
  | 'vc_funding' | 'developer' | 'newsletter' | 'healthcare_ai' | 'finance_ai'
  | 'education_ai' | 'legal_ai' | 'robotics' | 'semiconductor' | 'cloud_ai'
  | 'government_ai' | 'podcast' | 'youtube' | 'social' | 'india_ai' | 'international';

export interface CrawlSource {
  id: string;
  name: string;
  category: SC;
  subcategory: string;
  homepage: string;
  news_page?: string;
  rss_feed?: string;
  sitemap?: string;
  robots_txt?: string;
  supports_rss: boolean;
  supports_sitemap: boolean;
  requires_javascript: boolean;
  browser_required: boolean;
  login_required: boolean;
  paywall: boolean;
  language: string;
  country: string;
  crawl_frequency: CrawlFreq;
  priority_score: number;       // 0-100
  freshness_score: number;      // 0-100
  trust_score: number;          // 0-100
  estimated_articles_per_day: number;
  anti_bot_risk: AntiBotRisk;
  recommended_worker: WorkerType;
  extractor_type: ExtractorType;
  title_selector?: string;
  content_selector?: string;
  author_selector?: string;
  date_selector?: string;
  image_selector?: string;
  article_selector?: string;
  jsonld_supported: boolean;
  og_supported: boolean;
  twitter_card_supported: boolean;
  recommended_delay?: number;   // ms between requests
  recommended_timeout?: number; // ms
  recommended_retry?: number;
}

export interface CrawlJob {
  id: string;
  sourceId: string;
  url: string;
  type: 'rss' | 'article' | 'sitemap' | 'discovery';
  priority: number;
  scheduledAt: Date;
  attempts: number;
  lastAttempt?: Date;
  lastSuccess?: Date;
  etag?: string;
  lastModified?: string;
  contentHash?: string;
  status: 'pending' | 'running' | 'done' | 'failed' | 'dead';
}

export interface RawArticle {
  url: string;
  canonicalUrl?: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  tags?: string[];
  sourceId: string;
  sourceName: string;
  extractedAt: string;
  extractorUsed: ExtractorType;
  workerUsed: WorkerType;
  contentLength: number;
  language?: string;
  urlHash: string;
  contentHash: string;
  simhash?: string;
}

export interface WorkerDecision {
  worker: WorkerType;
  extractor: ExtractorType;
  reason: string;
  fallback?: WorkerType;
  headers?: Record<string, string>;
  delay?: number;
}
