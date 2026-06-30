import { groqJSONFast } from '../../llm';
import { ScoredEvent } from '../types';

export interface FactCheckResult {
  confidenceScore: number;       // 0,100
  isVerified: boolean;
  verificationStatus: 'verified' | 'unverified' | 'disputed' | 'fake';
  corroboratingSources: string[];
  contradictingSources: string[];
  factCheckNotes: string;
}

// Cross-check via Google News RSS and multiple sources
async function searchCorroboratingSources(title: string): Promise<string[]> {
  try {
    const query = encodeURIComponent(title.slice(0, 80));
    const googleNewsUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(googleNewsUrl, {
      headers: { 'User-Agent': 'ThinkSuite-AI-News-Bot/1.0' },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const titles = [...xml.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g)]
      .map(m => m[1])
      .filter(t => !t.includes('Google News'))
      .slice(0, 5);

    return titles;
  } catch {
    return [];
  }
}

export async function factCheckEvent(event: ScoredEvent): Promise<FactCheckResult> {
  // Step 1: Look for corroborating sources
  const corroboratingSources = await searchCorroboratingSources(event.title);

  // Step 2: AI-based verification analysis
  let aiVerdict: Partial<FactCheckResult> = {};

  try {
    const prompt = `You are a fact-checker for an AI news platform.

Analyze this AI news event and assess its credibility:

Title: ${event.title}
Source: ${event.sourceName}
Content: ${event.content.slice(0, 1000)}
Corroborating headlines found: ${corroboratingSources.join(' | ') || 'None found'}

Return JSON only:
{
  "confidenceScore": <0-100>,
  "verificationStatus": "<verified|unverified|disputed|fake>",
  "factCheckNotes": "<brief explanation, is this plausible? any red flags? source credibility?>",
  "contradictingSources": []
}

Rules:
- Official company blogs (openai.com, anthropic.com, etc.) = 90+ confidence
- Major tech news (TechCrunch, Verge, VentureBeat) = 75-85
- Corroborated by 3+ sources = 80+
- Only 1 source, no verification = 50-65
- Sensational/unverified claim = below 50
- Clear misinformation = below 20`;

    aiVerdict = await groqJSONFast(prompt, 400);
  } catch {
    // Fallback scoring based on source credibility
    const trustedSources = ['openai', 'anthropic', 'google', 'meta ai', 'microsoft', 'nvidia', 'techcrunch', 'verge', 'venturebeat', 'mit', 'arxiv'];
    const isTrusted = trustedSources.some(s => event.sourceName.toLowerCase().includes(s));
    aiVerdict = {
      confidenceScore: isTrusted ? 82 : 60,
      verificationStatus: isTrusted ? 'verified' : 'unverified',
      factCheckNotes: 'Auto-verified based on source credibility.',
      contradictingSources: [],
    };
  }

  const confidenceScore = aiVerdict.confidenceScore ?? 60;

  return {
    confidenceScore,
    isVerified: confidenceScore >= 60,
    verificationStatus: aiVerdict.verificationStatus ?? 'unverified',
    corroboratingSources,
    contradictingSources: aiVerdict.contradictingSources ?? [],
    factCheckNotes: aiVerdict.factCheckNotes ?? '',
  };
}

export function shouldPublish(factCheck: FactCheckResult): boolean {
  return factCheck.confidenceScore >= 55 && factCheck.verificationStatus !== 'fake';
}
