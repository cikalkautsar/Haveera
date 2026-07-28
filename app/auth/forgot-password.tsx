import AppButton from '@/src/components/common/AppButton';
import AppInput from '@/src/components/common/AppInput';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import { Colors, Spacing } from '@/src/theme';
import { supabase } from '@/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type FormValues = { email: string };

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: '' } });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(
      data.email.trim().toLowerCase(),
      { redirectTo: 'haveera://auth/reset-password' },
    );
    if (error) {
      setErrorMsg('Gagal mengirim email. Periksa alamat emailmu dan coba lagi.');
    } else {
      setSent(true);
    }
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
          <AppText variant="body" color={Colors.primary}>← Kembali</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <AppText style={styles.iconText}>🔑</AppText>
        </View>

        <AppText variant="heading" align="center">Lupa Password?</AppText>
        <AppText variant="body" color={Colors.textSecondary} align="center" style={styles.subtitle}>
          Masukkan email yang terdaftar. Kami akan kirimkan link untuk reset password.
        </AppText>

        {sent ? (
          /* Success state */
          <View style={styles.successBanner}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMedium" color="#1B5E20">Email terkirim!</AppText>
              <AppText variant="caption" color="#2E7D32" style={{ marginTop: 2 }}>
                Cek inbox atau folder spam kamu. Link reset password sudah dikirim.
              </AppText>
            </View>
          </View>
        ) : (
          /* Form */
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format email tidak valid',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Email"
                  placeholder="email@kamu.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            {errorMsg && (
              <View style={styles.errorBanner}>
                <AppText variant="caption" color="#D32F2F">{errorMsg}</AppText>
              </View>
            )}

            <AppButton
              title="Kirim Link Reset"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              style={styles.button}
            />
          </View>
        )}

        {/* Back to login */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          style={styles.backLogin}
          accessibilityRole="button"
          accessibilityLabel="Back to login"
        >
          <AppText variant="body" color={Colors.textSecondary}>
            Ingat password?{' '}
            <AppText variant="bodyMedium" color={Colors.primary}>Masuk</AppText>
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: Spacing.base,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconText: {
    fontSize: 32,
  },
  subtitle: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xs,
  },
  form: {
    width: '100%',
    gap: Spacing.base,
    marginTop: Spacing.sm,
  },
  button: {
    marginTop: Spacing.xs,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#388E3C',
    padding: Spacing.base,
    width: '100%',
    marginTop: Spacing.sm,
  },
  successIcon: {
    fontSize: 20,
  },
  backLogin: {
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
  },
});
