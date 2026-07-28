export type PrayerName = 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya';

export type PrayerStatus = 'completed' | 'pending' | 'missed';

export interface Prayer {
  name: PrayerName;
  time: string; // "05:32"
  status: PrayerStatus;
}

export interface NextPrayer {
  name: PrayerName;
  time: string;
  countdown: string; // "2h 15m"
}

export interface PrayerChecklist {
  date: string; // ISO date
  prayers: Prayer[];
}
