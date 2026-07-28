import { Redirect } from 'expo-router';

/** Legacy default tab — redirect to new main home. */
export default function TabsIndex() {
  return <Redirect href="/(main)/home" />;
}
