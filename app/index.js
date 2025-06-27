// app/index.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import HomeScreen from './Home'; // <-- your actual home-page component
import LoginScreen from './login';
import SignUpScreen from './SignUpScreen';
import Splash from './Splash';
import WelcomeScreen from './Welcome'; // <-- make sure this file exists!

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
        onPressLogin={() => setStep('signup')}
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

  // 🎉 Finally land on your real home page
  return <HomeScreen />;
}
