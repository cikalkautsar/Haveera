import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontFamily, FontSize } from '@/src/theme';
import { Surah } from '@/src/types/quran.types';
import { fetchAllSurahs } from '@/src/services/quranService';
import AppText from '@/src/components/common/AppText';
import Badge from '@/src/components/common/Badge';

/**
 * QuranScreen — daftar 114 surah dari equran.id API dengan search.
 */
export default function QuranScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSurahs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSurahs();
      setSurahs(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load surahs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSurahs();
  }, [loadSurahs]);

  const filtered = surahs.filter(
    (s) =>
      s.nameTransliteration.toLowerCase().includes(search.toLowerCase()) ||
      s.nameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search),
  );

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => router.push(`/(main)/quran/${item.number}`)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Surah ${item.nameTransliteration}`}
    >
      <View style={styles.numberBadge}>
        <AppText variant="caption" color={Colors.primary} align="center">
          {item.number}
        </AppText>
      </View>

      <View style={styles.surahInfo}>
        <AppText variant="bodyMedium">{item.nameTransliteration}</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          {item.nameTranslation} · {item.totalAyahs} Ayat
        </AppText>
      </View>

      <View style={styles.rightCol}>
        <AppText style={styles.arabicName} color={Colors.textPrimary}>
          {item.nameArabic}
        </AppText>
        <Badge
          label={item.revelationType}
          variant={item.revelationType === 'Meccan' ? 'primary' : 'info'}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="heading">Al-Quran</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Read and reflect
        </AppText>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari surah..."
          placeholderTextColor={Colors.textDisabled}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search surah"
        />
      </View>

      {/* States */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 8 }}>
            Memuat daftar surah...
          </AppText>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <AppText variant="body" color={Colors.error} align="center">{error}</AppText>
          <TouchableOpacity onPress={loadSurahs} style={styles.retryBtn}>
            <AppText variant="bodyMedium" color={Colors.primary}>Coba lagi</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.number)}
          renderItem={renderSurah}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 56,
    paddingBottom: Spacing.base,
    gap: 4,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
  },
  retryBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xxxl,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 64,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahInfo: {
    flex: 1,
    gap: 3,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  arabicName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.divider,
  },
});
