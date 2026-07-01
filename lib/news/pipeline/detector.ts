import { RawEvent, ScoredEvent, EventType } from '../types';
import { AI_COMPANY_KEYWORDS } from '../sources';

const EVENT_PATTERNS: { type: EventType; keywords: string[] }[] = [
  { type: 'model_release', keywords: ['release', 'launch', 'introduces', 'gpt', 'claude', 'gemini', 'llama', 'model', 'version', 'v2', 'v3', 'v4', 'v5', 'gpt-4o', 'o1', 'o3', 'deepseek', 'qwen', 'mistral', 'phi-'] },
  { type: 'research_paper', keywords: ['paper', 'research', 'arxiv', 'study', 'benchmark', 'evaluation', 'proposed', 'novel', 'preprint', 'findings'] },
  { type: 'funding', keywords: ['funding', 'raises', 'investment', 'series a', 'series b', 'series c', 'valuation', 'billion', 'million', 'investor', 'round', 'backed', 'venture'] },
  { type: 'acquisition', keywords: ['acquires', 'acquisition', 'buys', 'merger', 'acquired', 'deal', 'takeover'] },
  { type: 'api_release', keywords: ['api', 'sdk', 'developer', 'endpoint', 'integration', 'access', 'plugin', 'library', 'framework'] },
  { type: 'open_source', keywords: ['open source', 'open-source', 'github', 'released code', 'open weight', 'weights', 'mit license', 'apache license', 'open models'] },
  { type: 'keynote', keywords: ['keynote', 'conference', 'event', 'summit', 'demo day', 'devday', 'google i/o', 'wwdc', 'nvidia gtc', 'microsoft build', 'aws re:invent'] },
  { type: 'policy_update', keywords: ['policy', 'regulation', 'safety', 'alignment', 'governance', 'ban', 'law', 'eu ai act', 'executive order', 'compliance', 'ethics'] },
  { type: 'github_release', keywords: ['github', 'commit', 'release', 'update', 'v0.', 'v1.', 'v2.', 'pull request', 'merged'] },
  { type: 'product_launch', keywords: ['launch', 'announces', 'introducing', 'new feature', 'now available', 'general availability', 'ga release', 'ships'] },
  { type: 'interview', keywords: ['interview', 'says', 'told', 'according to', 'statement', 'tweet', 'posted', 'opinion', 'thinks'] },
  { type: 'breaking_news', keywords: ['breaking', 'exclusive', 'just in', 'first look', 'confirmed', 'leaked', 'urgent', 'alert'] },
];

const HIGH_IMPORTANCE_SIGNALS: string[] = [
  // Current flagship models
  'gpt-4o', 'gpt-4.5', 'gpt-5', 'gpt-6', 'o1', 'o3', 'o4',
  'claude 3', 'claude 3.5', 'claude 3.7', 'claude 4', 'claude 5',
  'gemini 1.5', 'gemini 2', 'gemini 2.5', 'gemini 3', 'gemini ultra',
  'llama 3', 'llama 4', 'llama 4.1',
  'deepseek', 'qwen', 'mistral large', 'mixtral',
  'grok 2', 'grok 3', 'grok-3',
  'phi-3', 'phi-4',
  // Big-picture signals
  'agi', 'artificial general intelligence', 'trillion', '$10 billion',
  'broke', 'record', 'first ever', 'surpasses human', 'open source gpt',
  'fired', 'lawsuit', 'banned', 'shutdown', 'acquires', 'merger',
  'sam altman', 'elon musk', 'sundar pichai', 'satya nadella',
  'dario amodei', 'demis hassabis', 'jensen huang', 'yann lecun',
  'series d', 'series e', '$1 billion', '$500 million',
];

