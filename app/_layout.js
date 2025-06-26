// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="Splash"      // the file Splash.js
      screenOptions={{ headerShown: false }}
    />
  );
}
