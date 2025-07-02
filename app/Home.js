// app/Home.js
import { useState, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from './_contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';



// Helper function to format date as "Jul 9"
function formatDate(d) {
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.1,
  },
  appBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    transform: [{ rotate: '180deg' }, { scale: 1.2 }],
    opacity: 0.35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  today: {
    color: '#4A4A4A',
    fontSize: 14,
  },
  todayActive: {
    color: '#84AB66',
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
    backgroundColor: '#96AA9F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
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
    marginVertical: 20,
  },
  dayScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: '#718278',
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  arrowButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4A4A4A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dayBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 4,
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
    color: '#4A4A4A',
    fontSize: 16,
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
    backgroundColor: '#FFFFFF',
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
  habitText: {
    fontSize: 16,
    color: '#333333',
  }
});

// Home Component
function Home() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { userId } = authContext.user || {};
  
  // State for habits
  const [habits, setHabits] = useState([]);

  // Fetch habits when component mounts and when route changes
  useEffect(() => {
    if (userId) {
      fetchHabits();
    }
  }, [userId, router]);

  // Function to fetch habits from database
  const fetchHabits = async () => {
    try {
      console.log('Fetching habits for userId:', userId);
      
      // Get all habits from AsyncStorage
      const allHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
      console.log('All habits from storage:', allHabits);
      
      // Filter habits for current user
      const userHabits = allHabits.filter(h => h.user_id === userId);
      console.log('User habits filtered:', userHabits);
      
      // Update state
      setHabits(userHabits);
      console.log('Habits state updated with:', userHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  // Log user state for debugging
  useEffect(() => {
    console.log('User state:', authContext.user);
  }, [authContext.user]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

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
      <Image
        source={require('../assets/images/background image 1.png')}
        style={styles.backgroundImage}
      />
      <Image
        source={require('../assets/images/background image 2.png')}
        style={styles.appBorder}
      />

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
          <TouchableOpacity onPress={goToday}>
            <Image
              source={require('../assets/images/calendar.png')}
              style={styles.createIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.createBtn} onPress={() => {
         router.push('add-habit');
       }}>
        <Image source={require('../assets/images/Create Button.png')} style={styles.createIcon} />
      </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Welcome, Charlie</Text>

      {/* Habits List */}
      <View style={styles.habitsContainer}>
        {habits.map((habit, index) => (
          <View key={habit.id} style={[styles.habitItem, { backgroundColor: habit.color }]}>
            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
            <Text style={styles.habitText}>{habit.name}</Text>
          </View>
        ))}
      </View>

      {/* 7-Day Scroller */}
      <View style={styles.dayScroller}>
        <TouchableOpacity onPress={goPrevDay} style={styles.arrowButton}>
          <View style={styles.arrow}>
            <Image
              source={require('../assets/images/Next Page Button.png')}
              style={[styles.arrowIcon, styles.arrowLeft]}
            />
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity onPress={goNextDay} style={styles.arrowButton}>
          <View style={styles.arrow}>
            <Image
              source={require('../assets/images/Next Page Button.png')}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addEvent} onPress={() => {
        router.push('add-habit');
      }}>
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
        <TouchableOpacity>
          <Image
            source={require('../assets/images/Question_light.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Home;
