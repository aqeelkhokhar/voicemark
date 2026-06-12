/**
 * Voicemark design tokens — locked in the project spec (Appendix C).
 * Spacing values outside the scale are not allowed.
 */

export const colors = {
  background: '#FAFAF7',
  surface: '#FFFFFF',
  borderSubtle: '#EAEAE6',
  textPrimary: '#1B1B1B',
  textSecondary: '#6B6B6B',
  accent: '#6B5B95',
  moodPillBackground: '#F2EFF7',
  error: '#B23A48',
  successSubtle: '#6B8E6B',
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radii = {
  card: 8,
  modal: 12,
  input: 24,
  pill: 999,
  recordButton: 9999,
} as const;

export const touchTarget = {
  minWidth: 48,
  minHeight: 48,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  touchTarget,
} as const;

export type Theme = typeof theme;
