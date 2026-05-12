/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JournalEntry } from '../App';

const ENTRIES_KEY = 'moodflow_entries';
const USER_KEY = 'moodflow_user';

export const storageService = {
  // User Profile
  saveUser: (user: { email: string; displayName?: string; photoURL?: string }) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  getUser: () => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Journal Entries
  saveEntry: (entry: JournalEntry) => {
    const entries = storageService.getEntries();
    const newEntries = [entry, ...entries];
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
    return newEntries;
  },

  getEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteEntry: (id: string) => {
    const entries = storageService.getEntries();
    const newEntries = entries.filter(e => e.id !== id);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
    return newEntries;
  }
};
