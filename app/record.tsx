import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { setDraftTranscript } from '@/features/recording/draft';
import { formatTimer, useRecording } from '@/features/recording/use-recording';
import { AppButton } from '@/ui/components/app-button';
import { Screen } from '@/ui/components/screen';
import { colors, spacing, typography } from '@/ui/theme';

export default function RecordScreen() {
  const router = useRouter();

  const { status, transcript, elapsedSeconds, errorDetail, stop, discard } =
    useRecording({
      onFinished: (finalTranscript) => {
        setDraftTranscript(finalTranscript);
        router.replace('/review');
      },
    });

  const handleDiscard = () => {
    discard();
    router.dismissTo('/');
  };

  if (status === 'error') {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.deniedTitle}>Speech recognition failed</Text>
          <Text style={styles.deniedBody}>
            Voicemark couldn&apos;t transcribe on this device.
          </Text>
          {errorDetail && <Text style={styles.errorDetail}>{errorDetail}</Text>}
        </View>
        <View style={styles.actions}>
          <AppButton
            label={copy.record.discardButton}
            variant="secondary"
            onPress={handleDiscard}
          />
        </View>
      </Screen>
    );
  }

  if (status === 'denied') {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.deniedTitle}>
            {copy.record.permissionDeniedTitle}
          </Text>
          <Text style={styles.deniedBody}>
            {copy.record.permissionDeniedBody}
          </Text>
        </View>
        <View style={styles.actions}>
          <AppButton
            label={copy.record.permissionDeniedCta}
            onPress={() => Linking.openSettings()}
          />
          <AppButton
            label={copy.record.discardButton}
            variant="secondary"
            onPress={handleDiscard}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.listening}>
          {status === 'stopping'
            ? copy.record.stopButton
            : copy.record.listeningHint}
        </Text>
        <Text style={styles.timer}>
          {formatTimer(elapsedSeconds)} / {copy.record.timerMaxDisplay}
        </Text>
      </View>

      <ScrollView style={styles.transcriptScroll}>
        <Text style={styles.transcript}>{transcript}</Text>
      </ScrollView>

      <View style={styles.actions}>
        <AppButton label={copy.record.stopButton} onPress={stop} />
        <AppButton
          label={copy.record.discardButton}
          variant="secondary"
          onPress={handleDiscard}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.sm,
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
  transcriptScroll: {
    flex: 1,
  },
  transcript: {
    ...typography.body,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  deniedTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  deniedBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorDetail: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
