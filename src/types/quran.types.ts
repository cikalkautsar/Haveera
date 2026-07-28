export interface Surah {
  number: number;
  nameArabic: string;
  nameTransliteration: string;
  nameTranslation: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  description?: string;
  audioUrl?: string;
}

export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
  transliteration?: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  savedAt: string;
}
