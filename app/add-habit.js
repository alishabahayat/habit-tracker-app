// app/add-habit.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';

// assets
const X_BUTTON = require('../assets/images/X Button.png');
const SUNNY_LEAVES = require('../assets/images/sunny leaves.png');

// colors
const COLORS = ['#84AB66', '#449371', '#447293', '#846693', '#934484', '#936644', 'rainbow'];

// emojis
const EMOJIS = [
  '😀', '😂', '😍', '🤔', '🥳', '😎', '🥳',
  '🤩', '😘', '🥰', '🥲', '🤗', '🥳', '🥰',
  '🎯', '💪', '📚', '🧘', '📈', '🍎', '🏃', '🎵',
  '🎨', '🎮', '💻', '📚', '🎨', '🎵', '🎬', '🎭',
  '🍽️', '🍽️', '🥗', '🍔', '🍵', '🥤', '🍽️', '🍽️',
  '🏋️', '🚴', '🏊', '🏃', '🧘', '🧘', '🧘', '🧘',
];

// styles
const DOT_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
    padding: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLeaves: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: -1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  xButton: {
    width: 24,
    height: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F0EE',
  },
  headerAccent: {
    color: '#84AB66',
  },
  whatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#5C5C5C',
    marginRight: 12,
    width: 60,
  },
  emojiBox: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emojiText: {
    fontSize: 24,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 16,
    width: '90%',
    textAlign: 'left',
    paddingHorizontal: 20,
  },
  inputPlaceholder: {
    color: '#888888',
    fontSize: 16,
    position: 'absolute',
  },
  inputText: {
    fontSize: 16,
    color: '#333333',
    position: 'absolute',
    left: 15,
    top: 15,
  },
  colorList: {
    paddingVertical: 20,
  },
  frequencyContainer: {
    marginVertical: 20,
  },
  frequencyContainerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  frequencyLabel: {
    fontSize: 18,
    color: '#5C5C5C',
    marginBottom: 10,
  },
  frequencyPicker: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  frequencyOption: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  frequencyOptionSelected: {
    backgroundColor: '#84AB66',
  },
  frequencyOptionText: {
    fontSize: 16,
    color: '#333',
  },
  frequencyOptionTextSelected: {
    color: '#fff',
  },
  frequencyInput: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    width: 60,
    textAlign: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  monthPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedDayButton: {
    backgroundColor: '#84AB66',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  monthPickerItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  startDateContainer: {
    marginVertical: 20,
  },
  startDateLabel: {
    fontSize: 18,
    color: '#5C5C5C',
    marginBottom: 10,
  },
  colorDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 10,
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerList: {
    padding: 10,
  },
  pickerItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  pickerEmoji: {
    fontSize: 32,
  },
  pickerClose: {
    marginTop: 5,
    padding: 10,
    alignSelf: 'center',
  },
  pickerCloseText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#84AB66',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sunnyLeaves: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
});

