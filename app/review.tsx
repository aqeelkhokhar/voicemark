import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { copy } from '@/copy';
import { mockEntry } from '@/features/journal/mock';
import { AppButton } from '@/ui/components/app-button';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

export default function ReviewScreen() {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>(mockEntry.transcript);

  return (
    <Screen scroll>
      <Text style={styles.editHint}>{copy.review.editHint}</Text>
      <TextInput
        multiline
        value={transcript}
        onChangeText={setTranscript}
        style={styles.input}
        textAlignVertical="top"
      />
      <View style={styles.actions}>
        <AppButton
          label={copy.review.reflectButton}
          onPress={() => router.push('/reflection')}
        />
        <AppButton
          label={copy.review.saveWithoutReflectionButton}
          variant="secondary"
          onPress={() => router.dismissTo('/')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  editHint: {
    ...typography.caption,
    color: colors.textSecondary,
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
  actions: {
    gap: spacing.md,
  },
});
