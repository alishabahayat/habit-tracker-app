import { useFocusEffect, useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from './_contexts/AuthContext';
import { HabitsContext } from './_contexts/HabitsContext';
import { calculateStreaks, getCompletionsForHabit } from './_helpers/completions';

function StreakBar({ current, longest }) {
  const percent = longest > 0 ? Math.min(100, Math.round((current / longest) * 100)) : 0;
  return (
    <View style={styles.barContainer}>
      <View style={[styles.bar, { width: `${percent}%` }]} />
      <Text style={styles.barLabel}>{percent}%</Text>
    </View>
  );
}

export default function Streaks() {
  const router = useRouter();
  const { habits } = useContext(HabitsContext);
  const { user } = useContext(AuthContext);
  const [habitStreaks, setHabitStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter habits by current user
  const userHabits = user && habits ? habits.filter(h => h.user_id === user.id) : [];
  if (!userHabits || userHabits.length === 0) {
    setHabitStreaks([]);
    setLoading(false);
    return;
  }

  // Always refresh streaks when screen is focused
useFocusEffect(
  React.useCallback(() => {
    let cancelled = false;
    async function fetchStreaks() {
      setLoading(true);
      if (!user) {
        setHabitStreaks([]);
        setLoading(false);
        return;
      }
      if (!userHabits || userHabits.length === 0) {
        setHabitStreaks([]);
        setLoading(false);
        return;
      }
      const streakData = await Promise.all(
        userHabits.map(async (habit) => {
          const completions = await getCompletionsForHabit(habit.id);
          const streaks = calculateStreaks(completions);
          return {
            ...habit,
            currentStreak: streaks.current,
            longestStreak: streaks.longest,
          };
        })
      );
      const validStreakData = streakData.filter(h => h && h.id && h.name);
      if (!cancelled) {
        setHabitStreaks(validStreakData);
        setLoading(false);
      }
    }
    fetchStreaks();
    return () => { cancelled = true; };
  }, [user, habits])
);



  if (!user) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#84AB66" />;
  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#84AB66" />;
  if (!habitStreaks.length) return <Text>No habits found for your account.</Text>;

  // Sort by current streak descending
  const sorted = [...habitStreaks].sort((a, b) => b.currentStreak - a.currentStreak);
  const withStreak = sorted.filter(h => h.currentStreak > 0);
  const noStreak = sorted.filter(h => h.currentStreak === 0);

  const renderHabit = (item) => (
    <View style={styles.habitRow}>
      <Text style={styles.habitTitle}>{item.emoji} {item.name}</Text>
      <View style={styles.streakInfoRow}>
        <Text style={[styles.streakText, { color: '#84AB66' }]}>Current: {item.currentStreak}d</Text>
        <Text style={styles.streakText}>Longest: {item.longestStreak}d</Text>
      </View>
      <StreakBar current={item.currentStreak} longest={item.longestStreak} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity onPress={() => router.replace('/Home')} style={styles.closeButton} hitSlop={{ top: 16, left: 16, right: 16, bottom: 16 }}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, marginBottom: 16, fontWeight: 'bold', color: '#718278', textAlign: 'center' }}>Streaks</Text>
        {withStreak.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, marginBottom: 8, color: '#84AB66', fontWeight: '600' }}>🔥 Active Streaks</Text>
            <FlatList
              data={withStreak}
              keyExtractor={item => item.id}
              renderItem={({ item }) => renderHabit(item)}
              scrollEnabled={false}
            />
          </View>
        )}
        {noStreak.length > 0 && (
          <View>
            <Text style={{ fontSize: 18, marginBottom: 8, color: '#bbb', fontWeight: '600' }}>No Active Streak</Text>
            <FlatList
              data={noStreak}
              keyExtractor={item => item.id}
              renderItem={({ item }) => renderHabit(item)}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 32,
    left: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  closeButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#718278',
    lineHeight: 40,
    textAlign: 'center',
  },
  habitRow: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  streakInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#718278',
    fontWeight: '500',
  },
  barContainer: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 14,
    backgroundColor: '#84AB66',
    borderRadius: 7,
  },
  barLabel: {
    position: 'absolute',
    right: 8,
    fontSize: 12,
    color: '#718278',
    fontWeight: 'bold',
  },
});
