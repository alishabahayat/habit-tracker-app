import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

const HabitsContext = createContext();
export { HabitsContext };

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const stored = await AsyncStorage.getItem('habits');
        if (stored) setHabits(JSON.parse(stored));
      } catch (err) {
        console.error('Error loading habits', err);
      }
    };
    loadHabits();
  }, []);

  return (
    <HabitsContext.Provider value={{ habits, setHabits }}>
      {children}
    </HabitsContext.Provider>
  );
};
