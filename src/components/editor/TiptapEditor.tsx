"use client";

import { useEffect, useState } from 'react';
import * as TiptapReact from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';

// Cast TiptapReact to any to avoid strict version mismatch issues during build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { useEditor, EditorContent, BubbleMenu, FloatingMenu } = TiptapReact as any;

import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { WordCountStatus } from '@/components/editor/WordCountStatus';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, Heading1, Heading2, 
  ImageIcon, Table as TableIcon, Search, Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TiptapEditorProps {
  onUpdate?: (html: string, text: string) => void;
  onSelectionChange?: (text: string) => void;
  initialContent?: string;
}

export function TiptapEditor({ onUpdate, onSelectionChange, initialContent }: TiptapEditorProps) {
  const [zoom, setZoom] = useState(1);
  const [showFind, setShowFind] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: 'bg-gray-100 dark:bg-gray-800 rounded p-4 font-mono text-sm' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic' } },
        horizontalRule: false,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Underline,
      Subscript,
      Superscript,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      FontFamily,
      Typography,
      CharacterCount,
      Focus.configure({ className: 'has-focus', mode: 'all' }),
      Placeholder.configure({ placeholder: 'Start typing your masterpiece...' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || `
      <h1>Untitled Research Paper</h1>
      <p><em>WordAI Studio - Student Edition</em></p>
      <p>Start typing your assignment here. Use the AI Assistant on the right to help you generate content, fix grammar, or find citations...</p>
    `,
    editorProps: {
      attributes: {
        class: 'page-a4 outline-none focus:outline-none min-h-[297mm] prose prose-sm max-w-none transition-all duration-300',
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: ({ editor }: { editor: any }) => {
      onUpdate?.(editor.getHTML(), editor.getText());
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelectionUpdate: ({ editor }: { editor: any }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        onSelectionChange?.(editor.state.doc.textBetween(from, to, ' '));
      }
    },
  });

  // Listen for rich animation/content insertion from Sidebar
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInsert = (e: any) => {
      if (!editor || !e.detail?.text) return;
      
      const markdownToHtml = (text: string) => {
        const lines = text.split('\n');
        let html = '';
        let inList = false;
        let listType: 'ul' | 'ol' | null = null;

        for (let line of lines) {
          line = line.trim();
          if (!line) {
            if (inList) { html += `</${listType}>`; inList = false; listType = null; }
            continue;
          }
          line = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

          if (line.startsWith('### ')) html += `<h3>${line.slice(4)}</h3>`;
          else if (line.startsWith('## ')) html += `<h2>${line.slice(3)}</h2>`;
          else if (line.startsWith('# ')) html += `<h1>${line.slice(2)}</h1>`;
          else if (line.startsWith('- ') || line.startsWith('* ')) {
            if (!inList || listType !== 'ul') { if (inList) html += `</${listType}>`; html += '<ul>'; inList = true; listType = 'ul'; }
            html += `<li>${line.slice(2)}</li>`;
          } else {
            if (inList) { html += `</${listType}>`; inList = false; listType = null; }
            html += `<p>${line}</p>`;
          }
        }
        if (inList) html += `</${listType}>`;
        return html;
      };

      editor.commands.focus();
      editor.commands.insertContent(markdownToHtml(e.detail.text));
    };

    window.addEventListener('ai-insert-content', handleInsert as EventListener);
    return () => window.removeEventListener('ai-insert-content', handleInsert as EventListener);
  }, [editor]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {editor && <EditorToolbar editor={editor} />}

      {/* Find & Replace Bar */}
      {showFind && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-2 flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Find..." 
              className="pl-9 h-8 text-xs bg-gray-50 dark:bg-gray-800 border-none rounded-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1 max-w-sm">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Replace with..." 
              className="pl-9 h-8 text-xs bg-gray-50 dark:bg-gray-800 border-none rounded-md" 
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs px-4 rounded-md">Replace All</Button>
          <Button size="sm" variant="ghost" className="h-8 rounded-md" onClick={() => setShowFind(false)}>×</Button>
        </div>
      )}

      {/* Ruler */}
      <div className="bg-white dark:bg-gray-800 h-6 border-b border-gray-200 dark:border-gray-700 flex items-center relative shrink-0 z-10">
        <div className="absolute left-1/2 -translate-x-1/2 w-[210mm] h-full flex items-end px-[25.4mm]">
          <div className="flex-1 border-l border-r border-gray-400 dark:border-gray-500 h-2 flex justify-between relative">
             {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="absolute text-[8px] text-gray-400" style={{ left: `${i * 10}%` }}>|</span>
             ))}
            <div className="absolute -left-1 bottom-0 cursor-pointer text-blue-500 text-[10px] drop-shadow-sm">▲</div>
            <div className="absolute -right-1 bottom-0 cursor-pointer text-blue-500 text-[10px] drop-shadow-sm">▲</div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 ml-4 rounded-md text-gray-400 hover:text-blue-500"
          onClick={() => setShowFind(!showFind)}
        >
          <Search className="h-3 w-3" />
        </Button>
      </div>

      {/* Editor Content Area */}
      <div 
        className="flex-1 overflow-y-auto editor-scroll pt-8 pb-32 flex flex-col items-center bg-gray-100 dark:bg-gray-950 transition-all duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {editor && BubbleMenu && (
          <>
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1 rounded-xl shadow-2xl backdrop-blur-xl">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="h-3.5 w-3.5" />
              </Button>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-3.5 w-3.5" />
              </Button>
            </BubbleMenu>

            <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex flex-col gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded-2xl shadow-2xl">
              <p className="text-[9px] font-black uppercase text-gray-400 px-2 py-1 tracking-widest">Quick Insert</p>
              <Button variant="ghost" className="justify-start h-9 gap-3 px-3 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className="h-4 w-4" /> <span className="text-xs font-bold">Heading 1</span>
              </Button>
              <Button variant="ghost" className="justify-start h-9 gap-3 px-3 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="h-4 w-4" /> <span className="text-xs font-bold">Heading 2</span>
              </Button>
              <Button variant="ghost" className="justify-start h-9 gap-3 px-3 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                <TableIcon className="h-4 w-4" /> <span className="text-xs font-bold">Table</span>
              </Button>
              <Button variant="ghost" className="justify-start h-9 gap-3 px-3 rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600" onClick={() => { const url = prompt('URL:'); if(url) editor.chain().focus().setImage({ src: url }).run(); }}>
                <ImageIcon className="h-4 w-4" /> <span className="text-xs font-bold">Image</span>
              </Button>
            </FloatingMenu>
          </>
        )}

        <EditorContent editor={editor} />
        
        <div className="w-[210mm] py-8 text-center opacity-30 select-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">End of Document</p>
          <p className="text-[8px] mt-1 font-medium">WordAI Studio - Professional Academic Edition</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 h-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 shrink-0">
        <WordCountStatus editor={editor} />
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

const Separator = ({ orientation, className }: { orientation: 'horizontal' | 'vertical', className?: string }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 ${orientation === 'vertical' ? 'w-px' : 'h-px'} ${className}`} />
);
