/**
 * QuickActionsCard — Claymorphism grid with colored icon bubbles.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from '../common/AppText';

interface QuickAction {
  id: string;
  label: string;
  img: any; // Image source
  onPress: () => void;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
}

// Color pairs for each action bubble [light, main]
const BUBBLE_PALETTES = [
  ['#E8F5EE', '#2D7A4F'],
  ['#E0ECEF', '#105666'],
  ['#F5E0DC', '#D3968C'],
  ['#EEE9C8', '#839958'],
] as const;

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ actions }) => {
  const { C } = useTheme();
  return (
    <View style={[styles.wrapper, { backgroundColor: C.surface, shadowColor: C.accent }]}>
      <View style={[styles.highlight, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
      <AppText variant="title" style={{ marginBottom: Spacing.base }}>Akses Cepat</AppText>
      <View style={styles.grid}>
        {actions.map((action, i) => {
          const [lightColor, mainColor] = BUBBLE_PALETTES[i % BUBBLE_PALETTES.length];
          return (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={action.onPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              {/* Clay bubble */}
              <View style={[styles.bubble, { shadowColor: mainColor }]}>
                <LinearGradient
                  colors={[lightColor, mainColor + '33']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Shimmer */}
                <LinearGradient
                  colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFillObject, styles.bubbleShimmer]}
                />
                <Image 
                  source={action.img}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <AppText variant="caption" align="center" color={C.textSecondary} style={{ marginTop: Spacing.xs }}>
                {action.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.clay,
    padding: Spacing.xl,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 7,
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
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    maxWidth: 80,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  bubbleShimmer: {
    width: '70%',
    height: '70%',
    top: 0,
    left: 0,
    borderRadius: 20,
  },
  iconImage: { 
    width: 45, 
    height: 45, 
    zIndex: 2,
  },
});

export default QuickActionsCard;
