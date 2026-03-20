"use client";

import { useState, useCallback, useRef } from 'react';
import { AIMessage, AIModel } from '@/types';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const streamChat = useCallback(async (
    messages: AIMessage[],
    model: AIModel = 'gemini-2.0-flash',
    onChunk: (text: string) => void,
    options?: {
      apiKey?: string;
      systemPrompt?: string;
      temperature?: number;
    }
  ) => {
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('ai-loading-start'));
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model,
          ...options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(fullText);
      }

      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return '';
      const msg = err instanceof Error ? err.message : 'Request failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('ai-loading-stop'));
    }
  }, []);

  const writeAction = useCallback(async (
    action: string,
    selectedText: string,
    onChunk: (text: string) => void,
    options?: {
      model?: AIModel;
      apiKey?: string;
      temperature?: number;
      tone?: string;
      language?: string;
    }
  ) => {
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('ai-loading-start'));
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          selectedText,
          model: options?.model || 'gemini-2.0-flash',
          apiKey: options?.apiKey,
          temperature: options?.temperature,
          options: {
            tone: options?.tone,
            language: options?.language,
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(fullText);
      }

      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return '';
      const msg = err instanceof Error ? err.message : 'Request failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('ai-loading-stop'));
    }
  }, []);

  const generateAssignment = useCallback(async (
    params: Record<string, unknown>,
    onChunk: (text: string) => void,
  ) => {
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('ai-loading-start'));
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(fullText);
      }

      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return '';
      const msg = err instanceof Error ? err.message : 'Request failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('ai-loading-stop'));
    }
  }, []);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    window.dispatchEvent(new CustomEvent('ai-loading-stop'));
  }, []);

  return {
    streamChat,
    writeAction,
    generateAssignment,
    cancelRequest,
    isLoading,
    error,
  };
}
