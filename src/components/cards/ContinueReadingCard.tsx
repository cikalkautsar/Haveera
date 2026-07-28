/**
 * ContinueReadingCard — Liquid glass card for Quran last-read position.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { LastRead } from '@/src/types/quran.types';
import AppText from '../common/AppText';

interface ContinueReadingCardProps {
  lastRead: LastRead;
  onPress: () => void;
}

const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({ lastRead, onPress }) => {
  const { C } = useTheme();

  return (
    <View style={[styles.wrapper, { shadowColor: C.accent }]}>
      {/* Glass gradient background */}
      <LinearGradient
        colors={[C.accent + '28', C.secondary + '18']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Base surface */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.surface, opacity: 0.75 }]} />
      {/* Shimmer */}
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay }]}
      />

      <View style={styles.content}>
        {/* Left */}
        <View style={styles.left}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image 
              source={require('@/assets/images/alquran.png')} 
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
            <AppText variant="caption" color={C.accent} style={{ fontWeight: '700', letterSpacing: 0.5 }}>
              LANJUT BACA
            </AppText>
          </View>
          <AppText variant="title" style={{ marginTop: 4 }}>{lastRead.surahName}</AppText>
          <AppText variant="caption" color={C.textSecondary}>
            Ayat {lastRead.ayahNumber} · Surah {lastRead.surahNumber}
          </AppText>
        </View>

        {/* Resume button */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Lanjut baca ${lastRead.surahName}`}
        >
          <LinearGradient
            colors={[C.accent, C.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.resumeBtn}
          >
            <AppText color="#FFFFFF" style={{ fontWeight: '700', fontSize: 13 }}>
              Lanjut →
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.clay,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    gap: Spacing.base,
    zIndex: 2,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  resumeBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default ContinueReadingCard;
