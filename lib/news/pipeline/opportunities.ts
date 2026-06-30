import { groqJSON, groqJSONFast } from '../../llm';
import { ScoredEvent } from '../types';

export interface StartupOpportunity {
  name: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  competitionLevel: 'low' | 'medium' | 'high';
  timeToMarket: string;
  techRequired: string[];
  estimatedMarketSize: string;
}

export interface OpportunityReport {
  opportunities: StartupOpportunity[];
  topOpportunity: StartupOpportunity;
  investmentAngles: string[];
  threatenedStartups: string[];
  emergingJobRoles: string[];
  summary: string;
}

export async function detectOpportunities(event: ScoredEvent): Promise<OpportunityReport | null> {
  if (event.importanceScore < 65) return null;

  try {
    const prompt = `You are a startup opportunity analyst and venture capital advisor.

This major AI event just happened:
Title: ${event.title}
Company: ${event.company}
Type: ${event.eventType}
Content: ${event.content.slice(0, 800)}

Generate a startup opportunity report as JSON:
{
  "opportunities": [
    {
      "name": "Specific startup idea name",
      "description": "What this startup does, 2 sentences",
      "targetMarket": "Who are the customers",
      "revenueModel": "How it makes money",
      "competitionLevel": "low|medium|high",
      "timeToMarket": "e.g. 3-6 months",
      "techRequired": ["Next.js", "OpenAI API"],
      "estimatedMarketSize": "e.g. $2B TAM"
    }
  ],
  "topOpportunity": { <same structure as above, the best one> },
  "investmentAngles": ["Why VCs should care - 3 points"],
  "threatenedStartups": ["Existing companies that are now at risk"],
  "emergingJobRoles": ["New job roles this creates"],
  "summary": "2-sentence executive summary of opportunities"
}

Generate 5-7 specific, actionable startup ideas. Be specific about the product, not generic.`;

    return await groqJSONFast<OpportunityReport>(prompt, 1500);
  } catch (err) {
    console.error('Opportunity detection failed:', (err as Error).message);
    return null;
  }
}
