// app/add-habit.js
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
import { addHabit } from './_helpers/database';
import { useRouter } from 'expo-router';
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
    marginBottom: 120, // Make space for footer
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
});

export default function AddHabit() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { userId } = authContext.user || {};

  const [activity, setActivity] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [color, setColor] = useState('#000000');
  const [emojiBoxColor, setEmojiBoxColor] = useState('#000000');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

      // Get existing habits
      const existingHabits = JSON.parse(await AsyncStorage.getItem('habits') || '[]');
      console.log('Existing habits in storage:', existingHabits);

      // Create new habit
      const newHabit = {
        id: Date.now().toString(),
        user_id: userId,
        emoji,
        name: activity,
        color
      };
      console.log('Created new habit:', newHabit);

      // Add to habits array
      existingHabits.push(newHabit);
      console.log('Habits array after adding:', existingHabits);

      // Save to AsyncStorage
      await AsyncStorage.setItem('habits', JSON.stringify(existingHabits));
      console.log('Habits saved to storage successfully');

      return newHabit.id;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
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
      {/* ── HEADER ────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={X_BUTTON} style={styles.xButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create <Text style={styles.headerAccent}>Activity</Text></Text>
      </View>

      {/* ── CENTERED CONTENT ───────────────── */}
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

      </View>

      {/* ── ADD BUTTON ────────────────────── */}
      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Add Activity</Text>
      </TouchableOpacity>

      {/* ── SUNNY LEAVES FOOTER ─────────── */}
      <Image
        source={SUNNY_LEAVES}
        style={styles.footerLeaves}
      />
    </View>
  );
}
