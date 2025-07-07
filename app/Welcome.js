// app/Welcome.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthContext } from './_contexts/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const opacity = useRef(new Animated.Value(1)).current;
  const bgFade  = useRef(new Animated.Value(0)).current;

  // interpolate background
  const bgColor = bgFade.interpolate({
    inputRange: [0, 1],
    outputRange: ['#EFD3C5', '#96AA9F'],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false, // JS-driven
      }),
      Animated.timing(bgFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false, // JS-driven color
      }),
    ]).start(redirect);

    // redirect helper lives inside useEffect
    async function redirect() {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const usersString = await AsyncStorage.getItem('users') || '[]';
          const users = JSON.parse(usersString);
          const user = users.find(u => u.id === userId);
          if (user) {
            await authContext.signIn(user.email, user.password);
            return router.replace('Home');
          }
        }
      } catch (e) {
        console.error(e);
      }
      router.replace('Login');
    }
  }, []); // ← don't forget this!


  return (
   <Animated.View
     style={[
       styles.container,
       {
         backgroundColor: bgColor,
         opacity:          opacity,
       }
     ]}
   >
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
          {authContext.user?.name
            ? `Welcome, ${authContext.user.name}!`
            : 'Welcome!'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  topLeaves: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#464646',
    fontWeight: 'bold',
  },
});
