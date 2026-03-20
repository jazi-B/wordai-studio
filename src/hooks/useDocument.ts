"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { debounce } from 'lodash';

export interface Document {
  id: string;
  title: string;
  content: string;
  content_text: string;
  word_count: number;
}

export function useDocument(documentId: string) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchDocument = useCallback(async () => {
    if (!documentId || documentId === 'demo-new' || documentId === 'demo-report') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (err) {
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  }, [documentId, supabase]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (id: string, updates: Partial<Document>) => {
        setSaving(true);
        try {
          const { error } = await supabase
            .from('documents')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);

          if (error) throw error;
        } catch (err) {
          console.error('Error saving document:', err);
        } finally {
          setSaving(false);
        }
      }, 2000),
    [supabase]
  );

  const saveDocument = useCallback(
    (updates: Partial<Document>) => {
      if (!documentId || documentId.startsWith('demo-') || !user) return;
      debouncedSave(documentId, updates);
    },
    [documentId, user, debouncedSave]
  );

  return {
    document,
    loading,
    saving,
    saveDocument,
    refresh: fetchDocument,
  };
}
