import { Redirect } from 'expo-router';

/** Legacy explore tab — redirect to new main home. */
export default function ExploreTab() {
  return <Redirect href="/(main)/home" />;
}
