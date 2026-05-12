/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface JournalInputProps {
  text: string;
  date: string;
  onChange: (text: string) => void;
  onDateChange: (date: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function JournalInput({
  text,
  date,
  onChange,
  onDateChange,
  onSubmit,
  isLoading
}: JournalInputProps) {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const canSubmit = wordCount >= 10 && !isLoading;

  return (
    <div className="glass p-8 rounded-[2.5rem]" id="journal-input-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] block mb-1">Journal Entry</span>
          <h2 className="text-xl font-bold text-[#0f4a38] dark:text-teal-400">Begin Reflection</h2>
        </div>
        <div className="relative group">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 backdrop-blur-sm rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all appearance-none cursor-pointer shadow-sm"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1D9E75] transition-colors pointer-events-none" />
        </div>
      </div>

      <div className="relative mb-6">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's unfolding in your mind today? Let your thoughts flow without judgment..."
          className="w-full min-h-[300px] p-6 bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none font-serif"
          disabled={isLoading}
        />
        <div className="pt-4 border-t border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between">
          <span className={`text-[10px] font-black uppercase tracking-widest ${wordCount < 10 ? 'text-amber-500' : 'text-[#1D9E75]'}`}>
            Words: {wordCount}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {wordCount < 10 ? 'Need 10 words' : 'Ready for insight'}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
          canSubmit 
            ? 'bg-[#1D9E75] hover:bg-[#15805d] hover:shadow-[#1D9E75]/30 shadow-teal-500/20' 
            : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
        }`}
        id="analyze-btn"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Deconstructing emotions...
          </>
        ) : (
          'Analyze My Entry'
        )}
      </button>
    </div>
  );
}
