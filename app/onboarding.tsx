import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontFamily, FontSize } from '@/src/theme';
import { useAuthStore } from '@/src/store/authStore';
import AppText from '@/src/components/common/AppText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {/* Arabic Greeting */}
      <View style={styles.topSection}>
        <AppText style={styles.arabic}>ٱلسَّلَامُ عَلَيْكُمْ</AppText>
        <AppText style={styles.title}>Selamat Datang di{'\n'}Haveera!</AppText>
      </View>

      {/* Characters */}
      <View style={styles.charactersRow}>
        <Image
          source={require('@/assets/images/Ikhwan.png')}
          style={styles.characterLeft}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/Akhwat.png')}
          style={styles.characterRight}
          resizeMode="contain"
        />
      </View>

      {/* CTA Button */}
      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Mulai"
        >
          <AppText style={styles.buttonText}>Bismillah yuk mulai</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxl,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.12,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  arabic: {
    fontFamily: FontFamily.regular,
    fontSize: 28,
    color: '#222',
    textAlign: 'center',
    lineHeight: 44,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 38,
  },
  charactersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 0,
  },
  characterLeft: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_WIDTH * 0.55,
  },
  characterRight: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_WIDTH * 0.55,
  },
  buttonWrap: {
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.body,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
