import { Stack } from 'expo-router';
import { AuthProvider } from './_contexts/AuthContext';
import { HabitsProvider } from './_contexts/HabitsContext'; // ✅ import this

export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider> {/* ✅ Wrap everything inside this */}
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
        </Stack>
      </HabitsProvider>
    </AuthProvider>
  );
}
