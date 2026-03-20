"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/login?message=Check your email to confirm your account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="max-w-md w-full glass-card rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold outfit mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join the next generation of academic writers</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@university.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-11 border-gray-200 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-11 border-gray-200 focus:ring-blue-500/20"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                Create Account <UserPlus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
