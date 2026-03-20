"use client";

import { useEffect, useState } from 'react';
import { type Editor } from '@tiptap/react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Target, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/hooks/useSettings';

interface WordCountStatusProps {
  editor: Editor | null;
  targetGoal?: number;
}

export function WordCountStatus({ editor }: WordCountStatusProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { settings, updateSettings } = useSettings();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(settings.targetWordCount.toString());

  const targetGoal = settings.targetWordCount || 1000;

  useEffect(() => {
    if (!editor) return;

    const updateCounts = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setCharCount(text.length);
    };

    editor.on('update', updateCounts);
    updateCounts(); // Initial count

    return () => {
      editor.off('update', updateCounts);
    };
  }, [editor]);

  const progress = Math.min((wordCount / targetGoal) * 100, 100);
  const isGoalReached = wordCount >= targetGoal;

  const handleGoalSubmit = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      updateSettings({ targetWordCount: newGoal });
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="h-10 bg-white border-t border-gray-100 px-4 flex items-center justify-between text-[11px] text-gray-500 font-medium shrink-0 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center space-x-6">
        <div className="flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
           <span className="font-black uppercase tracking-tighter text-slate-800">{wordCount.toLocaleString()} Words</span>
        </div>
        <span className="text-gray-200">|</span>
        <span className="font-bold opacity-60 uppercase tracking-widest text-[9px]">{charCount.toLocaleString()} Characters</span>
      </div>

      <div className="flex items-center space-x-4 w-[280px]">
        <div className="flex-1 flex flex-col space-y-1">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-400 font-black">
            <div className="flex items-center group cursor-pointer" onClick={() => !isEditingGoal && setIsEditingGoal(true)}>
              <Target className="w-3 h-3 mr-1 text-slate-400 group-hover:text-blue-500 transition-colors" />
              {isEditingGoal ? (
                <div className="flex items-center gap-1">
                  <Input 
                    autoFocus
                    className="h-4 w-16 text-[9px] p-1 border-blue-500 rounded-sm bg-blue-50 focus-visible:ring-0" 
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    onBlur={handleGoalSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleGoalSubmit()}
                  />
                </div>
              ) : (
                <span className="group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  Goal: {targetGoal}
                  <Edit2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </span>
              )}
            </div>
            <span className={isGoalReached ? "text-green-600" : "text-blue-600"}>{Math.round(progress)}% Complete</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5 bg-gray-100 overflow-hidden" 
            indicatorClassName={`transition-all duration-500 ${isGoalReached ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-blue-400 to-blue-600"}`} 
          />
        </div>
        {isGoalReached && (
          <div className="bg-green-50 p-1 rounded-full border border-green-100 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
        )}
      </div>
    </div>
  );
}
