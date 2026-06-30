import { groqJSONFast } from '../../llm';
import { BlogArticle, ScoredEvent } from '../types';

export interface GeneratedImages {
  heroImageUrl: string;
  heroImageCredit?: string;
  heroImageSourceUrl?: string;
  infographicData: InfographicData | null;
  ogImageUrl: string;
}

export interface InfographicData {
  type: 'comparison' | 'timeline' | 'stats' | 'flow';
  title: string;
  data: Record<string, unknown>;
}

const COMPANY_COLORS: Record<string, string> = {
  'OpenAI': '#10a37f',
  'Anthropic': '#d97706',
  'Google': '#4285f4',
  'Google DeepMind': '#4285f4',
  'Meta': '#0866ff',
  'Microsoft': '#00a4ef',
  'NVIDIA': '#76b900',
  'xAI': '#1d1d1f',
  'Mistral AI': '#ff7000',
  'HuggingFace': '#ff9d00',
  'default': '#2563eb',
};

const PEXELS_QUERY_MAP: Record<string, string> = {
  model_release: 'artificial intelligence robot technology',
  research_paper: 'science research data visualization',
  funding: 'startup investment growth technology',
  open_source: 'coding software collaboration technology',
  product_launch: 'technology product launch innovation',
  github_release: 'code programming developer screen',
  breaking_news: 'technology news digital information',
  keynote: 'conference presentation technology stage',
  policy_update: 'government technology policy law',
  api_release: 'software development api code',
  acquisition: 'business handshake deal technology',
  interview: 'technology podcast microphone interview',
  default: 'artificial intelligence technology future',
};

// Pexels — real, relevant, high-quality stock photos matched to event topic
async function getPexelsImage(event: ScoredEvent): Promise<{ url: string; credit: string; sourceUrl: string } | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const query = PEXELS_QUERY_MAP[event.eventType] || PEXELS_QUERY_MAP.default;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: key }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.photos?.[0];
    if (!photo) return null;

    return {
      url: photo.src.large2x || photo.src.large,
      credit: `Photo: ${photo.photographer} (Pexels)`,
      sourceUrl: photo.url,
    };
  } catch {
    return null;
  }
}

// Picsum — last-resort placeholder (no API key, always works)
function getPicsumFallback(event: ScoredEvent): { url: string; credit: string; sourceUrl: string } {
  return {
    url: `https://picsum.photos/seed/${event.id}/1792/1024`,
    credit: 'Image: Picsum Photos (placeholder)',
    sourceUrl: 'https://picsum.photos',
  };
}

// Generate infographic data structure for the article
async function generateInfographicData(
  article: Partial<BlogArticle>,
  event: ScoredEvent
): Promise<InfographicData | null> {
  try {
    const prompt = `Generate infographic data for this AI article.

Title: ${article.title}
Company: ${event.company}
Event type: ${event.eventType}
Key highlights: ${article.keyHighlights?.join(', ')}

Choose the best infographic type and generate data:

For model_release → type: "comparison" (model vs competitors)
For funding → type: "stats" (funding amounts, investors)
For research_paper → type: "stats" (key metrics from paper)
For timeline related → type: "timeline"
Default → type: "stats"

Return JSON:
{
  "type": "comparison|stats|timeline|flow",
  "title": "Infographic title",
  "data": {
    // For comparison: { "items": [{"label":"GPT-4o","value":"128K ctx"},{"label":"Claude 3","value":"200K ctx"}] }
    // For stats: { "items": [{"label":"Funding","value":"$6.6B"},{"label":"Valuation","value":"$157B"}] }
    // For timeline: { "items": [{"year":"2022","event":"Founded"},{"year":"2023","event":"GPT-4 launch"}] }
    // For flow: { "steps": ["Step 1","Step 2","Step 3"] }
  }
}`;

    return await groqJSONFast<InfographicData>(prompt, 400);
  } catch {
    return null;
  }
}

export async function generateImages(
  article: Partial<BlogArticle>,
  event: ScoredEvent
): Promise<GeneratedImages> {
  // If the original event already has a real image from RSS, use it — no DALL-E cost
  if (event.imageUrl && event.imageUrl.startsWith('http')) {
    const infographic = await generateInfographicData(article, event).catch(() => null);
    return {
      heroImageUrl: event.imageUrl,
      heroImageCredit: event.imageCredit || `Image: ${event.sourceName}`,
      heroImageSourceUrl: event.imageSourceUrl || event.url,
      infographicData: infographic,
      ogImageUrl: event.imageUrl,
    };
  }

  // No RSS image — try Pexels (real, relevant), then Picsum placeholder
  const [pexelsImg, infographic] = await Promise.all([
    getPexelsImage(event),
    generateInfographicData(article, event).catch(() => null),
  ]);

  if (pexelsImg) {
    return {
      heroImageUrl: pexelsImg.url,
      heroImageCredit: pexelsImg.credit,
      heroImageSourceUrl: pexelsImg.sourceUrl,
      infographicData: infographic,
      ogImageUrl: pexelsImg.url,
    };
  }

  const fallback = getPicsumFallback(event);
  return {
    heroImageUrl: fallback.url,
    heroImageCredit: fallback.credit,
    heroImageSourceUrl: fallback.sourceUrl,
    infographicData: infographic,
    ogImageUrl: fallback.url,
  };
}
