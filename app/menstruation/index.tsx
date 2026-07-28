import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import GlassCard from '@/src/components/common/GlassCard';

export default function MenstruationScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[C.accent + '33', C.background, C.primaryLight + '55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AppText style={{ fontSize: 24, color: C.textPrimary }}>←</AppText>
        </TouchableOpacity>
        <AppText variant="heading" style={{ fontSize: 22 }}>Kalender Menstruasi</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer scrollable>
        <GlassCard tint={[C.accent, C.secondary]} intensity="light" style={styles.card}>
          <View style={styles.content}>
            <AppText variant="title" align="center" style={{ fontSize: 22 }}>
              Fitur Segera Hadir
            </AppText>
            <AppText variant="body" color={C.textSecondary} align="center" style={{ marginTop: Spacing.sm, lineHeight: 22 }}>
              Kalender menstruasi khusus Akhwat sedang dalam tahap pengembangan. Nantinya kamu bisa melacak siklus, mencatat hari libur sholat, dan mendapatkan notifikasi pengingat mandi wajib.
            </AppText>
            
            <View style={[styles.badge, { backgroundColor: C.accent + '22' }]}>
              <AppText variant="caption" color={C.accent} style={{ fontWeight: '700' }}>
                Akhwat Only Feature
              </AppText>
            </View>
          </View>
        </GlassCard>
      </ScreenContainer>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useTheme>['C']) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.screen,
      paddingTop: 60,
      paddingBottom: Spacing.base,
    },
    backBtn: { padding: Spacing.xs },
    card: {
      marginTop: Spacing.xl,
      marginHorizontal: Spacing.screen,
    },
    content: {
      alignItems: 'center',
      padding: Spacing.xxl,
      paddingVertical: Spacing.xxxl,
    },
    badge: {
      marginTop: Spacing.xl,
      paddingHorizontal: Spacing.base,
      paddingVertical: 8,
      borderRadius: Radius.full,
    }
  });
}
