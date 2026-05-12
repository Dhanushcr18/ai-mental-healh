/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import MoodScoreBar from './MoodScoreBar';
import Affirmation from './Affirmation';
import { Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface AnalysisResult {
  mood: string;
  moodScore: number;
  clarity: number;
  confidence: number;
  emotionalPatterns: string;
  affirmation: string;
  suggestions: string[];
}

interface MoodResultProps {
  result: AnalysisResult;
}

export default function MoodResult({ result }: MoodResultProps) {
  const getMoodStyles = (mood: string) => {
    const m = mood.toLowerCase();
    if (['happy', 'grateful', 'joy', 'positive'].some(k => m.includes(k))) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 ring-green-500/20';
    if (['sad', 'lonely', 'grief', 'depressed'].some(k => m.includes(k))) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 ring-blue-500/20';
    if (['anxious', 'stressed', 'worried', 'fear'].some(k => m.includes(k))) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 ring-orange-500/20';
    if (['angry', 'frustrated', 'rage'].some(k => m.includes(k))) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 ring-red-500/20';
    if (['neutral', 'calm'].some(k => m.includes(k))) return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ring-slate-500/20';
    return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50 ring-purple-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
      id="mood-result-display"
    >
      <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75] rounded-full blur-3xl -mr-16 -mt-16 opacity-10" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Sparkles className="text-[#1D9E75] w-4 h-4" />
                Mood Analysis
              </h2>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ring-4 inline-block ${getMoodStyles(result.mood)}`}>
                  {result.mood}
                </div>
                <span className="text-slate-400 text-xs italic font-medium tracking-tight">AI Detected Sentiment</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-4xl font-black text-[#0f4a38] dark:text-teal-400 leading-none">{result.moodScore || '—'}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mood Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            <MoodScoreBar label="Mental Clarity" value={result.clarity} />
            <MoodScoreBar label="Self Confidence" value={result.confidence} />
          </div>

          <div className="space-y-8">
            <section className="bg-white/30 dark:bg-slate-900/30 p-4 rounded-2xl border border-white/40 dark:border-slate-800/40">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-[#1D9E75]" />
                Emotional Pattern detected
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg italic">
                {result.emotionalPatterns}
              </p>
            </section>

            <Affirmation text={result.affirmation} />

            <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="text-xs font-bold text-[#0f4a38] dark:text-teal-400 uppercase tracking-widest mb-6 border-b border-teal-100 dark:border-teal-900/30 pb-4">Nurturing Next Steps</h3>
              <ul className="grid grid-cols-1 md:grid-cols-1 gap-5">
                {result.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1D9E75]/10 dark:bg-[#1D9E75]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#1D9E75] transition-colors">
                      <div className="w-2 h-2 bg-[#1D9E75] rounded-full group-hover:bg-white" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
