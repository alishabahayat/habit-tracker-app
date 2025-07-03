// app/WelcomeScreen.js
import { useEffect, useContext, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AuthContext } from './_contexts/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user data and navigate
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const usersString = await AsyncStorage.getItem('users') || '[]';
        const users = JSON.parse(usersString);
        const userId = await AsyncStorage.getItem('userId');
        
        if (userId) {
          const user = users.find(u => u.id === userId);
          if (user) {
            console.log('Found user in storage:', { id: user.id, email: user.email, name: user.name });
            const userData = await authContext.signIn(user.email, user.password);
            console.log('User signed in:', userData);
            if (userData) {
              console.log('User initialized:', userData);
              router.replace('Home');
            }
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
    initializeUser();
  }, []);

  // Set timeout to navigate to Login after 3 seconds if no user
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Initialize AsyncStorage
        await AsyncStorage.getItem('users').then(users => {
          if (users) {
            console.log('Users loaded from storage:', users);
          }
        });

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          router.replace('Login');
        } else {
          router.replace('Home');
        }
      } catch (error) {
        console.error('Error checking userId:', error);
        router.replace('Login');
      }
    }, 3000); // 3 seconds

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
          {authContext.user?.name ? `Welcome, ${authContext.user.name}!` : 'Welcome!'}
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
