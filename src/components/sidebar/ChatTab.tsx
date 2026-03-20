"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Copy, ArrowDownToLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAI } from "@/hooks/useAI";
import { useSettings } from "@/hooks/useSettings";
import { AIModel } from "@/types";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatTabProps {
  selectedText?: string;
}

export function ChatTab({ selectedText }: ChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your WordAI Assistant. I can help you research, write, or format your paper. What are we working on today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<AIModel>('llama-3.3-70b');
  const [streamingContent, setStreamingContent] = useState('');
  const { streamChat, isLoading, cancelRequest, error } = useAI();
  const { settings } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStreamingContent('');

    try {
      const aiMessages = messages
        .concat(userMsg)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const providerMap: Record<string, keyof typeof settings.apiKeys> = {
        'gemini-2.0-flash': 'gemini',
        'gemini-1.5-flash': 'gemini',
        'gemini-1.5-pro': 'gemini',
        'llama-3.3-70b': 'groq',
        'gpt-4o': 'openai',
        'claude-3-5-sonnet': 'anthropic'
      };
      const apiKey = settings.apiKeys[providerMap[model] || 'gemini'];

      const fullText = await streamChat(
        aiMessages,
        model,
        (text) => setStreamingContent(text),
        { apiKey }
      );

      if (fullText) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setStreamingContent('');
        
        // Auto-insert into document
        window.dispatchEvent(new CustomEvent('ai-insert-content', { 
          detail: { text: fullText } 
        }));
      }
    } catch {
      setStreamingContent('');
    }
  }, [input, isLoading, messages, model, streamChat]);

  const insertContext = useCallback(() => {
    if (selectedText) {
      setInput(prev => prev + `\n\n[Selected text from document]:\n"${selectedText}"`);
    }
  }, [selectedText]);

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Model Selector */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <Select value={model} onValueChange={(v) => setModel(v as AIModel)}>
          <SelectTrigger className="w-full text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="llama-3.3-70b">Llama 3.3 70B (Groq)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start space-x-3'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-2xl rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl rounded-tl-none'
              } p-3 text-sm`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyMessage(msg.content)} title="Copy">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <span className="text-[10px] text-blue-500 font-medium ml-auto italic">Added to document</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Streaming response */}
          {streamingContent && (
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {streamingContent}
                <span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse ml-0.5"></span>
              </div>
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

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 shrink-0 space-y-2">
        {selectedText && (
          <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={insertContext}>
            + Insert selection as context
          </Button>
        )}
        <div className="relative">
          <Textarea
            className="w-full min-h-[50px] resize-none pr-10 text-sm"
            placeholder="Ask AI anything..."
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 bottom-2 h-6 w-6 text-blue-500 hover:text-blue-600"
            onClick={isLoading ? cancelRequest : sendMessage}
            disabled={!input.trim() && !isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-gray-400" onClick={() => setMessages([])}>
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
