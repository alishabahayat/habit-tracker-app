// app/Home.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';

// Helper function to format date as "Jul 9"
function formatDate(d) {
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// assets
const BACKGROUND_IMAGE_1 = require('../assets/images/background image 1.png');
const BACKGROUND_IMAGE_2 = require('../assets/images/background image 2.png');

// Styles
const styles = StyleSheet.create({
  dayScrollerWrapper: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#96AA9F',
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 8,
    marginTop: 57,
  },
  habitsScroll: {
    flex: 1,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
    position: 'relative',
  },
  backgroundImage1: {
    position: 'absolute',
    bottom: 29.8,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15,
    resizeMode: 'contain',
  },
  backgroundImage2: {
    position: 'absolute',
    top: -20,
    left: -40,
    right: 0,
    width: '120%',
    height: '120%',
    height: 238,
    opacity: 0.9,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  today: {
    width: 78,
    height: 35,
    flexShrink: 0,
    color: '#A36C44',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    transform: [{ translateY: 50 }],
  },

  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendar: {
    width: 24,
    height: 24,
  },
  createBtn: {
    backgroundColor: '#718278',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
    transform: [{ translateY: 50}],
  },
  createIcon: {
    width: 80,
    height: 32,
    resizeMode: 'contain',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 20,
    transform: [{ translateY: 45 }],
  },
  dayScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: '#718278',
    borderRadius: 16,
    overflow: 'hidden',
    width: '90%',
    marginHorizontal: 16,
  },
  arrowButton: {
    width: 35,
    height: 35,
    backgroundColor: '#4A4A4A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  arrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
  arrowLeft: {
    transform: [{ rotate: '180deg' }],
  },
  dayBoxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  dayBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 2,
  },
  dateBackground: {
    backgroundColor: '#718278',
    borderRadius: 8,
    padding: 8,
  },
  selectedBackground: {
    backgroundColor: '#84AB66',
    borderRadius: 8,
    padding: 8,
  },
  dateBoxContent: {
    position: 'relative',
    zIndex: 1,
  },
  dayName: {
    color: '#4A4A4A',
    fontSize: 12,
  },
  dayNum: {
    color: '#4A4A4A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayNumActive: {
    color: '#FFFFFF',
  },
  dateText: {
    width: 96,
    height: 35,
    flexShrink: 0,
    color: '#F2E8DA',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    transform: [{ translateY: 80 }, { translateX: -113 }],
  },
  addEvent: {
    height: 60,
    backgroundColor: '#73876ABF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#84AB66BF',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusSign: {
    fontSize: 24,
    color: '#D9D9D9',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#96AA9F',
  },
  activeTab: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginTop: 4,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  habitsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  habitText: {
    fontSize: 16,
    color: '#333333',
  }
});

export default function Home() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Load user ID from AsyncStorage
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        console.log('Loaded userId from AsyncStorage:', storedUserId);
      } catch (error) {
        console.error('Error loading userId:', error);
      }
    };
    loadUserId();
  }, []);

  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (userId) {
      fetchHabits();
    }
  }, [userId]);

  const fetchHabits = async () => {
    try {
      console.log('Starting to fetch habits');
      console.log('Current userId:', userId);
      
      // Get all habits
      const allHabitsString = await AsyncStorage.getItem('habits');
      console.log('Raw habits string:', allHabitsString);
      
      if (!allHabitsString) {
        console.log('No habits found in storage');
        setHabits([]);
        return;
      }
      
      const allHabits = JSON.parse(allHabitsString);
      console.log('Parsed habits:', allHabits);
      
      // Filter habits for current user
      const userHabits = allHabits.filter(h => h.user_id === userId);
      console.log('Filtered habits:', userHabits);
      
      setHabits(userHabits);
      console.log('Habits state updated successfully');
    } catch (error) {
      console.error('Error fetching habits:', error);
      console.error('Error details:', error.message);
      setHabits([]); // Clear habits on error
    }
  };

  useEffect(() => {
    console.log('User state changed:', authContext.user);
    console.log('User ID:', userId);
    
    if (userId) {
      fetchHabits();
    }
  }, [authContext.user, userId]);

  const goToday = () => setCurrentDate(new Date());
  const goToDate = (date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  const goPrevDay = () =>
    setCurrentDate(d =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
    );

  const goNextDay = () =>
    setCurrentDate(d =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    );

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (i - 3));
    return d;
  });

  return (
    <View style={styles.container}>

      <Image source={BACKGROUND_IMAGE_2} style={styles.backgroundImage2} />
      <Image source={BACKGROUND_IMAGE_1} style={styles.backgroundImage1} />
      <View style={styles.header}>
        <TouchableOpacity onPress={goToday}>
          <Text style={[
            styles.today, 
            selectedDate.toDateString() === new Date().toDateString() 
              ? styles.todayActive 
              : null
          ]}>
            Today
          </Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        
        <View style={styles.calendarContainer}>
          <TouchableOpacity style={[styles.createBtn, { backgroundColor: '#718278' }]} onPress={() => router.push('add-habit')}>
            <Text style={{ color: '#C8C8C8', fontWeight: 'bold', fontSize: 16 }}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Hello, Charlie</Text>

      {/* 7-Day Scroller (Fixed) */}
      <View style={styles.dayScrollerWrapper}>
        <View style={styles.dayScroller}>
          <View style={styles.dayBoxes}>
            {days.map((d, idx) => {
              const isToday =
                d.toDateString() === new Date().toDateString();
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.dayBox} 
                  onPress={() => goToDate(d)}
                >
                  <View style={
                    selectedDate.toDateString() === d.toDateString() 
                      ? styles.selectedBackground 
                      : styles.dateBackground
                  }>
                    <View style={styles.dateBoxContent}>
                      <Text style={styles.dayName}>{d.toLocaleString('en-US', { weekday: 'short' })}</Text>
                      <Text style={isToday ? [styles.dayNum, styles.dayNumActive] : styles.dayNum}>{d.getDate()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Habits List (Scrollable) */}
      <ScrollView style={styles.habitsScroll} contentContainerStyle={styles.habitsContainer}>
        {habits.map((habit, index) => (
          <TouchableOpacity 
            key={habit.id} 
            style={styles.habitItem}
            onPress={() => router.push(`/edit-habit?habitId=${habit.id}`)}
          >
            <Text style={[styles.habitEmoji, { color: habit.color }]}>{habit.emoji}</Text>
            <Text style={styles.habitText}>{habit.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addEvent} onPress={() => router.push('add-habit')}>
        <View style={styles.addCircle}>
          <Text style={styles.plusSign}>+</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <View style={styles.activeTab}>
          <Image
            source={require('../assets/images/Home_light.png')}
            style={styles.navIcon}
          />
          <View style={styles.activeDot} />
        </View>
        <TouchableOpacity>
          <Image
            source={require('../assets/images/Favorite_light.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                  await authContext.signOut();
                  router.replace('/Login');
                }
              }
            ]
          );
        }}>
          <Image
            source={require('../assets/images/Question_light.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}