const INDUSTRY_PATTERNS: { industry: string; keywords: RegExp }[] = [
  { industry: 'Healthcare',     keywords: /health|medical|clinical|patient|drug|pharma|hospital|diagnos|biotech|genomic|fda|radiology/ },
  { industry: 'Finance',        keywords: /financ|bank|trading|stock|invest|crypto|insurance|payment|fintech|hedge fund|wall street|defi/ },
  { industry: 'Robotics',       keywords: /robot|autonomous|self.driv|drone|manufactur|warehouse|humanoid|embodied|actuator|boston dynamics/ },
  { industry: 'Legal',          keywords: /legal|law|court|contract|compliance|regulation|gdpr|litigation|attorney|judiciary/ },
  { industry: 'Education',      keywords: /educat|school|learn|student|tutor|university|classroom|curriculum|edtech|khanmigo/ },
  { industry: 'Gaming & XR',    keywords: /game|gaming|metaverse|virtual reality|\bvr\b|\bar\b|augmented|unreal|unity|esport/ },
  { industry: 'Cybersecurity',  keywords: /cybersecur|hack|threat|vulnerab|malware|phishing|attack|breach|soc|siem|zero.day/ },
  { industry: 'Hardware & Chips', keywords: /chip|semiconductor|hardware|gpu|tpu|compute|datacenter|silicon|wafer|fab|nvidia|amd|intel|qualcomm/ },
  { industry: 'Creative AI',    keywords: /art|creative|music|video|image generat|midjourney|dall.e|sora|stable diffusion|adobe|runway|udio|suno/ },
  { industry: 'Autonomous Vehicles', keywords: /self.driv|autonomous vehicle|waymo|tesla autopilot|cruise|lidar|av industry/ },
  { industry: 'Enterprise AI',  keywords: /enterprise|b2b|saas|workflow|productivity|copilot|automation|crm|erp|salesforce/ },
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
    'openai': 'OpenAI', 'chatgpt': 'OpenAI', 'gpt': 'OpenAI', 'sora': 'OpenAI', 'dall-e': 'OpenAI', 'o1 model': 'OpenAI', 'o3 model': 'OpenAI',
    'anthropic': 'Anthropic', 'claude': 'Anthropic',
    'google deepmind': 'Google DeepMind', 'deepmind': 'Google DeepMind',
    'google': 'Google', 'gemini': 'Google', 'bard': 'Google', 'google ai': 'Google',
    'meta ai': 'Meta', 'meta llama': 'Meta', 'llama': 'Meta', 'facebook': 'Meta', 'meta ': 'Meta',
    'microsoft': 'Microsoft', 'copilot': 'Microsoft', 'bing': 'Microsoft', 'azure ai': 'Microsoft',
    'nvidia': 'NVIDIA',
    'hugging face': 'HuggingFace', 'huggingface': 'HuggingFace',
    'mistral': 'Mistral AI',
    'cohere': 'Cohere',
    'stability ai': 'Stability AI', 'stable diffusion': 'Stability AI',
    'perplexity': 'Perplexity',
    'xai': 'xAI', 'grok': 'xAI', 'x.ai': 'xAI',
    'amazon': 'Amazon', 'aws': 'Amazon', 'bedrock': 'Amazon',
    'apple': 'Apple',
    'deepseek': 'DeepSeek',
    'qwen': 'Alibaba (Qwen)',
    'groq': 'Groq',
    'cerebras': 'Cerebras',
    'elevenlabs': 'ElevenLabs',
    'character ai': 'Character AI',
    'midjourney': 'Midjourney',
    'runway': 'Runway',
    'replicate': 'Replicate',
    'ollama': 'Ollama',
    'together ai': 'Together AI',
    'a16z': 'a16z',
    'tesla': 'Tesla',
  };

  // Longer matches first to avoid 'meta' matching inside 'metamask'
  const sorted = Object.entries(companyMap).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, company] of sorted) {
    if (text.includes(keyword)) return company;
  }
  return 'AI Industry';
}

export function detectIndustry(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  for (const { industry, keywords } of INDUSTRY_PATTERNS) {
    if (keywords.test(text)) return industry;
  }
  return 'General AI';
}

function scoreImportance(title: string, content: string, sourceName: string): number {
  const text = `${title} ${content}`.toLowerCase();
  const src = sourceName.toLowerCase();
  let score = 40; // base

  // Official AI company blogs — highest credibility
  if (['openai', 'anthropic', 'deepmind', 'google ai'].some(s => src.includes(s))) score += 25;
  // Major AI news sites
  else if (['techcrunch', 'venturebeat', 'mit technology review', 'the decoder', 'wired'].some(s => src.includes(s))) score += 15;
  // Other company blogs
  else if (['meta ai', 'mistral', 'huggingface', 'xai', 'amazon aws', 'nvidia', 'microsoft', 'cohere', 'perplexity', 'elevenlabs', 'groq', 'cerebras', 'runway', 'character ai'].some(s => src.includes(s))) score += 18;
  // Research sources
  else if (['arxiv', 'papers with code', 'stanford', 'mit ai', 'bair'].some(s => src.includes(s))) score += 12;
  // Other tech news
  else if (['verge', 'ars technica', 'zdnet', 'siliconangle', 'ieee', 'the register'].some(s => src.includes(s))) score += 8;

  // High-importance signal boost
  HIGH_IMPORTANCE_SIGNALS.forEach(signal => {
    if (text.includes(signal.toLowerCase())) score += 15;
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
  const industry = detectIndustry(event.title, event.content);
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
    industry,
    importanceScore,
    viralityScore,
    seoScore,
    developerImpact,
    businessImpact,
    isDuplicate: false,
  };
}

export function filterLowImportance(events: ScoredEvent[], minScore = 40): ScoredEvent[] {
  return events.filter(e => e.importanceScore >= minScore);
}
