import React from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Colors, Spacing } from '@/src/theme';
import { LoginFormValues } from '@/src/types/auth.types';
import { useAuthStore, mapSupabaseUser } from '@/src/store/authStore';
import { supabase } from '@/supabase';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import AppText from '@/src/components/common/AppText';
import AppInput from '@/src/components/common/AppInput';
import AppButton from '@/src/components/common/AppButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const username = data.username.trim().toLowerCase();

      // Step 1: Resolve username → email via RPC (bypass RLS, SECURITY DEFINER)
      const { data: email, error: rpcError } = await supabase
        .rpc('get_email_by_username', { p_username: username });

      if (rpcError) throw rpcError;
      if (!email) throw new Error('Username tidak ditemukan.');

      // Step 2: Sign in with the resolved email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Login gagal, coba lagi.');

      login(mapSupabaseUser(authData.user));
      router.replace('/(main)/home');
    } catch (err: any) {
      Alert.alert('Login Gagal', err.message ?? 'Terjadi kesalahan.');
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
            Masuk untuk melanjutkan ibadah kamu
          </AppText>
        </View>

        <View style={styles.form}>
          {/* Username */}
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

          {/* Password */}
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
            onPress={() => router.push('/(auth)/register')}
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
});
