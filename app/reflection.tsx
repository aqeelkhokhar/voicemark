import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { journal } from '@/features/journal';
import { takePendingReflection } from '@/features/reflection/pending';
import { AppButton } from '@/ui/components/app-button';
import { Card } from '@/ui/components/card';
import { MoodPill } from '@/ui/components/mood-pill';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

export default function ReflectionScreen() {
  const router = useRouter();
  // One-shot payload from Review; consumed once per mount.
  const [pending] = useState(() => takePendingReflection());

  if (!pending) {
    // Reached without a fresh reflection (e.g. back navigation after save).
    return (
      <Screen>
        <View style={styles.centerEmpty}>
          <Text style={styles.body}>{copy.reflection.errorBody}</Text>
        </View>
        <AppButton
          label={copy.firstLaunchTooltip.dismiss}
          variant="secondary"
          onPress={() => router.dismissTo('/')}
        />
      </Screen>
    );
  }

  const { result } = pending;

  const handleSave = () => {
    journal.insert({
      rawTranscript: pending.rawTranscript,
      editedTranscript: pending.editedTranscript,
      summary: [...result.summary],
      followUp: result.followUp,
      mood: result.mood,
    });
    router.dismissTo('/');
  };

  return (
    <Screen scroll>
      <View style={styles.section}>
        <Text style={styles.heading}>{copy.reflection.summaryHeading}</Text>
        <Card>
          {result.summary.map((bullet) => (
            <Text key={bullet} style={styles.body}>
              · {bullet}
            </Text>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>{copy.reflection.followupHeading}</Text>
        <Card>
          <Text style={styles.followUp}>{result.followUp}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>{copy.reflection.moodHeading}</Text>
        <MoodPill mood={result.mood} />
      </View>

      <AppButton label={copy.reflection.saveButton} onPress={handleSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
