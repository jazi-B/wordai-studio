"use client";

import { useState } from "react";
import {
  FileText, Hash, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function FormatTab() {
  const [marginPreset, setMarginPreset] = useState('normal');
  const [lineSpacing, setLineSpacing] = useState('1.5');

  const templates = [
    { label: 'Academic Paper', value: 'academic' },
    { label: 'Business Report', value: 'business' },
    { label: 'Resume', value: 'resume' },
    { label: 'Cover Letter', value: 'cover-letter' },
    { label: 'Meeting Notes', value: 'meeting' },
    { label: 'Project Proposal', value: 'proposal' },
  ];

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 space-y-5">
        {/* Templates */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Document Templates</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {templates.map(t => (
              <Button key={t.value} variant="outline" size="sm" className="justify-start text-[11px] h-8 px-2 hover:border-blue-500">
                <FileText className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* TOC & Page Numbers */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Document Structure</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
              <BookOpen className="h-3.5 w-3.5 mr-2" />
              Generate Table of Contents
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8">
                <Hash className="h-3 w-3 mr-1" /> Page Numbers
              </Button>
              <Select defaultValue="bottom-center">
                <SelectTrigger className="text-[10px] h-8 w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-center">Top Center</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-center">Bottom Center</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Margins & Spacing */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Page Setup</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Margins</label>
              <Select value={marginPreset} onValueChange={setMarginPreset}>
                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (1&quot;)</SelectItem>
                  <SelectItem value="narrow">Narrow (0.5&quot;)</SelectItem>
                  <SelectItem value="wide">Wide (1.5&quot;)</SelectItem>
                  <SelectItem value="mirrored">Mirrored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Line Spacing</label>
              <Select value={lineSpacing} onValueChange={setLineSpacing}>
                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Single (1.0)</SelectItem>
                  <SelectItem value="1.15">1.15</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">Double (2.0)</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3">Triple (3.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Document Statistics</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Words</span><span className="font-semibold">—</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Characters</span><span className="font-semibold">—</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Sentences</span><span className="font-semibold">—</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Paragraphs</span><span className="font-semibold">—</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Reading Time</span><span className="font-semibold">—</span></div>
            <Separator className="my-1" />
            <div className="flex justify-between text-xs"><span className="text-gray-500">Readability (Flesch-Kincaid)</span><span className="font-semibold text-green-500">—</span></div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
