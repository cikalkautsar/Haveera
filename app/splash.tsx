import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/src/theme';
import AppText from '@/src/components/common/AppText';
import { supabase } from '@/supabase';
import { useAuthStore, mapSupabaseUser } from '@/src/store/authStore';


export default function SplashScreen() {
  const router = useRouter();
  const { setUser, isOnboardingComplete } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user));
        router.replace('/(main)/home');
      } else {
        router.replace('/onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Image source={require('@/assets/images/haveera.jpg')} style={styles.logoImage} /> 
        </View>
        <AppText variant="display" color={Colors.primary} style={styles.appName}>
          Haveera
        </AppText>
        <AppText variant="body" color={Colors.textSecondary} align="center">
          Your Digital Islamic Companion
        </AppText>
      </View>

      <AppText variant="caption" color={Colors.textDisabled} align="center">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.background || '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  logoWrap: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors?.surface || '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors?.primary || '#000',
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    letterSpacing: 1,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

});
