import { create } from 'zustand';
import { User } from '@/src/types/auth.types';
import { supabase } from '@/supabase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
}

/** Maps a Supabase session user to the app's User type. */
export function mapSupabaseUser(supabaseUser: any): User {
  const meta = supabaseUser.user_metadata ?? {};
  return {
    id: supabaseUser.id,
    name: meta.full_name ?? meta.name ?? supabaseUser.email ?? 'User',
    email: supabaseUser.email ?? '',
    username: meta.username ?? '',
    avatarUrl: meta.avatar_url ?? null,
    memberSince: supabaseUser.created_at ?? new Date().toISOString(),
    gender: meta.gender ?? undefined,
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboardingComplete: false,
  isLoading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  login: (user: User) =>
    set({ user, isAuthenticated: true }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  completeOnboarding: () => set({ isOnboardingComplete: true }),
}));
