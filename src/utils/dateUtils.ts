/**
 * dateUtils — pure helper functions for date/time formatting.
 * No side effects. Used for Hijri date display and formatting.
 */

/** Format a Date to "Monday, 15 June 2026" */
export function formatGregorianDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format a Date to short time "18:02" */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Approximate Hijri date string.
 * Real conversion requires a library (e.g. hijri-date).
 * Placeholder until library integration.
 */
export function getHijriDateLabel(): string {
  // Mock: returns a plausible Hijri date string
  const hijriMonths = [
    'Muharram', 'Safar', "Rabi' Al-Awwal", "Rabi' Al-Thani",
    'Jumada Al-Ula', 'Jumada Al-Akhirah', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu Al-Qa'dah", 'Dhu Al-Hijjah',
  ];
  // Approximate offset: Hijri year ≈ Gregorian - 579
  const now = new Date();
  const hijriYear = now.getFullYear() - 579;
  const monthIndex = now.getMonth(); // approximate
  return `${now.getDate()} ${hijriMonths[monthIndex]} ${hijriYear} H`;
}

/** Returns a time-based Arabic greeting */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Sabahul Khair 🌅';
  if (hour < 17) return 'Assalamualaikum ☀️';
  if (hour < 20) return 'Masaa Al-Khair 🌇';
  return 'Selamat Malam 🌙';
}
