/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface MoodScoreBarProps {
  label: string;
  value: number;
}

export default function MoodScoreBar({ label, value }: MoodScoreBarProps) {
  const percentage = (value / 10) * 100;

  return (
    <div className="mb-4" id={`score-bar-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">{label}</span>
        <span className="text-xs font-bold text-[#1D9E75] dark:text-teal-400">{value}/10</span>
      </div>
      <div className="w-full bg-slate-200/50 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="bg-[#1D9E75] h-full rounded-full shadow-[0_0_12px_rgba(29,158,117,0.5)]"
        />
      </div>
    </div>
  );
}
