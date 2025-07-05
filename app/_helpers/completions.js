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
  if (!frequency || frequency.type === 'daily') {
    // Original daily logic
    let longest = 1, current = 1, max = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) { current++; max = Math.max(max, current); }
      else if (diff > 1) { current = 1; }
    }
    const today = new Date();
    const last = dates[dates.length - 1];
    const diffToToday = Math.floor((today.setHours(0,0,0,0) - last.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    const currentStreak = diffToToday === 0 || diffToToday === 1 ? current : 0;
    return { current: currentStreak, longest: max };
  }

  if (frequency.type === 'weekly' && Array.isArray(frequency.daysOfWeek) && frequency.daysOfWeek.length === 1) {
    // Only support one weekday for now (e.g. every Monday)
    const targetDay = frequency.daysOfWeek[0];
    // Filter completions to only those on the correct weekday
    const filtered = dates.filter(d => d.getDay() === targetDay);
    if (filtered.length === 0) return { current: 0, longest: 0 };
    // Convert to ISO week numbers
    function getWeekYear(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
      return { year: d.getUTCFullYear(), week: weekNo };
    }
    const weekSet = filtered.map(getWeekYear);
    // Sort by year/week ascending
    weekSet.sort((a, b) => a.year !== b.year ? a.year - b.year : a.week - b.week);
    let longest = 1, current = 1, max = 1;
    for (let i = 1; i < weekSet.length; i++) {
      const prev = weekSet[i-1], curr = weekSet[i];
      const weekDiff = (curr.year - prev.year) * 52 + (curr.week - prev.week);
      if (weekDiff === 1) { current++; max = Math.max(max, current); }
      else if (weekDiff > 1) { current = 1; }
    }
    // Is streak ongoing? Last completion week = this week or last week
    const today = new Date();
    const thisWeek = getWeekYear(today);
    const last = weekSet[weekSet.length-1];
    const weekDiff = (thisWeek.year - last.year) * 52 + (thisWeek.week - last.week);
    const currentStreak = weekDiff === 0 || weekDiff === 1 ? current : 0;
    return { current: currentStreak, longest: max };
  }

  // Fallback: treat as daily
  let longest = 1, current = 1, max = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) { current++; max = Math.max(max, current); }
    else if (diff > 1) { current = 1; }
  }
  const today = new Date();
  const last = dates[dates.length - 1];
  const diffToToday = Math.floor((today.setHours(0,0,0,0) - last.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
  const currentStreak = diffToToday === 0 || diffToToday === 1 ? current : 0;
  return { current: currentStreak, longest: max };
}

