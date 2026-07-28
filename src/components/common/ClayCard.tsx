/**
 * ClayCard — Claymorphism card component.
 * Karakteristik: round corners besar, colored shadow, soft border, slight inner highlight.
 */
import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Radius } from '@/src/theme';

interface ClayCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Override background color */
  color?: string;
  /** Override shadow color (defaults to primary) */
  shadowColor?: string;
  padding?: number;
  noPadding?: boolean;
}

const ClayCard: React.FC<ClayCardProps> = ({
  children,
  style,
  color,
  shadowColor,
  padding = 20,
  noPadding = false,
}) => {
  const { C } = useTheme();
  const bg = color ?? C.surface;
  const sc = shadowColor ?? C.primary;

  return (
    <View
      style={[
        styles.clay,
        {
          backgroundColor: bg,
          shadowColor: sc,
          padding: noPadding ? 0 : padding,
        },
        style,
      ]}
    >
      {/* Inner top highlight — simulates clay depth */}
      <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.45)' }]} pointerEvents="none" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  clay: {
    borderRadius: Radius.clay,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
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

export default ClayCard;
