export type EventType =
  | 'model_release'
  | 'product_launch'
  | 'research_paper'
  | 'funding'
  | 'acquisition'
  | 'open_source'
  | 'api_release'
  | 'policy_update'
  | 'interview'
  | 'keynote'
  | 'github_release'
  | 'breaking_news'
  | 'general';

export type ArticleStatus = 'draft' | 'published' | 'rejected';

export interface RawEvent {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
  imageCredit?: string;    // "Source: TechCrunch" or photographer name
  imageSourceUrl?: string; // link to image source page
}

export interface NewsSource {
  id?: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'github' | 'arxiv';
  category?: 'company_blog' | 'news' | 'research' | 'social' | 'github';
  company?: string;
}

export interface ScoredEvent extends RawEvent {
  eventType: EventType;
  importanceScore: number;
  viralityScore: number;
  seoScore: number;
  businessImpact: number;
  developerImpact: number;
  company: string;
  industry: string;
  isDuplicate: boolean;
  duplicateOf?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  keyHighlights: string[];
  whyItMatters: string;
  expertAnalysis: string;
  marketImpact: string;
  developerImpact: string;
  futurePrediction: string;
  faqs: { question: string; answer: string }[];
  sources: { name: string; url: string }[];
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  category: string;
  company: string;
  industry: string;
  eventType: EventType;
  importanceScore: number;
  heroImageUrl: string;
  heroImageCredit?: string;    // e.g. "Image: OpenAI" or "Photo via TechCrunch"
  heroImageSourceUrl?: string; // link to original image source
  status: ArticleStatus;
  originalUrl: string;
  sourceName: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

