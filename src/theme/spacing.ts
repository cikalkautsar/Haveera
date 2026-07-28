/**
 * Haveera Spacing System — Updated for Claymorphism
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screen: 20, // Horizontal screen padding — slightly wider
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  card: 24,    // Claymorphism — bigger radius
  button: 18,
  full: 9999,
  bottomSheet: 32,
  clay: 28,    // Extra-round clay style
} as const;

export const Shadow = {
  // Claymorphism — colored, soft shadows
  clay: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  claySmall: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;
