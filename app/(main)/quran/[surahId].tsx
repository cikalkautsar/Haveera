import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontFamily } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { fetchSurahDetail } from '@/src/services/quranService';
import { Ayah, SurahDetail } from '@/src/types/quran.types';
import { useFavoriteAyahs } from '@/src/hooks/useFavoriteAyahs';
import AppText from '@/src/components/common/AppText';
import AppCard from '@/src/components/common/AppCard';

/**
 * QuranReaderScreen — menampilkan ayat-ayat dari surah yang dipilih.
 * Data diambil secara real-time dari equran.id API.
 */
export default function QuranReaderScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [fontSize, setFontSize] = useState(26);

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchFavoritesForSurah, toggleFavorite, isFavorite } = useFavoriteAyahs();

  const surahNum = parseInt(surahId ?? '1', 10);

  const loadSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSurahDetail(surahNum);
      setSurah(data);
    } catch (e: any) {
      setError(e.message ?? 'Gagal memuat surah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurah();
    fetchFavoritesForSurah(surahNum);
  }, [surahNum]);

  const renderAyah = ({ item }: { item: Ayah }) => {
    const fav = isFavorite(surahNum, item.number);
    return (
      <AppCard style={styles.ayahCard}>
        <View style={styles.ayahTopRow}>
          <View style={[styles.ayahNumber, { backgroundColor: C.primaryLight }]}>
            <AppText variant="caption" color={C.primary}>
              {item.number}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorite(
              surahNum,
              surah?.nameTransliteration || '',
              item.number,
              item.arabic,
              item.translation,
            )}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.favBtn, fav && { backgroundColor: C.error + '15' }]}
          >
            <AppText style={{ fontSize: 16 }}>{fav ? '❤️' : '🤍'}</AppText>
          </TouchableOpacity>
        </View>

        <AppText
          style={[styles.arabicText, { fontSize }]}
          align="right"
          color={C.textPrimary}
        >
          {item.arabic}
        </AppText>

        {showTransliteration && item.transliteration ? (
          <AppText variant="caption" color={C.textSecondary} style={styles.transliteration}>
            {item.transliteration}
          </AppText>
        ) : null}

        {showTranslation && (
          <AppText variant="bodySmall" color={C.textSecondary} style={styles.translation}>
            {item.translation}
          </AppText>
        )}
      </AppCard>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>

        {surah && (
          <View style={styles.surahTitle}>
            <AppText variant="title" align="center">
              {surah.nameTransliteration}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} align="center">
              {surah.nameTranslation} · {surah.totalAyahs} Ayat · {surah.revelationType}
            </AppText>
            <AppText style={styles.arabicTitle} align="center">
              {surah.nameArabic}
            </AppText>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setFontSize((f) => Math.max(18, f - 2))}
            style={styles.controlBtn}
            accessibilityLabel="Perkecil teks Arab"
          >
            <AppText variant="label" color={Colors.textSecondary}>A-</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFontSize((f) => Math.min(40, f + 2))}
            style={styles.controlBtn}
            accessibilityLabel="Perbesar teks Arab"
          >
            <AppText variant="label" color={Colors.textSecondary}>A+</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTransliteration((t) => !t)}
            style={[styles.controlBtn, showTransliteration && styles.controlBtnActive]}
            accessibilityLabel="Toggle transliterasi"
          >
            <AppText variant="caption" color={showTransliteration ? Colors.primary : Colors.textSecondary}>
              TR
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTranslation((t) => !t)}
            style={[styles.controlBtn, showTranslation && styles.controlBtnActive]}
            accessibilityLabel="Toggle terjemahan"
          >
            <AppText variant="caption" color={showTranslation ? Colors.primary : Colors.textSecondary}>
              ID
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 8 }}>
            Memuat ayat...
          </AppText>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={styles.center}>
          <AppText variant="body" color={Colors.error} align="center">{error}</AppText>
          <TouchableOpacity onPress={loadSurah} style={styles.retryBtn}>
            <AppText variant="bodyMedium" color={Colors.primary}>Coba lagi</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Ayah List */}
      {!loading && !error && surah && (
        <FlatList
          data={surah.ayahs}
          keyExtractor={(item) => String(item.number)}
          renderItem={renderAyah}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  surahTitle: {
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  arabicTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignSelf: 'flex-end',
  },
  controlBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 36,
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
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
    padding: Spacing.screen,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  ayahCard: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ayahTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ayahNumber: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicText: {
    fontFamily: FontFamily.regular,
    lineHeight: 52,
    writingDirection: 'rtl',
  },  
  transliteration: {
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  translation: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
});
