/**
 * ReceivedInviteCard
 * Card untuk undangan streak yang MASUK (received), dengan tombol Terima & Tolak.
 */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { ReceivedInvite } from '@/src/hooks/useStreaks';
import AppText from '../common/AppText';
import Avatar from '../common/Avatar';

interface ReceivedInviteCardProps {
  invite: ReceivedInvite;
  onAccept: (inviteId: string) => Promise<{ success: boolean; error?: string } | undefined>;
  onReject: (inviteId: string) => Promise<{ success: boolean; error?: string } | undefined>;
}

const ReceivedInviteCard: React.FC<ReceivedInviteCardProps> = ({ invite, onAccept, onReject }) => {
  const { C } = useTheme();
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const isBusy = accepting || rejecting;

  const handleAccept = async () => {
    setAccepting(true);
    const result = await onAccept(invite.invite_id);
    setAccepting(false);
    if (result && !result.success) {
      Alert.alert('Gagal', result.error ?? 'Tidak bisa menerima undangan saat ini.');
    }
  };

  const handleReject = () => {
    Alert.alert(
      'Tolak Undangan?',
      `Kamu akan menolak undangan streak dari ${invite.requester_full_name || invite.requester_username}.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tolak',
          style: 'destructive',
          onPress: async () => {
            setRejecting(true);
            const result = await onReject(invite.invite_id);
            setRejecting(false);
            if (result && !result.success) {
              Alert.alert('Gagal', result.error ?? 'Tidak bisa menolak undangan saat ini.');
            }
          },
        },
      ],
    );
  };

  const streakLabel = invite.streak_title || 'Streak Bersama';

  return (
    <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.primary + '20' }]}>
      {/* Gradient accent strip top */}
      <LinearGradient
        colors={[C.primaryMedium + '22', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header: badge */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: C.primaryLight }]}>
          <AppText style={{ fontSize: 12 }}>📩</AppText>
          <AppText variant="caption" color={C.primary} style={{ fontWeight: '700', fontSize: 11 }}>
            Undangan Masuk
          </AppText>
        </View>
      </View>

      {/* Requester info */}
      <View style={styles.personRow}>
        <Avatar name={invite.requester_full_name || invite.requester_username} size={40} />
        <View style={styles.personInfo}>
          <AppText variant="bodyMedium" style={{ fontWeight: '700' }} numberOfLines={1}>
            {invite.requester_full_name || invite.requester_username}
          </AppText>
          <AppText variant="caption" color={C.textSecondary}>
            @{invite.requester_username}
            {invite.requester_gender ? `  ·  ${invite.requester_gender}` : ''}
          </AppText>
        </View>
      </View>

      {/* Streak title */}
      <View style={[styles.streakPill, { backgroundColor: C.primaryLight }]}>
        <AppText variant="caption" color={C.primary} style={{ fontWeight: '600' }}>
          Mengundang kamu untuk:
        </AppText>
        <AppText variant="bodyMedium" color={C.primary} style={{ fontWeight: '800' }}>
          {streakLabel}
        </AppText>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* Reject */}
        <TouchableOpacity
          style={[styles.rejectBtn, { borderColor: C.warning + '80', backgroundColor: C.warning + '10' }]}
          onPress={handleReject}
          disabled={isBusy}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Tolak undangan"
        >
          {rejecting ? (
            <ActivityIndicator size="small" color={C.warning} />
          ) : (
            <AppText variant="label" color={C.warning} style={{ fontWeight: '700' }}>
              Tolak
            </AppText>
          )}
        </TouchableOpacity>

        {/* Accept */}
        <TouchableOpacity
          style={[styles.acceptBtnWrap, { opacity: isBusy ? 0.7 : 1 }]}
          onPress={handleAccept}
          disabled={isBusy}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Terima undangan"
        >
          <LinearGradient
            colors={[C.primaryMedium, C.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acceptBtn}
          >
            {accepting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText variant="label" color="#FFFFFF" style={{ fontWeight: '800' }}>
                Terima ✓
              </AppText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.clay,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  personInfo: { flex: 1, gap: 2 },
  streakPill: {
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 44,
  },
  acceptBtnWrap: {
    flex: 2,
    borderRadius: Radius.button,
    overflow: 'hidden',
    minHeight: 44,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});

export default ReceivedInviteCard;
