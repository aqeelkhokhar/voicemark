import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, touchTarget, typography } from '@/ui/theme';

type Variant = 'primary' | 'secondary' | 'destructive';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.label, variant !== 'primary' && styles.labelOnSurface]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.minHeight,
    borderRadius: radii.input,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  destructive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  labelOnSurface: {
    color: colors.textPrimary,
  },
});
