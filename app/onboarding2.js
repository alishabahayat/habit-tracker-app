// app/onboarding2.js (Screen 2 with updated styling from Figma)
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

export default function Onboarding2() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding3');
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/leaves.png')} style={styles.leaves} />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFD3C5',
    width: width,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 239.712,
    paddingBottom: 209.288,
  },
  leaves: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 100,
    resizeMode: 'contain',
  },
  logo: {
    width: 270,
    height: 270,
    resizeMode: 'contain',
  },
});
