import { NextRequest, NextResponse } from 'next/server';
import { callAI, ASSIGNMENT_SYSTEM_PROMPT } from '@/lib/aiService';
import { AIModel } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      topic,
      type = 'essay',
      wordCount = 1000,
      level = 'undergraduate',
      citation = 'apa',
      subject = '',
      keyPoints = '',
      model = 'gemini-2.0-flash',
      apiKey,
      temperature = 0.7,
    } = body;

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const typeLabels: Record<string, string> = {
      'essay': 'Essay',
      'report': 'Report',
      'research-paper': 'Research Paper',
      'case-study': 'Case Study',
      'lab-report': 'Lab Report',
      'literature-review': 'Literature Review',
      'reflective-journal': 'Reflective Journal',
      'presentation-script': 'Presentation Script',
    };

    const levelLabels: Record<string, string> = {
      'high-school': 'High School',
      'undergraduate': 'Undergraduate',
      'postgraduate': 'Postgraduate',
      'phd': 'PhD',
    };

    const citationLabels: Record<string, string> = {
      'apa': 'APA 7th Edition',
      'mla': 'MLA 9th Edition',
      'chicago': 'Chicago',
      'harvard': 'Harvard',
      'vancouver': 'Vancouver',
      'ieee': 'IEEE',
    };

    const userPrompt = `Generate a complete ${typeLabels[type] || type} on the topic: "${topic}"

Requirements:
- Target word count: approximately ${wordCount} words
- Academic level: ${levelLabels[level] || level}
- Citation style: ${citationLabels[citation] || citation}
${subject ? `- Subject/Discipline: ${subject}` : ''}
${keyPoints ? `- Key arguments or points to include: ${keyPoints}` : ''}

Structure the assignment with:
1. Title Page (Title, Student Name placeholder, Date, Course placeholder)
2. ${type === 'research-paper' || type === 'report' ? 'Abstract' : ''}
3. Introduction with hook, background context, and thesis statement
4. Body sections (3-6 main sections) each with:
   - Proper heading
   - Topic sentence
   - Arguments with evidence placeholders [Citation]
   - Analysis and discussion
5. Conclusion with summary and final thought
6. References section (formatted in ${citationLabels[citation] || citation} style with placeholder entries)

Use proper markdown formatting with ## for main headings and ### for subheadings.
CRITICAL: You MUST write the actual content for each section in exhaustive detail. Do NOT just provide an outline or "placeholders". I want the final, ready-to-submit text with 3-5 full paragraphs per main section. Focus on depth and academic rigor.
Write the entire assignment now.`;

    const result = await callAI({
      messages: [{ role: 'user', content: userPrompt }],
      model: model as AIModel,
      apiKey,
      systemPrompt: ASSIGNMENT_SYSTEM_PROMPT,
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
    const message = error instanceof Error ? error.message : 'Assignment generation failed';
    console.error('Assignment Error:', message);
    const isUserError = message.includes('API key') || message.includes('required') || message.includes('not found');
    return NextResponse.json({ error: message }, { status: isUserError ? 400 : 500 });
  }
}
