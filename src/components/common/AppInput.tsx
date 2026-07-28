import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Spacing, Radius, FontFamily, FontSize } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';

interface AppInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

/**
 * AppInput — labeled, validated text input with gender-aware colors.
 */
const AppInput: React.FC<AppInputProps> = ({
  label,
  errorMessage,
  helperText,
  containerStyle,
  isPassword = false,
  style,
  ...inputProps
}) => {
  const { C } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  const borderColor = errorMessage
    ? C.error
    : isFocused
    ? C.primary
    : C.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: C.textPrimary }]}>{label}</Text>
      )}

      <View style={[styles.inputWrap, { borderColor, backgroundColor: C.surface }]}>
        <TextInput
          style={[styles.input, { color: C.textPrimary }, style]}
          placeholderTextColor={C.textDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          {...inputProps}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure((prev) => !prev)}
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{isSecure ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? (
        <Text style={[styles.helperText, { color: C.error }]}>{errorMessage}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: C.textSecondary }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.label,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.base,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    paddingVertical: Spacing.sm,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  eyeText: {
    fontSize: 16,
  },
  helperText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption,
  },
});

export default AppInput;
