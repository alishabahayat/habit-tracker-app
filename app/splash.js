import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Splash({ onPressNext }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/leaves.png')}
        style={styles.leaves}
      />
      <Text style={styles.title}>Thrive</Text>
      <Text style={styles.subtitle}>
        Thrive a little bit more every day!{'\n'}
        Growing takes time so take it step by step so you can thrive
      </Text>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  leaves: {
    position: 'absolute',
    top: 40,
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 120,
    fontSize: 48,
    fontFamily: 'LeJourScript',
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginVertical: 16,
  },
  logo: {
    marginBottom: 40,
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },

});
