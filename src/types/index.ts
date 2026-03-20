// ========== Document Types ==========
export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: Record<string, unknown> | null;
  content_text: string;
  word_count: number;
  is_public: boolean;
  public_token: string | null;
  created_at: string;
  updated_at: string;
}

// ========== Chat Types ==========
export interface ChatMessage {
  id: string;
  document_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ========== User Settings ==========
export interface UserSettings {
  user_id: string;
  default_model: string;
  default_citation_style: string;
  custom_system_prompt: string | null;
  temperature: number;
  dark_mode: boolean;
  settings_json: Record<string, unknown> | null;
}

// ========== AI Types ==========
export type AIModel = 'gemini-2.0-flash' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'llama-3.3-70b' | 'gpt-4o' | 'claude-3-5-sonnet';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequestParams {
  messages: AIMessage[];
  model: AIModel;
  apiKey?: string;
  systemPrompt?: string;
  temperature?: number;
  stream?: boolean;
}

export type WriteAction =
  | 'rewrite'
  | 'fix-grammar'
  | 'improve'
  | 'shorten'
  | 'expand'
  | 'simplify'
  | 'formal'
  | 'creative'
  | 'translate'
  | 'summarize'
  | 'continue'
  | 'add-examples'
  | 'change-tone';

export interface WriteRequestParams {
  action: WriteAction;
  selectedText: string;
  prompt?: string;
  options?: {
    tone?: string;
    language?: string;
  };
}

export interface AssignmentRequestParams {
  topic: string;
  type: 'essay' | 'report' | 'research-paper' | 'case-study' | 'lab-report' | 'literature-review' | 'reflective-journal' | 'presentation-script';
  wordCount: number;
  level: 'high-school' | 'undergraduate' | 'postgraduate' | 'phd';
  citation: 'apa' | 'mla' | 'chicago' | 'harvard' | 'vancouver' | 'ieee';
  subject: string;
  keyPoints?: string;
}

// ========== Image Types ==========
export interface ImageResult {
  id: string;
  url: string;
  thumb: string;
  photographer: string;
  width: number;
  height: number;
  source: 'pexels' | 'unsplash' | 'pixabay';
  alt?: string;
}
