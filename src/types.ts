/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalysisResult {
  mood: string;
  moodScore: number;
  clarity: number;
  confidence: number;
  emotionalPatterns: string;
  affirmation: string;
  suggestions: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  analysis: AnalysisResult;
}

export interface LocalUser {
  email: string;
  displayName?: string;
  photoURL?: string;
}
