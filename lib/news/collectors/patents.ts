import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

// USPTO Patent Full-Text Search (free, no API key)
const USPTO_URL = 'https://efts.uspto.gov/LATEST/search-it';

// Google Patents RSS alternative - use SerpAPI or public feeds
const PATENT_RSS_SOURCES = [
  'https://news.google.com/rss/search?q=AI+artificial+intelligence+patent+USPTO&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=machine+learning+patent+filed+2025&hl=en-US&gl=US&ceid=US:en',
];

export interface PatentIntelligence {
  patentId: string;
  title: string;
  assignee: string;           // Company name
  inventors: string[];
  filingDate: string;
  summary: string;
  possibleProducts: string[];
  threatAnalysis: string;
  technologyArea: string;
  competitiveImplication: string;
}

async function analyzePatent(rawText: string): Promise<Partial<PatentIntelligence> | null> {
  try {
    const prompt = `Analyze this AI patent filing and extract intelligence.

Raw data: ${rawText.slice(0, 800)}

Return JSON:
{
  "possibleProducts": ["What products could be built from this patent"],
  "threatAnalysis": "What threat does this pose to competitors",
  "technologyArea": "Core technology area",
  "competitiveImplication": "Strategic implications for the AI industry"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content || '{}';
    return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
  } catch {
    return null;
  }
}

// Fetch AI patents via Google News RSS (free)
export async function fetchPatentNews(): Promise<RawEvent[]> {
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser({ timeout: 10000 });
  const events: RawEvent[] = [];

  for (const url of PATENT_RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items.slice(0, 8)) {
        if (!item.title || !item.link) continue;

        const isPatentRelated = ['patent', 'filing', 'USPTO', 'intellectual property', 'IP'].some(
          kw => item.title!.toLowerCase().includes(kw.toLowerCase()) ||
                (item.contentSnippet || '').toLowerCase().includes(kw.toLowerCase())
        );
        if (!isPatentRelated) continue;

        events.push({
          id: uuidv4(),
          source: 'patent-news',
          sourceName: 'Patent Intelligence',
          title: `[Patent] ${item.title}`,
          url: item.link,
          content: item.contentSnippet || '',
          publishedAt: item.pubDate || new Date().toISOString(),
        });
      }
    } catch { /* skip failed sources */ }
  }

  return events;
}
