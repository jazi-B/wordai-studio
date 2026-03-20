import { NextRequest, NextResponse } from 'next/server';
import { searchImages } from '@/lib/imageService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const source = (searchParams.get('source') || 'all') as 'pexels' | 'unsplash' | 'pixabay' | 'all';

    if (!query) {
      return NextResponse.json({ error: 'query parameter "q" is required' }, { status: 400 });
    }

    const images = await searchImages(query, page, source);

    return NextResponse.json({ images, total: images.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image search failed';
    console.error('Image Search Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
