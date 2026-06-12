import { gemini } from '@/lib/ai/gemini';
import { groq } from '@/lib/ai/groq';
import { buildPrompt } from '@/lib/ai/prompt';
import { AiError, AiProvider } from '@/lib/ai/provider';
import { getApiKey } from '@/lib/secrets';

import { ReflectionResult, validateReflection } from './validate';

export type { MoodTag, ReflectionResult } from './validate';

export type ReflectOutcome =
  | { status: 'ok'; result: ReflectionResult }
  | { status: 'no-key' }
  | { status: 'network-error' }
  | { status: 'parse-error' };

const TIMEOUT_MS = 30_000;
const RETRY_BACKOFF_MS = 2_000;

function withTimeout(): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function completeOnce(
  provider: AiProvider,
  prompt: string,
  apiKey: string,
): Promise<string> {
  const { signal, cancel } = withTimeout();
  try {
    return await provider.complete(prompt, apiKey, signal);
  } finally {
    cancel();
  }
}

/**
 * Runs one reflection: provider selection, the Appendix F network policy
 * (30s timeout, one retry with 2s backoff on network errors, never on 4xx),
 * and response validation. Only ever called from an explicit user tap.
 */
export async function reflect(transcript: string): Promise<ReflectOutcome> {
  const geminiKey = await getApiKey('gemini');
  const groqKey = geminiKey ? null : await getApiKey('groq');
  const provider = geminiKey ? gemini : groqKey ? groq : null;
  const apiKey = geminiKey ?? groqKey;

  if (!provider || !apiKey) {
    return { status: 'no-key' };
  }

  const prompt = buildPrompt(transcript);

  let raw: string;
  try {
    raw = await completeOnce(provider, prompt, apiKey);
  } catch (error) {
    const retryable =
      error instanceof AiError &&
      (error.kind === 'network' ||
        (error.kind === 'provider' && (error.status ?? 0) >= 500));
    if (!retryable) {
      return error instanceof AiError && error.kind === 'parse'
        ? { status: 'parse-error' }
        : { status: 'network-error' };
    }
    await sleep(RETRY_BACKOFF_MS);
    try {
      raw = await completeOnce(provider, prompt, apiKey);
    } catch {
      return { status: 'network-error' };
    }
  }

  const result = validateReflection(raw);
  return result ? { status: 'ok', result } : { status: 'parse-error' };
}

/** Appendix E "Test connection": a one-token call that proves the key works. */
export async function testProviderKey(
  provider: AiProvider,
  apiKey: string,
): Promise<boolean> {
  const { signal, cancel } = withTimeout();
  try {
    return await provider.testConnection(apiKey, signal);
  } finally {
    cancel();
  }
}
