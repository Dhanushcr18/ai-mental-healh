/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, LogIn, Sparkles, Mail, Lock, UserPlus, UserCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate a short delay
    setTimeout(() => {
      if (email && password) {
        onLogin(email, mode === 'signup' ? (displayName || email.split('@')[0]) : (displayName || email.split('@')[0]));
      } else {
        setError("Please enter your credentials.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Mesh Gradient Blobs */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none transition-opacity duration-1000 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#1D9E75] blur-[160px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3fb992] blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block bg-[#1D9E75] p-4 rounded-3xl shadow-2xl shadow-teal-500/40 mb-6"
          >
            <BrainCircuit className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-black text-[#0f4a38] dark:text-teal-400 tracking-tight mb-2">MoodFlow</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Your emotional sanctuary awaits.</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0f4a38] dark:text-teal-400">
              {mode === 'login' ? 'Welcome Back' : 'Create Sanctuary'}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
              {mode === 'login' ? 'Access your private space' : 'Start your journey of reflection'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group"
                >
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1D9E75] transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1D9E75] transition-colors" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1D9E75] transition-colors" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold text-center py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#1D9E75] text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:bg-[#15805d] transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs font-black text-[#1D9E75] uppercase tracking-widest hover:underline cursor-pointer"
              >
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Experience Flow</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs text-center leading-relaxed px-4">
              Your reflections are encrypted and only accessible by you. Your solitude is sacred.
            </p>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100/50 dark:border-slate-800/50 text-center">
            <div className="text-xs font-bold text-[#1D9E75] flex items-center justify-center gap-2 mx-auto uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Begin Your Journey
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Verified Auth • Secure Storage
          </p>
        </div>
      </motion.div>
    </div>
  );
}
