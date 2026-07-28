import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { Typography, TypographyVariant } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';

interface AppTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

/**
 * AppText — enforces the Haveera typography scale.
 * Use this instead of raw <Text> to maintain consistency.
 */
const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  align,
  numberOfLines,
  style,
  children,
}) => {
  const { C } = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        Typography[variant],
        { color: color ?? C.textPrimary },
        align ? { textAlign: align } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export default AppText;
