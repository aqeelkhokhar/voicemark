import * as SecureStore from 'expo-secure-store';

/**
 * BYO-key storage (spec Appendix E). Keys live only in the device's secure
 * store and in the outbound HTTPS request to the provider. Never log them,
 * never put them in navigable app state.
 */

export type ProviderId = 'gemini' | 'groq';

const STORE_KEYS: Record<ProviderId, string> = {
  gemini: 'gemini_key',
  groq: 'groq_key',
};

export async function getApiKey(provider: ProviderId): Promise<string | null> {
  return SecureStore.getItemAsync(STORE_KEYS[provider]);
}

export async function setApiKey(
  provider: ProviderId,
  key: string,
): Promise<void> {
  await SecureStore.setItemAsync(STORE_KEYS[provider], key);
}

export async function clearApiKey(provider: ProviderId): Promise<void> {
  await SecureStore.deleteItemAsync(STORE_KEYS[provider]);
}

/** Masked display for Settings: last 4 characters visible after save. */
export function maskKey(key: string): string {
  return `••••••••${key.slice(-4)}`;
}
