import { useTheme } from '@/src/context/ThemeContext';
import { usePrayerTimes } from '@/src/hooks/usePrayerTimes';
import { useAuthStore } from '@/src/store/authStore';
import { Radius, Spacing } from '@/src/theme';
import { formatGregorianDate, getGreeting, getHijriDateLabel } from '@/src/utils/dateUtils';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import ContinueReadingCard from '@/src/components/cards/ContinueReadingCard';
import FriendStreakCard from '@/src/components/cards/FriendStreakCard';
import NextPrayerCard from '@/src/components/cards/NextPrayerCard';
import PendingInviteCard, { PendingInvite } from '@/src/components/cards/PendingInviteCard';
import ReceivedInviteCard from '@/src/components/cards/ReceivedInviteCard';
import PrayerChecklistCard from '@/src/components/cards/PrayerChecklistCard';
import QuickActionsCard from '@/src/components/cards/QuickActionsCard';
import AppText from '@/src/components/common/AppText';
import Avatar from '@/src/components/common/Avatar';
import InviteStreakModal from '@/src/components/modals/InviteStreakModal';
import LocationPickerModal from '@/src/components/modals/LocationPickerModal';
import { supabase } from '@/supabase';
import { useStreaks } from '@/src/hooks/useStreaks';

export default function HomeScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const { user } = useAuthStore();
  const { checklist, nextPrayer, togglePrayer, locationName, needsManualLocation, refetch, error: prayerError } = usePrayerTimes();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const { activeStreaks, loadingStreaks, fetchActiveStreaks, checkinStreak,
    receivedInvites, loadingReceivedInvites, fetchReceivedInvites, acceptInvite, rejectInvite, cancelInvite,
  } = useStreaks();
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const fetchSentInvites = useCallback(async () => {
    if (!user?.id) return;
    setLoadingInvites(true);
    try {
      const { data, error } = await supabase.rpc('get_sent_invites', { p_user_id: user.id });
      if (error) throw error;
      setPendingInvites(data || []);
    } catch (err) {
      console.error('Error fetching sent invites:', err);
    } finally {
      setLoadingInvites(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSentInvites();
      fetchActiveStreaks();
      fetchReceivedInvites();
    }, [fetchSentInvites, fetchActiveStreaks, fetchReceivedInvites])
  );

  const handleCheckin = async (id: string) => {
    setCheckingInId(id);
    await checkinStreak(id);
    setCheckingInId(null);
  };

  const handleCancelInvite = async (inviteId: string) => {
    await cancelInvite(inviteId);
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
  };

  const quickActions = [
    { id: 'inbox', label: 'Inbox', img: require('@/assets/images/inbox_icon.png'), onPress: () => router.push('/inbox') },
    { id: 'counter', label: 'Counter', img: require('@/assets/images/Dzikir_icon.png'), onPress: () => router.push('/(main)/worship/tasbih') },
  ];

  if (user?.gender === 'Akhwat') {
    quickActions.push({ id: 'menstruation', label: 'Kalender', img: require('@/assets/images/calendar_icon.png'), onPress: () => router.push('/menstruation') });
  }

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] ?? 'Friend';

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={[C.background, C.primaryLight + 'AA', C.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AppText variant="caption" color={C.textSecondary} style={{ letterSpacing: 0.3 }}>
              {greeting}
            </AppText>
            <AppText variant="heading" style={{ fontSize: 26, fontWeight: '800', marginTop: 2 }}>
              {firstName}
            </AppText>
            {/* Hijri date pill */}
            <View style={[styles.datePill, { backgroundColor: C.primaryLight }]}>
              <AppText variant="caption" color={C.primary} style={{ fontWeight: '600' }}>
                {getHijriDateLabel()}
              </AppText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/(main)/profile')}
              activeOpacity={0.8}
            >
              <View style={[styles.avatarWrapper, { shadowColor: C.primary }]}>
                <Avatar name={user?.name ?? 'Guest'} size={48} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs }}>
          <AppText variant="caption" color={C.textDisabled}>
            {formatGregorianDate()}
          </AppText>
          {locationName && (
            <View style={[styles.locationPill, { backgroundColor: C.primaryLight }]}>
              <AppText variant="caption" color={C.primary} style={{ fontWeight: '600', fontSize: 11 }}>
                📍 {locationName}
              </AppText>
            </View>
          )}
        </View>

        <NextPrayerCard prayer={nextPrayer} />
        <PrayerChecklistCard prayers={checklist.prayers} onToggle={togglePrayer} />
        <QuickActionsCard actions={quickActions} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="title" style={styles.sectionTitle}>Streak Teman</AppText>
            <TouchableOpacity
              onPress={() => setShowInviteModal(true)}
              style={[styles.inviteButton, { backgroundColor: C.primaryLight }]}
              activeOpacity={0.8}
            >
              <Image
                source={require('@/assets/images/search_icon.png')}
                style={{ width: 14, height: 14, tintColor: C.primary }}
                resizeMode="contain"
              />
              <AppText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>Cari</AppText>
            </TouchableOpacity>
          </View>

          {(loadingInvites || loadingStreaks || loadingReceivedInvites) && (
            <ActivityIndicator size="small" color={C.primary} style={{ marginVertical: Spacing.sm }} />
          )}

          {!loadingReceivedInvites && receivedInvites.length > 0 && (
            <>
              <View style={[styles.subHeader, { backgroundColor: C.primaryLight }]}>
                <AppText variant="caption" color={C.primary} style={{ fontWeight: '700', fontSize: 11 }}>
                  📩  UNDANGAN MASUK  ({receivedInvites.length})
                </AppText>
              </View>
              {receivedInvites.map((invite) => (
                <ReceivedInviteCard
                  key={invite.invite_id}
                  invite={invite}
                  onAccept={acceptInvite}
                  onReject={rejectInvite}
                />
              ))}
            </>
          )}

          {/* Active Streaks */}
          {!loadingStreaks && activeStreaks.map((streak) => (
            <FriendStreakCard 
              key={streak.friendship_id} 
              streak={streak} 
              onCheckin={handleCheckin}
              isCheckingIn={checkingInId === streak.friendship_id}
            />
          ))}

          {/* Pending Invites (Sent) */}
          {!loadingInvites && pendingInvites.map((invite) => (
            <PendingInviteCard
              key={invite.id}
              invite={invite}
              onCancel={handleCancelInvite}
            />
          ))}

          {/* Empty State */}
          {pendingInvites.length === 0 && activeStreaks.length === 0 && receivedInvites.length === 0
            && !loadingInvites && !loadingStreaks && !loadingReceivedInvites && (
            <View style={[styles.emptyStreakCard, { backgroundColor: C.surface, borderColor: C.border }]}>
              <AppText variant="bodyMedium" color={C.textPrimary} style={{ fontWeight: '600' }}>
                Belum ada streak
              </AppText>
              <AppText variant="caption" color={C.textSecondary} align="center" style={{ marginTop: 2, paddingHorizontal: Spacing.lg }}>
                Cari username teman kamu dan mulai ibadah bersama!
              </AppText>
            </View>
          )}
        </View>

        <View style={[styles.quoteCard, { backgroundColor: C.primaryLight + 'BB', borderColor: C.primaryMedium + '44' }]}>
          <AppText variant="caption" color={C.primary} align="center" style={{ fontStyle: 'italic', lineHeight: 22 }}>
            "Sesungguhnya dalam dzikir kepada Allah, hati menjadi tenang."
          </AppText>
          <AppText variant="caption" color={C.textSecondary} align="center" style={{ marginTop: 4, fontWeight: '600' }}>
            — QS. Ar-Ra'd: 28
          </AppText>
        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <InviteStreakModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      <LocationPickerModal
        visible={needsManualLocation}
        onSaved={refetch}
      />
    </View>
  );
}

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
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    headerLeft: { flex: 1, gap: 2 },
    headerRight: { paddingTop: 4 },
    datePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
      marginTop: Spacing.sm,
    },
    avatarWrapper: {
      borderRadius: 30,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    locationPill: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
    },
    section: { gap: Spacing.sm },
    subHeader: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    sectionTitle: {},
    inviteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: Radius.full,
    },
    emptyStreakCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xxl,
      borderRadius: Radius.clay,
      borderWidth: 1,
      borderStyle: 'dashed',
    },
    quoteCard: {

      borderRadius: Radius.clay,
      padding: Spacing.xl,
      borderWidth: 1,
      marginTop: Spacing.sm,
    },
  });
}
