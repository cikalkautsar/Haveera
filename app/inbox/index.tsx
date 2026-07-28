import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuthStore } from '@/src/store/authStore';
import { supabase } from '@/supabase';
import AppText from '@/src/components/common/AppText';
import Avatar from '@/src/components/common/Avatar';
import ScreenContainer from '@/src/components/common/ScreenContainer';

interface InboxInvite {
  id: string;
  requester_id: string;
  username: string;
  full_name: string;
  gender: string;
  created_at: string;
  streak_title?: string;
}

export default function InboxScreen() {
  const router = useRouter();
  const { C } = useTheme();
  const { user } = useAuthStore();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [invites, setInvites] = useState<InboxInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInbox = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.rpc('get_inbox_invites', {
        p_user_id: user.id,
      });
      if (error) throw error;
      setInvites(data || []);
    } catch (err) {
      console.error('Error fetching inbox:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInbox();
  };

  const handleResponse = async (inviteId: string, status: 'accepted' | 'rejected') => {
    setProcessingId(inviteId);
    try {
      const { error } = await supabase.rpc('respond_to_invite', {
        p_invite_id: inviteId,
        p_status: status,
      });
      if (error) throw error;
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      console.error('Error responding to invite:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }: { item: InboxInvite }) => {
    const isProcessing = processingId === item.id;
    return (
      <View style={[styles.inviteCard, { backgroundColor: C.surface, shadowColor: C.primary }]}>
        <View style={styles.cardHeader}>
          <Avatar name={item.full_name || item.username} size={48} />
          <View style={styles.cardInfo}>
            <AppText variant="bodyMedium" style={{ fontWeight: '700' }}>
              {item.full_name || item.username}
            </AppText>
            <AppText variant="caption" color={C.textSecondary}>
              @{item.username} {item.gender ? `· ${item.gender}` : ''}
            </AppText>
            <AppText variant="caption" color={C.primary} style={{ marginTop: 2 }}>
              {item.streak_title ? `Mengajakmu untuk membuat streak "${item.streak_title}"` : `Mengajakmu untuk membuat streak`}
            </AppText>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnReject, { borderColor: C.border }]}
            onPress={() => handleResponse(item.id, 'rejected')}
            disabled={isProcessing}
          >
            <AppText variant="label" color={C.textSecondary}>Tolak</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnAccept, { backgroundColor: C.primary }]}
            onPress={() => handleResponse(item.id, 'accepted')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>Terima</AppText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[C.primaryLight + '88', C.background, C.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AppText style={{ fontSize: 24, color: C.textPrimary }}>←</AppText>
        </TouchableOpacity>
        <AppText variant="heading" style={{ fontSize: 22 }}>Kotak Masuk</AppText>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : invites.length === 0 ? (
        <View style={styles.center}>
          <AppText style={{ fontSize: 48, marginBottom: Spacing.md }}>📭</AppText>
          <AppText variant="title">Inbox Kosong</AppText>
          <AppText variant="body" color={C.textSecondary} align="center" style={{ marginTop: 4, maxWidth: 250 }}>
            Belum ada undangan streak dari temanmu.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={invites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useTheme>['C']) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.screen,
      paddingTop: 60,
      paddingBottom: Spacing.base,
    },
    backBtn: { padding: Spacing.xs },
    list: { padding: Spacing.screen, gap: Spacing.base, paddingBottom: 100 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    inviteCard: {
      borderRadius: Radius.clay,
      padding: Spacing.xl,
      gap: Spacing.base,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    cardInfo: { flex: 1, gap: 2 },
    actions: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.xs,
    },
    btn: {
      flex: 1,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    btnReject: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    btnAccept: {},
  });
}
