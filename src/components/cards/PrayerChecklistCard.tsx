import { useTheme } from '@/src/context/ThemeContext';
import { Radius, Spacing } from '@/src/theme';
import { Prayer } from '@/src/types/prayer.types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../common/AppText';

interface PrayerChecklistCardProps {
  prayers: Prayer[];
  onToggle: (prayerName: Prayer['name']) => void;
}

const PrayerChecklistCard: React.FC<PrayerChecklistCardProps> = ({ prayers, onToggle }) => {
  const { C } = useTheme();
  const doneCount = prayers.filter((p) => p.status === 'completed').length;
  const progress = prayers.length > 0 ? doneCount / prayers.length : 0;

  return (
    <View style={[styles.wrapper, { backgroundColor: C.surface, shadowColor: C.secondary }]}>
      <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />

      <View style={styles.header}>
        <View>
          <AppText variant="title">Sholat Hari Ini</AppText>
          <AppText variant="caption" color={C.textSecondary} style={{ marginTop: 2 }}>
            {doneCount} dari {prayers.length} selesai
          </AppText>
        </View>

        <View style={[styles.progressCircle, { borderColor: C.primaryMedium }]}>
          <AppText style={[styles.progressText, { color: C.primary }]}>
            {Math.round(progress * 100)}%
          </AppText>
        </View>
      </View>

      <View style={[styles.progressBar, { backgroundColor: C.surfaceAlt }]}>
        <LinearGradient
          colors={[C.primaryMedium, C.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.list}>
        {prayers.map((prayer) => (
          <PrayerItem key={prayer.name} prayer={prayer} onToggle={onToggle} />
        ))}
      </View>
    </View>
  );
};

interface PrayerItemProps {
  prayer: Prayer;
  onToggle: (name: Prayer['name']) => void;
}

const PrayerItem: React.FC<PrayerItemProps> = ({ prayer, onToggle }) => {
  const { C } = useTheme();
  const isCompleted = prayer.status === 'completed';
  const isMissed = prayer.status === 'missed';
  const isPending = !isCompleted && !isMissed;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onToggle(prayer.name)}
      activeOpacity={0.75}
      accessibilityRole="checkbox"
      accessibilityLabel={`${prayer.name} ${prayer.status}`}
    >
      {/* Indicator circle */}
      <View
        style={[
          styles.indicator,
          isCompleted
            ? { backgroundColor: C.primary, shadowColor: C.primary }
            : isMissed
              ? { backgroundColor: C.warning, shadowColor: C.warning }
              : {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: C.border || '#D1D5DB',
              },
        ]}
      >
        {isCompleted && <AppText style={styles.checkmark}>✓</AppText>}
        {isMissed && <AppText style={[styles.checkmark, { color: '#fff' }]}>!</AppText>}
      </View>

      <View style={styles.info}>
        <AppText variant="bodyMedium">{prayer.name}</AppText>
        <AppText variant="caption" color={C.textSecondary}>{prayer.time}</AppText>
      </View>

      {isPending ? (
        <View style={[styles.outlineBtn, { borderColor: C.primary }]}>
          <AppText style={[styles.outlineBtnText, { color: C.primary }]}>Belum</AppText>
        </View>
      ) : isCompleted ? (
        <View style={[styles.filledBtn, { backgroundColor: C.primary }]}>
          <AppText style={styles.filledBtnText}>✓ Selesai</AppText>
        </View>
      ) : (
        <View style={[styles.filledBtn, { backgroundColor: C.warning }]}>
          <AppText style={styles.filledBtnText}>Terlewat</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.clay,
    padding: Spacing.xl,
    gap: Spacing.base,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 7,
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: Radius.clay,
    borderTopRightRadius: Radius.clay,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontWeight: '800',
    fontSize: 13,
  },
  progressBar: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
    minWidth: 8,
  },
  list: { gap: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
    minHeight: 52,
  },
  indicator: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  info: { flex: 1, gap: 2 },
  /* Outlined button — visible border, transparent fill (not yet done) */
  outlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  outlineBtnText: {
    fontWeight: '700',
    fontSize: 12,
  },
  /* Filled button — solid color (done / missed) */
  filledBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  filledBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default PrayerChecklistCard;
