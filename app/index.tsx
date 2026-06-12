import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
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
        <Text style={styles.emptyHint}>{copy.today.emptyHint}</Text>
      </View>
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
});
