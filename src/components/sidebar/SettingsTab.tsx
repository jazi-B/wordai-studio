"use client";

import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/useSettings";

import { verifyEndpoints } from "@/lib/test-api";

export function SettingsTab() {
  const { settings, updateSetting, updateApiKey, clearAllData } = useSettings();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [testResults, setTestResults] = useState<{ success: boolean; details: any } | null>(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = await verifyEndpoints();
    setTestResults(results as any);
    setTesting(false);
  };

  const apiKeyFields = [
    { key: 'gemini' as const, label: 'Google Gemini Key (Flash/Pro)', link: 'https://aistudio.google.com/app/apikey' },
    { key: 'groq' as const, label: 'Groq API Key (Llama 3.3)', link: 'https://console.groq.com/keys' },
    { key: 'openai' as const, label: 'OpenAI API Key (GPT-4o)', link: 'https://platform.openai.com/api-keys' },
    { key: 'anthropic' as const, label: 'Anthropic Key (Claude 3.5)', link: 'https://console.anthropic.com/' },
    { key: 'pexels' as const, label: 'Pexels API Key (for images)', link: 'https://www.pexels.com/api/' },
    { key: 'unsplash' as const, label: 'Unsplash Access Key (for images)', link: 'https://unsplash.com/developers' },
  ];

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4 space-y-5">
        {/* AI Preferences */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">AI Engine</h3>
          <div className="space-y-3">
             <div>
               <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Active AI Model</Label>
               <Select value={settings.defaultModel} onValueChange={(v) => updateSetting('defaultModel', v as any)}>
                 <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                   <SelectItem value="llama-3.3-70b">Llama 3.3 70B (Groq)</SelectItem>
                   <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                   <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>

        <Separator />

        {/* API Keys */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">API Keys</h3>
          <div className="space-y-3">
            {apiKeyFields.map(({ key, label, link }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">{label}</Label>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500 hover:text-blue-600 flex items-center gap-0.5">
                    Get Key <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <Input
                  type="password"
                  className="text-xs h-8 font-mono"
                  placeholder={`Enter ${key} key...`}
                  value={settings.apiKeys[key]}
                  onChange={(e) => updateApiKey(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* AI Preferences */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">AI Behavior</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Default Citation Style</Label>
              <Select value={settings.defaultCitationStyle} onValueChange={(v) => updateSetting('defaultCitationStyle', v)}>
                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apa">APA 7th</SelectItem>
                  <SelectItem value="mla">MLA 9th</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="harvard">Harvard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[10px] uppercase font-bold text-gray-500">
                  Temperature: {settings.temperature.toFixed(1)}
                </Label>
                <span className="text-[9px] text-gray-400">Creative ← → Precise</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Custom System Prompt</Label>
              <Textarea
                className="text-xs min-h-[60px]"
                placeholder="Optional: prepended to all AI requests..."
                value={settings.customSystemPrompt}
                onChange={(e) => updateSetting('customSystemPrompt', e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Editor Preferences */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Editor</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Font Preference</Label>
              <Select value={settings.fontFamily} onValueChange={(v) => updateSetting('fontFamily', v)}>
                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="calibri">Calibri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Auto-save Interval</Label>
              <Select value={String(settings.autoSaveInterval)} onValueChange={(v) => updateSetting('autoSaveInterval', Number(v))}>
                <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Target Word Count</Label>
              <Input
                type="number"
                className="text-xs h-8"
                value={settings.targetWordCount}
                onChange={(e) => updateSetting('targetWordCount', Number(e.target.value))}
                min={100}
                step={100}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Diagnostics */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">System Health</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs" 
            onClick={runTests}
            disabled={testing}
          >
            {testing ? "Testing..." : "Run API Diagnostics"}
          </Button>
          {testResults && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold tracking-wider">Chat (Groq)</span>
                <span className={testResults.details.chat ? "text-green-500" : "text-red-500"}>
                  {testResults.details.chat ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold tracking-wider">Write (Llama)</span>
                <span className={testResults.details.write ? "text-green-500" : "text-red-500"}>
                  {testResults.details.write ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 uppercase font-bold tracking-wider">Images (Web)</span>
                <span className={testResults.details.images ? "text-green-500" : "text-red-500"}>
                  {testResults.details.images ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Danger Zone */}
        <div>
          {!showConfirmClear ? (
            <Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => setShowConfirmClear(true)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Clear All Data
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-500 font-semibold">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={() => { clearAllData(); setShowConfirmClear(false); }}>
                  Yes, Clear
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
