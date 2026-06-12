import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, touchTarget, typography } from '@/ui/theme';

type Variant = 'primary' | 'secondary' | 'destructive';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
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
  disabled: {
    opacity: 0.4,
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
