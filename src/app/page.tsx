"use client";

import Link from "next/link";
import { 
  Sparkles, Layout, 
  ArrowRight,
  Zap, FileText, Image as ImageIcon,
  Cpu, Shield, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-gradient text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/10 dark:border-gray-800/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="font-extrabold text-white text-xl">W</span>
            </div>
            <span className="font-bold text-2xl tracking-tight outfit">WordAI Studio</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#demo" className="hover:text-blue-500 transition-colors">Demo</a>
            <Link href="/editor/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/30">
                Launch Editor <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="hero-glow" />
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm animate-fade-in">
          <Zap className="h-4 w-4 fill-current" />
          <span>The Next Generation of Academic Writing</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.1] mb-8 text-gradient outfit tracking-tight">
          Write Smart.<br />Submit Better.
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          The all-in-one AI workspace designed for the modern student. 
          From <span className="text-blue-500 font-semibold font-serif italic">initial brainstorming</span> to 
          <span className="text-indigo-500 font-semibold font-serif italic"> final citations</span>, 
          WordAI Studio powers your academic journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
          <Link href="/editor/new">
            <Button size="lg" className="h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-2xl shadow-blue-500/40 hover:-translate-y-1 transition-all">
              Start Writing Free
            </Button>
          </Link>
          <a href="#demo">
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 border-gray-200 dark:border-gray-800 text-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
              Watch Demo
            </Button>
          </a>
        </div>

        {/* Floating Mockup Preview */}
        <div id="demo" className="relative max-w-5xl mx-auto group perspective-1000 scroll-mt-32">
          <div className="glass-card rounded-2xl p-2 transform rotate-x-6 hover:rotate-x-0 transition-all duration-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-blue-500/10 border-white/50">
            <div className="bg-gray-50 dark:bg-gray-950 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {/* Fake Sidebar Top */}
              <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-900">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto bg-gray-100 dark:bg-gray-800 px-12 py-1 rounded-md text-[10px] text-gray-400">
                  wordai-studio.app/editor/assignment-01
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex h-[400px]">
                <div className="w-16 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center py-4 space-y-4">
                  {[Sparkles, FileText, ImageIcon, Layout].map((Ico, i) => (
                    <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-blue-500/10 text-blue-500' : 'text-gray-400'}`}>
                      <Ico className="w-5 h-5" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white dark:bg-black p-12 overflow-hidden text-left font-serif">
                  <h2 className="text-3xl font-bold mb-6">The Impact of AI on Education</h2>
                  <p className="text-gray-400 mb-4 leading-loose">Artificial Intelligence has fundamentally reshaped the academic landscape...</p>
                  <p className="text-gray-400 leading-loose">By leveraging large language models, researchers are now capable of...</p>
                </div>
                <div className="w-64 border-l border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-4">
                  <div className="h-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center p-4">
                    <Sparkles className="w-8 h-8 text-blue-500 mb-2 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase text-gray-400">AI Assistant</p>
                    <p className="text-xs text-gray-500 mt-2 italic">&quot;Generating your assignment outline now...&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative bits */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/30 blur-[80px] -z-10" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/30 blur-[80px] -z-10" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold outfit mb-4 text-gradient">Everything you need to excel.</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Built from the ground up for academic integrity and creative freedom.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Sparkles, 
              title: "Intelligent Assistant", 
              desc: "A pro-active companion that writes, refines, and researches alongside you in real-time.",
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            { 
              icon: FileText, 
              title: "Drafting Mastery", 
              desc: "From complex essays to concise reports, generate high-quality drafts with a single click.",
              color: "text-indigo-500",
              bg: "bg-indigo-500/10"
            },
            { 
              icon: ImageIcon, 
              title: "Visual Assets", 
              desc: "Instantly find and insert copyright-free academic diagrams or illustrative imagery via web search.",
              color: "text-purple-500",
              bg: "bg-purple-500/10"
            },
            { 
              icon: Cpu, 
              title: "Model Selection", 
              desc: "Powered by Llama 3.3 (Groq) for lightning-fast, high-quality academic generation and reasoning.",
              color: "text-teal-500",
              bg: "bg-teal-500/10"
            },
            { 
              icon: Shield, 
              title: "Academic Honor", 
              desc: "Built-in checks and formal citation formatting (APA, MLA, Harvard) keep your work pristine.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            { 
              icon: Globe, 
              title: "Global Citations", 
              desc: "Translate and cite sources from across the world with seamless language support.",
              color: "text-amber-500",
              bg: "bg-amber-500/10"
            },
          ].map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group">
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="text-xl font-bold outfit mb-3">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -z-10" />
          
          <h2 className="text-4xl md:text-6xl font-bold outfit mb-8">Ready to graduate to<br />better writing?</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Join thousands of students who are already using AI to boost their productivity and academic success.
          </p>
          <Link href="/editor/new">
            <Button size="lg" className="h-16 px-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold shadow-xl shadow-blue-500/30">
              Launch Studio Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">W</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white outfit">WordAI Studio</span>
        </div>
        <div className="text-center md:text-left">
          © 2024 WordAI Studio. Designed for Academic Success. Built with Next.js & Groq.
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-500">Privacy</Link>
          <Link href="/" className="hover:text-blue-500">Terms</Link>
          <Link href="/" className="hover:text-blue-500">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
