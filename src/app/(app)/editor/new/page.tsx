"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function NewEditorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createDoc = async () => {
      if (authLoading) return;
      
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            title: 'Untitled Assignment',
            content_text: '',
            word_count: 0
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          router.replace(`/editor/${data.id}`);
        }
      } catch (err: any) {
        console.error('Failed to create document:', err);
        setError(err.message);
      }
    };

    createDoc();
  }, [user, authLoading, router, supabase]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <h1 className="text-xl font-black text-slate-800 mb-2">Editor Initialization Failed</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 animate-bounce">
            <span className="text-white font-black text-3xl uppercase italic">W</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Creating your workspace...</h2>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing WordAI Engine</p>
        </div>
        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
      </div>
    </div>
  );
}
