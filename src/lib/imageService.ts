import { ImageResult } from '@/types';

// ========== Pexels ==========
async function searchPexels(query: string, page: number = 1, apiKey: string): Promise<ImageResult[]> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}`,
    { headers: { Authorization: apiKey } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.photos || []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    url: (p as { src: { large: string } }).src.large,
    thumb: (p as { src: { medium: string } }).src.medium,
    photographer: String(p.photographer || 'Unknown'),
    width: Number(p.width),
    height: Number(p.height),
    source: 'pexels' as const,
    alt: String(p.alt || ''),
  }));
}

// ========== Unsplash ==========
async function searchUnsplash(query: string, page: number = 1, apiKey: string): Promise<ImageResult[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&page=${page}`,
    { headers: { Authorization: `Client-ID ${apiKey}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    url: (p as { urls: { regular: string } }).urls.regular,
    thumb: (p as { urls: { thumb: string } }).urls.thumb,
    photographer: (p as { user: { name: string } }).user?.name || 'Unknown',
    width: Number(p.width),
    height: Number(p.height),
    source: 'unsplash' as const,
    alt: String((p as { alt_description?: string }).alt_description || ''),
  }));
}

// ========== Pixabay ==========
async function searchPixabay(query: string, page: number = 1, apiKey: string): Promise<ImageResult[]> {
  const res = await fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=20&page=${page}&image_type=photo`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits || []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    url: String(p.largeImageURL || ''),
    thumb: String(p.previewURL || ''),
    photographer: String(p.user || 'Unknown'),
    width: Number(p.imageWidth),
    height: Number(p.imageHeight),
    source: 'pixabay' as const,
    alt: String(p.tags || ''),
  }));
}

// ========== Unified Search ==========
export async function searchImages(
  query: string,
  page: number = 1,
  source: 'pexels' | 'unsplash' | 'pixabay' | 'all' = 'all'
): Promise<ImageResult[]> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const pixabayKey = process.env.PIXABAY_API_KEY;

  const promises: Promise<ImageResult[]>[] = [];

  if ((source === 'all' || source === 'pexels') && pexelsKey) {
    promises.push(searchPexels(query, page, pexelsKey));
  }
  if ((source === 'all' || source === 'unsplash') && unsplashKey) {
    promises.push(searchUnsplash(query, page, unsplashKey));
  }
  if ((source === 'all' || source === 'pixabay') && pixabayKey) {
    promises.push(searchPixabay(query, page, pixabayKey));
  }

  if (promises.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(promises);
  const images: ImageResult[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      images.push(...result.value);
    }
  }

  // Shuffle results from multiple sources
  if (source === 'all') {
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
  }

  return images;
}

export async function getFirstImage(query: string): Promise<ImageResult | null> {
  const images = await searchImages(query, 1, 'all');
  return images.length > 0 ? images[0] : null;
}
