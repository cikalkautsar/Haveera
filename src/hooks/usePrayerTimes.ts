import { NextPrayer, Prayer, PrayerChecklist } from '@/src/types/prayer.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

const SHALAT_API = 'https://equran.id/api/v2/shalat';
const ALADHAN_API = 'https://api.aladhan.com/v1/timings';
const STORAGE_KEY = '@haveera/prayer_location_v2';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LocationMode = 'gps' | 'manual';

export interface PrayerLocation {
  mode: LocationMode;
  /** Display name shown in UI, e.g. "Jakarta Selatan" or "Bandung" */
  displayName: string;
  /** For GPS mode */
  latitude?: number;
  longitude?: number;
  /** For manual mode */
  provinsi?: string;
  kabkota?: string;
}

// ─── Persistence ─────────────────────────────────────────────────────────────

export async function savePrayerLocation(loc: PrayerLocation): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
}

export async function loadPrayerLocation(): Promise<PrayerLocation | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearPrayerLocation(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

// ─── Manual mode helpers ──────────────────────────────────────────────────────

export async function fetchProvinsiList(): Promise<string[]> {
  const res = await fetch(`${SHALAT_API}/provinsi`);
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchKabkotaList(provinsi: string): Promise<string[]> {
  const res = await fetch(`${SHALAT_API}/kabkota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provinsi }),
  });
  const data = await res.json();
  return data.data ?? [];
}

// ─── GPS helpers ──────────────────────────────────────────────────────────────

/**
 * Try to get device GPS coordinates.
 * Returns null if permission is denied or GPS unavailable.
 */
export async function getDeviceCoords(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return null;
  }
}

/**
 * Reverse-geocode coordinates to get a human-readable city name.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (results.length > 0) {
      const r = results[0];
      // Prefer subregion (kecamatan) or city or region
      return r.subregion ?? r.city ?? r.region ?? 'Lokasi Saya';
    }
  } catch {
    // fallback below
  }
  return 'Lokasi GPS';
}

// ─── Fetch prayer times ───────────────────────────────────────────────────────

interface RawPrayers {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  tanggal_lengkap?: string;
}

async function fetchByGPS(lat: number, lon: number, today: Date): Promise<RawPrayers> {
  const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  const url = `${ALADHAN_API}/${dateStr}?latitude=${lat}&longitude=${lon}&method=11`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.code !== 200 || !json.data?.timings) {
    throw new Error('Gagal mendapat jadwal dari GPS.');
  }

  const t = json.data.timings;
  // aladhan returns "HH:MM" with optional " (timezone)" suffix — strip suffix
  const clean = (s: string) => s.replace(/\s*\(.*\)$/, '').trim();

  return {
    subuh: clean(t.Fajr),
    dzuhur: clean(t.Dhuhr),
    ashar: clean(t.Asr),
    maghrib: clean(t.Maghrib),
    isya: clean(t.Isha),
    tanggal_lengkap: json.data.date?.readable ?? today.toDateString(),
  };
}

async function fetchByManual(provinsi: string, kabkota: string, today: Date): Promise<RawPrayers> {
  const response = await fetch(SHALAT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provinsi,
      kabkota,
      bulan: today.getMonth() + 1,
      tahun: today.getFullYear(),
    }),
  });

  const resJson = await response.json();

  if (resJson.code !== 200 || !resJson.data?.jadwal) {
    throw new Error(`Gagal mendapat jadwal untuk ${kabkota}.`);
  }

  const dateNum = today.getDate();
  const todayJadwal =
    resJson.data.jadwal.find((j: any) => j.tanggal === dateNum) ?? resJson.data.jadwal[0];

  if (!todayJadwal) throw new Error('Data jadwal tidak ditemukan.');

  return {
    subuh: todayJadwal.subuh,
    dzuhur: todayJadwal.dzuhur,
    ashar: todayJadwal.ashar,
    maghrib: todayJadwal.maghrib,
    isya: todayJadwal.isya,
    tanggal_lengkap: todayJadwal.tanggal_lengkap,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UsePrayerTimesReturn {
  checklist: PrayerChecklist;
  nextPrayer: NextPrayer;
  togglePrayer: (name: Prayer['name']) => void;
  loading: boolean;
  /** Human-readable location name shown in UI */
  locationName: string | null;
  location: PrayerLocation | null;
  /** True when no location is saved and GPS was denied — show manual picker */
  needsManualLocation: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<PrayerLocation | null>(null);
  const [needsManualLocation, setNeedsManualLocation] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [checklist, setChecklist] = useState<PrayerChecklist>({
    date: new Date().toISOString(),
    prayers: [],
  });

  const [nextPrayer, setNextPrayer] = useState<NextPrayer>({
    name: 'Subuh',
    time: '--:--',
    countdown: '--j --m',
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setNeedsManualLocation(false);

      try {
        const today = new Date();
        let raw: RawPrayers;
        let activeLoc: PrayerLocation;

        // 1. Check saved location
        const saved = await loadPrayerLocation();

        if (saved) {
          // Use saved location
          activeLoc = saved;
        } else {
          // 2. Try GPS auto-detection
          const coords = await getDeviceCoords();

          if (coords) {
            const displayName = await reverseGeocode(coords.latitude, coords.longitude);
            activeLoc = {
              mode: 'gps',
              displayName,
              latitude: coords.latitude,
              longitude: coords.longitude,
            };
            // Save so we don't re-request GPS on every open
            await savePrayerLocation(activeLoc);
          } else {
            // 3. GPS denied/unavailable → ask user to pick manually
            if (!cancelled) {
              setNeedsManualLocation(true);
              setLoading(false);
            }
            return;
          }
        }

        if (cancelled) return;
        setLocation(activeLoc);

        // 4. Fetch prayer times based on mode
        if (activeLoc.mode === 'gps' && activeLoc.latitude != null && activeLoc.longitude != null) {
          raw = await fetchByGPS(activeLoc.latitude, activeLoc.longitude, today);
        } else if (activeLoc.mode === 'manual' && activeLoc.provinsi && activeLoc.kabkota) {
          raw = await fetchByManual(activeLoc.provinsi, activeLoc.kabkota, today);
        } else {
          // Malformed saved location — clear and ask again
          await clearPrayerLocation();
          if (!cancelled) {
            setNeedsManualLocation(true);
            setLoading(false);
          }
          return;
        }

        if (cancelled) return;

        const prayers: Prayer[] = [
          { name: 'Subuh', time: raw.subuh, status: 'pending' },
          { name: 'Dzuhur', time: raw.dzuhur, status: 'pending' },
          { name: 'Ashar', time: raw.ashar, status: 'pending' },
          { name: 'Maghrib', time: raw.maghrib, status: 'pending' },
          { name: 'Isya', time: raw.isya, status: 'pending' },
        ];

        setChecklist({ date: raw.tanggal_lengkap ?? today.toISOString(), prayers });

        // 5. Compute next prayer & countdown
        const currentHour = today.getHours();
        const currentMin = today.getMinutes();
        const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

        let targetPrayer = prayers[0];
        let foundNext = false;
        for (const p of prayers) {
          if (currentTimeStr < p.time) {
            targetPrayer = p;
            foundNext = true;
            break;
          }
        }

        const [pHour, pMin] = targetPrayer.time.split(':').map(Number);
        let diffMins = pHour * 60 + pMin - (currentHour * 60 + currentMin);
        if (!foundNext || diffMins < 0) diffMins += 24 * 60;

        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        setNextPrayer({
          name: targetPrayer.name,
          time: targetPrayer.time,
          countdown: h > 0 ? `${h}j ${m}m` : `${m}m`,
        });
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Gagal memuat jadwal sholat.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [fetchTrigger]);

  const togglePrayer = useCallback((name: Prayer['name']) => {
    setChecklist((prev) => ({
      ...prev,
      prayers: prev.prayers.map((prayer) => {
        if (prayer.name !== name) return prayer;
        const nextStatus = prayer.status === 'completed' ? 'pending' : 'completed';
        return { ...prayer, status: nextStatus };
      }),
    }));
  }, []);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  const locationName = location?.displayName ?? null;

  return {
    checklist,
    nextPrayer,
    togglePrayer,
    loading,
    locationName,
    location,
    needsManualLocation,
    error,
    refetch,
  };
}
