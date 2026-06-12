import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { mockEntry } from '@/features/journal/mock';
import { Card } from '@/ui/components/card';
import { MoodPill } from '@/ui/components/mood-pill';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

function formatEntryDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EntryDetailScreen() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.date}>{formatEntryDate(mockEntry.createdAt)}</Text>
        <MoodPill mood={mockEntry.mood} />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>{copy.reflection.summaryHeading}</Text>
        <Card>
          {mockEntry.summary.map((bullet) => (
            <Text key={bullet} style={styles.body}>
              · {bullet}
            </Text>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>{copy.reflection.followupHeading}</Text>
        <Card>
          <Text style={styles.followUp}>{mockEntry.followUp}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.transcriptToggle}>
          {copy.entryDetail.transcriptToggleExpanded}
        </Text>
        <Card>
          <Text style={styles.body}>{mockEntry.transcript}</Text>
        </Card>
      </View>

      <Text style={styles.deleteEntry}>{copy.entryDetail.deleteEntry}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  date: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  heading: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textPrimary,
  },
  followUp: {
    ...typography.body,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  transcriptToggle: {
    ...typography.caption,
    color: colors.accent,
  },
  deleteEntry: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
