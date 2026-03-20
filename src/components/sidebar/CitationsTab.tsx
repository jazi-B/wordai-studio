"use client";

import { useState } from "react";
import { Search, Plus, BookOpen, Quote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/hooks/useSettings";

interface Citation {
  id: string;
  author: string;
  year: string;
  title: string;
  source: string;
  url?: string;
}

export function CitationsTab() {
  const [query, setQuery] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const { settings } = useSettings();

  const addCitation = () => {
    if (!query) return;
    // Demo behavior: just add a sample citation based on query
    const newCitation: Citation = {
      id: Date.now().toString(),
      author: "Smith, J.",
      year: "2024",
      title: query,
      source: "Journal of Research",
      url: "https://example.com"
    };
    setCitations([newCitation, ...citations]);
    setQuery("");
  };

  const generateReference = (c: Citation) => {
    if (settings.defaultCitationStyle === 'apa') {
      return `${c.author} (${c.year}). ${c.title}. ${c.source}.`;
    }
    return `${c.author}, ${c.title}, ${c.year}`;
  };

  const generateBibliography = () => {
    let bibliography = "\n\n# References\n\n";
    const sorted = [...citations].sort((a, b) => a.author.localeCompare(b.author));
    sorted.forEach(c => {
      bibliography += `${generateReference(c)}\n\n`;
    });
    
    window.dispatchEvent(new CustomEvent('ai-insert-content', { 
      detail: { text: bibliography } 
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 text-center tracking-widest">Academic Sources</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Cite a paper, book, or website..."
              className="pl-9 text-[11px] h-9 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCitation()}
            />
          </div>
          <Button size="sm" className="h-9 w-9 p-0 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-100 dark:shadow-none transition-all active:scale-90" onClick={addCitation}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {citations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 opacity-40">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter">Your library is empty</p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Add sources to build your bibliography and insert in-text citations.</p>
              </div>
            </div>
          ) : (
            citations.map((c) => (
              <div key={c.id} className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-900 group relative shadow-sm transition-all hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/40">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                    <Quote className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCitations(citations.filter(i => i.id !== c.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <h4 className="text-[11px] font-black text-gray-800 dark:text-gray-100 mb-1 leading-snug line-clamp-2">{c.title}</h4>
                <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                  <span>{c.author}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{c.year}</span>
                </div>
                
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-50 dark:border-gray-900">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-[9px] font-black uppercase tracking-widest rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                    onClick={() => {
                       window.dispatchEvent(new CustomEvent('ai-insert-content', { 
                        detail: { text: ` (${c.author}, ${c.year})` } 
                      }));
                    }}
                  >
                    Insert In-text Cite
                  </Button>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-6 text-[9px] py-0 text-slate-400 hover:text-blue-600 font-bold uppercase tracking-tighter"
                    onClick={() => {
                       window.dispatchEvent(new CustomEvent('ai-insert-content', { 
                        detail: { text: `\n\n${generateReference(c)}` } 
                      }));
                    }}
                  >
                    + Add Reference Entry
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {citations.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/50 backdrop-blur-sm shrink-0">
          <Button 
            className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] h-10 rounded-xl shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95"
            onClick={generateBibliography}
          >
            Generate Bibliography
          </Button>
        </div>
      )}
    </div>
  );
}
