/**
 * GlassCard — Liquid glass morphism card.
 * Karakteristik: semi-transparent bg, gradient shimmer overlay, frosted look,
 * soft white border, colored glow shadow.
 */
import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/context/ThemeContext';
import { Radius } from '@/src/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gradient colors for glass tint [top, bottom] */
  tint?: [string, string];
  padding?: number;
  noPadding?: boolean;
  /** Blur strength (visual only via opacity layers) */
  intensity?: 'light' | 'medium' | 'strong';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  tint,
  padding = 20,
  noPadding = false,
  intensity = 'medium',
}) => {
  const { C } = useTheme();
  const baseAlpha = intensity === 'light' ? 0.12 : intensity === 'strong' ? 0.28 : 0.18;
  const topColor = tint?.[0] ?? C.secondary;
  const bottomColor = tint?.[1] ?? C.primary;

  return (
    <View style={[styles.wrapper, { shadowColor: topColor }, style]}>
      {/* Glass background gradient */}
      <LinearGradient
        colors={[
          hexToRgba(topColor, baseAlpha + 0.05),
          hexToRgba(bottomColor, baseAlpha),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* White shimmer top-left */}
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFillObject, styles.shimmer]}
      />
      {/* Content */}
      <View style={[styles.content, noPadding ? {} : { padding }]}>
        {children}
      </View>
    </View>
  );
};

/** Helper: convert hex to rgba string */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.clay,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  shimmer: {
    borderRadius: Radius.clay,
    width: '60%',
    height: '60%',
    top: 0,
    left: 0,
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
});

export default GlassCard;
