"use client";

import { useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { importDocxAsHtml } from '@/lib/documentImporter';
import { Button } from '@/components/ui/button';

export function ImportDocButton() {
  const [importing, setImporting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const html = await importDocxAsHtml(file);
      const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

      // Create new document in Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert([{ 
          title, 
          content: html,
          word_count: html.split(/\s+/).length // Basic count
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) router.push(`/editor/${data.id}`);

    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import document. Please ensure it is a valid .docx file.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        onChange={handleFileChange}
        disabled={importing}
      />
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-white text-slate-600 px-4 py-2 rounded-full font-medium text-sm border-slate-200 transition-all hover:bg-slate-50 relative pointer-events-none shadow-sm"
      >
        {importing ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
        <span>{importing ? 'Importing...' : 'Import Word'}</span>
      </Button>
    </div>
  );
}
