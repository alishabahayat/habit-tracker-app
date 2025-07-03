import { View, Text, FlatList } from 'react-native';
import { useContext } from 'react';
import { HabitsContext } from '../_contexts/HabitsContext';

export default function Favorites() {
  const { habits } = useContext(HabitsContext); // get all habits

  const favoriteHabits = habits.filter(habit => habit.isFavorite);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Favorite Habits</Text>
      <FlatList
        data={favoriteHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ paddingVertical: 8 }}>{item.name}</Text>
        )}
      />
    </View>
  );
}
