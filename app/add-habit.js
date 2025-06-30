// app/add-habit.js
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// assets
const X_BUTTON   = require('../assets/images/X Button.png');
const SUNNY_LEAVES = require('../assets/images/sunny leaves.png');

// your 6 brand-colors + a rainbow option:
const COLORS = [
  '#84AB66',
  '#9ABDF1',
  '#A34BB6',
  '#E46464',
  '#F2C94C',
  '#FF8A65',
  'rainbow',
];

// a small emoji list for demo:
const EMOJIS = ['😀','🎯','💪','📚','🧘','📈','🍎','🏃'];

export default function AddHabit({ navigation }) {
  const [emoji, setEmoji] = useState('😀');
  const [activity, setActivity] = useState('');
  const [color,    setColor]    = useState(COLORS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* ── HEADER ──────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Create <Text style={styles.headerAccent}>Activity</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={X_BUTTON} style={styles.xButton} />
        </TouchableOpacity>
      </View>

      {/* ── WHAT? + EMOJI PICKER ────────── */}
      <View style={styles.whatRow}>
        <Text style={styles.label}>What?</Text>
        <TouchableOpacity
          style={[styles.emojiBox, { borderColor: color }]}
          onPress={() => setShowEmojiPicker(true)}
        >
          <Text style={styles.emojiText}>{emoji}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { borderColor: color }]}
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
              item === 'rainbow'
                ? styles.rainbowDot
                : { backgroundColor: item },
              item === color && styles.colorDotActive,
            ]}
            onPress={() => setColor(item)}
          />
        )}
      />

      {/* ── SUNNY LEAVES FOOTER ─────────── */}
      <Image source={SUNNY_LEAVES} style={styles.footerLeaves} />

      {/* ── EMOJI PICKER MODAL ──────────── */}
      <Modal
        visible={showEmojiPicker}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerTitle}>Pick an emoji</Text>
          <FlatList
            data={EMOJIS}
            keyExtractor={(e) => e}
            numColumns={6}
            contentContainerStyle={styles.pickerList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setEmoji(item);
                  setShowEmojiPicker(false);
                }}
                style={styles.pickerItem}
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
      </Modal>
    </View>
  );
}

const DOT_SIZE =  thirtySix = 36;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96AA9F', // as per your note
    padding: 20,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
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

  /* WHAT? ROW */
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
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },

  /* ACTIVITY INPUT */
  input: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },

  /* COLOR PICKER */
  colorList: {
    paddingVertical: 10,
  },
  colorDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderColor: '#333',
  },
  rainbowDot: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    // a simple gradient ring hack:
    backgroundImage:
      'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
  },

  /* FOOTER LEAVES */
  footerLeaves: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  /* EMOJI PICKER */
  pickerContainer: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  pickerTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerList: {
    alignItems: 'center',
  },
  pickerItem: {
    padding: 16,
    width: 60,
    alignItems: 'center',
  },
  pickerEmoji: {
    fontSize: 32,
  },
  pickerClose: {
    marginTop: 20,
    alignSelf: 'center',
  },
  pickerCloseText: {
    color: '#888',
    fontSize: 18,
  },
});
