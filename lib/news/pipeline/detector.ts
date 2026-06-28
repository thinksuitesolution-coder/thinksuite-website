import { RawEvent, ScoredEvent, EventType } from '../types';
import { AI_COMPANY_KEYWORDS } from '../sources';

const EVENT_PATTERNS: { type: EventType; keywords: string[] }[] = [
  { type: 'model_release', keywords: ['release', 'launch', 'introduces', 'gpt', 'claude', 'gemini', 'llama', 'model', 'version', 'v2', 'v3', 'v4', 'v5'] },
  { type: 'research_paper', keywords: ['paper', 'research', 'arxiv', 'study', 'benchmark', 'evaluation', 'proposed', 'novel'] },
  { type: 'funding', keywords: ['funding', 'raises', 'investment', 'series a', 'series b', 'valuation', 'billion', 'million', 'investor'] },
  { type: 'acquisition', keywords: ['acquires', 'acquisition', 'buys', 'merger', 'acquired', 'deal'] },
  { type: 'api_release', keywords: ['api', 'sdk', 'developer', 'endpoint', 'integration', 'access'] },
  { type: 'open_source', keywords: ['open source', 'open-source', 'github', 'released code', 'open weight', 'weights'] },
  { type: 'keynote', keywords: ['keynote', 'conference', 'event', 'summit', 'demo day', 'devday', 'google i/o', 'wwdc', 'nvidia gtc'] },
  { type: 'policy_update', keywords: ['policy', 'regulation', 'safety', 'alignment', 'governance', 'ban', 'law', 'eu ai act'] },
  { type: 'github_release', keywords: ['github', 'commit', 'release', 'update', 'v0.', 'v1.', 'v2.'] },
  { type: 'product_launch', keywords: ['launch', 'announces', 'introducing', 'new feature', 'now available', 'general availability'] },
  { type: 'interview', keywords: ['interview', 'says', 'told', 'according to', 'statement', 'tweet', 'posted'] },
  { type: 'breaking_news', keywords: ['breaking', 'exclusive', 'just in', 'first look', 'confirmed', 'leaked'] },
];

const HIGH_IMPORTANCE_SIGNALS: string[] = [
  'gpt-5', 'gpt-6', 'claude 4', 'claude 5', 'gemini 3', 'llama 4',
  'agi', 'artificial general intelligence', 'trillion', '$10 billion',
  'broke', 'record', 'first ever', 'surpasses human', 'open source gpt',
  'fired', 'lawsuit', 'banned', 'shutdown', 'acquires', 'merger',
  'sam altman', 'elon musk', 'sundar pichai', 'satya nadella',
];

function detectEventType(title: string, content: string): EventType {
  const text = `${title} ${content}`.toLowerCase();

  for (const pattern of EVENT_PATTERNS) {
    if (pattern.keywords.some(k => text.includes(k.toLowerCase()))) {
      return pattern.type;
    }
  }
  return 'general';
}

function detectCompany(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  const companyMap: Record<string, string> = {
    'openai': 'OpenAI', 'chatgpt': 'OpenAI', 'gpt': 'OpenAI', 'sora': 'OpenAI', 'dall-e': 'OpenAI',
    'anthropic': 'Anthropic', 'claude': 'Anthropic',
    'google': 'Google', 'deepmind': 'Google DeepMind', 'gemini': 'Google', 'bard': 'Google',
    'meta': 'Meta', 'llama': 'Meta', 'facebook': 'Meta',
    'microsoft': 'Microsoft', 'copilot': 'Microsoft', 'bing': 'Microsoft',
    'nvidia': 'NVIDIA',
    'hugging face': 'HuggingFace', 'huggingface': 'HuggingFace',
    'mistral': 'Mistral AI',
    'cohere': 'Cohere',
    'stability': 'Stability AI',
    'perplexity': 'Perplexity',
    'xai': 'xAI', 'grok': 'xAI',
    'amazon': 'Amazon', 'aws': 'Amazon', 'bedrock': 'Amazon',
    'apple': 'Apple',
    'tesla': 'Tesla',
  };

  for (const [keyword, company] of Object.entries(companyMap)) {
    if (text.includes(keyword)) return company;
  }
  return 'AI Industry';
}

function scoreImportance(title: string, content: string, sourceName: string): number {
  const text = `${title} ${content}`.toLowerCase();
  let score = 40; // base

  // Source credibility boost
  if (['openai blog', 'anthropic blog', 'google ai blog', 'google deepmind'].some(s => sourceName.toLowerCase().includes(s.toLowerCase()))) score += 25;
  else if (['techcrunch', 'venturebeat', 'mit technology review'].some(s => sourceName.toLowerCase().includes(s.toLowerCase()))) score += 15;
  else if (sourceName.toLowerCase().includes('arxiv')) score += 10;

  // High-importance signal boost
  HIGH_IMPORTANCE_SIGNALS.forEach(signal => {
    if (text.includes(signal.toLowerCase())) score += 20;
  });

  // AI company mention
  if (AI_COMPANY_KEYWORDS.some(k => text.includes(k.toLowerCase()))) score += 10;

  return Math.min(score, 100);
}

function scoreVirality(title: string, importanceScore: number): number {
  let score = importanceScore * 0.6;
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('breaking') || lowerTitle.includes('exclusive')) score += 20;
  if (lowerTitle.includes('first') || lowerTitle.includes('record')) score += 15;
  if (HIGH_IMPORTANCE_SIGNALS.some(s => lowerTitle.includes(s))) score += 25;

  return Math.min(Math.round(score), 100);
}

export function scoreEvent(event: RawEvent): ScoredEvent {
  const eventType = detectEventType(event.title, event.content);
  const company = detectCompany(event.title, event.content);
  const importanceScore = scoreImportance(event.title, event.content, event.sourceName);
  const viralityScore = scoreVirality(event.title, importanceScore);

  const seoScore = Math.round(
    (importanceScore * 0.4) + (viralityScore * 0.3) + (event.content.length > 500 ? 30 : 15)
  );

  const developerImpact = ['model_release', 'api_release', 'open_source', 'github_release', 'research_paper'].includes(eventType) ? importanceScore : Math.round(importanceScore * 0.5);
  const businessImpact = ['funding', 'acquisition', 'product_launch', 'breaking_news'].includes(eventType) ? importanceScore : Math.round(importanceScore * 0.6);

  return {
    ...event,
    eventType,
    company,
    importanceScore,
    viralityScore,
    seoScore,
    developerImpact,
    businessImpact,
    isDuplicate: false,
  };
}

export function filterLowImportance(events: ScoredEvent[], minScore = 45): ScoredEvent[] {
  return events.filter(e => e.importanceScore >= minScore);
}
