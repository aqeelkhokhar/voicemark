import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/ui/theme';

type MoodPillProps = {
  mood: string;
};

export function MoodPill({ mood }: MoodPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{mood}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.moodPillBackground,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'capitalize',
  },
});
