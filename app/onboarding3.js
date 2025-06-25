import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Onboarding3() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'LeJourScript': require('../assets/fonts/LeJourScript.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thrive</Text>
      <Text style={styles.subtitle}>Thrive a little bit more everyday !{"\n"}Growing takes time so take it step by step so you can thrive</Text>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image source={require('../assets/images/Next Page Button.svg')} style={styles.arrow} />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFD3C5',
    width: width,
    height: 812,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  title: {
    fontSize: 36,
    fontFamily: 'LeJourScript',
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
  },
  subtitle: {
    fontSize: 14,
    color: '#464646',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: -10,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  arrow: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
