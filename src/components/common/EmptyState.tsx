import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '@/src/theme';
import AppText from './AppText';
import AppButton from './AppButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * EmptyState — friendly empty list / page placeholder.
 * Per UI guidelines: icon + short explanation + optional action.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌙',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.icon}>{icon}</AppText>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      {description && (
        <AppText variant="body" color="#6B7280" align="center" style={styles.description}>
          {description}
        </AppText>
      )}
      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.action}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  description: {
    marginTop: Spacing.xs,
  },
  action: {
    marginTop: Spacing.base,
  },
});

export default EmptyState;
