/**
 * InviteStreakModal — modal untuk mencari user berdasarkan username
 * dan mengundang mereka ke streak bersama.
 *
 * Flow:
 *  1. User ketik username → debounce 400ms → query profiles table via RPC
 *  2. Tampilkan hasil pencarian dengan avatar
 *  3. Tekan "Undang" → kirim undangan (insert ke friendships/streak_invites)
 */
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius, FontFamily, FontSize } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuthStore } from '@/src/store/authStore';
import { supabase } from '@/supabase';
import AppText from '@/src/components/common/AppText';
import Avatar from '@/src/components/common/Avatar';

interface SearchResult {
  id: string;
  username: string;
  full_name: string;
  gender: string | null;
}

interface InviteStreakModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTED_TITLES = ['Tahajjud Challenge', 'Tilawah 1 Juz', 'Puasa Daud', 'Dzikir Pagi Petang'];

const InviteStreakModal: React.FC<InviteStreakModalProps> = ({ visible, onClose }) => {
  const { C } = useTheme();
  const { user } = useAuthStore();

  const [streakTitle, setStreakTitle] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [noResult, setNoResult] = useState(false);

  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      setNoResult(false);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (text.trim().length < 2) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.rpc('search_users_by_username', {
            search_query: text.trim(),
            current_user_id: user?.id ?? '00000000-0000-0000-0000-000000000000',
          });

          if (error) throw error;
          setResults(data ?? []);
          setNoResult((data ?? []).length === 0 && text.trim().length >= 2);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [user?.id],
  );

  // ── Invite ──────────────────────────────────────────────────────────────────
  const handleSendInvite = useCallback(
    async () => {
      if (!user?.id || !selectedUser) return;
      setInvitingId(selectedUser.id);
      try {
        const { error } = await supabase.rpc('send_invite', {
          p_requester_id: user.id,
          p_receiver_id: selectedUser.id,
          p_streak_title: streakTitle.trim() || null,
        });

        if (error) {
          throw error;
        }

        setInvitedIds((prev) => new Set(prev).add(selectedUser.id));
        setSelectedUser(null);
        Alert.alert('Berhasil', `Undangan streak berhasil terkirim ke ${selectedUser.username}!`);
      } catch (err: any) {
        Alert.alert('Gagal Mengirim Undangan', err?.message || 'Terjadi kesalahan.');
        console.warn('Invite error:', err?.message);
      } finally {
        setInvitingId(null);
      }
    },
    [user?.id, selectedUser, streakTitle],
  );

  // ── Reset on close ───────────────────────────────────────────────────────
  const handleClose = () => {
    setStreakTitle('');
    setSelectedUser(null);
    setQuery('');
    setResults([]);
    setInvitedIds(new Set());
    setNoResult(false);
    onClose();
  };

  // ── Render result item ───────────────────────────────────────────────────
  const renderItem = ({ item }: { item: SearchResult }) => {
    const isInvited = invitedIds.has(item.id);
    const isInviting = invitingId === item.id;

    return (
      <View style={[styles.resultItem, { borderBottomColor: C.divider }]}>
        <Avatar name={item.full_name || item.username} size={44} />
        <View style={styles.resultInfo}>
          <AppText variant="bodyMedium" style={{ fontWeight: '700' }}>
            {item.full_name || item.username}
          </AppText>
          <AppText variant="caption" color={C.textSecondary}>
            @{item.username}
            {item.gender ? `  ·  ${item.gender}` : ''}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => !isInvited && !isInviting && setSelectedUser(item)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isInvited ? 'Sudah diundang' : `Undang ${item.username}`}
          disabled={isInvited || isInviting}
        >
          <LinearGradient
            colors={
              isInvited
                ? [C.primaryLight, C.primaryLight]
                : [C.primaryMedium, C.primary]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.inviteBtn, { opacity: isInvited ? 0.7 : 1 }]}
          >
            {isInviting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText
                style={{
                  color: isInvited ? C.primary : '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {isInvited ? '✓ Terkirim' : 'Undang'}
              </AppText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
        <View style={[styles.root, { backgroundColor: C.background }]}>
          {/* Background gradient */}
          <LinearGradient
            colors={[C.primaryLight + 'CC', C.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.4 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: C.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AppText variant="heading" style={{ fontSize: 22, fontWeight: '800' }}>
                Ajak membuat Streaks
              </AppText>
              <AppText variant="caption" color={C.textSecondary} style={{ marginTop: 4 }}>
                Cari teman dengan username mereka
              </AppText>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: C.surfaceAlt }]}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <AppText style={{ fontSize: 16, fontWeight: '700' }} color={C.textSecondary}>
                ✕
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="caption" color={C.textSecondary} style={{ fontWeight: '700', marginBottom: Spacing.xs, marginTop: Spacing.md }}>
            CARI TEMAN
          </AppText>
          {/* Search input */}
          <View style={[styles.inputWrap, { backgroundColor: C.surface, borderColor: C.border }]}>
            <TextInput
              style={[styles.input, { color: C.textPrimary, fontFamily: FontFamily.regular }]}
              placeholder="Cari username..."
              placeholderTextColor={C.textDisabled}
              value={query}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <AppText style={{ fontSize: 16 }} color={C.textDisabled}>✕</AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={C.primary} />
              <AppText variant="caption" color={C.textSecondary} style={{ marginTop: Spacing.sm }}>
                Mencari...
              </AppText>
            </View>
          )}

          {!loading && noResult && (
            <View style={styles.centered}>
              <AppText variant="body" color={C.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
                Username "{query}" tidak ditemukan
              </AppText>
              <AppText variant="caption" color={C.textDisabled} align="center" style={{ marginTop: 4 }}>
                Pastikan username sudah benar
              </AppText>
            </View>
          )}

          {!loading && results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: Spacing.xxxl }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {!loading && results.length === 0 && !noResult && query.length < 2 && (
            <View style={styles.centered}>
              <AppText variant="body" color={C.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
                Ketik username untuk mencari teman
              </AppText>
              <AppText variant="caption" color={C.textDisabled} align="center" style={{ marginTop: 4 }}>
                Minimal 2 karakter
              </AppText>
            </View>
          )}
        </View>


      {/* Confirmation Modal */}
      <Modal visible={!!selectedUser} transparent animationType="fade" onRequestClose={() => setSelectedUser(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: C.surface, shadowColor: C.primary }]}>
            <AppText variant="title" style={{ fontSize: 20 }}>Mau streaks apa?</AppText>
            <AppText variant="body" color={C.textSecondary} style={{ marginBottom: Spacing.sm }}>
              Pilih atau ketik judul streak untuk dilakukan bersama <AppText style={{ fontWeight: '700' }} color={C.textPrimary}>@{selectedUser?.username}</AppText>.
            </AppText>

            <View style={[styles.inputWrap, { backgroundColor: C.surface, borderColor: C.border }]}>
              <TextInput
                style={[styles.input, { color: C.textPrimary, fontFamily: FontFamily.regular }]}
                placeholder="Contoh: Tahajjud Challenge"
                placeholderTextColor={C.textDisabled}
                value={streakTitle}
                onChangeText={setStreakTitle}
              />
              {streakTitle.length > 0 && (
                <TouchableOpacity onPress={() => setStreakTitle('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <AppText style={{ fontSize: 16 }} color={C.textDisabled}>✕</AppText>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.suggestionRowWrap}>
              {SUGGESTED_TITLES.map((title) => (
                <TouchableOpacity
                  key={title}
                  style={[styles.suggestionChip, { 
                    backgroundColor: streakTitle === title ? C.primary : C.surfaceAlt,
                    borderColor: streakTitle === title ? C.primary : C.border
                  }]}
                  onPress={() => setStreakTitle(title)}
                >
                  <AppText variant="caption" color={streakTitle === title ? '#FFFFFF' : C.textSecondary}>
                    {title}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.surfaceAlt, borderColor: C.border, borderWidth: 1 }]}
                onPress={() => setSelectedUser(null)}
                disabled={invitingId !== null}
              >
                <AppText variant="label" color={C.textPrimary}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.primary, borderWidth: 1, borderColor: C.primary }]}
                onPress={handleSendInvite}
                disabled={invitingId !== null}
              >
                {invitingId !== null ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <AppText variant="label" color="#FFFFFF">Kirim</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.screen },
  handle: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  headerLeft: { flex: 1 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  titleForm: {
    marginBottom: Spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.clay,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    paddingVertical: 0,
    minHeight: 36,
  },
  suggestionRow: {
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  list: { flex: 1 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  resultInfo: { flex: 1, gap: 3 },
  inviteBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: Spacing.xxxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.clay,
    padding: Spacing.xl,
    gap: Spacing.sm,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
});

export default InviteStreakModal;
