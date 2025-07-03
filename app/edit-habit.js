// app/edit-habit.js
import { useContext, useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addHabit, updateHabit, deleteHabit } from './_helpers/database';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from './_contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// frequency options
const FREQUENCIES = [
  { value: 'daily', label: 'Every day' },
  { value: 'every-other-day', label: 'Every other day' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom...' },
];

// styles
const DOT_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F',
    padding: 20,
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
    width: 40,
    height: 40,
    alignItems: 'center',
    width: '100%',
    marginBottom: 120,
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
  xButton: {
    width: 24,
    height: 24,
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
  },
  colorList: {
    paddingVertical: 20,
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
  frequencyContainer: {
    marginVertical: 20,
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
  },
  startDateContainer: {
    marginVertical: 20,
  },
  startDateLabel: {
    fontSize: 18,
    color: '#5C5C5C',
    marginBottom: 10,
  },
  startDateInput: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
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
      Alert.alert('Error', 'Please enter an activity name');
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
        <Text style={styles.headerTitle}>Edit <Text style={styles.headerAccent}>Activity</Text></Text>
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
        />

        <View style={styles.frequencyContainer}>
          <Text style={styles.frequencyLabel}>Frequency</Text>
          <TextInput
            style={styles.frequencyPicker}
            value={frequency}
            onChangeText={setFrequency}
            placeholder="Select frequency"
          />
        </View>

        <View style={styles.startDateContainer}>
          <Text style={styles.startDateLabel}>Start Date</Text>
          <TextInput
            style={styles.startDateInput}
            value={startDate.toLocaleDateString()}
            onChangeText={(text) => setStartDate(new Date(text))}
            placeholder="Select start date"
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
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Habit</Text>
      </TouchableOpacity>

      <Image source={SUNNY_LEAVES} style={styles.sunnyLeaves} />
    </View>
  );
}
