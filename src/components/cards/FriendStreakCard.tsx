import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { ActiveStreak } from '@/src/hooks/useStreaks';
import { usePrayerTimes } from '@/src/hooks/usePrayerTimes';
import AppText from '../common/AppText';
import Avatar from '../common/Avatar';

interface FriendStreakCardProps {
  streak: ActiveStreak;
  onCheckin: (id: string) => void;
  isCheckingIn?: boolean;
}

const FriendStreakCard: React.FC<FriendStreakCardProps> = ({ streak, onCheckin, isCheckingIn }) => {
  const { C } = useTheme();
  const { checklist } = usePrayerTimes();

  // Pulse animation for the check-in button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!streak.my_completed_today) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [streak.my_completed_today]);

  // --- Tahajud Logic ---
  const isTahajudStreak = useMemo(() => {
    const title = streak.streak_title?.toLowerCase() || '';
    return title.includes('tahajud') || title.includes('tahajjud');
  }, [streak.streak_title]);

  const isTahajudTime = useMemo(() => {
    if (!isTahajudStreak) return true;
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const currentStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const subuhPrayer = checklist.prayers.find(p => p.name === 'Subuh');
    const subuhTime = subuhPrayer?.time || '04:30';
    return currentStr >= '00:00' && currentStr < subuhTime;
  }, [isTahajudStreak, checklist]);

  // --- Puasa Daud Logic ---
  // Puasa Daud = puasa berselang-seling (1 hari puasa, 1 hari istirahat)
  const isPuasaDaud = useMemo(() => {
    const title = streak.streak_title?.toLowerCase() || '';
    return title.includes('puasa daud') || title.includes('daud');
  }, [streak.streak_title]);

  // Hari istirahat saya: sudah checkin kemarin, belum checkin hari ini
  const isMyRestDay = isPuasaDaud && streak.my_completed_yesterday && !streak.my_completed_today;

  // Hari istirahat teman: sudah checkin kemarin, belum checkin hari ini
  const isFriendRestDay = isPuasaDaud && streak.friend_completed_yesterday && !streak.friend_completed_today;

  const streakName = streak.streak_title || 'Streak Bersama';
  const bothDone = streak.my_completed_today && streak.friend_completed_today;

  return (
    <View style={styles.outerWrap}>
      {/* Glassmorphism Card */}
      <LinearGradient
        colors={[
          C.primary + '12',
          C.primaryLight + 'DD',
          C.surface,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: C.primary + '18' }]}
      >
        {/* ── Top Row: Title + Day Count ── */}
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <AppText variant="title" style={{ flex: 1 }} numberOfLines={1}>
              {streakName}
            </AppText>
          </View>
          <View style={[styles.dayBadge, { backgroundColor: C.primary + '15' }]}>
            <AppText style={[styles.dayCount, { color: C.primary }]}>
              {streak.total_days}
            </AppText>
            <AppText variant="caption" color={C.primary} style={{ fontSize: 10, fontWeight: '600' }}>
              hari
            </AppText>
          </View>
        </View>

        {/* ── Participants Row ── */}
        <View style={styles.participantsRow}>
          {/* Me */}
          <View style={styles.personChip}>
            <Avatar name="You" size={28} />
            <View style={{ flex: 1 }}>
              <AppText variant="caption" style={{ fontWeight: '700' }}>Kamu</AppText>
            </View>
            {streak.my_completed_today ? (
              <View style={[styles.statusDot, { backgroundColor: C.success || '#22C55E' }]}>
                <AppText style={{ fontSize: 10, color: '#fff' }}>✓</AppText>
              </View>
            ) : isMyRestDay ? (
              <View style={[styles.statusDot, { backgroundColor: C.warning + '33' }]}>
                <AppText style={{ fontSize: 10 }}>🌙</AppText>
              </View>
            ) : (
              <View style={[styles.statusDot, { backgroundColor: C.textDisabled + '55' }]}>
                <AppText style={{ fontSize: 10, color: C.textDisabled }}>·</AppText>
              </View>
            )}
          </View>

          <View style={styles.personChip}>
            <Avatar name={streak.friend_full_name || streak.friend_username} size={28} />
            <View style={{ flex: 1 }}>
              <AppText variant="caption" style={{ fontWeight: '700' }} numberOfLines={1}>
                {streak.friend_full_name || streak.friend_username}
              </AppText>
            </View>
            {streak.friend_completed_today ? (
              <View style={[styles.statusDot, { backgroundColor: C.success || '#22C55E' }]}>
                <AppText style={{ fontSize: 10, color: '#fff' }}>✓</AppText>
              </View>
            ) : isFriendRestDay ? (
              <View style={[styles.statusDot, { backgroundColor: C.warning + '33' }]}>
                <AppText style={{ fontSize: 10 }}>🌙</AppText>
              </View>
            ) : (
              <View style={[styles.statusDot, { backgroundColor: C.textDisabled + '55' }]}>
                <AppText style={{ fontSize: 10, color: C.textDisabled }}>·</AppText>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: C.primary + '10' }]} />

        {streak.my_completed_today ? (
          <View style={styles.completedSection}>
            <View style={[styles.completedBadge, { backgroundColor: (C.success || '#22C55E') + '18' }]}>
              <AppText variant="body" color={C.success || '#22C55E'} style={{ fontWeight: '700' }}>
                {bothDone ? 'Kalian berdua sudah selesai hari ini!' : 'Kamu sudah selesai hari ini!'}
              </AppText>
            </View>
          </View>
        ) : isMyRestDay ? (
          // Hari istirahat Puasa Daud — boleh tidak check-in hari ini
          <View style={styles.lockedSection}>
            <View style={[styles.restDayBadge, { backgroundColor: C.warning + '12', borderColor: C.warning + '30' }]}>
              <AppText style={{ fontSize: 20 }}>🌙</AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="caption" color={C.warning} style={{ fontWeight: '800' }}>
                  Hari Istirahat Puasa Daud
                </AppText>
                <AppText variant="caption" color={C.textSecondary} style={{ fontSize: 11, marginTop: 1 }}>
                  Besok waktunya puasa lagi — streak tetap aman!
                </AppText>
              </View>
            </View>
          </View>
        ) : !isTahajudTime ? (
          <View style={styles.lockedSection}>
            <View style={[styles.lockedBadge, { backgroundColor: C.warning + '15' }]}>
              <AppText style={{ fontSize: 16 }}>🌙</AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="caption" color={C.warning} style={{ fontWeight: '700' }}>
                  Belum waktunya
                </AppText>
                <AppText variant="caption" color={C.textSecondary} style={{ fontSize: 11 }}>
                  Bisa diisi saat waktu Tahajud (00:00 – Subuh)
                </AppText>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.checkinSection}>
            <AppText variant="body" color={C.textSecondary} style={styles.questionText}>
              Apakah kamu sudah{'\n'}
              <AppText variant="body" style={{ fontWeight: '800', color: C.textPrimary }}>
                {streakName}
              </AppText>
              {' '}hari ini?
            </AppText>

            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onCheckin(streak.friendship_id)}
                disabled={isCheckingIn}
              >
                <LinearGradient
                  colors={[C.primary, C.primaryMedium || C.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.checkinBtn}
                >
                  {isCheckingIn ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <AppText variant="label" color="#FFFFFF" style={{ fontWeight: '800', letterSpacing: 0.5 }}>
                        Sudah, Alhamdulillah!
                      </AppText>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrap: {
    marginBottom: 4,
  },
  card: {
    borderRadius: Radius.clay,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  fireEmoji: { fontSize: 22 },
  dayBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    minWidth: 52,
  },
  dayCount: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  participantsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 2,
  },
  personChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: Radius.button,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    borderRadius: 1,
    marginVertical: 2,
  },
  completedSection: {
    paddingVertical: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.button,
  },
  lockedSection: {
    paddingVertical: 4,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.button,
  },
  restDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.button,
    borderWidth: 1,
  },
  checkinSection: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: 4,
    paddingBottom: 2,
  },
  questionText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  checkinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Radius.button,
  },
});

export default FriendStreakCard;

