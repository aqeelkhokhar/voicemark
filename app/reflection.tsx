import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { mockEntry } from '@/features/journal/mock';
import { AppButton } from '@/ui/components/app-button';
import { Card } from '@/ui/components/card';
import { MoodPill } from '@/ui/components/mood-pill';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

export default function ReflectionScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
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
        <Text style={styles.heading}>{copy.reflection.moodHeading}</Text>
        <MoodPill mood={mockEntry.mood} />
      </View>

      <AppButton
        label={copy.reflection.saveButton}
        onPress={() => router.dismissTo('/')}
      />
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
});
