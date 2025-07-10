// app/_helpers/completions.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETIONS_KEY = 'habitCompletions';

/**
 * Get all completions from AsyncStorage.
 * Returns an object: { [habitId]: [dateString, ...] }
 */
export async function getAllCompletions() {
  const raw = await AsyncStorage.getItem(COMPLETIONS_KEY);
  return raw ? JSON.parse(raw) : {};
}

/**
 * Get completions for a habit
 * @param {string} habitId
 * @returns {string[]} Array of ISO date strings
 */
export async function getCompletionsForHabit(habitId) {
  const all = await getAllCompletions();
  return all[habitId] || [];
}

/**
 * Mark a habit as completed for a given date (YYYY-MM-DD)
 * @param {string} habitId
 * @param {string} dateStr (YYYY-MM-DD)
 */
export async function markHabitCompleted(habitId, dateStr) {
  const all = await getAllCompletions();
  if (!all[habitId]) all[habitId] = [];
  if (!all[habitId].includes(dateStr)) {
    all[habitId].push(dateStr);
    await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
  }
}

/**
 * Unmark a habit as completed for a given date (YYYY-MM-DD)
 * @param {string} habitId
 * @param {string} dateStr (YYYY-MM-DD)
 */
export async function unmarkHabitCompleted(habitId, dateStr) {
  const all = await getAllCompletions();
  if (all[habitId]) {
    all[habitId] = all[habitId].filter(d => d !== dateStr);
    await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
  }
}

/**
 * Utility to check if a habit is completed for a given date
 * @param {string} habitId
 * @param {string} dateStr (YYYY-MM-DD)
 * @returns {Promise<boolean>}
 */
export async function isHabitCompleted(habitId, dateStr) {
  const completions = await getCompletionsForHabit(habitId);
  return completions.includes(dateStr);
}

/**
 * Calculate current streak and longest streak for a habit
 * @param {string[]} completions - Array of YYYY-MM-DD strings (sorted or unsorted)
 * @returns {{ current: number, longest: number }}
 */
// Calculate streaks with frequency support
// completions: array of YYYY-MM-DD strings
// frequency: {type: 'daily'|'weekly'|..., daysOfWeek: [0-6], ...}
export function calculateStreaks(completions, frequency) {
  if (!completions || completions.length === 0) return { current: 0, longest: 0 };
  // Sort dates ascending
  const dates = completions.map(d => new Date(d)).sort((a, b) => a - b);

  // Get the frequency in days (default to 1 for daily)
  const frequencyInDays = frequency?.type === 'weekly' 
    ? 7 // Weekly habits should be completed once per week
    : 1; // Default to daily

  // Calculate streaks based on frequency
  let longest = 1, current = 1, max = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    
    // If the difference is less than or equal to our frequency, continue the streak
    if (diff <= frequencyInDays) { 
      current++; 
      max = Math.max(max, current); 
    }
    // If the difference is more than our frequency, reset the streak
    else { 
      current = 1; 
    }
  }

  // Check if streak is ongoing
  const today = new Date();
  const last = dates[dates.length - 1];
  const diffToToday = Math.floor((today.setHours(0,0,0,0) - last.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
  
  // If the last completion was within our frequency period, keep the streak
  const currentStreak = diffToToday <= frequencyInDays ? current : 0;

  return { current: currentStreak, longest: max };
}

