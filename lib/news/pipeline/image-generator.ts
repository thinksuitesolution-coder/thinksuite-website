import OpenAI from 'openai';
import { BlogArticle, ScoredEvent } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

export interface GeneratedImages {
  heroImageUrl: string;
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

// Generate hero image via DALL-E 3
async function generateHeroWithDALLE(event: ScoredEvent): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const prompts: Record<string, string> = {
    model_release: `Futuristic AI neural network visualization for ${event.company}, electric blue and purple glowing circuits on dark background, professional tech photography style, 16:9 aspect ratio`,
    research_paper: `Abstract AI research visualization, scientific data flowing through neural pathways, glowing equations and graphs on deep blue background, academic tech aesthetic`,
    funding: `Modern startup funding concept, rising graph with financial data, clean minimalist design, ${COMPANY_COLORS[event.company] || '#2563eb'} accent colors on white background`,
    open_source: `Open source code repository visualization, interconnected nodes and branches glowing, community collaboration concept, dark background with colorful highlights`,
    product_launch: `Product launch announcement visual, sleek modern interface mockup with glowing elements, ${event.company} brand colors, dark premium tech aesthetic`,
    breaking_news: `Breaking AI news alert visualization, urgent red and white design with digital circuits, news ticker aesthetic, dramatic lighting`,
    default: `Professional AI technology visualization for ${event.company}, modern neural network design, blue gradient, photorealistic render`,
  };

  const prompt = prompts[event.eventType] || prompts.default;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt}. No text, no watermarks. Suitable for a professional AI news publication.`,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });
    return response.data?.[0]?.url || null;
  } catch (err) {
    console.warn('DALL-E generation failed, using Unsplash fallback:', (err as Error).message);
    return null;
  }
}

// Unsplash free fallback (no API key needed)
function getUnsplashFallback(event: ScoredEvent): string {
  const queryMap: Record<string, string> = {
    model_release: 'artificial+intelligence+robot+technology',
    research_paper: 'science+research+data+visualization',
    funding: 'startup+investment+growth+technology',
    open_source: 'coding+software+collaboration+technology',
    product_launch: 'technology+product+launch+innovation',
    github_release: 'code+programming+developer+screen',
    breaking_news: 'technology+news+digital+information',
    keynote: 'conference+presentation+technology+stage',
    default: 'artificial+intelligence+technology+future',
  };
  const query = queryMap[event.eventType] || queryMap.default;
  return `https://source.unsplash.com/1792x1024/?${query}&sig=${Date.now()}`;
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content || '{}';
    return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
  } catch {
    return null;
  }
}

export async function generateImages(
  article: Partial<BlogArticle>,
  event: ScoredEvent
): Promise<GeneratedImages> {
  // Try DALL-E first, fall back to Unsplash
  const [dalleUrl, infographic] = await Promise.all([
    generateHeroWithDALLE(event),
    generateInfographicData(article, event),
  ]);

  const heroImageUrl = dalleUrl || getUnsplashFallback(event);

  return {
    heroImageUrl,
    infographicData: infographic,
    ogImageUrl: heroImageUrl,
  };
}
