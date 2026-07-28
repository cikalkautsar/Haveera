import { ThemeProvider } from '@/src/context/ThemeContext';
import { mapSupabaseUser, useAuthStore } from '@/src/store/authStore';
import { Colors } from '@/src/theme';
import { supabase } from '@/supabase';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Listen to real-time Supabase auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          // Session gone (logout or expired)
          setUser(null);
          // Only force back to login if the user explicitly signs out.
          // This allows the initial splash screen and onboarding to render properly.
          if (_event === 'SIGNED_OUT') {
            router.replace('/auth/login');
          }
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthGuard />
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(main)" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
