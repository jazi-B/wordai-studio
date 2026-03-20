import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';
import { AIRequestParams } from '@/types';

// ========== Prompt Templates ==========
export const ASSIGNMENT_SYSTEM_PROMPT = `You are an expert academic writer and university professor. Generate a complete, well-structured academic assignment on the given topic.

Requirements:
- Use formal academic English throughout
- Proper paragraph structure with clear topic sentences
- Evidence-based arguments (use [Citation] placeholders where references are needed)
- Appropriate academic vocabulary for the level specified
- Logical flow and coherence between sections
- Correct formatting for the citation style specified

Return the assignment as well-formatted text with proper markdown headings. 
Rules:
- Use # for the main title
- Use ## for main sections
- Use ### for subsections
- Use **Bold** for emphasis and important terms
- Use bullet points (-) for lists
- Do not use markdown code blocks; return raw text with markdown formatting markers.`;

export const WRITE_ACTION_PROMPTS: Record<string, string> = {
  'rewrite': 'Rewrite the following text while maintaining its meaning but improving the wording:\n\n',
  'fix-grammar': 'Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text:\n\n',
  'improve': 'Improve the clarity and readability of the following text:\n\n',
  'shorten': 'Make the following text more concise while keeping all key points:\n\n',
  'expand': 'Expand and elaborate on the following text with more detail, examples, and depth:\n\n',
  'simplify': 'Simplify the following text so it is easier to understand:\n\n',
  'formal': 'Rewrite the following text in a formal academic tone:\n\n',
  'creative': 'Rewrite the following text in a more creative and engaging style:\n\n',
  'summarize': 'Provide a concise summary of the following text:\n\n',
  'continue': 'Continue writing from where the following text ends, maintaining the same style and topic:\n\n',
  'add-examples': 'Add relevant examples and evidence to support the following text:\n\n',
  'generate-assignment': `Generate a comprehensive academic assignment based on the following topic and requirements. 
Include:
1. An engaging title (#)
2. An abstract or introduction with a clear thesis statement (##)
3. Multiple structured body paragraphs with evidence-based arguments (## and ###)
4. A critical analysis of the topic
5. A concise conclusion (##)
6. Use sophisticated academic English throughout.

Topic and Requirements:\n\n`,
};

export async function callAI(params: AIRequestParams): Promise<ReadableStream | string> {
  const {
    messages,
    model,
    apiKey,
    systemPrompt,
    temperature = 0.7,
    stream = true,
  } = params;

  const allMessages: CoreMessage[] = messages.map(m => ({
    role: m.role as 'system' | 'user' | 'assistant',
    content: m.content,
  }));

  if (systemPrompt && !allMessages.some(m => m.role === 'system')) {
    allMessages.unshift({ role: 'system', content: systemPrompt });
  }

  try {
    let providerModel;

    if (model.startsWith('gemini')) {
      const key = apiKey || process.env.GOOGLE_AI_API_KEY;
      if (!key) throw new Error('Missing Google Gemini API Key. Please add it in Settings tab.');
      const googleProvider = createGoogleGenerativeAI({ apiKey: key }); 
      providerModel = googleProvider(model === 'gemini-2.0-flash' ? 'gemini-2.0-flash-001' : 'gemini-1.5-flash');
    } else if (model === 'llama-3.3-70b') {
      const key = apiKey || process.env.GROQ_API_KEY;
      if (!key || key === 'your-groq-key-here') throw new Error('Missing Groq API Key. Please add it in Settings tab.');
      const groqProvider = createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: key }); 
      providerModel = groqProvider('llama-3.3-70b-versatile');
    } else {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) throw new Error(`Missing API Key for model ${model}. Please add it in Settings tab.`);
      const genericProvider = createOpenAI({ apiKey: key });
      providerModel = genericProvider(model);
    }

    if (stream) {
      const result = await streamText({
        model: providerModel,
        messages: allMessages,
        temperature,
      });
      // Convert textStream to ReadableStream<Uint8Array> for consistency
      return result.textStream.pipeThrough(new TextEncoderStream());
    } else {
      const { text } = await streamText({
        model: providerModel,
        messages: allMessages,
        temperature,
      });
      return text;
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`AI calling error [${model}]:`, error);
    throw new Error(error.message || 'AI service unavailable');
  }
}
