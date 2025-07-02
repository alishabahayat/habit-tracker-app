// app/index.js
import React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeDatabase } from './_helpers/database';
import { AuthContext, AuthProvider } from './_contexts/AuthContext';
import { useRouter } from 'expo-router';

import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Splash from './Splash';
import WelcomeScreen from './Welcome';
import AddHabitScreen from './add-habit';

export default function Index() {
  const router = useRouter();
  const [step, setStep] = useState('loading');

  // Initialize database when app starts
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        console.log('App initialized successfully');
        setStep('splash');
        const t = setTimeout(() => {
          setStep('login');
          router.push('/Login');
        }, 3000);
        return () => clearTimeout(t);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Error', 'Failed to initialize app. Please try again.');
      }
    };
    initApp();
  }, []);

  return (
    <AuthProvider>
      {step === 'loading' ? (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : step === 'splash' ? (
        <Splash onPressNext={() => router.push('/Login')} />
      ) : step === 'login' ? (
        <Login />
      ) : step === 'signup' ? (
        <SignUp />
      ) : step === 'welcome' ? (
        <WelcomeScreen onPressNext={() => router.push('/Home')} />
      ) : step === 'home' ? (
        <Home />
      ) : step === 'add-habit' ? (
        <AddHabitScreen onPressBack={() => router.push('/Home')} />
      ) : null}
    </AuthProvider>
  );
}
