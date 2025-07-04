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
export function calculateStreaks(completions) {
  if (!completions || completions.length === 0) return { current: 0, longest: 0 };
  // Sort dates ascending
  const dates = completions.map(d => new Date(d)).sort((a, b) => a - b);
  let longest = 1;
  let current = 1;
  let max = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      max = Math.max(max, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  // Check if streak is ongoing (last date is today or yesterday)
  const today = new Date();
  const last = dates[dates.length - 1];
  const diffToToday = Math.floor((today.setHours(0,0,0,0) - last.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
  const currentStreak = diffToToday === 0 || diffToToday === 1 ? current : 0;
  return { current: currentStreak, longest: max };
}
