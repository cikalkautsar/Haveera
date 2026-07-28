import { Surah, SurahDetail, Ayah } from '@/src/types/quran.types';

const BASE_URL = 'https://equran.id/api';

function mapRevelationType(tempatTurun: string): 'Meccan' | 'Medinan' {
  return tempatTurun.toLowerCase() === 'mekah' ? 'Meccan' : 'Medinan';
}

export async function fetchAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surat`);
  if (!res.ok) throw new Error(`Failed to fetch surahs: ${res.status}`);
  const data: any[] = await res.json();

  return data.map((s) => ({
    number: s.nomor,
    nameArabic: s.nama,
    nameTransliteration: s.nama_latin,
    nameTranslation: s.arti,
    totalAyahs: s.jumlah_ayat,
    revelationType: mapRevelationType(s.tempat_turun),
    description: s.deskripsi,
    audioUrl: s.audio,
  }));
}


export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surat/${surahNumber}`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}: ${res.status}`);
  const data = await res.json();

  const ayahs: Ayah[] = (data.ayat ?? []).map((a: any) => ({
    number: a.nomor,
    arabic: a.ar,
    transliteration: a.tr?.trim(),
    translation: a.idn,
  }));

  return {
    number: data.nomor,
    nameArabic: data.nama,
    nameTransliteration: data.nama_latin,
    nameTranslation: data.arti,
    totalAyahs: data.jumlah_ayat,
    revelationType: mapRevelationType(data.tempat_turun),
    description: data.deskripsi,
    audioUrl: data.audio,
    ayahs,
  };
}
