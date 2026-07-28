/**
 * LocationPickerModal
 * Shown when GPS permission is denied or unavailable.
 * User picks provinsi → kabkota → jadwal dimuat.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Spacing } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from '../common/AppText';
import {
  fetchKabkotaList,
  fetchProvinsiList,
  PrayerLocation,
  savePrayerLocation,
} from '@/src/hooks/usePrayerTimes';

interface LocationPickerModalProps {
  visible: boolean;
  onSaved: () => void;
}

type Step = 'provinsi' | 'kabkota';

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ visible, onSaved }) => {
  const { C } = useTheme();

  const [step, setStep] = useState<Step>('provinsi');
  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kabkotaList, setKabkotaList] = useState<string[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Load provinsi when modal opens
  useEffect(() => {
    if (!visible) return;
    setStep('provinsi');
    setSelectedProvinsi(null);
    setKabkotaList([]);
    setListError(null);
    loadProvinsi();
  }, [visible]);

  const loadProvinsi = async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const list = await fetchProvinsiList();
      setProvinsiList(list);
    } catch {
      setListError('Gagal memuat daftar provinsi. Coba lagi.');
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectProvinsi = useCallback(async (prov: string) => {
    setSelectedProvinsi(prov);
    setStep('kabkota');
    setLoadingList(true);
    setListError(null);
    try {
      const list = await fetchKabkotaList(prov);
      setKabkotaList(list);
    } catch {
      setListError('Gagal memuat daftar kota. Coba lagi.');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const handleSelectKabkota = useCallback(
    async (kota: string) => {
      if (!selectedProvinsi) return;
      setSaving(true);
      const loc: PrayerLocation = {
        mode: 'manual',
        displayName: kota,
        provinsi: selectedProvinsi,
        kabkota: kota,
      };
      await savePrayerLocation(loc);
      setSaving(false);
      onSaved();
    },
    [selectedProvinsi, onSaved],
  );

  const handleBack = useCallback(() => {
    setStep('provinsi');
    setSelectedProvinsi(null);
    setKabkotaList([]);
    setListError(null);
  }, []);

  const displayList = step === 'provinsi' ? provinsiList : kabkotaList;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: C.background }]}>
          {/* Header */}
          <LinearGradient
            colors={[C.primaryMedium, C.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            {step === 'kabkota' && (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.75}>
                <AppText color="rgba(255,255,255,0.9)" style={{ fontSize: 20 }}>
                  ←
                </AppText>
              </TouchableOpacity>
            )}
            <View style={styles.headerText}>
              <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{ letterSpacing: 0.5 }}>
                JADWAL SHOLAT
              </AppText>
              <AppText variant="title" color="#FFFFFF" style={styles.headerTitle}>
                {step === 'provinsi' ? 'Pilih Provinsi' : `Pilih Kota di ${selectedProvinsi}`}
              </AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.75)" style={{ marginTop: 2 }}>
                {step === 'provinsi'
                  ? 'GPS tidak tersedia. Pilih lokasi kamu secara manual.'
                  : 'Pilih kabupaten atau kota tempat kamu tinggal.'}
              </AppText>
            </View>
          </LinearGradient>

          {/* Step indicators */}
          <View style={[styles.stepRow, { backgroundColor: C.surface }]}>
            {(['provinsi', 'kabkota'] as Step[]).map((s, idx) => (
              <View key={s} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        step === s
                          ? C.primary
                          : idx < (step === 'kabkota' ? 1 : 0)
                          ? C.primaryMedium
                          : C.border,
                    },
                  ]}
                >
                  <AppText style={[styles.stepNum, { color: step === s || idx === 0 ? '#fff' : C.textDisabled }]}>
                    {idx + 1}
                  </AppText>
                </View>
                <AppText
                  variant="caption"
                  color={step === s ? C.primary : C.textDisabled}
                  style={{ fontWeight: step === s ? '700' : '400' }}
                >
                  {s === 'provinsi' ? 'Provinsi' : 'Kab/Kota'}
                </AppText>
              </View>
            ))}
            <View style={[styles.stepLine, { backgroundColor: C.border }]} />
          </View>

          {/* List */}
          {loadingList ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={C.primary} />
              <AppText variant="caption" color={C.textSecondary} style={{ marginTop: Spacing.sm }}>
                Memuat daftar...
              </AppText>
            </View>
          ) : listError ? (
            <View style={styles.center}>
              <AppText color={C.warning} align="center">
                {listError}
              </AppText>
              <TouchableOpacity
                onPress={step === 'provinsi' ? loadProvinsi : () => handleSelectProvinsi(selectedProvinsi!)}
                style={[styles.retryBtn, { backgroundColor: C.primaryLight }]}
                activeOpacity={0.8}
              >
                <AppText color={C.primary} style={{ fontWeight: '700' }}>
                  Coba Lagi
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {displayList.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.listItem, { borderBottomColor: C.border }]}
                  onPress={() =>
                    step === 'provinsi' ? handleSelectProvinsi(item) : handleSelectKabkota(item)
                  }
                  activeOpacity={0.7}
                  disabled={saving}
                >
                  <AppText variant="bodyMedium">{item}</AppText>
                  <AppText color={C.textDisabled} style={{ fontSize: 16 }}>
                    {step === 'provinsi' ? '›' : saving ? '…' : '✓'}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    minHeight: 130,
    justifyContent: 'flex-end',
  },
  headerText: { gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  backBtn: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.xl,
    padding: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    height: 2,
    width: '30%',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
    zIndex: 1,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.base,
    minHeight: 200,
  },
  retryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default LocationPickerModal;
