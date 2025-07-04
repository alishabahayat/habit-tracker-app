import { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HabitsContext } from './_contexts/HabitsContext';

export default function Streaks() {
  const { habits } = useContext(HabitsContext);

  if (!habits) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Streaks</Text>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16 }}>{item.emoji} {item.name}</Text>
            {/* You can add streak logic here */}
            <Text style={{ fontSize: 14, color: 'gray' }}>Current streak: 3 days</Text>
          </View>
        )}
      />
    </View>
  );
}
