"use client";

import { useState, useCallback } from 'react';
import { TiptapEditor } from './TiptapEditor';
import { useDocument } from '@/hooks/useDocument';

interface EditorPanelProps {
  documentId?: string;
  onSelectionChange?: (text: string) => void;
}

export function EditorPanel({ onSelectionChange, documentId = '' }: EditorPanelProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { document, saving, saveDocument } = useDocument(documentId);
  
  const handleUpdate = useCallback((html: string, text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
    
    // Auto-save to database
    saveDocument({ content_text: text, word_count: words });
  }, [saveDocument]);

  return (
    <section className="w-[70%] flex flex-col relative bg-gray-100 dark:bg-gray-950 overflow-hidden border-r border-gray-200 dark:border-gray-700 h-full">
      {/* Title Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shrink-0 h-14">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded p-1.5">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-md">
            {document?.title || 'Untitled Assignment'}
          </h1>
        </div>
      </div>

      <TiptapEditor
        onUpdate={handleUpdate}
        onSelectionChange={onSelectionChange}
        initialContent={document?.content_text}
      />

      {/* Status Bar */}
      <footer className="h-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium z-20 shrink-0">
        <div className="flex space-x-4">
          <span>Words: {wordCount}</span>
          <span>Chars: {charCount}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${saving ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} mr-1.5`}></div>
            {saving ? 'Saving...' : 'All changes saved'}
          </span>
          <span className="font-semibold">English (US)</span>
        </div>
      </footer>
    </section>
  );
}
