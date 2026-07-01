import { groqJSON } from '../../llm';
import { ScoredEvent, BlogArticle } from '../types';
import { v4 as uuidv4 } from 'uuid';

function buildPrompt(event: ScoredEvent): string {
  return `You are an expert AI journalist writing for ThinkSuite, a leading AI & Tech agency blog.

Write a comprehensive, SEO-optimized article about this AI news event.

EVENT:
Title: ${event.title}
Source: ${event.sourceName}
Company: ${event.company}
Type: ${event.eventType}
URL: ${event.url}
Content: ${event.content.slice(0, 3000)}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "SEO headline 60-70 chars",
  "summary": "2-3 sentence compelling summary",
  "content": "Full article markdown 800+ words. Use ## headings, bullet points, **bold**. Sections: Introduction, What Happened, Key Details, Technical Analysis, Industry Impact, Future Implications.",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5"],
  "whyItMatters": "2-3 paragraphs why this matters to developers, businesses, AI industry",
  "expertAnalysis": "Deep analysis — implications, opportunities, risks",
  "marketImpact": "Effect on AI market, competitors, investment landscape",
  "developerImpact": "Impact on developers and technical teams",
  "futurePrediction": "30, 90, 180 day predictions",
  "faqs": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"},
    {"question": "Q3?", "answer": "A3"}
  ],
  "metaTitle": "SEO title max 60 chars",
  "metaDescription": "SEO description max 160 chars with keywords",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "One of: AI Models, Research, Funding, Open Source, Tools, Policy, Industry News"
}`;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '');
}

export async function generateBlogArticle(event: ScoredEvent): Promise<BlogArticle | null> {
  try {
    const data = await groqJSON<Partial<BlogArticle>>(buildPrompt(event), 6000);
    const now = new Date().toISOString();
    const title = data.title || event.title;

    return {
      id: uuidv4(),
      slug: generateSlug(title),
      title,
      summary: data.summary || '',
      content: data.content || '',
      keyHighlights: data.keyHighlights || [],
      whyItMatters: data.whyItMatters || '',
      expertAnalysis: data.expertAnalysis || '',
      marketImpact: data.marketImpact || '',
      developerImpact: data.developerImpact || '',
      futurePrediction: data.futurePrediction || '',
      faqs: data.faqs || [],
      sources: [{ name: event.sourceName, url: event.url }],
      metaTitle: data.metaTitle || title.slice(0, 60),
      metaDescription: data.metaDescription || '',
      tags: data.tags || [],
      category: data.category || 'Industry News',
      company: event.company,
      industry: event.industry,
      eventType: event.eventType,
      importanceScore: event.importanceScore,
      heroImageUrl: event.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(event.company + event.id)}/1200/630`,
      heroImageCredit: event.imageUrl
        ? (event.imageCredit || `Image: ${event.sourceName}`)
        : 'Image: Picsum Photos (placeholder)',
      heroImageSourceUrl: event.imageUrl
        ? (event.imageSourceUrl || event.url)
        : 'https://picsum.photos',
      status: 'published',
      originalUrl: event.url,
      sourceName: event.sourceName,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error(`Article generation failed for "${event.title}":`, (err as Error).message);
    return null;
  }
}
