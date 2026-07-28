export interface ProfileStats {
  totalPrayersCompleted: number;
  currentStreak: number;
  longestStreak: number;
  quranBookmarks: number;
}

export interface SettingsGeneral {
  language: 'en' | 'id';
  notificationsEnabled: boolean;
}

export interface SettingsPrayer {
  calculationMethod: string;
  madhhab: 'Shafi' | 'Hanafi' | 'Maliki' | 'Hanbali';
}

export interface AppSettings {
  general: SettingsGeneral;
  prayer: SettingsPrayer;
}
