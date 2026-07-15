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

  if (!process.env.OPENAI_API_KEY) {
    console.error('[intelligence/chat] OPENAI_API_KEY is not set');
    return NextResponse.json({ error: 'AI Intelligence chat is not configured on this server.' }, { status: 500 });
  }

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
    console.error('[intelligence/chat] OpenAI request failed:', err);
    return NextResponse.json({ error: (err as Error).message || 'AI request failed' }, { status: 500 });
  }
}
