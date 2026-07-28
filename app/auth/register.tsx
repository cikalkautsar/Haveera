import AppButton from '@/src/components/common/AppButton';
import AppInput from '@/src/components/common/AppInput';
import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/common/ScreenContainer';
import { Colors, Spacing } from '@/src/theme';
import { RegisterFormValues } from '@/src/types/auth.types';
import { supabase } from '@/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert, KeyboardAvoidingView,
    Platform, StyleSheet,
    TouchableOpacity, View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'Ikhwan',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const username = data.username.trim().toLowerCase();

      // ini cek dlu username nya ada apa ga
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        Alert.alert('Username Sudah Dipakai', 'Pilih username yang lain.');
        return;
      }

      // ini bkin data kl gak ada
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            username,
            gender: data.gender,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Gagal membuat akun.');


      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        username,
        full_name: data.name,
        gender: data.gender,
      });

      if (profileError) throw profileError;

      Alert.alert(
        'Akun Dibuat!',
        'Silakan cek email kamu untuk verifikasi, lalu login.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }],
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      Alert.alert('Pendaftaran Gagal', err.message ?? 'Terjadi kesalahan.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenContainer scrollable>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppText variant="body" color={Colors.primary}>← Back</AppText>
          </TouchableOpacity>
          <AppText variant="heading">Buat Akun</AppText>
          <AppText variant="body" color={Colors.textSecondary} align="center">
            Bergabung dengan Haveera dan mulai perjalanan ibadahmu
          </AppText>
        </View>
        
        <View style={styles.form}>

          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Nama lengkap wajib diisi',
              minLength: { value:3, message: 'Minimal 3 karakter' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Nama Lengkap"
                placeholder="Muhammad"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                autoCapitalize="words"
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username wajib diisi',
              minLength: { value: 3, message: 'Minimal 3 karakter' },
              maxLength: { value: 20, message: 'Maksimal 20 karakter' },
              pattern: {
                value: /^[a-zA-Z0-9._]+$/,
                message: 'Hanya huruf, angka, titik, dan underscore',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Username"
                placeholder="haveera_user"
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
            name="email"
            rules={{
              required: 'Email wajib diisi',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Email tidak valid' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.email?.message}
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

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Konfirmasi password wajib diisi',
              validate: (v) => v === password || 'Password tidak sama',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Konfirmasi Password"
                placeholder="••••••••"
                isPassword
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

  
          <Controller
            control={control}
            name="gender"
            rules={{ required: 'Pilih gender' }}
            render={({ field: { onChange, value } }) => (
              <View>
                <AppText variant="label" style={styles.genderLabel}>Gender</AppText>
                <View style={styles.genderRow}>
                  {(['Ikhwan', 'Akhwat'] as const).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        value === option && styles.genderOptionSelected,
                      ]}
                      onPress={() => onChange(option)}
                      accessibilityRole="button"
                      accessibilityLabel={option}
                    >
                      <AppText
                        variant="bodyMedium"
                        color={value === option ? Colors.white : Colors.textSecondary}
                      >
                        {option}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && (
                  <AppText variant="caption" color={Colors.error} style={styles.genderError}>
                    {errors.gender.message}
                  </AppText>
                )}
              </View>
            )}
          />

          <AppButton
            title="Buat Akun"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <AppText variant="body" color={Colors.textSecondary}>
            Sudah punya akun?{' '}
          </AppText>
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            accessibilityRole="button"
            accessibilityLabel="Login"
          >
            <AppText variant="bodyMedium" color={Colors.primary}>Login</AppText>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  backButton: {
    marginBottom: Spacing.sm,
  },
  form: {
    gap: Spacing.base,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  genderLabel: {
    marginBottom: Spacing.sm,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border ?? '#E0E0E0',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  genderOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderError: {
    marginTop: 4,
  },
});
