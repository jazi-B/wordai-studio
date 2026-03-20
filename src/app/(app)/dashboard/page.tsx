"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, BookOpen, BarChart2, 
  Home, Compass, User, Bell, 
  CheckCircle2, Clock, FileText, Sparkles,
  ChevronRight, ArrowUpRight, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ImportDocButton } from '@/components/dashboard/ImportDocButton';

const WordAIDashboard = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(6);
        
        if (!error && data) setDocuments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [user, supabase]);

  const stats = [
    { label: 'RESEARCH HOURS', value: '12.5h', change: '↗ +2.4h', color: 'text-emerald-500' },
    { label: 'AI SUGGESTIONS', value: documents.length > 0 ? '48' : '0', change: '✦ 12 new', color: 'text-blue-500' },
    { label: 'DOCS WRITTEN', value: documents.length, change: '↗ 12% increase', color: 'text-emerald-500' },
    { label: 'AVG. GRADE', value: 'A+', change: 'Academic Excellence', color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl uppercase italic">W</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ImportDocButton />
          <Link href="/editor/new">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-all hover:bg-blue-700 shadow-md shadow-blue-100">
              <Plus size={18} />
              <span>New Doc</span>
            </button>
          </Link>
          <div className="relative">
            <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center overflow-hidden">
               {user?.email ? (
                 <span className="text-[10px] font-bold text-gray-500">{user.email[0].toUpperCase()}</span>
               ) : (
                 <User className="h-5 w-5 text-gray-500" />
               )}
            </div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <section className="px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  {i === 0 ? <Clock size={14} /> : i === 1 ? <Sparkles size={14} /> : i === 2 ? <FileText size={14} /> : <BarChart2 size={14} />}
                </div>
                {stat.label}
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className={`${stat.color} text-[10px] font-bold`}>{stat.change}</div>
            </div>
          ))}
        </section>

        {/* Active Assignments */}
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800">Recent Assignments</h2>
            <Link href="/documents" className="text-blue-600 text-xs font-bold hover:underline">See all</Link>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">No documents found. Create your first assignment!</p>
              <Link href="/editor/new">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold px-6 text-white active:bg-blue-800">
                  + Start Writing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, idx) => (
                <div key={doc.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:border-blue-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate pr-2">{doc.title}</h3>
                    <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-500">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-tight">
                    <span>Word Count</span>
                    <span>{doc.word_count || 0} words</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000"
                      style={{ width: `${Math.min((doc.word_count / 2000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-6 flex justify-end">
                     <Link href={`/editor/${doc.id}`}>
                      <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowUpRight size={18} />
                      </div>
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-blue-600 transition-colors">
          <Home size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Dash</span>
        </Link>
        <Link href="/documents" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
          <FileText size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Library</span>
        </Link>
        <Link href="/editor/new" className="relative -top-6">
          <button className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-300 ring-4 ring-white transition-transform active:scale-90 hover:scale-110">
            <Plus size={28} />
          </button>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
          <Compass size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors">
          <User size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default WordAIDashboard;
