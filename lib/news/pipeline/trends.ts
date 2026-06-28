import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

export interface TrendPrediction {
  technology: string;
  currentMomentum: number;    // 0-100
  predictedGrowth30d: number; // percentage
  predictedGrowth90d: number;
  predictedGrowth180d: number;
  signals: string[];
  riskFactors: string[];
  confidence: number;
  category: string;
  investmentRecommendation: 'strong_buy' | 'buy' | 'hold' | 'watch' | 'avoid';
}

export interface TrendReport {
  generatedAt: string;
  topTrends: TrendPrediction[];
  risingStars: string[];        // Technologies to watch
  declining: string[];          // Technologies losing momentum
  marketSummary: string;
  nextBigThing: string;         // Single prediction for the next breakout
  timeHorizon: '30d' | '90d' | '180d';
}

// Recent article titles are used to calculate trend signals
export async function generateTrendReport(
  recentArticleTitles: string[],
  timeHorizon: '30d' | '90d' | '180d' = '90d'
): Promise<TrendReport> {
  const prompt = `You are a technology trend analyst for the AI industry with access to recent news signals.

Recent AI news signals (${recentArticleTitles.length} articles from the past week):
${recentArticleTitles.slice(0, 30).join('\n')}

Based on these signals, generate a trend prediction report as JSON:
{
  "topTrends": [
    {
      "technology": "e.g. AI Agents",
      "currentMomentum": <0-100>,
      "predictedGrowth30d": <percentage like 45>,
      "predictedGrowth90d": <percentage>,
      "predictedGrowth180d": <percentage>,
      "signals": ["Why this is trending - 3 specific signals from the news"],
      "riskFactors": ["What could slow it down"],
      "confidence": <0-100>,
      "category": "Infrastructure|Applications|Research|Tools|Policy",
      "investmentRecommendation": "strong_buy|buy|hold|watch|avoid"
    }
  ],
  "risingStars": ["Tech 1", "Tech 2", "Tech 3"],
  "declining": ["Tech losing momentum 1", "Tech 2"],
  "marketSummary": "3-sentence AI market summary based on current signals",
  "nextBigThing": "Single specific prediction for the next major breakthrough in ${timeHorizon}",
  "timeHorizon": "${timeHorizon}"
}

Include 8-10 trend predictions. Be specific and data-driven based on the signals.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.6,
    });

    const raw = completion.choices[0].message.content || '{}';
    const data = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());

    return {
      generatedAt: new Date().toISOString(),
      timeHorizon,
      ...data,
    };
  } catch (err) {
    console.error('Trend report generation failed:', (err as Error).message);
    return {
      generatedAt: new Date().toISOString(),
      topTrends: [],
      risingStars: [],
      declining: [],
      marketSummary: 'Unable to generate trend report at this time.',
      nextBigThing: '',
      timeHorizon,
    };
  }
}
