/**
 * ThemeContext — provides the gender-aware color palette to the entire app.
 *
 * Usage in a component:
 *   const { C } = useTheme();
 *   <View style={{ backgroundColor: C.background }} />
 */
import React, { createContext, useContext, useMemo } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { getGenderColors, GenderColorPalette, IkhwanColors } from '@/src/theme';

interface ThemeContextValue {
  C: GenderColorPalette;
}

const ThemeContext = createContext<ThemeContextValue>({ C: IkhwanColors });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const gender = useAuthStore((s) => s.user?.gender);
  const C = useMemo(() => getGenderColors(gender), [gender]);
  return <ThemeContext.Provider value={{ C }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
