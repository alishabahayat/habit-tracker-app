import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      setInitialRoute(completed ? 'login' : 'splash');
    };
    checkOnboarding();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade', // 👈 fade instead of slide
        animationDuration: 800, // 👈 optional
      }}
    />
  );
}
