// app/index.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './login';
import SignUpScreen from './SignUpScreen';
import Splash from './Splash';
import WelcomeScreen from './Welcome'; // your “Hello Charlie!” page

export default function Index() {
  const [step, setStep] = useState('loading');

  useEffect(() => {
    // show splash → after 3s go to login
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

  // final screen
  return <WelcomeScreen />;
}
