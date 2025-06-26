// app/WelcomeScreen.js
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen({ onPressNext }) {
  return (
    <View style={styles.container}>

      {/* ── Top Section ───────────────────────────────────── */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/images/leaf10.png')}
          style={styles.topLeaves}
        />
      </View>

      {/* ── Middle Section ────────────────────────────────── */}
      <View style={styles.middleSection}>
        <Text style={styles.title}>Hello Charlie!</Text>
      </View>

      {/* ── Bottom Section ────────────────────────────────── */}
      <View style={styles.bottomSection}>
        <Image
          source={require('../assets/images/leaves.png')}
          style={styles.centerLeaves}
        />
        <TouchableOpacity style={styles.button} onPress={onPressNext}>
          <Image
            source={require('../assets/images/Next Page Button.png')}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
  },

  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  topLeaves: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },

  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#464646',
    fontWeight: 'bold',
  },

  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  centerLeaves: {
    position: 'absolute',
    width: 300,
    height: 150,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
