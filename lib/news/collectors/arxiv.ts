import { RawEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Arxiv has a free API, no key needed
const ARXIV_SEARCH_URL = 'https://export.arxiv.org/api/query';

const HIGH_IMPACT_TERMS = [
  'GPT', 'LLM', 'large language model', 'transformer', 'reasoning',
  'multimodal', 'agent', 'RLHF', 'alignment', 'safety', 'benchmark',
  'foundation model', 'generative', 'diffusion', 'RAG', 'fine-tuning',
];

function parseArxivXML(xml: string): RawEvent[] {
  const entries: RawEvent[] = [];
  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  for (const entry of entryMatches.slice(0, 10)) {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || '';
    const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || '';
    const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
    const authors = Array.from(entry.matchAll(/<name>([\s\S]*?)<\/name>/g)).map(m => m[1].trim()).slice(0, 3);

    if (!title || !id) continue;

    // Only include papers mentioning high-impact terms
    const isHighImpact = HIGH_IMPACT_TERMS.some(term =>
      title.toLowerCase().includes(term.toLowerCase()) ||
      summary.toLowerCase().includes(term.toLowerCase())
    );
    if (!isHighImpact) continue;

    entries.push({
      id: uuidv4(),
      source: 'arxiv',
      sourceName: 'ArXiv Research',
      title: `[Research] ${title.replace(/\n/g, ' ')}`,
      url: id.replace('abs', 'pdf'),
      content: `Authors: ${authors.join(', ')}\n\n${summary.slice(0, 1500)}`,
      publishedAt: published,
    });
  }

  return entries;
}

export async function fetchArxivPapers(): Promise<RawEvent[]> {
  try {
    const query = encodeURIComponent(
      '(ti:"large language model" OR ti:GPT OR ti:LLM OR ti:transformer OR ti:"generative AI" OR ti:"multimodal") AND (cat:cs.AI OR cat:cs.LG OR cat:cs.CL)'
    );
    const url = `${ARXIV_SEARCH_URL}?search_query=${query}&start=0&max_results=15&sortBy=submittedDate&sortOrder=descending`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'ThinkSuite-AI-News-Bot/1.0' },
    });

    if (!res.ok) return [];
    const xml = await res.text();
    return parseArxivXML(xml);
  } catch (err) {
    console.error('Arxiv fetch failed:', (err as Error).message);
    return [];
  }
}