export default function AddHabit() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { id: userId } = authContext.user || {};

  const [activity, setActivity] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [color, setColor] = useState('#000000');
  const [emojiBoxColor, setEmojiBoxColor] = useState('#000000');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [frequency, setFrequency] = useState({
    type: 'daily',
    interval: 1,
    daysOfWeek: [],
    daysOfMonth: [],
    monthsOfYear: [],
    dayOfMonth: null
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Log user state when component mounts
  useEffect(() => {
    console.log('AddHabit component mounted with user:', authContext.user);
  }, [authContext.user]);

  // Log activity changes
  useEffect(() => {
    console.log('Activity changed:', activity);
  }, [activity]);

  const handleSave = async () => {
    if (!activity.trim()) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    try {
      console.log('Starting to add habit with userId:', userId);
      console.log('Current activity:', activity);
      console.log('Selected emoji:', emoji);
      console.log('Selected color:', color);
      console.log('Selected frequency:', frequency);
      console.log('Selected start date:', selectedDate);

      // Get existing habits
      const existingHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
      console.log('Existing habits in storage:', existingHabits);

      // Create new habit
      const newHabit = {
        id: Date.now().toString(),
        user_id: userId,
        emoji,
        name: activity,
        color,
        start_date: selectedDate.toISOString(),
        frequency: {
          type: frequency.type,
          interval: frequency.interval,
          daysOfWeek: frequency.daysOfWeek,
          daysOfMonth: frequency.daysOfMonth,
          monthsOfYear: frequency.monthsOfYear,
          dayOfMonth: frequency.dayOfMonth
        }
      };
      console.log('Created new habit:', newHabit);

      // Add to habits array
      existingHabits.push(newHabit);
      console.log('Habits array after adding:', existingHabits);

      // Save to AsyncStorage
      await AsyncStorage.setItem('habits', JSON.stringify(existingHabits));
      console.log('Habits saved to storage successfully');

      // Update HabitsContext if available
      if (typeof window !== 'undefined') {
        // Web: find global context
        const globalCtx = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent;
        if (globalCtx && globalCtx.setHabits) globalCtx.setHabits(existingHabits);
      }
      if (typeof setHabits === 'function') setHabits(existingHabits);

      router.back();
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to add habit');
    }
  };

  const handleBack = () => {
    if (activity.trim() !== '') {
      Alert.alert(
        'Unsaved Changes',
        'Would you like to save your activity before leaving?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'Save',
            style: 'default',
            onPress: () => {
              handleSave();
            }
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ],
        { cancelable: false }
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* ── HEADER ────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Image source={X_BUTTON} style={styles.xButton} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create <Text style={styles.headerAccent}>Activity</Text></Text>
        </View>
        <View style={styles.centeredContent}>
          <View style={styles.whatRow}>
            <Text style={styles.label}>What?</Text>
            <TouchableOpacity
              style={[styles.emojiBox, { backgroundColor: emojiBoxColor }]}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { borderColor: emojiBoxColor }]}
            placeholder="Enter activity name…"
            value={activity}
            onChangeText={setActivity}
            multiline={true}
            numberOfLines={3}
          />
          {/* ── FREQUENCY PICKER ────────────── */}
          <View style={styles.frequencyContainer}>
            <Text style={styles.frequencyLabel}>Frequency Type</Text>
            <View style={styles.frequencyPicker}>
              {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.frequencyOption,
                    frequency.type === type && styles.frequencyOptionSelected
                  ]}
                  onPress={() => {
                    setFrequency(prev => ({
                      ...prev,
                      type,
                      daysOfWeek: type === 'weekly' ? [] : prev.daysOfWeek,
                      daysOfMonth: type === 'monthly' ? [] : prev.daysOfMonth,
                      monthsOfYear: type === 'yearly' ? [] : prev.monthsOfYear
                    }));
                  }}
                >
                  <Text style={[
                    styles.frequencyOptionText,
                    frequency.type === type && styles.frequencyOptionTextSelected
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Frequency details by type go here (already present in your code) */}
            {frequency.type === 'daily' && (
              <View style={styles.frequencyContainerInline}>
                <Text style={styles.frequencyLabel}>Every</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={frequency.interval.toString()}
                  onChangeText={(value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                      setFrequency(prev => ({ ...prev, interval: num }));
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="1"
                />
                <Text style={styles.frequencyLabel}>day(s)</Text>
              </View>
            )}
            {frequency.type === 'weekly' && (
              <>
                <View style={styles.frequencyContainerInline}>
                  <Text style={styles.frequencyLabel}>Every</Text>
                  <TextInput
                    style={styles.frequencyInput}
                    value={frequency.interval.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value);
                      if (!isNaN(num) && num > 0) {
                        setFrequency(prev => ({ ...prev, interval: num }));
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                  <Text style={styles.frequencyLabel}>week(s)</Text>
                </View>
                <Text style={styles.frequencyLabel}>Select days of the week:</Text>
                <View style={styles.daysOfWeekContainer}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        frequency.daysOfWeek.includes(index) && styles.selectedDayButton
                      ]}
                      onPress={() => {
                        setFrequency(prev => ({
                          ...prev,
                          daysOfWeek: prev.daysOfWeek.includes(index)
                            ? prev.daysOfWeek.filter(d => d !== index)
                            : [...prev.daysOfWeek, index]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        frequency.daysOfWeek.includes(index) && styles.selectedDayButtonText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            {frequency.type === 'monthly' && (
              <>
                <View style={styles.frequencyContainerInline}>
                  <Text style={styles.frequencyLabel}>Every</Text>
                  <TextInput
                    style={styles.frequencyInput}
                    value={frequency.interval.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value);
                      if (!isNaN(num) && num > 0) {
                        setFrequency(prev => ({ ...prev, interval: num }));
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                  <Text style={styles.frequencyLabel}>month(s)</Text>
                </View>
                <Text style={styles.frequencyLabel}>Select days of the month:</Text>
                <View style={styles.daysOfWeekContainer}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        frequency.daysOfMonth.includes(day) && styles.selectedDayButton
                      ]}
                      onPress={() => {
                        setFrequency(prev => ({
                          ...prev,
                          daysOfMonth: prev.daysOfMonth.includes(day)
                            ? prev.daysOfMonth.filter(d => d !== day)
                            : [...prev.daysOfMonth, day]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        frequency.daysOfMonth.includes(day) && styles.selectedDayButtonText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            {frequency.type === 'yearly' && (
              <>
                <View style={styles.frequencyContainerInline}>
                  <Text style={styles.frequencyLabel}>Every</Text>
                  <TextInput
                    style={styles.frequencyInput}
                    value={frequency.interval.toString()}
                    onChangeText={(value) => {
                      const num = parseInt(value);
                      if (!isNaN(num) && num > 0) {
                        setFrequency(prev => ({ ...prev, interval: num }));
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                  <Text style={styles.frequencyLabel}>year(s)</Text>
                </View>
                <Text style={styles.frequencyLabel}>Select month:</Text>
                <View style={styles.monthPicker}>
                  {['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.monthPickerItem,
                        frequency.monthsOfYear.includes(index) && styles.selectedDayButton
                      ]}
                      onPress={() => {
                        setFrequency(prev => ({
                          ...prev,
                          monthsOfYear: prev.monthsOfYear.includes(index)
                            ? prev.monthsOfYear.filter(m => m !== index)
                            : [...prev.monthsOfYear, index]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        frequency.monthsOfYear.includes(index) && styles.selectedDayButtonText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.frequencyLabel}>Select day of the month:</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={frequency.dayOfMonth ? frequency.dayOfMonth.toString() : ''}
                  onChangeText={(value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 1 && num <= 31) {
                      setFrequency(prev => ({ ...prev, dayOfMonth: num }));
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </>
            )}
          </View>
          {/* ── START DATE PICKER ───────────── */}
          <View style={styles.startDateContainer}>
            <Text style={styles.startDateLabel}>Start Date</Text>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              minimumDate={new Date()}
            />
          </View>
          {/* ── COLOR PICKER ────────────────── */}
          <FlatList
            data={COLORS}
            keyExtractor={(c) => c}
            horizontal
            contentContainerStyle={styles.colorList}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorDot,
                  { backgroundColor: item },
                  item === color && styles.colorDotActive,
                ]}
                onPress={() => {
                  setColor(item);
                  if (item === 'rainbow') {
                    setEmojiBoxColor('#84AB66');
                  } else {
                    const hexColor = item;
                    const r = parseInt(hexColor.slice(1,3), 16);
                    const g = parseInt(hexColor.slice(3,5), 16);
                    const b = parseInt(hexColor.slice(5,7), 16);
                    const rgbaColor = `rgba(${r},${g},${b},0.8)`;
                    setEmojiBoxColor(rgbaColor);
                  }
                }}
              />
            )}
          />
          {/* ── ADD BUTTON ────────────────────── */}
          <TouchableOpacity style={styles.addButton} onPress={handleSave}>
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* ── EMOJI PICKER MODAL ──────────── */}
      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Pick an emoji</Text>
            <FlatList
              data={EMOJIS}
              keyExtractor={(e) => e}
              numColumns={6}
              contentContainerStyle={styles.pickerList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setEmoji(item);
                    setShowEmojiPicker(false);
                  }}
                >
                  <Text style={styles.pickerEmoji}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.pickerClose}
              onPress={() => setShowEmojiPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ── SUNNY LEAVES FOOTER ─────────── */}
      <Image
        source={SUNNY_LEAVES}
        style={styles.footerLeaves}
      />
    </View>
  );
}
