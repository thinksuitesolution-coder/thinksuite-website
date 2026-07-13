import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title, summary, content, keyHighlights, whyItMatters, futurePrediction } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `Tu ek expert AI news journalist hai jo fluent hai Hinglish mein (Hindi + English mix).

Neeche diya gaya AI news article ko natural Hinglish mein translate kar.
Hinglish matlab: Roman script mein Hindi bolne ka tarika + English technical terms ko as-is rakhna.
Tone: casual, friendly, knowledgeable, jaise koi smart dost explain kar raha ho.

RULES:
- Technical terms (AI, LLM, GPT, API, model, dataset, etc.) English mein hi rakhna
- Company names, product names English mein rakhna
- Baaki sab Hinglish mein likhna (Roman script, Hindi words)
- Markdown formatting (##, ###, -, *) same rakhna
- FAQs, highlights sab translate karna
- Never use em dashes (—) or en dashes (–) anywhere in the translated output, use a comma or colon instead

ORIGINAL ARTICLE:
Title: ${title}
Summary: ${summary}
Content: ${content.slice(0, 3000)}
Key Highlights: ${(keyHighlights || []).join(' | ')}
Why It Matters: ${whyItMatters || ''}
Future Prediction: ${futurePrediction || ''}

Return ONLY this JSON (no extra text):
{
  "title": "Hinglish title yahan",
  "summary": "Hinglish summary yahan",
  "content": "Full Hinglish article in markdown (## headings, bullet points same rakho)",
  "keyHighlights": ["Highlight 1 Hinglish mein", "Highlight 2", "Highlight 3"],
  "whyItMatters": "Why it matters Hinglish mein",
  "futurePrediction": "Future prediction Hinglish mein"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text || '{}';
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json({ success: true, translated: data });
  } catch (err) {
    console.error('Translate error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
