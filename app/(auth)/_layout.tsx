import { Stack } from 'expo-router';

/**
 * Auth stack layout — covers Login and Register screens.
 * No header; each screen handles its own back navigation.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
