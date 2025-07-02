// app/add-habit.js
import { useContext, useState } from 'react';
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
    opacity: 0.2,
    transform: [{ translateY: -50 }], // Move up by half its height
    width: '100%',
    overflow: 'visible',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
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



export default function AddHabit({ onPressBack }) {
  const [emoji, setEmoji] = useState('😀');
  const [activity, setActivity] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiBoxColor, setEmojiBoxColor] = useState(COLORS[0]);
  const [rainbowColor, setRainbowColor] = useState(null);

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
              handleAddHabit();
            }
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => onPressBack()
          }
        ],
        { cancelable: false }
      );
    } else {
      onPressBack();
    }
  };

  const handleAddHabit = async () => {
    if (!activity.trim()) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    try {
      // Get the user ID (this would be from your local auth state)
      const authContext = useContext(AuthContext);
      const userId = authContext?.user?.id || 1;

      // Add the habit to SQLite
      await addHabit(userId, emoji, activity, emojiBoxColor);

      Alert.alert('Success', 'Habit added successfully');
      setActivity('');
      setEmoji('😀');
      setColor(COLORS[0]);
      setEmojiBoxColor(COLORS[0]);
      setShowEmojiPicker(false);
      onPressBack();
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to add habit. Please try again.');
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
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
