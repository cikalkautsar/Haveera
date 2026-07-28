import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius } from '@/src/theme';
import AppText from './AppText';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

/**
 * Badge — small status pill for streak counts, prayer states, labels.
 */
const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const bg = bgMap[variant];
  const fg = fgMap[variant];

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <AppText variant="labelSmall" color={fg}>
        {label}
      </AppText>
    </View>
  );
};

const bgMap: Record<BadgeVariant, string> = {
  success: Colors.successLight,
  warning: Colors.warningLight,
  error: Colors.errorLight,
  info: Colors.infoLight,
  neutral: Colors.surfaceAlt,
  primary: Colors.primaryLight,
};

const fgMap: Record<BadgeVariant, string> = {
  success: Colors.primary,
  warning: '#92400E',
  error: Colors.error,
  info: Colors.info,
  neutral: Colors.textSecondary,
  primary: Colors.primary,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
});

export default Badge;
