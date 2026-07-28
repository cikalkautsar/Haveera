import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius, FontFamily, FontSize } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}


const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const { C } = useTheme();

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isOutline = variant === 'outline';

  const textColor = isPrimary || isDanger ? '#FFFFFF' : isOutline ? C.primary : C.primary;
  const spinnerColor = isPrimary || isDanger ? '#FFFFFF' : C.primary;

  const containerStyle = [
    styles.base,
    sizeStyles[size],
    !isPrimary && !isDanger && {
      backgroundColor: isOutline ? 'transparent' : variant === 'secondary' ? C.primaryLight : 'transparent',
      borderWidth: isOutline ? 1.5 : 0,
      borderColor: isOutline ? C.primary : undefined,
    },
    (disabled || loading) && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={fullWidth ? [styles.fullWidthWrapper, style] : undefined}
    >
      <View style={containerStyle}>
        {/* Gradient for primary and danger */}
        {(isPrimary || isDanger) && (
          <LinearGradient
            colors={isDanger ? [C.error, '#C0392B'] : [C.primaryMedium, C.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.button }]}
          />
        )}
        {/* Shimmer highlight */}
        {(isPrimary || isDanger) && (
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.button }]}
          />
        )}

        {loading ? (
          <ActivityIndicator color={spinnerColor} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <AppText variant="label" color={textColor} style={[{ fontWeight: '700' }, textStyle]}>
              {title}
            </AppText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.md, minHeight: 38 },
  md: { paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.xl, minHeight: 50 },
  lg: { paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl, minHeight: 58 },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  fullWidthWrapper: { width: '100%' },
  fullWidth: { width: '100%' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    zIndex: 2,
  },
  iconWrap: { marginRight: Spacing.xs },
  disabled: { opacity: 0.5 },
});

export default AppButton;
