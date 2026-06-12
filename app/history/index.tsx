import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { JournalEntry, journal } from '@/features/journal';
import { groupEntriesByDate } from '@/features/journal/date-groups';
import { MoodPill } from '@/ui/components/mood-pill';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

function entryTime(createdAt: string): string {
  return new Date(createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      setEntries(journal.listByDate());
    }, []),
  );

  if (entries.length === 0) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>{copy.history.emptyTitle}</Text>
          <Text style={styles.emptyBody}>{copy.history.emptyBody}</Text>
        </View>
      </Screen>
    );
  }

  const sections = groupEntriesByDate(entries).map((group) => ({
    title: group.label,
    data: group.entries,
  }));

  return (
    <Screen contentStyle={styles.listContent}>
      <SectionList
        sections={sections}
        keyExtractor={(entry) => entry.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Link href={`/history/${item.id}`} asChild>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.rowHeader}>
                <Text style={styles.rowTime}>{entryTime(item.createdAt)}</Text>
                {item.mood && <MoodPill mood={item.mood} />}
              </View>
              <Text numberOfLines={2} style={styles.rowBody}>
                {item.summary?.[0] ?? item.editedTranscript}
              </Text>
            </Pressable>
          </Link>
        )}
        contentContainerStyle={styles.sections}
      />
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
  listContent: {
    padding: 0,
  },
  sections: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.md,
  },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rowBody: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
