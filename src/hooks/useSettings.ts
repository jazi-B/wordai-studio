"use client";

import { useState, useCallback } from 'react';
import { AIModel } from '@/types';

interface SettingsState {
  defaultModel: AIModel;
  defaultCitationStyle: string;
  customSystemPrompt: string;
  temperature: number;
  darkMode: boolean;
  fontFamily: string;
  autoSaveInterval: number;
  targetWordCount: number;
  apiKeys: {
    gemini: string;
    groq: string;
    openai: string;
    anthropic: string;
    pexels: string;
    unsplash: string;
  };
}

const DEFAULT_SETTINGS: SettingsState = {
  defaultModel: 'gemini-2.0-flash',
  defaultCitationStyle: 'apa',
  customSystemPrompt: '',
  temperature: 0.7,
  darkMode: false,
  fontFamily: 'inter',
  autoSaveInterval: 30,
  targetWordCount: 1000,
  apiKeys: {
    gemini: '',
    groq: '',
    openai: '',
    anthropic: '',
    pexels: '',
    unsplash: '',
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem('wordai-settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  const updateSetting = useCallback(<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('wordai-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateApiKey = useCallback((provider: keyof SettingsState['apiKeys'], value: string) => {
    setSettings(prev => {
      const next = {
        ...prev,
        apiKeys: { ...prev.apiKeys, [provider]: value },
      };
      localStorage.setItem('wordai-settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem('wordai-settings');
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    updateApiKey,
    clearAllData,
  };
}
