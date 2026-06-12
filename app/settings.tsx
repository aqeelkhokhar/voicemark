import Constants from 'expo-constants';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { copy } from '@/copy';
import { AppButton } from '@/ui/components/app-button';
import { Card } from '@/ui/components/card';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '0.1.0';

  return (
    <Screen scroll>
      <View style={styles.group}>
        <Text style={styles.groupTitle}>
          {copy.settings.aiProvider.groupTitle}
        </Text>
        <Card>
          <Text style={styles.fieldLabel}>
            {copy.settings.aiProvider.keyFieldLabel}
          </Text>
          <TextInput
            editable={false}
            secureTextEntry
            placeholder={copy.settings.aiProvider.keyFieldPlaceholder}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
          <Text style={styles.helpLink}>
            {copy.settings.aiProvider.keyHelpLink}
          </Text>
          <AppButton
            label={copy.settings.aiProvider.keyTestButton}
            variant="secondary"
          />
        </Card>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{copy.settings.data.groupTitle}</Text>
        <Card>
          <AppButton
            label={copy.settings.data.clearAllEntries}
            variant="destructive"
          />
        </Card>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{copy.settings.about.groupTitle}</Text>
        <Card>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {copy.settings.about.versionRow}
            </Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.rowLink}>{copy.settings.about.githubRow}</Text>
          <View style={styles.divider} />
          <Text style={styles.rowLink}>{copy.settings.about.privacyRow}</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.md,
  },
  groupTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    minHeight: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
  },
  helpLink: {
    ...typography.caption,
    color: colors.accent,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowLink: {
    ...typography.body,
    color: colors.accent,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
});
