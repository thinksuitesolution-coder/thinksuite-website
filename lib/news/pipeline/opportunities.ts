import OpenAI from 'openai';
import { ScoredEvent } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const raw = completion.choices[0].message.content || '{}';
    return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
  } catch (err) {
    console.error('Opportunity detection failed:', (err as Error).message);
    return null;
  }
}
