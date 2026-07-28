import { useState, useCallback } from 'react';
import { supabase } from '@/supabase';
import { useAuthStore } from '@/src/store/authStore';

export interface FavoriteAyah {
  id: string;
  surah_number: number;
  surah_name: string;
  ayah_number: number;
  ayah_arabic: string | null;
  ayah_translation: string | null;
  created_at: string;
}

export function useFavoriteAyahs() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteAyah[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set()); // "surah:ayah"
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Fetch all favorites (for profile/list)
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_ayahs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
      setCount((data || []).length);

      const ids = new Set<string>();
      (data || []).forEach((f: FavoriteAyah) => ids.add(`${f.surah_number}:${f.ayah_number}`));
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch favorites for a specific surah (lighter query)
  const fetchFavoritesForSurah = useCallback(async (surahNumber: number) => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('favorite_ayahs')
        .select('ayah_number')
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber);

      if (error) throw error;
      const ids = new Set<string>();
      (data || []).forEach((f: any) => ids.add(`${surahNumber}:${f.ayah_number}`));
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Error fetching surah favorites:', err);
    }
  }, [user?.id]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (
    surahNumber: number,
    surahName: string,
    ayahNumber: number,
    ayahArabic?: string,
    ayahTranslation?: string,
  ) => {
    if (!user?.id) return;

    const key = `${surahNumber}:${ayahNumber}`;
    const isFav = favoriteIds.has(key);

    // Optimistic update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(key);
      else next.add(key);
      return next;
    });

    try {
      if (isFav) {
        // Remove
        const { error } = await supabase
          .from('favorite_ayahs')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', surahNumber)
          .eq('ayah_number', ayahNumber);
        if (error) throw error;
        setCount(c => Math.max(0, c - 1));
      } else {
        // Add
        const { error } = await supabase
          .from('favorite_ayahs')
          .insert({
            user_id: user.id,
            surah_number: surahNumber,
            surah_name: surahName,
            ayah_number: ayahNumber,
            ayah_arabic: ayahArabic || null,
            ayah_translation: ayahTranslation || null,
          });
        if (error) throw error;
        setCount(c => c + 1);
      }
    } catch (err) {
      // Revert optimistic update
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(key);
        else next.delete(key);
        return next;
      });
      console.error('Error toggling favorite:', err);
    }
  }, [user?.id, favoriteIds]);

  const isFavorite = useCallback((surahNumber: number, ayahNumber: number) => {
    return favoriteIds.has(`${surahNumber}:${ayahNumber}`);
  }, [favoriteIds]);

  // Fetch just the count (for profile stat)
  const fetchCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { count: c, error } = await supabase
        .from('favorite_ayahs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (error) throw error;
      setCount(c ?? 0);
    } catch (err) {
      console.error('Error fetching favorite count:', err);
    }
  }, [user?.id]);

  return {
    favorites,
    favoriteIds,
    count,
    loading,
    fetchFavorites,
    fetchFavoritesForSurah,
    fetchCount,
    toggleFavorite,
    isFavorite,
  };
}
