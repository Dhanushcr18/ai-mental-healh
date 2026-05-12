/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface AffirmationProps {
  text: string;
}

export default function Affirmation({ text }: AffirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-l-4 border-[#1D9E75] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-r-3xl my-6 flex flex-col gap-4 shadow-xl relative group"
      id="affirmation-card"
    >
      <div className="absolute top-4 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
        <Heart className="w-12 h-12 text-[#1D9E75] fill-[#1D9E75]" />
      </div>
      
      <div className="relative z-10">
        <h4 className="text-[10px] font-black text-[#1D9E75] dark:text-teal-400 uppercase tracking-[0.2em] mb-4">Personal Affirmation</h4>
        <p className="text-slate-800 dark:text-slate-200 font-serif italic text-xl md:text-2xl leading-snug">
          "{text}"
        </p>
      </div>
    </motion.div>
  );
}
