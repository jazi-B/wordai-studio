"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocCard {
  id: string;
  title: string;
  updatedAt: string;
  wordCount: number;
  preview: string;
}

const SAMPLE_DOCS: DocCard[] = [
  {
    id: 'demo-1',
    title: 'Impact of AI on Higher Education',
    updatedAt: '2 hours ago',
    wordCount: 2450,
    preview: 'The integration of artificial intelligence into academic research has revolutionized how students approach...',
  },
  {
    id: 'demo-2',
    title: 'Climate Policy Analysis',
    updatedAt: '1 day ago',
    wordCount: 1800,
    preview: 'This report examines the effectiveness of global climate policies...',
  },
  {
    id: 'demo-3',
    title: 'Shakespeare Literary Review',
    updatedAt: '3 days ago',
    wordCount: 3200,
    preview: 'A comprehensive analysis of thematic elements in Shakespeare\'s major tragedies...',
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const filteredDocs = SAMPLE_DOCS.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Documents</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredDocs.length} documents</p>
          </div>
          <Link href="/editor/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" /> New Document
            </Button>
          </Link>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Edited</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="words">Word Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New Document Card */}
          <Link href="/editor/new" className="group">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 h-48 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500">New Document</span>
            </div>
          </Link>

          {filteredDocs.map((doc) => (
            <Link key={doc.id} href={`/editor/${doc.id}`}>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-48 flex flex-col hover:shadow-lg hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <h3 className="font-semibold text-sm truncate group-hover:text-blue-500 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 line-clamp-3 flex-1 leading-relaxed">
                  {doc.preview}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center text-[10px] text-gray-400 space-x-3">
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{doc.updatedAt}</span>
                    <span>{doc.wordCount} words</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
