// app/index.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import HomeScreen from './Home';
import LoginScreen from './login';
import SignUpScreen from './SignUpScreen';
import Splash from './Splash';
import WelcomeScreen from './Welcome';
import AddHabitScreen from './add-habit';

export default function Index() {
  const [step, setStep] = useState('loading');

  // 1️⃣ Splash → after 3s → login
  useEffect(() => {
    setStep('splash');
    const t = setTimeout(() => setStep('login'), 3000);
    return () => clearTimeout(t);
  }, []);

  if (step === 'loading') {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (step === 'splash') {
    return <Splash onPressNext={() => setStep('login')} />;
  }

  if (step === 'login') {
    return (
      <LoginScreen
        onPressLogin={() => setStep('welcome')}
        onPressGoToSignUp={() => setStep('signup')}
      />
    );
  }

  if (step === 'signup') {
    return <SignUpScreen onPressSignUp={() => setStep('welcome')} />;
  }

  if (step === 'welcome') {
    // WelcomeScreen will auto-advance itself after its own timer
    return <WelcomeScreen onPressNext={() => setStep('home')} />;
  }

  if (step === 'addHabit') {
    return <AddHabitScreen onPressBack={() => setStep('home')} />;
  }

  // 🎉 Finally land on your real home page
  return <HomeScreen onPressAddHabit={() => setStep('addHabit')} />;
}
