import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { JournalEntry, journal } from '@/features/journal';
import { relativeDate } from '@/features/journal/date-groups';
import { MoodPill } from '@/ui/components/mood-pill';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function TodayScreen() {
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLatestEntry(journal.listByDate()[0] ?? null);
    }, []),
  );

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{copy.today.title}</Text>
          <Text style={styles.date}>{formatToday()}</Text>
        </View>
        <View style={styles.navLinks}>
          <Link href="/history" style={styles.navLink}>
            {copy.history.title}
          </Link>
          <Link href="/settings" style={styles.navLink}>
            {copy.settings.title}
          </Link>
        </View>
      </View>

      <View style={styles.center}>
        <Pressable
          accessibilityLabel={copy.today.recordButtonLabel}
          onPress={() => router.push('/record')}
          style={({ pressed }) => [
            styles.recordButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.recordButtonInner} />
        </Pressable>
        <Text style={styles.recordLabel}>{copy.today.recordButtonLabel}</Text>
        {!latestEntry && (
          <Text style={styles.emptyHint}>{copy.today.emptyHint}</Text>
        )}
      </View>

      {latestEntry && (
        <Link href={`/history/${latestEntry.id}`} asChild>
          <Pressable
            style={({ pressed }) => [styles.preview, pressed && styles.pressed]}
          >
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>
                {copy.today.recentEntryPrefix}
                {relativeDate(latestEntry.createdAt)}
              </Text>
              {latestEntry.mood && <MoodPill mood={latestEntry.mood} />}
            </View>
            <Text numberOfLines={2} style={styles.previewBody}>
              {latestEntry.editedTranscript}
            </Text>
          </Pressable>
        </Link>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.huge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  navLinks: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  navLink: {
    ...typography.caption,
    color: colors.accent,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: radii.recordButton,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonInner: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  recordLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  emptyHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  preview: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  previewLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  previewBody: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
