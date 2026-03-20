"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, ImagePlus, Sparkles } from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageResult } from "@/types";

interface ImagesTabProps {
  onInsertImage?: (url: string, alt: string) => void;
}

export function ImagesTab({ onInsertImage }: ImagesTabProps) {
  const [query, setQuery] = useState('');
  const [source] = useState<'unsplash' | 'pexels'>('unsplash');
  const [images, setImages] = useState<ImageResult[]>([
    {
      id: 'demo-1',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200',
      thumb: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=400',
      photographer: 'University Campus',
      source: 'unsplash',
      alt: 'University building',
      width: 1200,
      height: 800
    },
    {
      id: 'demo-2',
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200',
      thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400',
      photographer: 'Study Sessions',
      source: 'unsplash',
      alt: 'Student studying',
      width: 1200,
      height: 800
    },
    {
      id: 'demo-3',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200',
      thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400',
      photographer: 'Graduation',
      source: 'unsplash',
      alt: 'Graduation caps',
      width: 1200,
      height: 800
    }
  ]);
  const [isSearching, setIsSearching] = useState(false);

  // Define handleInsert at the top level
  const handleInsert = useCallback((img: ImageResult) => {
    onInsertImage?.(img.url, img.alt || img.photographer);
  }, [onInsertImage]);

  const searchImages = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(query)}&source=${source}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error('Image search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, [query, source]);

  const magicSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/images/quick?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        // The quick search returns { id, url, thumb, photographer, source, alt, width, height }
        if (data) {
          handleInsert(data as ImageResult);
        }
      }
    } catch (err) {
      console.error('Magic search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, [query, handleInsert]);

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden bg-white">
      {/* Search */}
      <div className="space-y-2 mb-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            className="pl-9 pr-4 text-xs h-9 rounded-full ring-blue-500"
            placeholder="What image do you need? (e.g. 'DNA structure')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchImages()}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            size="sm" 
            className="h-8 text-[11px] border-blue-200 text-blue-600 hover:bg-blue-50" 
            onClick={searchImages} 
            disabled={isSearching || !query.trim()}
          >
            Manual Search
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-[11px] bg-blue-500 hover:bg-blue-600 text-white font-bold" 
            onClick={magicSearch} 
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            Magic Auto-Insert
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 pr-2 pb-4">
          {images.length === 0 && !isSearching && (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-gray-400">
              <ImagePlus className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-xs">Search for images to insert</p>
            </div>
          )}
          {isSearching && (
            <div className="col-span-2 flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          )}
          {images.map((img) => (
            <div
              key={`${img.source || 'img'}-${img.id}`}
              className="relative group aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-blue-500 transition-colors"
            >
              <NextImage
                src={img.thumb}
                alt={img.alt || 'Image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 z-10">
                <p className="text-[9px] text-white truncate">{img.photographer}</p>
                <p className="text-[8px] text-white/70">{img.source}</p>
              </div>
              <div className="absolute inset-0 bg-blue-500/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                <Button
                  size="sm"
                  className="h-7 text-[10px] bg-white text-blue-600 hover:bg-gray-100 font-bold"
                  onClick={() => handleInsert(img)}
                >
                  Insert
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Upload Section */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-8 text-[11px]" 
          onClick={() => alert("Upload feature coming soon! Currently only web search is supported.")}
        >
          <Search className="w-3.5 h-3.5 mr-1.5" />
          Upload (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
