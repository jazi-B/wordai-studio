import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/aiService';
import { AIModel } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      model = 'gemini-2.0-flash',
      apiKey,
      systemPrompt,
      temperature = 0.7,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    const result = await callAI({
      messages,
      model: model as AIModel,
      apiKey,
      systemPrompt: systemPrompt || 'You are a helpful AI writing assistant for students. Be concise, accurate, and helpful.',
      temperature,
      stream: true,
    });

    if (result instanceof ReadableStream) {
      return new Response(result, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return NextResponse.json({ content: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI request failed';
    console.error('AI Chat Error:', message);
    const isUserError = message.includes('API key') || message.includes('required') || message.includes('not found');
    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
