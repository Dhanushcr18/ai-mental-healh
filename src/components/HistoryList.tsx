/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Trash2 } from 'lucide-react';

interface Entry {
  id: string;
  date: string;
  text: string;
  analysis: {
    mood: string;
  };
}

interface HistoryListProps {
  entries: Entry[];
  onDelete: (id: string) => void;
}

export default function HistoryList({ entries, onDelete }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800" id="empty-history">
        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-slate-400 w-8 h-8" />
        </div>
        <h3 className="text-slate-600 dark:text-slate-300 font-medium">No entries yet</h3>
        <p className="text-slate-400 text-sm">Your journey starts with your first word.</p>
      </div>
    );
  }

  const getMoodColor = (mood: string) => {
    const m = mood.toLowerCase();
    if (['happy', 'grateful', 'joy', 'positive'].some(k => m.includes(k))) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
    if (['sad', 'lonely', 'grief', 'depressed'].some(k => m.includes(k))) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    if (['anxious', 'stressed', 'worried', 'fear'].some(k => m.includes(k))) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
    if (['angry', 'frustrated', 'rage'].some(k => m.includes(k))) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
    if (['neutral', 'calm'].some(k => m.includes(k))) return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="history-list">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass p-6 rounded-3xl hover:translate-y-[-4px] transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity -mr-8 -mt-8" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{formatDate(entry.date)}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-2 ring-white/20 dark:ring-slate-800/20 ${getMoodColor(entry.analysis.mood)}`}>
                {entry.analysis.mood}
              </div>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-700/50 shadow-sm"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-serif line-clamp-3 text-base leading-relaxed relative z-10 italic">
            "{entry.text}"
          </p>
        </motion.div>
      ))}
    </div>
  );
}
