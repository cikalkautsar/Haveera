import { Doa } from '@/src/types/doa.types';

const BASE_URL = 'https://equran.id/api';

export async function fetchAllDoa(): Promise<Doa[]> {
  const res = await fetch(`${BASE_URL}/doa`);
  if (!res.ok) throw new Error(`Gagal memuat doa: ${res.status}`);
  const json = await res.json();

  if (json.status !== 'success') throw new Error('API returned non-success status');

  return (json.data as any[]).map((d) => ({
    id: d.id,
    grup: d.grup,
    nama: d.nama,
    arabic: d.ar,
    transliteration: d.tr?.trim() ?? '',
    translation: d.idn,
    tentang: d.tentang,
    tags: Array.isArray(d.tag) ? d.tag : [],
  }));
}
