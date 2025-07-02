// app/WelcomeScreen.js
import { useEffect, useContext, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useNavigation
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from './_contexts/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isTimeout, setIsTimeout] = useState(false);

  // Navigate to Home when user data is available
  useEffect(() => {
    if (authContext.user && !isTimeout) {
      router.push('/Home');
    }
  }, [authContext.user, isTimeout]);

  // Set timeout to navigate to Home after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
      router.push('/Home');
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* Top */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/images/leaf10.png')}
          style={styles.topLeaves}
        />
      </View>

      {/* Middle */}
      <View style={styles.middleSection}>
        <Text style={styles.title}>
          {authContext.user?.name ? `Hello ${authContext.user.name}!` : 'Welcome!'}
        </Text>
      </View>

      {/* Bottom (button still here if you want a tap fallback) */}
      {/*<View style={styles.bottomSection}>
        <Image
          source={require('../assets/images/leaves.png')}
          style={styles.centerLeaves}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onPressNext}
        >
          <Image
            source={require('../assets/images/Next Page Button.png')}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#EFD3C5', justifyContent: 'center', alignItems: 'center' },
  title:       { fontSize: 32, color: '#464646', fontWeight: 'bold' },
  //button:      { backgroundColor: '#333', width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  //arrow:       { width: 40, height: 40, resizeMode: 'contain' },
});
