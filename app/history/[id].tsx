import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { journal } from '@/features/journal';
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = journal.getById(id);

  if (!entry) {
    return (
      <Screen>
        <View style={styles.centerEmpty}>
          <Text style={styles.body}>{copy.history.emptyTitle}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.date}>{formatEntryDate(entry.createdAt)}</Text>
        {entry.mood && <MoodPill mood={entry.mood} />}
      </View>

      {entry.summary && (
        <View style={styles.section}>
          <Text style={styles.heading}>{copy.reflection.summaryHeading}</Text>
          <Card>
            {entry.summary.map((bullet) => (
              <Text key={bullet} style={styles.body}>
                · {bullet}
              </Text>
            ))}
          </Card>
        </View>
      )}

      {entry.followUp && (
        <View style={styles.section}>
          <Text style={styles.heading}>{copy.reflection.followupHeading}</Text>
          <Card>
            <Text style={styles.followUp}>{entry.followUp}</Text>
          </Card>
        </View>
      )}

      {/* Phase 2: transcript expanded by default — no AI content exists yet.
          The collapse toggle ships in Phase 4. */}
      <View style={styles.section}>
        <Text style={styles.heading}>{copy.review.header}</Text>
        <Card>
          <Text style={styles.body}>{entry.editedTranscript}</Text>
        </Card>
      </View>
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
  centerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
