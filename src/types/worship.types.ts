// ─── Dua ────────────────────────────────────────────────────────────────────

export type DuaCategory =
  | 'Daily'
  | 'Morning'
  | 'Evening'
  | 'Eating'
  | 'Sleeping'
  | 'Traveling'
  | 'Rain'
  | 'Mosque';

export interface Dua {
  id: string;
  category: DuaCategory;
  titleArabic: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

// ─── Dhikr ───────────────────────────────────────────────────────────────────

export type DhikrCategory =
  | 'Morning'
  | 'Evening'
  | 'After Prayer'
  | 'Before Sleep'
  | 'After Waking Up';

export interface Dhikr {
  id: string;
  category: DhikrCategory;
  title?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  repetitionCount: number;
}

// ─── Tasbih ──────────────────────────────────────────────────────────────────

export interface TasbihSession {
  id: string;
  dhikrText: string;
  target: number;
  current: number;
  completedAt?: string;
}

// ─── Friend Streak ────────────────────────────────────────────────────────────

export type StreakWorshipType =
  | 'Daily Quran'
  | 'Morning Dhikr'
  | 'Evening Dhikr'
  | 'Tahajjud'
  | 'Dhuha'
  | 'Witr'
  | 'Sunnah Fasting';

export interface FriendStreakParticipant {
  userId: string;
  name: string;
  avatarUrl: string | null;
  completedToday: boolean;
}

export interface FriendStreak {
  id: string;
  worshipType: StreakWorshipType;
  streakDays: number;
  participants: FriendStreakParticipant[];
  startedAt: string;
}
