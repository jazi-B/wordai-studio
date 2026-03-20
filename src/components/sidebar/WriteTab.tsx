"use client";

import { useState, useCallback } from "react";
import {
  Edit3, Check, Scissors, Expand, Sparkles, Lightbulb,
  BookOpen, PenLine, Award, Smile, FileText, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAI } from "@/hooks/useAI";
import { useSettings } from "@/hooks/useSettings";
import { AIModel } from "@/types";

interface WriteTabProps {
  selectedText?: string;
  onInsertText?: (text: string) => void;
}

export function WriteTab({ selectedText, onInsertText }: WriteTabProps) {
  const [writePrompt, setWritePrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [assignmentTopic, setAssignmentTopic] = useState('');
  const [assignmentType, setAssignmentType] = useState('essay');
  const [assignmentWords, setAssignmentWords] = useState(1000);
  const [assignmentLevel, setAssignmentLevel] = useState('undergraduate');
  const [assignmentCitation, setAssignmentCitation] = useState('apa');
  const [assignmentSubject, setAssignmentSubject] = useState('');
  const [assignmentKeyPoints, setAssignmentKeyPoints] = useState('');
  const [model, setModel] = useState<AIModel>('llama-3.3-70b');
  const { writeAction, generateAssignment, isLoading, error } = useAI();
  const { settings } = useSettings();

  const quickActions = [
    { action: 'rewrite', label: 'Rewrite', icon: Edit3 },
    { action: 'fix-grammar', label: 'Fix Grammar', icon: Check },
    { action: 'improve', label: 'Improve Clarity', icon: Lightbulb },
    { action: 'shorten', label: 'Make Shorter', icon: Scissors },
    { action: 'expand', label: 'Make Longer', icon: Expand },
    { action: 'simplify', label: 'Simplify', icon: BookOpen },
    { action: 'formal', label: 'Make Formal', icon: Award },
    { action: 'creative', label: 'Make Creative', icon: Smile },
    { action: 'summarize', label: 'Summarize', icon: FileText },
    { action: 'continue', label: 'Continue Writing', icon: PenLine },
    { action: 'add-examples', label: 'Add Examples', icon: Sparkles },
  ];

  const handleQuickAction = useCallback(async (action: string) => {
    if (!selectedText) return;
    setGeneratedText('');
    
    let actualAction = action;
    const options: Record<string, unknown> = {};
    
    if (action.startsWith('change-tone:')) {
      actualAction = 'change-tone';
      options.tone = action.split(':')[1];
    } else if (action.startsWith('translate:')) {
      actualAction = 'translate';
      options.language = action.split(':')[1];
    }

    const providerMap: Record<string, keyof typeof settings.apiKeys> = {
      'gemini-2.0-flash': 'gemini',
      'llama-3.3-70b': 'groq',
      'gpt-4o': 'openai',
      'claude-3-5-sonnet': 'anthropic'
    };
    const apiKey = settings.apiKeys[providerMap[model] || 'gemini'];

    try {
      const result = await writeAction(actualAction, selectedText, (text) => setGeneratedText(text), {
        apiKey,
        model,
        ...options
      });
      if (result) {
        setGeneratedText(result);
        window.dispatchEvent(new CustomEvent('ai-insert-content', { detail: { text: result } }));
        onInsertText?.(result);
      }
    } catch {
      // error handled in hook
    }
  }, [selectedText, writeAction, model, settings]);

  const handleWriteFromScratch = useCallback(async () => {
    if (!writePrompt.trim()) return;
    setGeneratedText('');
    
    const providerMap: Record<string, keyof typeof settings.apiKeys> = {
      'gemini-2.0-flash': 'gemini',
      'llama-3.3-70b': 'groq',
      'gpt-4o': 'openai',
      'claude-3-5-sonnet': 'anthropic'
    };
    const apiKey = settings.apiKeys[providerMap[model] || 'gemini'];

    try {
      const result = await writeAction('rewrite', writePrompt, (text) => setGeneratedText(text), {
        apiKey,
        model,
      });
      if (result) {
        setGeneratedText(result);
        window.dispatchEvent(new CustomEvent('ai-insert-content', { detail: { text: result } }));
        onInsertText?.(result);
      }
    } catch {
      // error handled in hook
    }
  }, [writePrompt, writeAction, model, settings]);

  const handleGenerateAssignment = useCallback(async () => {
    if (!assignmentTopic.trim()) return;
    setGeneratedText('');
    
    const providerMap: Record<string, keyof typeof settings.apiKeys> = {
      'gemini-2.0-flash': 'gemini',
      'llama-3.3-70b': 'groq',
      'gpt-4o': 'openai',
      'claude-3-5-sonnet': 'anthropic'
    };
    const apiKey = settings.apiKeys[providerMap[model] || 'gemini'];

    try {
      const result = await generateAssignment(
        {
          topic: assignmentTopic,
          type: assignmentType,
          wordCount: assignmentWords,
          level: assignmentLevel,
          citation: assignmentCitation,
          subject: assignmentSubject,
          keyPoints: assignmentKeyPoints,
          apiKey,
          model,
        },
        (text) => setGeneratedText(text)
      );
      if (result) {
        setGeneratedText(result);
        window.dispatchEvent(new CustomEvent('ai-insert-content', { detail: { text: result } }));
        onInsertText?.(result);
      }
    } catch {
      // error handled in hook
    }
  }, [assignmentTopic, assignmentType, assignmentWords, assignmentLevel, assignmentCitation, assignmentSubject, assignmentKeyPoints, generateAssignment, model, settings]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 space-y-5">
        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Quick Actions {selectedText ? '' : '(select text first)'}</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {quickActions.map(({ action, label, icon: Icon }) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                className="justify-start text-[11px] h-8 px-2 hover:border-blue-500 hover:text-blue-500 disabled:opacity-40"
                disabled={!selectedText || isLoading}
                onClick={() => handleQuickAction(action)}
              >
                <Icon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tone & Translate */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Change Tone</label>
            <Select 
              disabled={!selectedText || isLoading} 
              onValueChange={(tone) => handleQuickAction(`change-tone:${tone}`)}
            >
              <SelectTrigger className="text-xs h-8"><SelectValue placeholder="Tone" /></SelectTrigger>
              <SelectContent>
                {['Professional', 'Academic', 'Casual', 'Persuasive', 'Friendly'].map(t => (
                  <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Translate To</label>
            <Select 
              disabled={!selectedText || isLoading} 
              onValueChange={(lang) => handleQuickAction(`translate:${lang}`)}
            >
              <SelectTrigger className="text-xs h-8"><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent>
                {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Korean'].map(l => (
                  <SelectItem key={l} value={l.toLowerCase()}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Write From Scratch */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Write From Scratch</h3>
          <Textarea
            className="text-xs min-h-[60px] mb-2"
            placeholder="What do you want to write? Describe it here..."
            value={writePrompt}
            onChange={(e) => setWritePrompt(e.target.value)}
          />
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
            disabled={!writePrompt.trim() || isLoading}
            onClick={handleWriteFromScratch}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <PenLine className="h-3.5 w-3.5 mr-1" />}
            Generate
          </Button>
        </div>

        <Separator />

        {/* Assignment Builder */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            Assignment Builder
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Topic / Title</label>
              <Input className="text-xs h-8" placeholder="e.g. Impact of AI on Higher Education" value={assignmentTopic} onChange={(e) => setAssignmentTopic(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">AI Model</label>
                <Select value={model} onValueChange={(v) => setModel(v as AIModel)}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.3-70b">Llama 3.3 (Groq)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Type</label>
                <Select value={assignmentType} onValueChange={setAssignmentType}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="research-paper">Research Paper</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="lab-report">Lab Report</SelectItem>
                    <SelectItem value="literature-review">Literature Review</SelectItem>
                    <SelectItem value="reflective-journal">Reflective Journal</SelectItem>
                    <SelectItem value="presentation-script">Presentation Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Word Count</label>
                <Select value={String(assignmentWords)} onValueChange={(v) => setAssignmentWords(Number(v))}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[500, 1000, 1500, 2000, 2500, 3000].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Level</label>
                <Select value={assignmentLevel} onValueChange={setAssignmentLevel}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Citation</label>
                <Select value={assignmentCitation} onValueChange={setAssignmentCitation}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apa">APA 7th</SelectItem>
                    <SelectItem value="mla">MLA 9th</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="harvard">Harvard</SelectItem>
                    <SelectItem value="vancouver">Vancouver</SelectItem>
                    <SelectItem value="ieee">IEEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Subject / Discipline</label>
              <Input className="text-xs h-8" placeholder="e.g. Computer Science" value={assignmentSubject} onChange={(e) => setAssignmentSubject(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Key Points (optional)</label>
              <Textarea className="text-xs min-h-[50px]" placeholder="Arguments or points to include..." value={assignmentKeyPoints} onChange={(e) => setAssignmentKeyPoints(e.target.value)} />
            </div>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm"
              disabled={!assignmentTopic.trim() || isLoading}
              onClick={handleGenerateAssignment}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate Full Assignment
            </Button>
          </div>
        </div>

        {/* Status Message */}
        {isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3 animate-pulse">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium tracking-tight">AI is crafting your content...</span>
          </div>
        )}

        {!isLoading && generatedText && !error && (
             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                 <Check className="h-3.5 w-3.5 text-white" />
               </div>
               <span className="text-xs text-green-700 dark:text-green-300 font-medium tracking-tight italic">Done! Content has been added to your document.</span>
             </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-600 dark:text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
