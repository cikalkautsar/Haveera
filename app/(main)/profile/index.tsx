import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, ActivityIndicator, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuthStore } from '@/src/store/authStore';
import { useStreaks } from '@/src/hooks/useStreaks';
import { useFavoriteAyahs } from '@/src/hooks/useFavoriteAyahs';
import AppText from '@/src/components/common/AppText';
import Avatar from '@/src/components/common/Avatar';

interface ProfileMenuItemProps {
  icon: ImageSourcePropType;
  label: string;
  sublabel?: string;
  onPress: () => void;
  destructive?: boolean;
  accentColor?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const { user, logout } = useAuthStore();
  const { activeStreaks, loadingStreaks, fetchActiveStreaks } = useStreaks();
  const { count: favoriteCount, fetchCount: fetchFavoriteCount, favorites, fetchFavorites, loading: loadingFavs } = useFavoriteAyahs();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const styles = useMemo(() => makeStyles(C), [C]);

  useFocusEffect(
    useCallback(() => {
      fetchActiveStreaks();
      fetchFavoriteCount();
    }, [fetchActiveStreaks, fetchFavoriteCount])
  );

  const displayName = user?.name ?? 'Guest';
  const displayUsername = user?.username ? `@${user.username}` : '';
  const displayEmail = user?.email ?? '';
  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[C.primaryLight + 'BB', C.background, C.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="caption" color={C.textSecondary} style={{ letterSpacing: 0.5, fontWeight: '600' }}>PROFIL</AppText>
          <AppText variant="heading" style={{ fontSize: 28, fontWeight: '800', marginTop: 4 }}>Akun Saya</AppText>
        </View>

        {/* Profile Hero Card */}
        <View style={[styles.profileCard, { shadowColor: C.primary }]}>
          {/* Gradient background */}
          <LinearGradient
            colors={[C.primaryMedium + '22', C.accent + '14']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.surface, opacity: 0.8, borderRadius: Radius.clay }]} />
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay }]}
          />
          <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />

          <View style={styles.profileCardContent}>
            <View style={[styles.avatarRing, { borderColor: C.primary + '40' }]}>
              <Avatar name={displayName} size={72} />
            </View>
            <View style={styles.profileInfo}>
              <AppText variant="title" style={{ fontSize: 20, fontWeight: '800' }}>{displayName}</AppText>
              {displayUsername ? (
                <View style={[styles.usernamePill, { backgroundColor: C.primaryLight }]}>
                  <AppText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>{displayUsername}</AppText>
                </View>
              ) : null}
              {user?.gender ? (
                <View style={[styles.genderBadge, {
                  backgroundColor: user.gender === 'Akhwat' ? C.accent + '22' : C.secondary + '22',
                }]}>
                  <AppText variant="caption" color={user.gender === 'Akhwat' ? C.accent : C.secondary} style={{ fontWeight: '600' }}>
                    {user.gender === 'Ikhwan' ? '☽  Ikhwan' : '🌸  Akhwat'}
                  </AppText>
                </View>
              ) : null}
              {memberSince ? (
                <AppText variant="caption" color={C.textDisabled}>Bergabung {memberSince}</AppText>
              ) : null}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.statCard, { backgroundColor: C.surface, shadowColor: C.primary }]}
            onPress={() => { setShowFavoritesModal(true); fetchFavorites(); }}
          >
            <View style={[styles.statCardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
            <Image source={require('@/assets/images/star.png')} style={{ width: 22, height: 22 }} />
            <AppText style={[styles.statValue, { color: C.primary }]}>{favoriteCount}</AppText>
            <AppText variant="caption" color={C.textSecondary}>Favorite Ayat</AppText>
          </TouchableOpacity>
        </View>

        {/* Friend Streak Cards */}
        <View style={[styles.menuSection, { marginTop: Spacing.sm }]}>
          <AppText variant="caption" color={C.textSecondary} style={styles.menuLabel}>STREAK BERSAMA TEMAN</AppText>
          
          {loadingStreaks && (
            <ActivityIndicator size="small" color={C.primary} style={{ marginVertical: Spacing.md }} />
          )}

          {!loadingStreaks && activeStreaks.length === 0 && (
            <View style={[styles.menuCard, { backgroundColor: C.surface, shadowColor: C.primary, padding: Spacing.lg }]}>
              <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
              <View style={{ alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm }}>
                <AppText variant="body" color={C.textSecondary} align="center">
                  Belum ada streak aktif
                </AppText>
              </View>
            </View>
          )}

          {!loadingStreaks && activeStreaks.map((streak) => (
            <View key={streak.friendship_id} style={[styles.menuCard, { backgroundColor: C.surface, shadowColor: C.primary, padding: Spacing.lg, marginBottom: Spacing.sm }]}>
              <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="title" style={{ fontSize: 16 }} numberOfLines={1}>
                      {streak.streak_title || 'Streak Bersama'}
                    </AppText>
                    <AppText variant="caption" color={C.textSecondary}>
                      bersama {streak.friend_full_name || streak.friend_username}
                    </AppText>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <AppText variant="heading" color={C.primary}>{streak.total_days}</AppText>
                  <AppText variant="caption" color={C.textSecondary}>hari</AppText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <AppText variant="caption" color={C.textSecondary} style={styles.menuLabel}>PENGATURAN AKUN</AppText>
          <View style={[styles.menuCard, { backgroundColor: C.surface, shadowColor: C.primary }]}>
            <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
            <ProfileMenuItem
              icon={require('@/assets/images/settings.png')}
              label="Pengaturan"
              sublabel="Privasi & preferensi"
              onPress={() => router.push('/(main)/profile/settings')}
              accentColor={C.secondary}
            />
            <View style={[styles.divider, { backgroundColor: C.divider }]} />
            <ProfileMenuItem
              icon={require('@/assets/images/logout.png')}
              label="Keluar"
              sublabel="Sampai jumpa lagi"
              onPress={() => setShowLogoutModal(true)}
              destructive
              accentColor={C.error}
            />
          </View>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: C.surface, shadowColor: C.primary }]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0)']}
              style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay }]}
            />
            <AppText style={{ fontSize: 40, textAlign: 'center' }}>👋</AppText>
            <AppText variant="title" align="center">Yakin keluar?</AppText>
            <AppText variant="body" color={C.textSecondary} align="center" style={{ lineHeight: 22 }}>
              Kamu bisa masuk kembali kapan saja menggunakan username dan password.
            </AppText>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.surfaceAlt, borderColor: C.border, borderWidth: 1 }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <AppText variant="label" color={C.textPrimary}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnLogout}
                onPress={async () => { setShowLogoutModal(false); await logout(); }}
              >
                <LinearGradient
                  colors={[C.error, '#C0392B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.button }]}
                />
                <AppText variant="label" color="#FFFFFF">Keluar</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal visible={showFavoritesModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFavoritesModal(false)}>
        <View style={{ flex: 1, backgroundColor: C.background }}>
          <LinearGradient
            colors={[C.primaryLight + 'CC', C.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.35 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Handle */}
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.sm }} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.screen, marginBottom: Spacing.base }}>
            <View>
              <AppText variant="heading" style={{ fontSize: 22, fontWeight: '800' }}>Favorite Ayat</AppText>
              <AppText variant="caption" color={C.textSecondary}>{favoriteCount} ayat tersimpan</AppText>
            </View>
            <TouchableOpacity
              onPress={() => setShowFavoritesModal(false)}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
            >
              <AppText style={{ fontSize: 16, fontWeight: '700' }} color={C.textSecondary}>✕</AppText>
            </TouchableOpacity>
          </View>

          {loadingFavs ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={C.primary} />
            </View>
          ) : favorites.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingBottom: 60 }}>
              <AppText style={{ fontSize: 48 }}>📖</AppText>
              <AppText variant="title">Belum Ada Favorite</AppText>
              <AppText variant="body" color={C.textSecondary} align="center" style={{ maxWidth: 250 }}>
                Tekan ikon 🤍 di ayat manapun untuk menyimpannya di sini.
              </AppText>
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: Spacing.screen, paddingBottom: 60, gap: Spacing.md }}>
              {favorites.map((fav) => (
                <TouchableOpacity
                  key={fav.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    setShowFavoritesModal(false);
                    router.push(`/(main)/quran/${fav.surah_number}`);
                  }}
                >
                  <View style={[styles.menuCard, { backgroundColor: C.surface, shadowColor: C.primary, padding: Spacing.base }]}>
                    <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
                    
                    {/* Surah info */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                        <AppText style={{ fontSize: 14 }}>❤️</AppText>
                        <AppText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
                          {fav.surah_name} · Ayat {fav.ayah_number}
                        </AppText>
                      </View>
                    </View>

                    {/* Arabic */}
                    {fav.ayah_arabic && (
                      <AppText
                        style={{ fontSize: 22, lineHeight: 42, textAlign: 'right', writingDirection: 'rtl' }}
                        color={C.textPrimary}
                      >
                        {fav.ayah_arabic}
                      </AppText>
                    )}

                    {/* Translation */}
                    {fav.ayah_translation && (
                      <AppText variant="caption" color={C.textSecondary} style={{ marginTop: Spacing.xs, lineHeight: 20 }}>
                        {fav.ayah_translation}
                      </AppText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

function ProfileMenuItem({ icon, label, sublabel, onPress, destructive = false, accentColor }: ProfileMenuItemProps) {
  const { C } = useTheme();
  return (
    <TouchableOpacity style={styles2.item} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[styles2.iconBubble, { backgroundColor: (accentColor ?? C.primary) + '18' }]}>
      <Image source={icon} style={{ width: 18, height: 18 }} />
      </View>
      <View style={styles2.textWrap}>
        <AppText variant="body" color={destructive ? C.error : C.textPrimary} style={{ fontWeight: '600' }}>{label}</AppText>
        {sublabel && <AppText variant="caption" color={C.textSecondary}>{sublabel}</AppText>}
      </View>
      <AppText variant="body" color={C.textDisabled} style={{ fontSize: 18 }}>›</AppText>
    </TouchableOpacity>
  );
}

const styles2 = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 64,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, gap: 2 },
});

function makeStyles(C: ReturnType<typeof useTheme>['C']) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: Spacing.screen,
      paddingTop: 60,
      paddingBottom: Spacing.xxxl + 20,
      gap: Spacing.base,
    },
    header: { marginBottom: Spacing.xs, gap: 2 },
    profileCard: {
      borderRadius: Radius.clay,
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
    },
    cardHighlight: {
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 2,
      borderTopLeftRadius: Radius.clay,
      borderTopRightRadius: Radius.clay,
      zIndex: 3,
    },
    profileCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.xl,
      gap: Spacing.base,
      zIndex: 2,
    },
    avatarRing: {
      padding: 3,
      borderRadius: 42,
      borderWidth: 2.5,
    },
    profileInfo: { flex: 1, gap: 6 },
    usernamePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
    },
    genderBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
    },
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    statCard: {
      flex: 1,
      borderRadius: Radius.card,
      padding: Spacing.md,
      alignItems: 'center',
      gap: 3,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 5,
      overflow: 'hidden',
      position: 'relative',
    },
    statCardHighlight: {
      position: 'absolute',
      top: 0, left: 0, right: 0, height: 2,
      borderTopLeftRadius: Radius.card,
      borderTopRightRadius: Radius.card,
    },
    statValue: { fontWeight: '800', fontSize: 16 },
    menuSection: { gap: Spacing.sm },
    menuLabel: { paddingHorizontal: Spacing.xs, letterSpacing: 0.5, fontWeight: '700' },
    menuCard: {
      borderRadius: Radius.clay,
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
      position: 'relative',
    },
    divider: { height: 1, marginHorizontal: Spacing.base },
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
      padding: Spacing.xxl,
      gap: Spacing.base,
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
      marginTop: Spacing.xs,
    },
    modalBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: Radius.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnLogout: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: Radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
}
