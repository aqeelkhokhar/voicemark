import { getSetting, setSetting } from '@/lib/db';

/**
 * App-level settings stored in the SQLite settings table (spec Section 7).
 * Distinct from API keys, which live in expo-secure-store.
 */

const TOOLTIP_DISMISSED_KEY = 'first_launch_tooltip_dismissed';

export function isFirstLaunchTooltipDismissed(): boolean {
  return getSetting(TOOLTIP_DISMISSED_KEY) === '1';
}

export function dismissFirstLaunchTooltip(): void {
  setSetting(TOOLTIP_DISMISSED_KEY, '1');
}
