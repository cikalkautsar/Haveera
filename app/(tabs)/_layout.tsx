import { Stack } from 'expo-router';

/** Legacy tabs layout — routes redirect to new (main) structure. */
export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
