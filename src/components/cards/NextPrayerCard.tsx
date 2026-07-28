/**
 * NextPrayerCard — Liquid Glass hero card.
 * Prominent display of next prayer with gradient background.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { NextPrayer } from '@/src/types/prayer.types';
import AppText from '../common/AppText';

interface NextPrayerCardProps {
  prayer: NextPrayer;
  onPress?: () => void;
}

const NextPrayerCard: React.FC<NextPrayerCardProps> = ({ prayer, onPress }) => {
  const { C } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} accessibilityRole="button">
      <View style={[styles.wrapper, { shadowColor: C.primary }]}>
        {/* Main gradient */}
        <LinearGradient
          colors={[C.primaryMedium, C.primary, C.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Glass shimmer overlay */}
        <LinearGradient
          colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay }]}
        />

        {/* Decorative blob */}
        <View style={[styles.blob, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        <View style={[styles.blobSmall, { backgroundColor: 'rgba(255,255,255,0.07)' }]} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <AppText variant="caption" color="rgba(255,255,255,0.9)" style={styles.badgeText}>
              SHOLAT BERIKUTNYA
              </AppText>
            </View>
            <View style={styles.timePill}>
              <AppText variant="caption" color="rgba(255,255,255,0.95)" style={{ fontWeight: '700' }}>
                {prayer.time}
              </AppText>
            </View>
          </View>

          <AppText variant="heading" color="#FFFFFF" style={styles.prayerName}>
            {prayer.name}
          </AppText>

          <View style={styles.countdownRow}>
            <AppText variant="caption" color="rgba(255,255,255,0.75)">dalam</AppText>
            <View style={styles.countdownPill}>
              <AppText style={styles.countdownText}>{prayer.countdown}</AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.clay,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
    minHeight: 160,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.sm,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  timePill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  prayerName: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: Spacing.xs,
    color: '#FFFFFF',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  countdownPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.base,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  countdownText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  // Decorative blobs
  blob: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -40,
    right: -30,
  },
  blobSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    bottom: -20,
    right: 60,
  },
});

export default NextPrayerCard;
