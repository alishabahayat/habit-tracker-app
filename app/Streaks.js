import { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HabitsContext } from './_contexts/HabitsContext';

export default function Streaks() {
  const { habits } = useContext(HabitsContext);

  return (
    <View>
      <Text>Favorites</Text>
      <FlatList
        data={habits.filter(h => h.favorite)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
