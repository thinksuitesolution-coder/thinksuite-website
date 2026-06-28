import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScoredEvent, BlogArticle } from '../types';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'build-placeholder');

function buildPrompt(event: ScoredEvent): string {
  return `You are an expert AI journalist and analyst writing for ThinkSuite, a leading AI & Tech agency blog.

Write a comprehensive, SEO-optimized blog article about this AI news event.

EVENT DETAILS:
Title: ${event.title}
Source: ${event.sourceName}
Company: ${event.company}
Event Type: ${event.eventType}
Original URL: ${event.url}
Content: ${event.content}

WRITE THE ARTICLE IN THIS EXACT JSON FORMAT:
{
  "title": "Engaging, SEO-optimized headline (60-70 chars)",
  "summary": "2-3 sentence compelling summary",
  "content": "Full article in markdown format, minimum 800 words. Include: Introduction, What Happened, Key Details, Technical Analysis, Industry Impact, Comparison with competitors (if applicable), Expert Analysis, Future Implications. Use ## headings, bullet points, bold for key terms.",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5"],
  "whyItMatters": "2-3 paragraphs explaining why this matters to developers, businesses, and the AI industry",
  "expertAnalysis": "Deep analysis paragraph, implications, opportunities, risks",
  "marketImpact": "How this affects the AI market, competitors, investment landscape",
  "developerImpact": "Specific impact on developers and technical teams",
  "futurePrediction": "What happens next, 30, 90, 180 days prediction",
  "faqs": [
    {"question": "FAQ question 1?", "answer": "Detailed answer"},
    {"question": "FAQ question 2?", "answer": "Detailed answer"},
    {"question": "FAQ question 3?", "answer": "Detailed answer"}
  ],
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 160 chars), compelling, includes keywords",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "category": "One of: AI Models, Research, Funding, Open Source, Tools, Policy, Industry News"
}

IMPORTANT:
- Be factual, cite the source
- Write like TechCrunch/VentureBeat quality
- Include actual technical details
- Return ONLY the JSON, no markdown code blocks`;
}

async function writeWithOpenAI(event: ScoredEvent): Promise<Partial<BlogArticle>> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: buildPrompt(event) }],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const raw = completion.choices[0].message.content || '{}';
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
}

async function writeWithGemini(event: ScoredEvent): Promise<Partial<BlogArticle>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(buildPrompt(event));
  const raw = result.response.text();
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
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
  let articleData: Partial<BlogArticle>;

  try {
    articleData = await writeWithOpenAI(event);
  } catch (primaryErr) {
    console.warn('OpenAI failed, falling back to Gemini:', (primaryErr as Error).message);
    try {
      articleData = await writeWithGemini(event);
    } catch (fallbackErr) {
      console.error('Both LLMs failed:', (fallbackErr as Error).message);
      return null;
    }
  }

  const now = new Date().toISOString();
  const title = articleData.title || event.title;

  return {
    id: uuidv4(),
    slug: generateSlug(title),
    title,
    summary: articleData.summary || '',
    content: articleData.content || '',
    keyHighlights: articleData.keyHighlights || [],
    whyItMatters: articleData.whyItMatters || '',
    expertAnalysis: articleData.expertAnalysis || '',
    marketImpact: articleData.marketImpact || '',
    developerImpact: articleData.developerImpact || '',
    futurePrediction: articleData.futurePrediction || '',
    faqs: articleData.faqs || [],
    sources: [{ name: event.sourceName, url: event.url }],
    metaTitle: articleData.metaTitle || title.slice(0, 60),
    metaDescription: articleData.metaDescription || '',
    tags: articleData.tags || [],
    category: articleData.category || 'Industry News',
    company: event.company,
    eventType: event.eventType,
    importanceScore: event.importanceScore,
    heroImageUrl: event.imageUrl || `https://source.unsplash.com/1200x630/?${encodeURIComponent(event.company + ' AI technology')}`,
    status: 'published',
    originalUrl: event.url,
    sourceName: event.sourceName,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
