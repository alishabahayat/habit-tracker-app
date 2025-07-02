// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="Splash"      
      screenOptions={{ headerShown: false }}
    />
  );
}
