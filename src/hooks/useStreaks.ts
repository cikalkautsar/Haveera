import { useState, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthStore } from '@/src/store/authStore';

export interface ActiveStreak {
  friendship_id: string;
  streak_title: string | null;
  friend_id: string;
  friend_username: string;
  friend_full_name: string;
  friend_gender: string;
  created_at: string;
  my_completed_today: boolean;
  friend_completed_today: boolean;
  my_completed_yesterday: boolean;
  friend_completed_yesterday: boolean;
  total_days: number;
}


export interface ReceivedInvite {
  invite_id: string;
  requester_id: string;
  requester_username: string;
  requester_full_name: string;
  requester_gender: string;
  streak_title: string | null;
  created_at: string;
}

export function useStreaks() {
  const { user } = useAuthStore();
  const [activeStreaks, setActiveStreaks] = useState<ActiveStreak[]>([]);
  const [loadingStreaks, setLoadingStreaks] = useState(true);
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>([]);
  const [loadingReceivedInvites, setLoadingReceivedInvites] = useState(false);

  const fetchActiveStreaks = useCallback(async () => {
    if (!user?.id) {
      setLoadingStreaks(false);
      return;
    }
    
    setLoadingStreaks(true);
    try {
      const { data, error } = await supabase.rpc('get_active_streaks', {
        p_user_id: user.id,
      });
      if (error) throw error;
      setActiveStreaks(data || []);
    } catch (err) {
      console.error('Error fetching active streaks:', JSON.stringify(err, null, 2));
    } finally {
      setLoadingStreaks(false);
    }
  }, [user?.id]);

  const checkinStreak = async (friendshipId: string) => {
    if (!user?.id) return { success: false };
    
    try {
      const { error } = await supabase.rpc('log_streak_progress', {
        p_friendship_id: friendshipId,
        p_user_id: user.id,
      });
      
      if (error) throw error;
      
      // Update local state to reflect check-in
      setActiveStreaks(prev => 
        prev.map(streak => 
          streak.friendship_id === friendshipId 
            ? { ...streak, my_completed_today: true }
            : streak
        )
      );
      
      return { success: true };
    } catch (err: any) {
      console.error('Error logging streak:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchReceivedInvites = useCallback(async () => {
    if (!user?.id) return;
    setLoadingReceivedInvites(true);
    try {
      const { data, error } = await supabase.rpc('get_received_invites', {
        p_user_id: user.id,
      });
      if (error) throw error;
      setReceivedInvites(data || []);
    } catch (err) {
      console.error('Error fetching received invites:', err);
    } finally {
      setLoadingReceivedInvites(false);
    }
  }, [user?.id]);

  const acceptInvite = async (inviteId: string) => {
    if (!user?.id) return { success: false };
    try {
      const { error } = await supabase.rpc('accept_invite', {
        p_invite_id: inviteId,
        p_user_id: user.id,
      });
      if (error) throw error;
      // Remove from received list & refresh active streaks
      setReceivedInvites(prev => prev.filter(i => i.invite_id !== inviteId));
      await fetchActiveStreaks();
      return { success: true };
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      return { success: false, error: err.message };
    }
  };

  const rejectInvite = async (inviteId: string) => {
    if (!user?.id) return { success: false };
    try {
      const { error } = await supabase.rpc('reject_invite', {
        p_invite_id: inviteId,
        p_user_id: user.id,
      });
      if (error) throw error;
      setReceivedInvites(prev => prev.filter(i => i.invite_id !== inviteId));
      return { success: true };
    } catch (err: any) {
      console.error('Error rejecting invite:', err);
      return { success: false, error: err.message };
    }
  };

  const cancelInvite = async (inviteId: string) => {
    if (!user?.id) return;
    try {
      await supabase.rpc('cancel_invite', {
        p_invite_id: inviteId,
        p_user_id: user.id,
      });
    } catch (err) {
      console.error('Error cancelling invite:', err);
    }
  };

  return {
    activeStreaks,
    loadingStreaks,
    fetchActiveStreaks,
    checkinStreak,
    receivedInvites,
    loadingReceivedInvites,
    fetchReceivedInvites,
    acceptInvite,
    rejectInvite,
    cancelInvite,
  };
}
