import AppButton from '@/src/components/common/AppButton';
import AppInput from '@/src/components/common/AppInput';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import { mapSupabaseUser, useAuthStore } from '@/src/store/authStore';
import { Colors, Spacing } from '@/src/theme';
import { LoginFormValues } from '@/src/types/auth.types';
import { supabase } from '@/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

export default function Login() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    try {
      const username = data.username.trim().toLowerCase();
      const { data: email, error: rpcError } = await supabase
        .rpc('get_email_by_username', { p_username: username });

      if (rpcError || !email) {
        setLoginError('Username atau password sepertinya salah. Coba lagi.');
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (authError || !authData.user) {
        setLoginError('Username atau password sepertinya salah. Coba lagi.');
        return;
      }

      login(mapSupabaseUser(authData.user));
      router.replace('/(main)/home');
    } catch {
      setLoginError('Terjadi kesalahan. Periksa koneksimu dan coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenContainer scrollable>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={require('@/assets/images/haveera.jpg')} style={styles.logoImage} />
          </View>
          <AppText variant="heading">Welcome Back</AppText>
          <AppText variant="body" color={Colors.textSecondary} align="center">
            Masuk untuk melanjutkan perjalanan spiritualmu
          </AppText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              pattern: {
                value: /^[a-zA-Z0-9._]+$/,
                message: 'Hanya huruf, angka, titik, dan underscore',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Username"
                placeholder="contoh: haveera_user"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(t) => onChange(t.toLowerCase())}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password wajib diisi',
              minLength: { value: 6, message: 'Minimal 6 karakter' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="••••••••"
                isPassword
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          {/* Lupa Password */}
          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password' as any)}
            style={styles.forgotBtn}
            accessibilityRole="button"
            accessibilityLabel="Lupa password"
          >
            <AppText variant="caption" color={Colors.primary}>Lupa Password?</AppText>
          </TouchableOpacity>

          {/* Inline error */}
          {loginError && (
            <View style={styles.errorBanner}>
              <AppText variant="caption" color={Colors.error ?? '#D32F2F'}>
                {loginError}
              </AppText>
            </View>
          )}

          <AppButton
            title="Login"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <AppText variant="caption" color={Colors.textSecondary}>atau</AppText>
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            title="Lanjutkan dengan Google"
            onPress={() => {}}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="body" color={Colors.textSecondary}>
            Belum punya akun?{' '}
          </AppText>
          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <AppText variant="bodyMedium" color={Colors.primary}>
              Daftar
            </AppText>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    gap: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.xs,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
});
