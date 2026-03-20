import { NextRequest, NextResponse } from 'next/server';
import { callAI, WRITE_ACTION_PROMPTS } from '@/lib/aiService';
import { AIModel, WriteAction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      selectedText,
      prompt,
      options,
      model = 'gemini-2.0-flash',
      apiKey,
      temperature = 0.7,
    } = body;

    if (!action || !selectedText) {
      return NextResponse.json({ error: 'action and selectedText are required' }, { status: 400 });
    }

    let userMessage = '';
    const writeAction = action as WriteAction;

    if (writeAction === 'translate' && options?.language) {
      userMessage = `Translate the following text to ${options.language}:\n\n${selectedText}`;
    } else if (writeAction === 'change-tone' && options?.tone) {
      userMessage = `Rewrite the following text in a ${options.tone} tone:\n\n${selectedText}`;
    } else if (WRITE_ACTION_PROMPTS[writeAction]) {
      userMessage = WRITE_ACTION_PROMPTS[writeAction] + selectedText;
    } else {
      userMessage = `${prompt || 'Transform'} the following text:\n\n${selectedText}`;
    }

    const result = await callAI({
      messages: [{ role: 'user', content: userMessage }],
      model: model as AIModel,
      apiKey,
      systemPrompt: 'You are an expert writing assistant. Return only the transformed text without any explanations or preamble.',
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
    const message = error instanceof Error ? error.message : 'Write action failed';
    console.error('AI Write Error:', message);
    const isUserError = message.includes('API key') || message.includes('required') || message.includes('not found');
    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
