import { groqJSON, groqJSONFast } from '../../llm';
import { ScoredEvent } from '../types';

export interface CompetitorAnalysis {
  triggerCompany: string;
  affectedCompetitors: {
    company: string;
    impact: 'positive' | 'negative' | 'neutral';
    impactScore: number;        // 0-100
    reasoning: string;
    likelyResponse: string;
  }[];
  marketShareShift: string;
  technicalComparison: {
    aspect: string;
    triggerCompany: string;
    competitors: Record<string, string>;
  }[];
  industryNarrative: string;
  winnerAnalysis: string;
  loserAnalysis: string;
}

const COMPETITOR_MAP: Record<string, string[]> = {
  'OpenAI':        ['Anthropic', 'Google DeepMind', 'Meta', 'xAI', 'Mistral AI', 'Cohere'],
  'Anthropic':     ['OpenAI', 'Google DeepMind', 'Meta', 'xAI', 'Mistral AI'],
  'Google':        ['OpenAI', 'Microsoft', 'Meta', 'Anthropic'],
  'Google DeepMind': ['OpenAI', 'Microsoft', 'Meta', 'Anthropic'],
  'Meta':          ['OpenAI', 'Google DeepMind', 'Anthropic', 'Mistral AI'],
  'Microsoft':     ['Google', 'OpenAI', 'Amazon'],
  'xAI':           ['OpenAI', 'Anthropic', 'Google DeepMind'],
  'NVIDIA':        ['AMD', 'Intel', 'Qualcomm'],
  'Mistral AI':    ['OpenAI', 'Anthropic', 'Cohere'],
  'HuggingFace':   ['OpenAI', 'Replicate', 'Together AI'],
};

export async function generateCompetitorIntelligence(
  event: ScoredEvent
): Promise<CompetitorAnalysis | null> {
  const competitors = COMPETITOR_MAP[event.company];
  if (!competitors || event.importanceScore < 70) return null;

  try {
    const prompt = `You are a competitive intelligence analyst for the AI industry.

Event: ${event.title}
Company: ${event.company}
Details: ${event.content.slice(0, 600)}

Analyze impact on competitors: ${competitors.join(', ')}

Return JSON:
{
  "triggerCompany": "${event.company}",
  "affectedCompetitors": [
    {
      "company": "CompanyName",
      "impact": "negative|positive|neutral",
      "impactScore": <0-100>,
      "reasoning": "Why and how they are affected",
      "likelyResponse": "What they will likely do"
    }
  ],
  "marketShareShift": "Brief analysis of potential market share movement",
  "technicalComparison": [
    {
      "aspect": "e.g. Context Window",
      "triggerCompany": "e.g. 128K tokens",
      "competitors": {"Anthropic": "200K", "Google": "1M"}
    }
  ],
  "industryNarrative": "2-3 sentence industry perspective",
  "winnerAnalysis": "Who benefits most and why",
  "loserAnalysis": "Who is most threatened and why"
}`;

    return await groqJSONFast<CompetitorAnalysis>(prompt, 1200);
  } catch (err) {
    console.error('Competitor intel failed:', (err as Error).message);
    return null;
  }
}
