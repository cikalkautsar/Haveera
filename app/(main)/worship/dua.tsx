import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing, Radius, FontFamily, FontSize, GenderColorPalette } from '@/src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGenderColors } from '@/src/hooks/useGenderColors';
import { Doa } from '@/src/types/doa.types';
import { fetchAllDoa } from '@/src/services/doaService';
import AppText from '@/src/components/common/AppText';

export default function DuaScreen() {
  const router = useRouter();
  const C = useGenderColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const insets = useSafeAreaInsets();

  const [doas, setDoas] = useState<Doa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedGrup, setSelectedGrup] = useState<string | null>(null);
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);

  const loadDoa = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllDoa();
      setDoas(data);
    } catch (e: any) {
      setError(e.message ?? 'Gagal memuat doa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoa();
  }, [loadDoa]);

  const groups = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    doas.forEach((d) => {
      if (!seen.has(d.grup)) {
        seen.add(d.grup);
        result.push(d.grup);
      }
    });
    return result;
  }, [doas]);

  const filtered = useMemo(
    () =>
      doas.filter((d) => {
        const matchSearch =
          d.nama.toLowerCase().includes(search.toLowerCase()) ||
          d.translation.toLowerCase().includes(search.toLowerCase()) ||
          d.grup.toLowerCase().includes(search.toLowerCase());
        const matchGrup = selectedGrup ? d.grup === selectedGrup : true;
        return matchSearch && matchGrup;
      }),
    [doas, search, selectedGrup],
  );

  const renderDoa = ({ item }: { item: Doa }) => (
    <TouchableOpacity
      style={styles.doaCard}
      onPress={() => setSelectedDoa(item)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={item.nama}
    >
      <View style={styles.doaCardTop}>
        <View style={styles.doaNameWrap}>
          <AppText variant="bodyMedium">{item.nama}</AppText>
          <AppText variant="caption" color={C.textSecondary}>{item.grup}</AppText>
        </View>
        <AppText style={styles.arabicPreview} color={C.primary} align="right">
          {item.arabic.slice(0, 40)}{item.arabic.length > 40 ? '...' : ''}
        </AppText>
      </View>
      {!!item.translation && (
        <AppText variant="bodySmall" color={C.textSecondary} style={styles.translationPreview}>
          {item.translation.slice(0, 100)}{item.translation.length > 100 ? '...' : ''}
        </AppText>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 40) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={C.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">Doa Harian</AppText>
        <AppText variant="caption" color={C.textSecondary}>
          Kumpulan doa shahih dari Hisnul Muslim
        </AppText>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari doa..."
          placeholderTextColor={C.textDisabled}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Cari doa"
        />
      </View>

      {!loading && !error && groups.length > 0 && (
        <View style={{ flexGrow: 0, paddingBottom: Spacing.sm }}>
          <FlatList
            data={['Semua', ...groups]}
            horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(g) => g}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item: g }) => {
            const isAll = g === 'Semua';
            const active = isAll ? selectedGrup === null : selectedGrup === g;
            return (
              <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedGrup(isAll ? null : g)}
                accessibilityRole="button"
                accessibilityLabel={g}
              >
                <AppText
                  variant="caption"
                  color={active ? C.white : C.textSecondary}
                >
                  {g}
                </AppText>
              </TouchableOpacity>
            );
          }}
        />
        </View>
      )}

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <AppText variant="caption" color={C.textSecondary} style={{ marginTop: 8 }}>
            Memuat doa...
          </AppText>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <AppText variant="body" color={C.error} align="center">{error}</AppText>
          <TouchableOpacity onPress={loadDoa} style={styles.retryBtn}>
            <AppText variant="bodyMedium" color={C.primary}>Coba lagi</AppText>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          style={{ flex: 1 }}
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDoa}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <AppText variant="body" color={C.textSecondary} align="center">
                Doa tidak ditemukan
              </AppText>
            </View>
          }
        />
      )}


      <Modal
        visible={!!selectedDoa}
        animationType="slide"
        onRequestClose={() => setSelectedDoa(null)}
        presentationStyle="pageSheet"
      >
        {selectedDoa && (
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <AppText variant="title">{selectedDoa.nama}</AppText>
                <AppText variant="caption" color={C.textSecondary}>
                  {selectedDoa.grup}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDoa(null)}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Tutup"
              >
                <AppText variant="bodyMedium" color={C.primary}>✕</AppText>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >

              {!!selectedDoa.arabic && (
                <AppText style={styles.arabicFull} align="right" color={C.textPrimary}>
                  {selectedDoa.arabic}
                </AppText>
              )}

              {!!selectedDoa.transliteration && (
                <View style={styles.section}>
                  <AppText variant="caption" color={C.textSecondary} style={styles.sectionLabel}>
                    Transliterasi
                  </AppText>
                  <AppText variant="body" style={styles.transliterationText as any}>
                    {selectedDoa.transliteration}
                  </AppText>
                </View>
              )}

              {!!selectedDoa.translation && (
                <View style={styles.section}>
                  <AppText variant="caption" color={C.textSecondary} style={styles.sectionLabel}>
                    Terjemahan
                  </AppText>
                  <AppText variant="body">{selectedDoa.translation}</AppText>
                </View>
              )}

              {!!selectedDoa.tentang && (
                <View style={[styles.section, styles.hadithBox]}>
                  <AppText variant="caption" color={C.textSecondary} style={styles.sectionLabel}>
                    📖 Keterangan
                  </AppText>
                  <AppText variant="bodySmall" color={C.textSecondary}>
                    {selectedDoa.tentang}
                  </AppText>
                </View>
              )}

              {selectedDoa.tags.length > 0 && (
                <View style={styles.tagRow}>
                  {selectedDoa.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <AppText variant="caption" color={C.primary}>#{tag}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

function makeStyles(C: GenderColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.background },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.base,
    gap: 4,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.sm,
  },
    searchInput: {
      backgroundColor: C.surface,
      borderRadius: Radius.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      fontFamily: FontFamily.regular,
      fontSize: FontSize.body,
      color: C.textPrimary,
      borderWidth: 1,
      borderColor: C.border,
      minHeight: 48,
    },
  chipRow: {
    paddingHorizontal: Spacing.screen,
    gap: Spacing.sm,
  },
    chip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: C.border,
      backgroundColor: C.surface,
    },
    chipActive: {
      backgroundColor: C.primary,
      borderColor: C.primary,
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
    gap: Spacing.sm,
  },
    doaCard: {
      backgroundColor: C.surface,
      borderRadius: Radius.card,
      padding: Spacing.base,
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: C.border,
    },
  doaCardTop: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  doaNameWrap: { flex: 1, gap: 2 },
  arabicPreview: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 28,
    maxWidth: 120,
  },
  translationPreview: { lineHeight: 20 },
    // Modal
    modal: { flex: 1, backgroundColor: C.background },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: Spacing.screen,
      paddingTop: Spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: C.divider,
      gap: Spacing.md,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radius.full,
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    },
  modalScroll: { flex: 1 },
  modalContent: {
    padding: Spacing.screen,
    gap: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  arabicFull: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
    lineHeight: 48,
    writingDirection: 'rtl',
  },
  section: { gap: Spacing.xs },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transliterationText: { fontStyle: 'italic', color: C.textSecondary },
    hadithBox: {
      backgroundColor: C.surface,
      borderRadius: Radius.sm,
      padding: Spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
    },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
    tag: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: C.primaryLight,
    },
  });
}
