import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { copy } from '@/copy';
import { journal } from '@/features/journal';
import { takeDraftTranscript } from '@/features/recording/draft';
import { reflect } from '@/features/reflection';
import { setPendingReflection } from '@/features/reflection/pending';
import { AppButton } from '@/ui/components/app-button';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

type ReflectError = 'network' | 'parse' | null;

export default function ReviewScreen() {
  const router = useRouter();
  // Lazy initializer so the one-shot draft is consumed exactly once per mount.
  const [rawTranscript] = useState<string>(() => takeDraftTranscript() ?? '');
  const [transcript, setTranscript] = useState<string>(rawTranscript);
  const [reflecting, setReflecting] = useState(false);
  const [error, setError] = useState<ReflectError>(null);

  const isEmpty = transcript.trim().length === 0;

  const handleSaveWithoutReflection = () => {
    if (isEmpty) return;
    journal.insert({
      rawTranscript,
      editedTranscript: transcript.trim(),
    });
    router.dismissTo('/');
  };

  const handleReflect = async () => {
    if (isEmpty) return;
    setError(null);
    setReflecting(true);
    const outcome = await reflect(transcript.trim());
    setReflecting(false);

    switch (outcome.status) {
      case 'ok':
        setPendingReflection({
          rawTranscript,
          editedTranscript: transcript.trim(),
          result: outcome.result,
        });
        router.push('/reflection');
        break;
      case 'no-key':
        router.push('/settings?missingKey=1');
        break;
      case 'parse-error':
        setError('parse');
        break;
      case 'network-error':
        setError('network');
        break;
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.editHint}>{copy.review.editHint}</Text>
      <TextInput
        multiline
        value={transcript}
        onChangeText={setTranscript}
        editable={!reflecting}
        style={styles.input}
        textAlignVertical="top"
      />

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            {error === 'parse'
              ? copy.reflection.parseError
              : copy.reflection.errorTitle}
          </Text>
          {error === 'network' && (
            <Text style={styles.errorBody}>{copy.reflection.errorBody}</Text>
          )}
        </View>
      )}

      {reflecting ? (
        <View style={styles.waiting}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.waitingText}>{copy.reflection.waitingState}</Text>
        </View>
      ) : (
        <View style={styles.actions}>
          {isEmpty && (
            <Text style={styles.emptyHint}>{copy.review.emptyHint}</Text>
          )}
          <AppButton
            label={copy.review.reflectButton}
            onPress={handleReflect}
            disabled={isEmpty}
          />
          <AppButton
            label={
              error
                ? copy.reflection.errorCta
                : copy.review.saveWithoutReflectionButton
            }
            variant="secondary"
            onPress={handleSaveWithoutReflection}
            disabled={isEmpty}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  editHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  input: {
    ...typography.body,
    minHeight: 240,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.card,
    padding: spacing.lg,
    color: colors.textPrimary,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  errorTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.error,
  },
  errorBody: {
    ...typography.body,
    color: colors.textPrimary,
  },
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  waitingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
  },
});
