import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { copy } from '@/copy';
import { journal } from '@/features/journal';
import { testProviderKey } from '@/features/reflection';
import { gemini } from '@/lib/ai/gemini';
import { groq } from '@/lib/ai/groq';
import { AiProvider } from '@/lib/ai/provider';
import {
  clearApiKey,
  getApiKey,
  maskKey,
  ProviderId,
  setApiKey,
} from '@/lib/secrets';
import { AppButton } from '@/ui/components/app-button';
import { Card } from '@/ui/components/card';
import { Screen } from '@/ui/components/screen';
import { colors, radii, spacing, typography } from '@/ui/theme';

const GITHUB_URL = 'https://github.com/aqeelkhokhar/voicemark';
const AI_STUDIO_URL = 'https://aistudio.google.com/apikey';

const PROVIDERS: Record<ProviderId, AiProvider> = { gemini, groq };

type TestState = 'idle' | 'testing' | 'success' | 'failure';

function KeyControls({
  provider,
  label,
  showHelpLink,
}: {
  provider: ProviderId;
  label: string;
  showHelpLink?: boolean;
}) {
  const [savedMask, setSavedMask] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [testState, setTestState] = useState<TestState>('idle');

  const refresh = useCallback(async () => {
    const key = await getApiKey(provider);
    setSavedMask(key ? maskKey(key) : null);
  }, [provider]);

  useEffect(() => {
    let active = true;
    getApiKey(provider).then((key) => {
      if (active) setSavedMask(key ? maskKey(key) : null);
    });
    return () => {
      active = false;
    };
  }, [provider]);

  const handleSave = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    await setApiKey(provider, trimmed);
    setInput('');
    setTestState('idle');
    await refresh();
  };

  const handleRemove = () => {
    Alert.alert(
      copy.settings.aiProvider.removeKeyConfirmTitle,
      copy.settings.aiProvider.removeKeyConfirmBody,
      [
        { text: copy.firstLaunchTooltip.dismiss, style: 'cancel' },
        {
          text: copy.settings.aiProvider.removeKey,
          style: 'destructive',
          onPress: async () => {
            await clearApiKey(provider);
            setTestState('idle');
            await refresh();
          },
        },
      ],
    );
  };

  const handleTest = async () => {
    const candidate = input.trim() || (await getApiKey(provider));
    if (!candidate) {
      setTestState('failure');
      return;
    }
    setTestState('testing');
    const ok = await testProviderKey(PROVIDERS[provider], candidate);
    setTestState(ok ? 'success' : 'failure');
  };

  return (
    <View style={styles.keyControls}>
      <Text style={styles.fieldLabel}>{label}</Text>

      {savedMask ? (
        <View style={styles.savedKeyRow}>
          <Text style={styles.savedKey}>{savedMask}</Text>
          <Text style={styles.removeLink} onPress={handleRemove}>
            {copy.settings.aiProvider.removeKey}
          </Text>
        </View>
      ) : (
        <TextInput
          value={input}
          onChangeText={(text) => {
            setInput(text);
            setTestState('idle');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder={copy.settings.aiProvider.keyFieldPlaceholder}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      )}

      {showHelpLink && !savedMask && (
        <Text
          style={styles.helpLink}
          onPress={() => Linking.openURL(AI_STUDIO_URL)}
        >
          {copy.settings.aiProvider.keyHelpLink}
        </Text>
      )}

      {!savedMask && input.trim().length > 0 && (
        <AppButton
          label={copy.settings.aiProvider.saveKey}
          onPress={handleSave}
        />
      )}

      {testState === 'testing' ? (
        <View style={styles.testingRow}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <AppButton
          label={copy.settings.aiProvider.keyTestButton}
          variant="secondary"
          onPress={handleTest}
        />
      )}

      {testState === 'success' && (
        <Text style={styles.testSuccess}>
          {copy.settings.aiProvider.keyTestSuccess}
        </Text>
      )}
      {testState === 'failure' && (
        <Text style={styles.testFailure}>
          {copy.settings.aiProvider.keyTestFailure}
        </Text>
      )}
    </View>
  );
}

function PrivacyModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{copy.privacyModal.title}</Text>
          {copy.privacyModal.bullets.map((bullet) => (
            <Text key={bullet} style={styles.modalBullet}>
              · {bullet}
            </Text>
          ))}
          <AppButton label={copy.privacyModal.cta} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const { missingKey } = useLocalSearchParams<{ missingKey?: string }>();
  const version = Constants.expoConfig?.version ?? '0.0.0';
  const [privacyVisible, setPrivacyVisible] = useState(false);

  const handleClearEntries = () => {
    Alert.alert(
      copy.settings.data.clearConfirmTitle,
      copy.settings.data.clearConfirmBody,
      [
        { text: copy.firstLaunchTooltip.dismiss, style: 'cancel' },
        {
          text: copy.settings.data.clearConfirmDestructiveCta,
          style: 'destructive',
          onPress: () => journal.deleteAll(),
        },
      ],
    );
  };

  return (
    <Screen scroll>
      {missingKey === '1' && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {copy.settings.aiProvider.missingKeyBanner}
          </Text>
        </View>
      )}

      <View style={styles.group}>
        <Text style={styles.groupTitle}>
          {copy.settings.aiProvider.groupTitle}
        </Text>
        <Card>
          <KeyControls
            provider="gemini"
            label={copy.settings.aiProvider.keyFieldLabel}
            showHelpLink
          />
          <View style={styles.divider} />
          <KeyControls
            provider="groq"
            label={copy.settings.aiProvider.groqKeyFieldLabel}
          />
        </Card>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>
          {copy.settings.coachingStyle.groupTitle}
        </Text>
        <Card>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {copy.settings.coachingStyle.defaultStyle}
            </Text>
            <View style={styles.selectedDot} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabelDisabled}>
              {copy.settings.coachingStyle.stoic}
            </Text>
            <Text style={styles.comingSoon}>
              {copy.settings.coachingStyle.comingSoon}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabelDisabled}>
              {copy.settings.coachingStyle.gratitude}
            </Text>
            <Text style={styles.comingSoon}>
              {copy.settings.coachingStyle.comingSoon}
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{copy.settings.data.groupTitle}</Text>
        <Card>
          <AppButton
            label={copy.settings.data.clearAllEntries}
            variant="destructive"
            onPress={handleClearEntries}
          />
        </Card>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{copy.settings.about.groupTitle}</Text>
        <Card>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {copy.settings.about.versionRow}
            </Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
          <View style={styles.divider} />
          <Text
            style={styles.rowLink}
            onPress={() => Linking.openURL(GITHUB_URL)}
          >
            {copy.settings.about.githubRow}
          </Text>
          <View style={styles.divider} />
          <Pressable onPress={() => setPrivacyVisible(true)}>
            <Text style={styles.rowLink}>{copy.settings.about.privacyRow}</Text>
          </Pressable>
        </Card>
      </View>

      <PrivacyModal
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.moodPillBackground,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.card,
    padding: spacing.lg,
  },
  bannerText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  group: {
    gap: spacing.md,
  },
  groupTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  keyControls: {
    gap: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    minHeight: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
  },
  savedKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  savedKey: {
    ...typography.body,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  removeLink: {
    ...typography.body,
    color: colors.error,
  },
  helpLink: {
    ...typography.caption,
    color: colors.accent,
  },
  testingRow: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testSuccess: {
    ...typography.caption,
    color: colors.successSubtle,
  },
  testFailure: {
    ...typography.caption,
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowLink: {
    ...typography.body,
    color: colors.accent,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  rowLabelDisabled: {
    ...typography.body,
    color: colors.textSecondary,
  },
  comingSoon: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
  modalTitle: {
    ...typography.sectionHeading,
    color: colors.textPrimary,
  },
  modalBullet: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
