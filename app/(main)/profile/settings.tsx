import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/src/theme';
import AppText from '@/src/components/common/AppText';
import AppCard from '@/src/components/common/AppCard';
import ScreenContainer from '@/src/components/common/ScreenContainer';

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

interface SettingToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Bahasa Indonesia'>('English');
  const calculationMethod = 'Muslim World League';
  const [madhhab, setMadhhab] = useState('Shafi');

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppText variant="body" color={Colors.primary}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="heading">Settings</AppText>
      </View>

      <SettingSection title="General">
        <SettingToggle
          label="Notifications"
          description="Prayer time and worship reminders"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Language"
          value={language}
          onPress={() =>
            setLanguage((l) =>
              l === 'English' ? 'Bahasa Indonesia' : 'English',
            )
          }
        />
      </SettingSection>


      <SettingSection title="Prayer">
        <SettingRow
          label="Calculation Method"
          value={calculationMethod}
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Madhhab"
          value={madhhab}
          onPress={() =>
            setMadhhab((m) =>
              ['Shafi', 'Hanafi', 'Maliki', 'Hanbali'][
                (['Shafi', 'Hanafi', 'Maliki', 'Hanbali'].indexOf(m) + 1) % 4
              ],
            )
          }
        />
      </SettingSection>

      <SettingSection title="Privacy">
        <SettingRow
          label="Delete Account"
          onPress={handleDeleteAccount}
          destructive
        />
      </SettingSection>


      <SettingSection title="About">
        <SettingRow label="Version" value="1.0.0 (MVP)" />
        <View style={styles.divider} />
        <SettingRow label="Licenses" onPress={() => {}} />
      </SettingSection>
    </ScreenContainer>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color={Colors.textSecondary} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <AppCard noPadding>{children}</AppCard>
    </View>
  );
}

function SettingRow({ label, value, onPress, destructive = false }: SettingRowProps & { destructive?: boolean }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
    >
      <AppText
        variant="body"
        color={destructive ? Colors.error : Colors.textPrimary}
        style={styles.rowLabel}
      >
        {label}
      </AppText>
      {value && (
        <AppText variant="body" color={Colors.textSecondary}>
          {value}
        </AppText>
      )}
      {onPress && !value && (
        <AppText variant="body" color={Colors.textDisabled}>›</AppText>
      )}
    </TouchableOpacity>
  );
}

function SettingToggle({ label, description, value, onValueChange }: SettingToggleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.toggleLeft}>
        <AppText variant="body">{label}</AppText>
        {description && (
          <AppText variant="caption" color={Colors.textSecondary}>
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primaryMedium }}
        thumbColor={Colors.background}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 52,
    gap: Spacing.sm,
  },
  rowLabel: {
    flex: 1,
  },
  toggleLeft: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },
});
