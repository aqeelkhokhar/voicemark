import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

export default function HistoryScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>{copy.history.emptyTitle}</Text>
        <Text style={styles.emptyBody}>{copy.history.emptyBody}</Text>
        {/* Phase 1 only: route into the detail placeholder until real entries exist (Phase 2). */}
        <Link href="/history/sample" style={styles.sampleLink}>
          {copy.history.dateGroupLabels.earlier}
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sampleLink: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.lg,
  },
});
