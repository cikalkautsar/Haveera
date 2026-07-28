import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontFamily } from '@/src/theme';
import { useTasbihCounter, TasbihItem } from '@/src/hooks/useTasbihCounter';
import tasbihData from '@/src/data/tasbih.json';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';

const PRESET_TARGETS = [11, 33, 99, 100];

/**
 * TasbihScreen — digital tasbih counter with circular progress indicator.
 * Tap counter increments, vibration feedback on target completion.
 * Tap history is NOT stored (per feature spec).
 */
export default function TasbihScreen() {
  const router = useRouter();
  const [showPicker, setShowPicker] = React.useState(false);
  
  const {
    count,
    target,
    activeItem,
    isComplete,
    increment,
    reset,
    setTarget,
    setActiveItem,
  } = useTasbihCounter();


  const handleTap = () => {
    if (isComplete) return;
    increment();
    if (count + 1 >= target) {
      Vibration.vibrate([0, 80, 40, 80]);
    } else {
      Vibration.vibrate(20);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">Tasbih Counter</AppText>
      </View>

      {/* Dhikr Text */}
      <TouchableOpacity 
        style={styles.dhikrWrap}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <AppText variant="caption" color={Colors.primary} style={{ marginBottom: 4, fontWeight: '600' }}>
          {activeItem.judul} ▾
        </AppText>
        <AppText
          style={styles.arabicDhikr}
          align="center"
          color={Colors.textPrimary}
        >
          {activeItem.arab}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} align="center">
          {activeItem.latin}
        </AppText>
      </TouchableOpacity>

      {/* Circular Progress Counter */}
      <TouchableOpacity
        style={styles.counterWrap}
        onPress={handleTap}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Count: ${count}. Tap to increment.`}
        disabled={isComplete}
      >
        <View
          style={[
            styles.counterButton,
            { borderColor: isComplete ? Colors.success : Colors.primary },
            isComplete && { backgroundColor: Colors.surface },
          ]}
        >
          <AppText
            style={styles.countNumber}
            color={isComplete ? Colors.success : Colors.textPrimary}
          >
            {count}
          </AppText>
          <AppText
            variant="caption"
            color={isComplete ? Colors.success : Colors.textSecondary}
          >
            {isComplete ? '✓ Selesai' : `dari ${target}`}
          </AppText>
        </View>
      </TouchableOpacity>

      {/* Target presets */}
      <View style={styles.presets}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Target
        </AppText>
        <View style={styles.presetRow}>
          {PRESET_TARGETS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.presetChip, target === t && styles.presetChipActive]}
              onPress={() => setTarget(t)}
              accessibilityRole="button"
              accessibilityLabel={`Set target to ${t}`}
            >
              <AppText
                variant="caption"
                color={target === t ? Colors.textInverse : Colors.textSecondary}
              >
                {t}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reset */}
      <View style={styles.resetWrap}>
        <AppButton
          title="Reset"
          onPress={reset}
          variant="outline"
          size="md"
        />
      </View>

      {/* Complete message */}
      {isComplete && (
        <View style={styles.completeBanner}>
          <AppText variant="title" color={Colors.primary} align="center">
            Alhamdulillah! 🌟
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} align="center">
            May Allah accept your dhikr.
          </AppText>
        </View>
      )}

      {/* Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="title">Pilih Dzikir</AppText>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <AppText color={Colors.textSecondary}>Tutup</AppText>
              </TouchableOpacity>
            </View>
            <FlatList
              data={tasbihData as TasbihItem[]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setActiveItem(item);
                    setShowPicker(false);
                  }}
                >
                  <AppText variant="body" style={{ fontWeight: '600' }}>{item.judul}</AppText>
                  <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1}>{item.arab}</AppText>
                  <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1}>{item.arti}</AppText>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.surfaceAlt }} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screen,
  },
  header: {
    paddingTop: 56,
    paddingBottom: Spacing.base,
    gap: 4,
  },
  dhikrWrap: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  arabicDhikr: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 52,
  },
  counterWrap: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  counterButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 5,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  countNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 72,
    lineHeight: 80,
  },
  presets: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  presetChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    minWidth: 44,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: Colors.primary,
  },
  resetWrap: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  completeBanner: {
    marginTop: Spacing.xl,
    padding: Spacing.base,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.card,
    gap: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.bottomSheet,
    borderTopRightRadius: Radius.bottomSheet,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  modalItem: {
    padding: Spacing.base,
  },
});
