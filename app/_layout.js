// app/_layout.js
import { Stack } from 'expo-router';
import { AuthProvider } from './_contexts/AuthContext';
import { HabitsProvider } from './_contexts/HabitsContext';

export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <Stack
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" options={{ headerShown: false }} />
          <Stack.Screen name="Home" options={{ headerShown: false }} />
          <Stack.Screen name="add-habit" options={{ headerShown: false }} />
          <Stack.Screen name="Streaks" options={{ headerShown: false }} />
          {/* Add more screens like Favorites, edit-habit, etc. as needed */}
        </Stack>
      </HabitsProvider>
    </AuthProvider>
  );
}
