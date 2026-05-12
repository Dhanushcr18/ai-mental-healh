/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, BarChart2, Activity, Info } from 'lucide-react';

interface AnalysisResult {
  mood: string;
  moodScore: number;
  clarity: number;
  confidence: number;
  emotionalPatterns: string;
  affirmation: string;
  suggestions: string[];
}

interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  text: string;
  analysis: AnalysisResult;
  timestamp: any; // Can be a timestamp object or number
}

interface InsightsDashboardProps {
  entries: JournalEntry[];
}

export default function InsightsDashboard({ entries }: InsightsDashboardProps) {
  // Process data for charts
  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp instanceof Date ? a.timestamp.getTime() : 0);
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp instanceof Date ? b.timestamp.getTime() : 0);
        return timeA - timeB; // Chronological order
      })
      .map(entry => {
        const date = new Date(entry.date);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: entry.analysis.moodScore,
          clarity: entry.analysis.clarity,
          confidence: entry.analysis.confidence,
        };
      });
  }, [entries]);

  const averages = useMemo(() => {
    if (entries.length === 0) return { mood: 0, clarity: 0, confidence: 0 };
    const sums = entries.reduce((acc, entry) => {
      acc.mood += entry.analysis.moodScore;
      acc.clarity += entry.analysis.clarity;
      acc.confidence += entry.analysis.confidence;
      return acc;
    }, { mood: 0, clarity: 0, confidence: 0 });
    
    return {
      mood: (sums.mood / entries.length).toFixed(1),
      clarity: (sums.clarity / entries.length).toFixed(1),
      confidence: (sums.confidence / entries.length).toFixed(1)
    };
  }, [entries]);

  if (entries.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-[2.5rem]">
        <div className="bg-teal-100 dark:bg-teal-900/40 p-4 rounded-full mb-4">
          <Info className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-xl font-bold text-[#0f4a38] dark:text-teal-400 mb-2">More Data Needed</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Continue journaling! We need at least 2 entries to build your emotional trends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="insights-dashboard">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 dark:bg-teal-900/40 p-2 rounded-xl">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Mood</span>
          </div>
          <div className="text-3xl font-black text-[#0f4a38] dark:text-teal-400">{averages.mood}<span className="text-lg text-slate-300 dark:text-slate-600 ml-1">/10</span></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-xl">
              <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Clarity</span>
          </div>
          <div className="text-3xl font-black text-[#0f4a38] dark:text-teal-400">{averages.clarity}<span className="text-lg text-slate-300 dark:text-slate-600 ml-1">/10</span></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-xl">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Confidence</span>
          </div>
          <div className="text-3xl font-black text-[#0f4a38] dark:text-teal-400">{averages.confidence}<span className="text-lg text-slate-300 dark:text-slate-600 ml-1">/10</span></div>
        </motion.div>
      </div>

      {/* Mood Trend Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-[2.5rem]"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0f4a38] dark:text-teal-400">Emotional Wellness Trend</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Mood scores over time</p>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }}
                dy={10}
              />
              <YAxis 
                domain={[0, 10]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--chart-tooltip-bg)', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 700 }}
              />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#1D9E75" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorMood)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Comparison Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass p-8 rounded-[2.5rem]"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0f4a38] dark:text-teal-400">Clarity vs Confidence</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Multi-dimensional analysis</p>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }}
                dy={10}
              />
              <YAxis 
                domain={[0, 10]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--chart-tooltip-bg)', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clarity" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
                animationDuration={2000}
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#f97316" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
                animationDuration={2000}
                animationBegin={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
