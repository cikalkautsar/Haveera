import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import Avatar from '../common/Avatar';

export interface PendingInvite {
  id: string;
  receiver_id: string;
  username: string;
  full_name: string;
  gender: string;
  created_at: string;
}

interface PendingInviteCardProps {
  invite: PendingInvite;
  onPress?: () => void;
  onCancel?: (inviteId: string) => Promise<void>;
}

const PendingInviteCard: React.FC<PendingInviteCardProps> = ({ invite, onPress, onCancel }) => {
  const { C } = useTheme();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = () => {
    Alert.alert(
      'Batalkan Undangan?',
      `Undangan ke ${invite.full_name || invite.username} akan dibatalkan.`,
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Batalkan',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            await onCancel?.(invite.id);
            setCancelling(false);
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={!onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.fireRow}>
            <AppText style={styles.fireEmoji}>⌛</AppText>
            <AppText variant="title">Menunggu Persetujuan</AppText>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: C.surfaceAlt }]}>
            <AppText variant="caption" color={C.textSecondary}>Streak Teman</AppText>
          </View>
        </View>

        <View style={styles.participants}>
          <View style={styles.participant}>
            <Avatar name={invite.full_name || invite.username} size={36} />
            <View style={styles.participantInfo}>
              <AppText variant="bodySmall" style={{ fontWeight: '600' }}>
                {invite.full_name || invite.username}
              </AppText>
              <AppText variant="caption" color={C.textSecondary}>
                @{invite.username} {invite.gender ? `· ${invite.gender}` : ''}
              </AppText>
            </View>
            <AppText variant="caption" color={C.primary} style={{ fontWeight: '600' }}>
              Pending
            </AppText>
          </View>
        </View>

        {/* Batalkan button — only shown if onCancel is provided */}
        {onCancel && (
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: C.warning + '70', backgroundColor: C.warning + '0D' }]}
            onPress={handleCancel}
            disabled={cancelling}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Batalkan undangan"
          >
            {cancelling ? (
              <ActivityIndicator size="small" color={C.warning} />
            ) : (
              <AppText variant="caption" color={C.warning} style={{ fontWeight: '700' }}>
                Batalkan Undangan
              </AppText>
            )}
          </TouchableOpacity>
        )}
      </AppCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { gap: Spacing.md, opacity: 0.8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  fireRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  fireEmoji: { fontSize: 20 },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  participants: { gap: Spacing.sm, marginTop: Spacing.xs },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  participantInfo: { flex: 1, gap: 2 },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radius.button,
    borderWidth: 1.5,
    marginTop: Spacing.xs,
  },
});

export default PendingInviteCard;
