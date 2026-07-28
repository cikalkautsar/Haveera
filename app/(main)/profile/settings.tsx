import AppCard from '@/src/components/common/AppCard';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import { useAuthStore } from '@/src/store/authStore';
import { Colors, Radius, Spacing } from '@/src/theme';
import { supabase } from '@/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const displayEmail = user?.email ?? '—';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open link.'),
    );
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">Settings</AppText>
      </View>

      {/* ── ACCOUNT ── */}
      <SettingSection title="Account">
        {/* Email row */}
        <SettingRow
          label="Email"
          value={displayEmail}
          onPress={() => setEmailModalVisible(true)}
        />

        <View style={styles.divider} />

        {/* Change password */}
        <SettingRow
          label="Change Password"
          onPress={() => setPasswordModalVisible(true)}
        />
      </SettingSection>

      {/* ── ABOUT ── */}
      <SettingSection title="About">
        <SettingRow label="Version" value="1.0.0" />
        <View style={styles.divider} />
        <SettingRow
          label="Licenses"
          onPress={() => router.push('/(main)/profile/licenses' as any)}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Privacy Policy"
          onPress={() => handleOpenLink('https://haveera.app/privacy')}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Terms of Service"
          onPress={() => handleOpenLink('https://haveera.app/terms')}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Send Feedback"
          onPress={() => handleOpenLink('mailto:feedback@haveera.app')}
        />
      </SettingSection>

      {/* Modals */}
      <ChangeEmailModal
        visible={emailModalVisible}
        currentEmail={displayEmail}
        onClose={() => setEmailModalVisible(false)}
      />
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    </ScreenContainer>
  );
}

// ─────────────────────────────────────────────
// Change Email Modal
// ─────────────────────────────────────────────
function ChangeEmailModal({
  visible,
  currentEmail,
  onClose,
}: {
  visible: boolean;
  currentEmail: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!email || email === currentEmail) { onClose(); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email });
    setLoading(false);
    if (error) {
      Alert.alert('Gagal', error.message);
    } else {
      Alert.alert('Berhasil', 'Email berhasil diperbarui. Cek inbox kamu untuk konfirmasi.');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <AppText variant="heading" style={{ marginBottom: Spacing.base }}>Ganti Email</AppText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email baru"
            placeholderTextColor={Colors.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel="New email input"
          />
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save email"
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <AppText variant="body" color="#fff" style={{ fontWeight: '700', textAlign: 'center' }}>Simpan</AppText>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
            <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>Batal</AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Change Password Modal
// ─────────────────────────────────────────────
function ChangePasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!password) { Alert.alert('Password tidak boleh kosong'); return; }
    if (password !== confirm) { Alert.alert('Password tidak cocok'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      Alert.alert('Gagal', error.message);
    } else {
      Alert.alert('Berhasil', 'Password berhasil diperbarui.');
      setPassword('');
      setConfirm('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <AppText variant="heading" style={{ marginBottom: Spacing.base }}>Ganti Password</AppText>
          <TextInput
            style={[styles.input, { marginBottom: Spacing.sm }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password baru"
            placeholderTextColor={Colors.textDisabled}
            secureTextEntry
            accessibilityLabel="New password input"
          />
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Konfirmasi password"
            placeholderTextColor={Colors.textDisabled}
            secureTextEntry
            accessibilityLabel="Confirm password input"
          />
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save password"
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <AppText variant="body" color="#fff" style={{ fontWeight: '700', textAlign: 'center' }}>Simpan</AppText>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
            <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>Batal</AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color={Colors.textSecondary} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <AppCard noPadding>{children}</AppCard>
    </View>
  );
}

function SettingRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
    >
      <AppText variant="body" color={Colors.textPrimary} style={styles.rowLabel}>
        {label}
      </AppText>
      {value && (
        <AppText variant="body" color={Colors.textSecondary} numberOfLines={1} style={{ maxWidth: '55%' }}>
          {value}
        </AppText>
      )}
      {onPress && (
        <AppText variant="body" color={Colors.textDisabled}>›</AppText>
      )}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.8,
  },
  // Setting row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 52,
    gap: Spacing.sm,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.bottomSheet,
    borderTopRightRadius: Radius.bottomSheet,
    padding: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  cancelBtn: {
    paddingVertical: Spacing.sm,
  },
});
