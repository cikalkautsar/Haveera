import { Stack } from 'expo-router';

export default function WorshipLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dua" />
      <Stack.Screen name="dhikr" />
      <Stack.Screen name="tasbih" />
    </Stack>
  );
}
