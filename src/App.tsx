/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine, History, Sparkles, BrainCircuit, LogOut, BarChart2, User as UserIcon, Sun, Moon } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';

import { auth, db, testConnection } from './lib/firebase';
import JournalInput from './components/JournalInput';
import MoodResult from './components/MoodResult';
import HistoryList from './components/HistoryList';
import LoginPage from './components/LoginPage';
import InsightsDashboard from './components/InsightsDashboard';
import ProfileSection from './components/ProfileSection';

// Types
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
  timestamp: number;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'history' | 'insights' | 'profile'>('write');
  const [journalText, setJournalText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Handle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  // Handle Auth State
  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Sync Entries with Firestore
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const path = 'entries';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data({ serverTimestamps: 'estimate' }),
        id: doc.id
      })) as JournalEntry[];
      setEntries(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const deleteEntry = async (id: string) => {
    const path = `entries/${id}`;
    try {
      await deleteDoc(doc(db, 'entries', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleSubmit = async () => {
    if (!journalText.trim() || !user) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Journal Entry Dated ${date}: ${journalText}` }]
          }
        ],
        config: {
          systemInstruction: "You are a compassionate mental health journal analyzer. Analyze the following entry and return a structured analysis of the user's mood, emotional patterns, and helpful suggestions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mood: { type: Type.STRING, description: "One word describing the primary mood." },
              moodScore: { type: Type.NUMBER, description: "Score from 1 to 10." },
              clarity: { type: Type.NUMBER, description: "Mental clarity score from 1 to 10." },
              confidence: { type: Type.NUMBER, description: "Confidence/Self-esteem score from 1 to 10." },
              emotionalPatterns: { type: Type.STRING, description: "2-3 sentences describing detected emotional patterns." },
              affirmation: { type: Type.STRING, description: "A warm, personalized affirmation." },
              suggestions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3 actionable mindful suggestions."
              },
            },
            required: ["mood", "moodScore", "clarity", "confidence", "emotionalPatterns", "affirmation", "suggestions"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setAnalysisResult(result);

      // Save to Firestore
      const path = 'entries';
      try {
        const docRef = doc(collection(db, path));
        await setDoc(docRef, {
          id: docRef.id,
          userId: user.uid,
          date,
          text: journalText,
          analysis: result,
          timestamp: serverTimestamp()
        });
        
        // Clear the form after successful save
        setJournalText('');
        // Keep analysis result visible if you want, or clear it
        // setAnalysisResult(null); 
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    } catch (err) {
      console.error(err);
      setError("AI analysis unavailable. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <LoginPage onLogin={() => {}} />; // Login handled by Firebase onSnapshot
  }

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Background Mesh Gradient Blobs */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1D9E75] blur-[140px] dark:opacity-20"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#3fb992] blur-[100px] dark:opacity-20"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#9eebd3] blur-[80px] dark:opacity-10"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1D9E75] p-2 rounded-xl shadow-lg shadow-teal-500/20">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-[#0f4a38]">
              MoodFlow <span className="hidden md:inline text-[10px] uppercase font-bold bg-[#1D9E75]/10 px-2 py-0.5 rounded text-[#1D9E75] ml-2">AI Powered</span>
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-white/60 dark:bg-slate-900/60 p-1 rounded-xl shadow-sm border border-white/40 dark:border-slate-800/40">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'write' 
                  ? 'bg-[#1D9E75] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <PenLine className="w-4 h-4" />
              Write Entry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'history' 
                  ? 'bg-[#1D9E75] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <History className="w-4 h-4" />
              Past Entries
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'insights' 
                  ? 'bg-[#1D9E75] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'profile' 
                  ? 'bg-[#1D9E75] text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all shadow-sm group"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Journaler</div>
                <div className="text-sm font-bold text-[#0f4a38] dark:text-teal-400 line-clamp-1 max-w-[150px]">{user.displayName || user.email?.split('@')[0]}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="group relative w-10 h-10 rounded-full bg-[#1D9E75]/20 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[#1D9E75] font-bold shadow-sm transition-all hover:bg-red-500 hover:text-white hover:border-red-400 dark:bg-slate-900"
                title="Sign Out"
              >
                <span className="group-hover:hidden uppercase text-xs">{(user.displayName || user.email || 'MU').substring(0, 2)}</span>
                <LogOut className="hidden group-hover:block w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            <motion.div
              key="write-tab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className={analysisResult ? "lg:col-span-12 xl:col-span-12" : "lg:col-span-12"}>
                <div className="mb-8 ml-2">
                  <h2 className="text-3xl md:text-5xl font-black text-[#0f4a38] dark:text-teal-400 tracking-tight mb-4">Reflect & Grow</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed text-lg italic">
                    "Your mind is a sanctuary. Reflection is its light."
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  <div className={analysisResult ? "xl:col-span-5" : "xl:col-span-12"}>
                    <JournalInput
                      text={journalText}
                      date={date}
                      onChange={setJournalText}
                      onDateChange={setDate}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />

                    {error && (
                      <div className="mt-6 glass bg-red-50/80 border-red-200 p-4 rounded-3xl text-red-600 text-sm font-semibold flex items-center gap-3">
                        <div className="bg-red-100 p-1.5 rounded-full">
                          <Sparkles className="w-4 h-4 text-red-500" />
                        </div>
                        {error}
                      </div>
                    )}
                  </div>

                  {analysisResult && (
                    <div className="xl:col-span-7">
                      <MoodResult result={analysisResult} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#0f4a38] dark:text-teal-400 tracking-tight">Your Journey</h2>
                  <p className="text-slate-400 font-medium tracking-tight uppercase text-xs font-bold">Moments captured in time.</p>
                </div>
                <div className="glass px-6 py-2 rounded-2xl flex items-center gap-3">
                  <History className="w-4 h-4 text-[#1D9E75]" />
                  <span className="text-sm font-bold text-[#0f4a38] dark:text-teal-400">
                    {entries.length} Reflections
                  </span>
                </div>
              </div>
              
              <HistoryList entries={entries} onDelete={deleteEntry} />
            </motion.div>
          ) : activeTab === 'insights' ? (
            <motion.div
              key="insights-tab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#0f4a38] dark:text-teal-400 tracking-tight">Emotional Trends</h2>
                  <p className="text-slate-400 font-medium tracking-tight uppercase text-xs font-bold">Deep visual patterns of your mind.</p>
                </div>
              </div>
              
              <InsightsDashboard entries={entries} />
            </motion.div>
          ) : (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#0f4a38] dark:text-teal-400 tracking-tight">User Profile</h2>
                  <p className="text-slate-400 font-medium tracking-tight uppercase text-xs font-bold">Manage your digital sanctuary identity.</p>
                </div>
              </div>
              
              <ProfileSection user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="flex items-center gap-2 bg-white/40 px-4 py-1.5 rounded-full border border-white/50 backdrop-blur-sm">Safe Space Encryption Active</span>
          <span className="hidden md:inline text-[#1D9E75]">•</span>
          <span className="flex items-center gap-2 bg-white/40 px-4 py-1.5 rounded-full border border-white/50 backdrop-blur-sm">AI Guidance (Not Therapy)</span>
          <span className="hidden md:inline text-[#1D9E75]">•</span>
          <span className="flex items-center gap-2 bg-white/40 px-4 py-1.5 rounded-full border border-white/50 backdrop-blur-sm">Local Storage Privacy</span>
        </div>
      </footer>
    </div>
  );
}
