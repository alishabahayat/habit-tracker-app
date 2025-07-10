//app/Streaks.js
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useContext, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';
import { HabitsContext } from './_contexts/HabitsContext';
import { calculateStreaks, getCompletionsForHabit } from './_helpers/completions';

function StreakBar({ current, longest }) {
  const pct = longest > 0 ? Math.min(100, Math.round((current / longest) * 100)) : 0;
  return (
    <View style={styles.barContainer}>
      <View style={[styles.barFill, { width: `${pct}%` }]} />
      <Text style={styles.barLabel}>{pct}%</Text>
    </View>
  );
}

export default function Streaks() {
  const router = useRouter();
  const habitsContext = useContext(HabitsContext);
  const authContext = useContext(AuthContext);
  const [habitStreaks, setHabitStreaks] = useState([]);
  const [loading, setLoading]           = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('Streaks page mounted');
    console.log('Auth Context:', authContext);
    console.log('Habits Context:', habitsContext);
  }, []);

  // Early return if contexts are not available
  if (!habitsContext || !authContext) {
    return null;
  }

  const { habits } = habitsContext;
  const { user } = authContext;

  // Load streak data on focus — no setState in render!
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function load() {
        setLoading(true);

        try {
          if (!user) {
            if (isActive) {
              setHabitStreaks([]);
              setLoading(false);
            }
            return;
          }

          const mine = habits.filter(h => h.user_id === user.id);
          if (mine.length === 0) {
            if (isActive) {
              setHabitStreaks([]);
              setLoading(false);
            }
            return;
          }

          console.log('Calculating streaks for habits:', mine.map(h => h.name));
          
          const data = await Promise.all(
            mine.map(async h => {
              try {
                const comps = await getCompletionsForHabit(h.id);
                console.log(`Completions for ${h.name}:`, comps);
                
                if (!Array.isArray(comps)) {
                  console.error(`Invalid completions format for ${h.name}:`, comps);
                  return { id: h.id, emoji: h.emoji, name: h.name, current: 0, longest: 0 };
                }

                const { current, longest } = calculateStreaks(comps, h.frequency);
                console.log(`Streaks for ${h.name}: current=${current}, longest=${longest}`);
                return { id: h.id, emoji: h.emoji, name: h.name, current, longest };
              } catch (error) {
                console.error(`Error calculating streaks for ${h.name}:`, error);
                return { id: h.id, emoji: h.emoji, name: h.name, current: 0, longest: 0 };
              }
            })
          );

          if (isActive) {
            setHabitStreaks(data);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error in load function:', error);
          if (isActive) {
            setHabitStreaks([]);
            setLoading(false);
          }
        }
      }
      load();
      return () => { isActive = false; };
    }, [habits, user])
  );

  // ─── Early returns ───
  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#84AB66" />
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#84AB66" />
      </View>
    );
  }
  if (habitStreaks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No habits found for your account.</Text>
      </View>
    );
  }
  // ─────────────────────

  // Sort & split
  const sorted   = [...habitStreaks].sort((a,b) => b.current - a.current);
  const active   = sorted.filter(h => h.current  > 0);
  const inactive = sorted.filter(h => h.current === 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.habitTitle}>{item.emoji} {item.name}</Text>
      <View style={styles.infoRow}>
        <Text style={[styles.infoText, styles.activeText]}>Current: {item.current}d</Text>
        <Text style={styles.infoText}>Longest: {item.longest}d</Text>
      </View>
      <StreakBar current={item.current} longest={item.longest} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.replace('/Home')}
        hitSlop={{ top:16, bottom:16, left:16, right:16 }}
      >
        <Image
          source={require('../assets/images/X Button.png')}
          style={{ width: 32, height: 32 }}
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Streaks</Text>

        {active.length > 0 && (
          <>
            <Text style={styles.sectionActive}>🔥 Active Streaks</Text>
            <FlatList
              data={active}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </>
        )}

        {inactive.length > 0 && (
          <>
            <Text style={styles.sectionInactive}>No Active Streak</Text>
            <FlatList
              data={inactive}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  content: {
    flexGrow: 1,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 64,
    marginBottom: 24,
  },
  sectionActive: {
    fontSize: 18,
    fontWeight: '600',
    color: '#84AB66',
    marginBottom: 16,
  },
  sectionInactive: {
    fontSize: 18,
    fontWeight: '600',
    color: '#718278',
    marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
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
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#718278',
    fontWeight: '500',
  },
  activeText: {
    color: '#84AB66',
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
  barFill: {
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#718278',
    textAlign: 'center',
  },
});