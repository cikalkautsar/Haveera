import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/src/theme';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  color?: string;
  style?: ViewStyle;
}

/**
 * LoadingIndicator — centered activity spinner.
 * Every screen should show loading feedback (per UI guidelines).
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullScreen = false,
  color = Colors.primary,
  style,
}) => {
  return (
    <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
      <ActivityIndicator color={color} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

export default LoadingIndicator;
