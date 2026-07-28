import { useAuthStore } from '@/src/store/authStore';
import { getGenderColors, GenderColorPalette } from '@/src/theme';

/**
 * Returns the gender-aware color palette.
 *
 * - Akhwat → botanical palette (#0A3323 dark green, #839958 moss,
 *             #F7F4D5 beige, #D3968C rosy brown, #105666 midnight green)
 * - Ikhwan / undefined → Islamic green palette (default)
 *
 * Usage:
 *   const C = useGenderColors();
 *   <View style={{ backgroundColor: C.background }} />
 */
export function useGenderColors(): GenderColorPalette {
  const gender = useAuthStore((s) => s.user?.gender);
  return getGenderColors(gender);
}
