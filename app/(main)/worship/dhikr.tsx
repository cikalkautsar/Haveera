import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '@/src/theme';
import { DhikrCategory } from '@/src/types/worship.types';
import AppText from '@/src/components/common/AppText';
import AppCard from '@/src/components/common/AppCard';

const CATEGORIES: { label: DhikrCategory; description: string }[] = [
  { label: 'Morning', description: 'Dzikir pagi hari' },
  { label: 'Evening', description: 'Dzikir petang hari' },
  { label: 'After Prayer',description: 'Dzikir setelah shalat fardhu' },
  { label: 'Before Sleep',  description: 'Dzikir sebelum tidur' },
  { label: 'After Waking Up', description: 'Dzikir setelah bangun tidur' },
];

export default function DhikrScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(main)/worship/dhikr-detail?category=${item.label}`)}
      activeOpacity={0.8}
    >
      <AppCard style={styles.categoryCard}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <AppText variant="subtitle">{item.label} Dhikr</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {item.description}
            </AppText>
          </View>
          <AppText color={Colors.textSecondary} variant="body">➔</AppText>
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 40) }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">Dhikr</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Remembrance of Allah
        </AppText>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.label}
        renderItem={renderCategory}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      />
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
  categoryCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});
