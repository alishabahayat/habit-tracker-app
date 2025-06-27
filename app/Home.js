// app/HomeScreen.js
import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// simple date formatting helper
function formatDate(d) {
  const opts = { month: 'short', day: 'numeric' };
  return d.toLocaleString('en-US', opts);
}

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goPrevDay = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const goNextDay = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  // For the 7-day scroller:
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (i - 3)); // center today at index 3
    return d;
  });

  return (
    <View style={styles.container}>
      {/* Top decorative background */}
      <Image
        source={require('../assets/images/background image 1.png')}
        style={styles.topBg}
      />

      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.today}>Today</Text>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        <Image
          source={require('../assets/images/calendar.png')}
          style={styles.calendar}
        />
        <TouchableOpacity style={styles.createBtn}>
          <Image
            source={require('../assets/images/Create Button.png')}
            style={styles.createIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 7-day scroller */}
      <View style={styles.dayScroller}>
        <TouchableOpacity onPress={goPrevDay}>
          <Image
            source={require('../assets/images/date.png')}
            style={styles.arrow}
          />
        </TouchableOpacity>

        {days.map((d, idx) => {
          const isToday =
            d.toDateString() === new Date().toDateString();
          return (
            <View
              key={idx}
              style={[
                styles.dayBox,
                isToday && styles.dayBoxActive,
              ]}
            >
              <Text style={styles.dayName}>
                {d.toLocaleString('en-US', { weekday: 'short' })}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  isToday && styles.dayNumActive,
                ]}
              >
                {d.getDate()}
              </Text>
            </View>
          );
        })}

        <TouchableOpacity onPress={goNextDay}>
          <Image
            source={require('../assets/images/date.png')}
            style={[styles.arrow, styles.arrowRight]}
          />
        </TouchableOpacity>
      </View>

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addEvent}>
        <Image
          source={require('../assets/images/Add Event Button.png')}
          style={styles.addIcon}
        />
      </TouchableOpacity>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image
            source={require('../assets/images/Home_light.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFD3C5' },
  topBg: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'cover',
    top: 0,
    height: 200, // adjust to your artboard
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  today: { fontSize: 16, color: '#718278', flex: 1 },
  dateText: { fontSize: 20, fontWeight: 'bold', color: '#464646' },
  calendar: { width: 24, height: 24, marginLeft: 8 },
  createBtn: { marginLeft: 'auto' },
  createIcon: { width: 80, height: 32, resizeMode: 'contain' },

  dayScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  arrow: { width: 20, height: 20, tintColor: '#464646' },
  arrowRight: { transform: [{ rotate: '180deg' }] },
  dayBox: {
    marginHorizontal: 4,
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBoxActive: {
    backgroundColor: '#A4F27F',
    borderRadius: 8,
  },
  dayName: { fontSize: 12, color: '#666' },
  dayNum: { fontSize: 14, color: '#666' },
  dayNumActive: { color: '#212121', fontWeight: 'bold' },

  addEvent: {
    position: 'absolute',
    top: 300,
    left: 20,
  },
  addIcon: { width: 60, height: 60 },

  bottomNav: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navIcon: { width: 24, height: 24 },
});
