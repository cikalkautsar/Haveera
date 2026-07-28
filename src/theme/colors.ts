const shared = {
  // =========================
  // Status Colors
  // =========================
  success: '#3F7D58',
  successLight: '#EAF4EC',

  warning: '#D4A017',
  warningLight: '#FFF5D9',

  error: '#C94C4C',
  errorLight: '#FBEAEA',

  info: '#5D8AA8',
  infoLight: '#EAF3F8',

  // =========================
  // Global
  // =========================
  overlay: 'rgba(0,0,0,0.40)',
  cardShadow: 'rgba(0,0,0,0.06)',

  white: '#FFFFFF',

  textInverse: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#6B7280',
  textDisabled: '#C5CBD3',

  border: '#E7E9EC',
  divider: '#F3F4F6',

  prayerPending: '#E5E7EB',
  prayerMissed: '#D4A017',
} as const;

/* ======================================================
   IKHWAN
   Navy • Teal • Sky Blue • Beige
====================================================== */

export const IkhwanColors = {
  ...shared,

  // Primary
  primary: '#2F4156',
  primaryDark: '#223244',
  primaryMedium: '#47627B',
  primaryLight: '#EDF4F8',

  // Secondary
  secondary: '#567C8D',
  secondaryLight: '#DCE8EF',

  // Accent
  accent: '#AFC8DC',
  accentLight: '#EAF2F8',

  // Background
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5EFEB',

  // Prayer
  prayerCompleted: '#2F4156',
} as const;

/* ======================================================
   AKHWAT
   Dark Jungle Green • William Hooker's Green
   Pistachio • Beige
====================================================== */

export const AkhwatColors = {
  ...shared,

  // Primary
  primary: '#12311B',
  primaryDark: '#0C2213',
  primaryMedium: '#31503A',
  primaryLight: '#EEF5ED',

  // Secondary
  secondary: '#5E7E59',
  secondaryLight: '#EAF2E7',

  // Accent
  accent: '#A7C97D',
  accentLight: '#EDF5E7',

  // Background
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5EFEB',

  // Prayer
  prayerCompleted: '#12311B',
} as const;

/* ======================================================
   DEFAULT
====================================================== */

export const Colors = IkhwanColors;

export type GenderColorPalette = {
  readonly [K in keyof typeof IkhwanColors]: string;
};

export type ColorKey = keyof typeof IkhwanColors;

export function getGenderColors(
  gender?: 'Ikhwan' | 'Akhwat',
): GenderColorPalette {
  return gender === 'Akhwat'
    ? AkhwatColors
    : IkhwanColors;
}