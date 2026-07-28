import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { FontFamily } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from './AppText';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  style?: ViewStyle;
}

/**
 * Avatar — displays initials inside a colored circle.
 * Background uses gender-aware primary color.
 */
const Avatar: React.FC<AvatarProps> = ({ name, size = 44, style }) => {
  const { C } = useTheme();
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const fontSize = Math.round(size * 0.38);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: C.primary },
        style,
      ]}
    >
      <AppText
        style={{
          fontFamily: FontFamily.semiBold,
          fontSize,
          color: C.textInverse,
          includeFontPadding: false,
        }}
      >
        {initials}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default Avatar;
