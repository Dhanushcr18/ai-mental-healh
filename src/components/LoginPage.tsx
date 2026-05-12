/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user?.email) {
        onLogin(user.email);
      }
    } catch (err) {
      console.error(err);
      setError("Sign in failed. Ensure you are using a verified account.");
    } finally {
      setIsLoading(false);
    }
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

        <div className="glass p-10 rounded-[2.5rem]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0f4a38] dark:text-teal-400">Welcome</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">Access your private space</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#1D9E75]/30 border-t-[#1D9E75] rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-[#1D9E75]" />
                  Sign in with Google
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>
            )}
            
            <div className="flex items-center gap-3 pt-4">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Experience Flow</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs text-center leading-relaxed px-4">
              Connect your account securely. Your reflections are protected and only accessible by you.
            </p>
          </div>

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
