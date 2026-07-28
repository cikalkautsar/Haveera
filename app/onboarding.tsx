import AppText from '@/src/components/common/AppText';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, FontFamily, Spacing } from '@/src/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const { width, height } = useWindowDimensions();

  const handleStart = () => {
    completeOnboarding();
    router.replace('/auth/login');
  };

  const imgWidth = width * 0.48;
  const imgHeight = Math.min(imgWidth * 1.4, height * 0.52);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleStart}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel="Mulai"
    >
      {/* Arabic Greeting */}
      <View style={[styles.topSection, { paddingTop: height * 0.07 }]}>
        <AppText style={styles.arabic}>ٱلسَّلَامُ عَلَيْكُمْ</AppText>
        <AppText style={styles.title}>Selamat Datang di{'\n'}Haveera!</AppText>
      </View>

      {/* Characters */}
      <View style={[styles.charactersRow, { width }]}>
        <Image
          source={require('@/assets/images/Ikhwan.png')}
          style={{ width: imgWidth, height: imgHeight }}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/Akhwat.png')}
          style={{ width: imgWidth, height: imgHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Tap hint — center of screen */}
      <View style={styles.hintWrap} pointerEvents="none">
        <AppText style={styles.hintText}>Ketuk di mana saja untuk mulai</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  arabic: {
    fontFamily: FontFamily.regular,
    fontSize: 26,
    color: '#222',
    textAlign: 'center',
    lineHeight: 42,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 36,
  },
  charactersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
  },
  hintWrap: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  hintText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
});
