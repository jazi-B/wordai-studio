"use client";

import { useState } from 'react';
import { Search, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createPexelsClient } from '@/lib/pexelsService'; // We'll create this next

interface ImageSearchDialogProps {
  onSelect: (url: string) => void;
}

export function ImageSearchDialog({ onSelect }: ImageSearchDialogProps) {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Direct fetch if possible, or via service
      const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=12`, {
         headers: {
           Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'your-fallback-key'
         }
      });
      const data = await res.json();
      setImages(data.photos || []);
    } catch (error) {
       console.error('Image search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded text-gray-600 dark:text-gray-300" title="Search Web Images">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[500px] flex flex-col p-0 overflow-hidden bg-white dark:bg-gray-950 border-none shadow-2xl rounded-3xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            Smart Image Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search for academic topics, diagrams, photos..." 
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Search'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
               <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full">
                 <ImageIcon className="h-10 w-10" />
               </div>
               <p className="text-xs font-bold uppercase tracking-widest">Find the perfect visual aid for your paper</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <div 
                  key={img.id} 
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:ring-4 ring-blue-500 transition-all group relative"
                  onClick={() => {
                    onSelect(img.src.large);
                    setOpen(false);
                  }}
                >
                  <img src={img.src.medium} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-black uppercase tracking-tighter backdrop-blur-md px-2 py-1 bg-white/10 rounded-lg">Select Image</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
