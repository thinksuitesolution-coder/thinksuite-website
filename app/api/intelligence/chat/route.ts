import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'build-placeholder' });

export async function POST(req: NextRequest) {
  const { message, conversationHistory = [] } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  const systemPrompt = `You are the ThinkSuite AI Intelligence Assistant, an expert analyst specializing in the AI industry.

You have deep knowledge of:
- All major AI companies (OpenAI, Anthropic, Google DeepMind, Meta, Microsoft, NVIDIA, xAI, Mistral, Cohere, etc.)
- AI models, capabilities, benchmarks, and comparisons
- AI funding, acquisitions, and market dynamics
- AI research papers and technical developments
- AI product strategy and business implications
- Developer tools, APIs, and frameworks
- AI policy, safety, and regulation

You are conversational, insightful, and always cite relevant companies/products when relevant.
You give structured, data-driven answers with specific numbers and comparisons when possible.
When unsure, you say so clearly.

Context: You're embedded in ThinkSuite's AI Intelligence Platform, a real-time AI news and analysis service.`;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user', content: message },
    ];

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      response,
      usage: completion.usage,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
