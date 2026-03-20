import { NextRequest, NextResponse } from 'next/server';
import { getFirstImage } from '@/lib/imageService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const data = await getFirstImage(query);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
