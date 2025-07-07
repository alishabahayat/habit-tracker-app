//app/Splash.js
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to Login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.subtitle}>
        Growing takes time. Let's thrive a little more today
      </Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFD3C5',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'LeJourScript',
  },
  logo: {
    marginBottom: 24,
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },

});