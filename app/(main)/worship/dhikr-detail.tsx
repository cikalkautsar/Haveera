import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontFamily } from '@/src/theme';

import { Dhikr, DhikrCategory } from '@/src/types/worship.types';
import AppText from '@/src/components/common/AppText';
import AppCard from '@/src/components/common/AppCard';
import Badge from '@/src/components/common/Badge';

import dzikirData from '@/src/data/dzikir.json';

const DHIKRS: Dhikr[] = [
  // Morning (dari dzikir.json)
  ...dzikirData.pagi.map((d: any) => ({
    id: `m${d.id}`,
    category: 'Morning' as DhikrCategory,
    title: d.judul,
    arabic: d.arab,
    transliteration: d.latin || '',
    translation: d.arti,
    source: d.dalil || '',
    repetitionCount: d.ulang
  })),
  // Evening (dari dzikir.json)
  ...dzikirData.petang.map((d: any) => ({
    id: `e${d.id}`,
    category: 'Evening' as DhikrCategory,
    title: d.judul,
    arabic: d.arab,
    transliteration: d.latin || '',
    translation: d.arti,
    source: d.dalil || '',
    repetitionCount: d.ulang
  })),
  // After Prayer
  { id: 'ap1', category: 'After Prayer', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'Subhanallah', translation: 'Glory be to Allah', source: 'Muslim', repetitionCount: 33 },
  { id: 'ap2', category: 'After Prayer', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'All praise be to Allah', source: 'Muslim', repetitionCount: 33 },
  { id: 'ap3', category: 'After Prayer', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', source: 'Muslim', repetitionCount: 33 },
  // Before Sleep
  { id: 'bs1', category: 'Before Sleep', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amutu wa ahya', translation: 'In Your name, O Allah, I die and I live', source: 'Bukhari', repetitionCount: 1 },
  { id: 'bs2', category: 'Before Sleep', arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', transliteration: 'Allahumma qini adhabaka yawma tab\'athu ibadak', translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants', source: 'Abu Dawud', repetitionCount: 3 },
  // After Waking Up
  { id: 'aw1', category: 'After Waking Up', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', transliteration: 'Alhamdulillahil ladhi ahyana ba\'da ma amatana wa ilayhin nushur', translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection', source: 'Bukhari', repetitionCount: 1 },
];

export default function DhikrDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: DhikrCategory }>();
  const category = params.category || 'Morning';

  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);

  const filtered = DHIKRS.filter((d) => d.category === category);

  const renderDhikr = ({ item }: { item: Dhikr }) => (
    <TouchableOpacity
      onPress={() => setSelectedDhikr(item)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${item.category} dhikr`}
    >
      <AppCard style={styles.dhikrCard}>
        <View style={styles.cardHeader}>
          <Badge label={item.category} variant="primary" />
          <Badge label={`×${item.repetitionCount}`} variant="neutral" />
        </View>
        {item.title && (
          <AppText variant="bodyMedium" style={{ fontWeight: '700', marginTop: Spacing.xs }}>
            {item.title}
          </AppText>
        )}
        <AppText
          style={styles.arabicPreview}
          align="right"
          color={Colors.textPrimary}
        >
          {item.arabic}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1}>
          {item.transliteration}
        </AppText>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 40) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">{category} Dhikr</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          {filtered.length} dhikrs available
        </AppText>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderDhikr}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selectedDhikr}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDhikr(null)}
      >
        {selectedDhikr && (
          <View style={[styles.modal, { paddingTop: Math.max(insets.top + Spacing.xl, Spacing.xl) }]}>
            <TouchableOpacity
              onPress={() => setSelectedDhikr(null)}
              style={styles.modalClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <AppText variant="body" color={Colors.textSecondary}>✕</AppText>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBadgeRow}>
                <Badge label={selectedDhikr.category} variant="primary" />
                <Badge label={`Repeat × ${selectedDhikr.repetitionCount}`} variant="neutral" />
              </View>
              {selectedDhikr.title && (
                <AppText variant="title" style={{ marginBottom: Spacing.sm }}>
                  {selectedDhikr.title}
                </AppText>
              )}
              <AppText style={styles.modalArabic} align="right">
                {selectedDhikr.arabic}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.modalSection}>
                {selectedDhikr.transliteration}
              </AppText>
              <View style={styles.divider} />
              <AppText variant="body" style={styles.modalSection}>
                {selectedDhikr.translation}
              </AppText>
              <AppText variant="caption" color={Colors.textDisabled} style={styles.source}>
                Source: {selectedDhikr.source}
              </AppText>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.base,
    gap: 4,
  },
  list: { padding: Spacing.screen, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  dhikrCard: { gap: Spacing.sm },
  cardHeader: { flexDirection: 'row', gap: Spacing.xs },
  arabicPreview: { fontFamily: FontFamily.regular, fontSize: 20, lineHeight: 36 },
  modal: { flex: 1, padding: Spacing.xl, backgroundColor: Colors.background },
  modalClose: { alignSelf: 'flex-end', padding: Spacing.sm, marginBottom: Spacing.sm },
  modalBadgeRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.base },
  modalArabic: { fontFamily: FontFamily.regular, fontSize: 28, lineHeight: 52, color: Colors.textPrimary },
  modalSection: { marginTop: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md },
  source: { marginTop: Spacing.xl, fontStyle: 'italic' },
});
