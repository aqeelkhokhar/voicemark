import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { journal } from '@/features/journal';
import { AppButton } from '@/ui/components/app-button';
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
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry] = useState(() => journal.getById(id));
  // Collapsed by default when AI content exists; the transcript is the only
  // content on reflection-less entries, so those start expanded.
  const [transcriptVisible, setTranscriptVisible] = useState(
    () => !entry?.summary,
  );

  if (!entry) {
    return (
      <Screen>
        <View style={styles.centerEmpty}>
          <Text style={styles.body}>{copy.history.emptyTitle}</Text>
        </View>
      </Screen>
    );
  }

  const handleDelete = () => {
    Alert.alert(copy.entryDetail.deleteEntry, copy.history.deleteConfirm, [
      { text: copy.common.cancel, style: 'cancel' },
      {
        text: copy.entryDetail.deleteEntry,
        style: 'destructive',
        onPress: () => {
          journal.deleteById(entry.id);
          router.back();
        },
      },
    ]);
  };

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
          <View style={styles.quote}>
            <Text style={styles.followUp}>{entry.followUp}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text
          style={styles.transcriptToggle}
          onPress={() => setTranscriptVisible((visible) => !visible)}
        >
          {transcriptVisible
            ? copy.entryDetail.transcriptToggleExpanded
            : copy.entryDetail.transcriptToggleCollapsed}
        </Text>
        {transcriptVisible && (
          <Card>
            <Text style={styles.body}>{entry.editedTranscript}</Text>
          </Card>
        )}
      </View>

      <AppButton
        label={copy.entryDetail.deleteEntry}
        variant="destructive"
        onPress={handleDelete}
      />
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
  quote: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.sm,
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
  centerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
