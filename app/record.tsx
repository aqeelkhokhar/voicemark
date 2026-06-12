import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { AppButton } from '@/ui/components/app-button';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

export default function RecordScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.listening}>{copy.record.listeningHint}</Text>
        <Text style={styles.timer}>0:00 / {copy.record.timerMaxDisplay}</Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label={copy.record.stopButton}
          onPress={() => router.push('/review')}
        />
        <AppButton
          label={copy.record.discardButton}
          variant="secondary"
          onPress={() => router.dismissTo('/')}
        />
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
  },
  listening: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  timer: {
    ...typography.title,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    gap: spacing.md,
  },
});
