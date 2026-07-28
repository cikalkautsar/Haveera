import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Radius, Spacing } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  noPadding?: boolean;
}

/**
 * AppCard — Claymorphism card container.
 * Soft shadow, rounded, inner highlight.
 */
const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  padding = Spacing.base,
  noPadding = false,
}) => {
  const { C } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: C.surface,
          shadowColor: C.primary,
          padding: noPadding ? 0 : padding,
        },
        style,
      ]}
    >
      {/* Inner top highlight */}
      <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.6)' }]} pointerEvents="none" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.clay,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: Radius.clay,
    borderTopRightRadius: Radius.clay,
    zIndex: 1,
  },
});

export default AppCard;
