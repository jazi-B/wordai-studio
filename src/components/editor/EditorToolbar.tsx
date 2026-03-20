"use client";

import { useState, useCallback } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon,
  Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Link2, Table as TableIcon,
  Strikethrough, FileDown, Printer, Eraser, ArrowUpDown,
  Layout, Scissors, Copy, Clipboard, FileText, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageSearchDialog } from './ImageSearchDialog';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [activeTab, setActiveTab] = useState('home');

  const setFontFamily = useCallback((font: string) => {
    const fontMap: Record<string, string> = {
      inter: 'Inter, sans-serif',
      arial: 'Arial, sans-serif',
      times: 'Times New Roman, serif',
      calibri: 'Calibri, sans-serif',
      georgia: 'Georgia, serif',
      mono: 'Courier New, monospace',
    };
    editor.chain().focus().setFontFamily(fontMap[font] || font).run();
  }, [editor]);

  const setFontSize = useCallback((size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: `${size}pt` }).run();
  }, [editor]);

  const setLineHeight = useCallback((height: string) => {
    const editorEl = document.querySelector('.ProseMirror') as HTMLElement;
    if (editorEl) editorEl.style.lineHeight = height;
  }, []);

  const setMargins = useCallback((value: string) => {
    const page = document.querySelector('.page-a4') as HTMLElement;
    if (page) {
      if (value === 'narrow') page.style.padding = '12.7mm';
      else if (value === 'normal') page.style.padding = '25.4mm';
      else if (value === 'wide') page.style.padding = '38.1mm';
    }
  }, []);

  const addImage = useCallback((url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt('Enter link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const ToolbarButton = ({ onClick, isActive, children, title, label, className }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
    label?: string;
    className?: string;
  }) => (
    <div className="flex flex-col items-center gap-0.5 group">
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:bg-slate-100 dark:hover:bg-gray-800 ${className}`}
        onClick={onClick}
        title={title}
      >
        {children}
      </Button>
      {label && <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{label}</span>}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex flex-col shrink-0 z-30 shadow-lg shadow-slate-100 dark:shadow-none">
      {/* Ribbon Tabs */}
      <div className="bg-slate-50 dark:bg-gray-900 px-2 flex items-center justify-between h-9">
        <Tabs defaultValue="home" onValueChange={setActiveTab} className="h-full">
          <TabsList className="bg-transparent border-none p-0 h-full gap-1">
            <TabsTrigger value="home" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full transition-all text-[10px] font-black uppercase tracking-widest px-4">Home</TabsTrigger>
            <TabsTrigger value="insert" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full transition-all text-[10px] font-black uppercase tracking-widest px-4">Insert</TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full transition-all text-[10px] font-black uppercase tracking-widest px-4">Layout</TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full transition-all text-[10px] font-black uppercase tracking-widest px-4">Export</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 pr-4 text-[10px] font-black text-slate-400">
           <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter shadow-sm font-black">Pro Edition</span>
        </div>
      </div>

      <div className="h-20 flex items-center p-2 gap-4 overflow-x-auto no-scrollbar bg-white dark:bg-gray-950">
        
        {activeTab === 'home' && (
          <>
            <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
              <div className="flex gap-1 h-full items-center">
                 <ToolbarButton onClick={() => {}} label="Paste" className="h-12 w-12"><Clipboard className="h-6 w-6" /></ToolbarButton>
                 <div className="flex flex-col gap-1 pr-2">
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded"><Scissors className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded"><Copy className="h-3 w-3" /></Button>
                 </div>
              </div>
              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Clipboard</span>
            </div>

            <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
               <div className="flex flex-col gap-2">
                 <div className="flex gap-2">
                    <Select defaultValue="inter" onValueChange={setFontFamily}>
                      <SelectTrigger className="h-7 w-[110px] text-[10px] font-bold bg-slate-50 dark:bg-gray-900 border-none rounded-lg shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="times">Times New Roman</SelectItem>
                        <SelectItem value="calibri">Calibri</SelectItem>
                        <SelectItem value="georgia">Georgia</SelectItem>
                        <SelectItem value="mono">Courier New</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="12" onValueChange={setFontSize}>
                       <SelectTrigger className="h-7 w-[50px] text-[10px] font-bold bg-slate-50 dark:bg-gray-900 border-none rounded-lg shadow-sm">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {['8', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="flex items-center gap-1">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><Bold className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><Italic className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}><UnderlineIcon className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}><Strikethrough className="h-3.5 w-3.5" /></ToolbarButton>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')}><Highlighter className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="h-3.5 w-3.5" /></ToolbarButton>
                 </div>
               </div>
               <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Font</span>
            </div>

            <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-1">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><List className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}><ListOrdered className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')}><CheckSquare className="h-3.5 w-3.5" /></ToolbarButton>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <ToolbarButton onClick={() => setLineHeight('1.15')} title="Standard Spacing"><ArrowUpDown className="h-3.5 w-3.5" /></ToolbarButton>
                 </div>
                 <div className="flex items-center gap-1">
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}><AlignLeft className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}><AlignCenter className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}><AlignRight className="h-3.5 w-3.5" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}><AlignJustify className="h-3.5 w-3.5" /></ToolbarButton>
                 </div>
              </div>
              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Paragraph</span>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex gap-2">
                 <Button variant="outline" className="h-11 flex flex-col items-start gap-0 px-3 py-1 bg-slate-50 border-none rounded-xl hover:bg-slate-100 transition-all font-black text-xs text-blue-600 focus:scale-95" onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
                   <span>AaBbCc</span>
                   <span className="text-[8px] uppercase tracking-tighter text-slate-400">Heading 1</span>
                 </Button>
                 <Button variant="outline" className="h-11 flex flex-col items-start gap-0 px-3 py-1 bg-slate-50 border-none rounded-xl hover:bg-slate-100 transition-all font-black text-xs text-slate-800 focus:scale-95" onClick={() => editor.chain().focus().setParagraph().run()}>
                   <span>AaBbCc</span>
                   <span className="text-[8px] uppercase tracking-tighter text-slate-400">Normal</span>
                 </Button>
              </div>
               <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Styles</span>
            </div>
          </>
        )}

        {activeTab === 'insert' && (
           <>
              <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
                 <div className="flex gap-3">
                    <ToolbarButton onClick={() => {}} label="New Page"><Plus className="h-6 w-6" /></ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Section"><FileText className="h-6 w-6" /></ToolbarButton>
                 </div>
                 <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Pages</span>
              </div>

              <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
                 <div className="flex gap-4 h-full items-center">
                    <ToolbarButton onClick={addTable} label="Table"><TableIcon className="h-6 w-6" /></ToolbarButton>
                    <div className="flex items-center">
                      <ImageSearchDialog onSelect={addImage} />
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Graphics</span>
                    </div>
                    <ToolbarButton onClick={addLink} label="Links"><Link2 className="h-6 w-6" /></ToolbarButton>
                 </div>
                 <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Illustrations</span>
              </div>
           </>
        )}

        {activeTab === 'layout' && (
           <>
              <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
                 <div className="flex gap-4">
                    <Select onValueChange={setMargins}>
                       <SelectTrigger className="h-12 w-[100px] flex flex-col items-center justify-center p-0 border-none bg-slate-50 dark:bg-gray-900 rounded-xl hover:bg-slate-100 shadow-sm">
                          <Layout className="h-5 w-5 text-blue-600 mb-1" />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Margins</span>
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="narrow">Narrow</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Page Setup</span>
              </div>
           </>
        )}

        {activeTab === 'export' && (
           <>
              <div className="flex flex-col h-full border-r border-slate-100 dark:border-gray-800 pr-4">
                 <div className="flex gap-4">
                    <ToolbarButton 
                      onClick={async () => {
                         const { exportToPdf } = await import('@/lib/exportService');
                         const title = 'Document';
                         const text = editor.getText();
                         const pdfData = await exportToPdf(title, text);
                         // Use unknown as target for Uint8Array to BlobPart conversion
                         const blob = new Blob([pdfData as unknown as BlobPart], { type: 'application/pdf' });
                         const url = URL.createObjectURL(blob);
                         const link = document.createElement('a'); link.href = url; link.download = `${title}.pdf`; link.click();
                         URL.revokeObjectURL(url);
                      }} 
                      label="PDF Print"
                    >
                      <Printer className="h-6 w-6 text-blue-600" />
                    </ToolbarButton>
                    <ToolbarButton 
                      onClick={async () => {
                         const { exportToDocx } = await import('@/lib/exportService');
                         const title = 'Document';
                         const text = editor.getText();
                         const docxBuffer = await exportToDocx(title, text);
                         // Convert docxBuffer to BlobPart precisely for strict TS environments like Vercel
                         const blob = new Blob([docxBuffer as unknown as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                         const url = URL.createObjectURL(blob);
                         const link = document.createElement('a'); link.href = url; link.download = `${title}.docx`; link.click();
                         URL.revokeObjectURL(url);
                      }} 
                      label="Word Doc"
                    >
                      <FileDown className="h-6 w-6 text-green-600" />
                    </ToolbarButton>
                 </div>
                 <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest text-center mt-auto">Finish</span>
              </div>
           </>
        )}

      </div>
    </div>
  );
}
