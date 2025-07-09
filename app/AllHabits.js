// app/AllHabits.js
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HabitsContext } from './_contexts/HabitsContext';

function HabitItem({ habit, onEdit }) {
  return (
    <TouchableOpacity
      style={styles.habitItem}
      onPress={() => {
        Alert.alert(
          'Habit Options',
          'What would you like to do?',
          [
            { text: 'Edit', onPress: onEdit },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }}
    >
      <View style={[styles.habitEmojiCircle, { backgroundColor: habit.color }]}>
        <Text style={styles.habitEmoji}>{habit.emoji}</Text>
      </View>
      <Text style={styles.habitText}>{habit.name}</Text>
    </TouchableOpacity>
  );
}

export default function AllHabits() {
  const { habits } = useContext(HabitsContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back to Home Button */}
      <TouchableOpacity
        onPress={() => router.replace('/Home')}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>All Habits</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onEdit={() => router.push(`/edit-habit?habitId=${habit.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#718278',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#F2E8DA',
    fontWeight: 'bold',
    fontSize: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  habitEmojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitText: {
    fontSize: 16,
    color: '#333',
  },
});
