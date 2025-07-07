// app/edit-habit.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  View
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';
import { HabitsContext } from './_contexts/HabitsContext';
import { deleteHabit, updateHabit } from './_helpers/database';


// assets
const X_BUTTON = require('../assets/images/X Button.png');


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
  habitHighlight: {
    color: '#A36C44',
    fontWeight: '700',
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
    color: '#A36C44',
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
    shadowOffset: { width: 0, height: 2 },
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
  startDateContainer: {
    marginVertical: 20,
  },
  startDateLabel: {
    fontSize: 18,
    color: '#5C5C5C',
    marginBottom: 10,
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
    shadowOffset: { width: 0, height: 4 },
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
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default function EditHabit() {
  const router = useRouter();
  let habitId;
  // Use expo-router v2+ correct hook
  try {
    const params = useLocalSearchParams();
    habitId = params.habitId;
  } catch (e) {
    // Fallback: try parsing from window.location.search if available (web)
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      habitId = params.get('habitId');
    }
  }
  const authContext = useContext(AuthContext);
  const { userId } = authContext.user || {};
  const { setHabits } = useContext(HabitsContext);
  if (!habitId) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text style={{color:'red'}}>Error: No habitId provided in route params.</Text>
      </View>
    );
  }

  const [activity, setActivity] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [color, setColor] = useState('#000000');
  const [emojiBoxColor, setEmojiBoxColor] = useState('#000000');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState(new Date());
  const [habit, setHabit] = useState(null);

  useEffect(() => {
    const loadHabit = async () => {
      try {
        const habits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
        const foundHabit = habits.find(h => h.id === habitId);
        if (foundHabit) {
          setHabit(foundHabit);
          setActivity(foundHabit.name);
          setEmoji(foundHabit.emoji);
          setColor(foundHabit.color);
          setFrequency(foundHabit.frequency || 'daily');
          setStartDate(new Date(foundHabit.start_date));
        }
      } catch (error) {
        console.error('Error loading habit:', error);
      }
    };
    loadHabit();
  }, [habitId]);

  const handleSave = async () => {
    if (!activity.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      const updates = {
        name: activity,
        emoji,
        color,
        frequency,
        start_date: startDate.toISOString(),
      };

      await updateHabit(habitId, updates);
      const all = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
      setHabits(all);
      router.back();
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habitId);
              // Load updated habits from AsyncStorage and update context
              const updatedHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
              setHabits(updatedHabits);
              router.back();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (activity.trim() !== habit?.name) {
      Alert.alert(
        'Unsaved Changes',
        'Would you like to save your changes before leaving?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'Save',
            style: 'default',
            onPress: handleSave
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
      <TouchableOpacity onPress={handleBack}>
        <Image source={X_BUTTON} style={styles.xButton} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit <Text style={styles.headerAccent}>Habit</Text></Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.centeredContent}
        keyboardShouldPersistTaps="handled"  
      >
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
          placeholder="Enter habit name…"
          value={activity}
          onChangeText={setActivity}
        />

        {/* ── FREQUENCY PICKER ────────────── */}
        <View style={styles.frequencyContainer}>
          <Text style={styles.frequencyLabel}>Frequency Type</Text>
          <View style={styles.frequencyPicker}>
            {['daily','weekly','monthly','yearly'].map(type => (
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
                    daysOfWeek: type === 'weekly'   ? [] : prev.daysOfWeek,
                    daysOfMonth: type === 'monthly' ? [] : prev.daysOfMonth,
                    monthsOfYear:type === 'yearly'  ? [] : prev.monthsOfYear
                  }));
                }}
              >
                <Text style={[
                  styles.frequencyOptionText,
                  frequency.type === type && styles.frequencyOptionTextSelected
                ]}>
                  {type.charAt(0).toUpperCase()+type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Daily */}
          {frequency.type === 'daily' && (
            <View style={styles.frequencyContainerInline}>
              <Text style={styles.frequencyLabel}>Every</Text>
              <TextInput
                style={styles.frequencyInput}
                value={String(frequency.interval)}
                onChangeText={v => {
                  const n = parseInt(v);
                  if (!isNaN(n) && n > 0) setFrequency(p => ({ ...p, interval: n }));
                }}
                keyboardType="numeric"
                placeholder="1"
              />
              <Text style={styles.frequencyLabel}>day(s)</Text>
            </View>
          )}

          {/* Weekly */}
          {frequency.type === 'weekly' && (
            <>
              <View style={styles.frequencyContainerInline}>
                <Text style={styles.frequencyLabel}>Every</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={String(frequency.interval)}
                  onChangeText={v => {
                    const n = parseInt(v);
                    if (!isNaN(n) && n > 0) setFrequency(p => ({ ...p, interval: n }));
                  }}
                  keyboardType="numeric"
                  placeholder="1"
                />
                <Text style={styles.frequencyLabel}>week(s)</Text>
              </View>
              <Text style={styles.frequencyLabel}>Select days of the week:</Text>
              <View style={styles.daysOfWeekContainer}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      frequency.daysOfWeek.includes(i) && styles.selectedDayButton
                    ]}
                    onPress={() => {
                      setFrequency(p => ({
                        ...p,
                        daysOfWeek: p.daysOfWeek.includes(i)
                          ? p.daysOfWeek.filter(d => d !== i)
                          : [...p.daysOfWeek, i]
                      }));
                    }}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      frequency.daysOfWeek.includes(i) && styles.selectedDayButtonText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Monthly */}
          {frequency.type === 'monthly' && (
            <>
              <View style={styles.frequencyContainerInline}>
                <Text style={styles.frequencyLabel}>Every</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={String(frequency.interval)}
                  onChangeText={v => {
                    const n = parseInt(v);
                    if (!isNaN(n) && n > 0) setFrequency(p => ({ ...p, interval: n }));
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
                      setFrequency(p => ({
                        ...p,
                        daysOfMonth: p.daysOfMonth.includes(day)
                          ? p.daysOfMonth.filter(d => d !== day)
                          : [...p.daysOfMonth, day]
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

          {/* Yearly */}
          {frequency.type === 'yearly' && (
            <>
              <View style={styles.frequencyContainerInline}>
                <Text style={styles.frequencyLabel}>Every</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={String(frequency.interval)}
                  onChangeText={v => {
                    const n = parseInt(v);
                    if (!isNaN(n) && n > 0) setFrequency(p => ({ ...p, interval: n }));
                  }}
                  keyboardType="numeric"
                  placeholder="1"
                />
                <Text style={styles.frequencyLabel}>year(s)</Text>
              </View>
              <Text style={styles.frequencyLabel}>Select month:</Text>
              <View style={styles.monthPicker}>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, idx) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.dayButton,
                      frequency.monthsOfYear.includes(idx) && styles.selectedDayButton
                    ]}
                    onPress={() => {
                      setFrequency(p => ({
                        ...p,
                        monthsOfYear: p.monthsOfYear.includes(idx)
                          ? p.monthsOfYear.filter(x => x !== idx)
                          : [...p.monthsOfYear, idx]
                      }));
                    }}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      frequency.monthsOfYear.includes(idx) && styles.selectedDayButtonText
                    ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.frequencyLabel}>Select day of the month:</Text>
              <View style={styles.daysOfWeekContainer}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      frequency.dayOfMonth === day && styles.selectedDayButton
                    ]}
                    onPress={() => setFrequency(p => ({ ...p, dayOfMonth: day }))}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      frequency.dayOfMonth === day && styles.selectedDayButtonText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>


        <View style={styles.startDateContainer}>
          <Text style={styles.startDateLabel}>Start Date</Text>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              if (date) {
                setStartDate(date);
              }
            }}
          />
        </View>


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
      </ScrollView>

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

      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Habit</Text>
      </TouchableOpacity>

    </View>
  );
}
