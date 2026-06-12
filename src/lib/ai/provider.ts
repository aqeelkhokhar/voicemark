import { ProviderId } from '@/lib/secrets';

/**
 * Provider abstraction (spec Section 9): the free-tier landscape is volatile,
 * so the app talks to one interface and providers stay swappable.
 */

export type AiErrorKind =
  /** fetch failed, timed out, or the device is offline */
  | 'network'
  /** the provider answered with a non-OK HTTP status */
  | 'provider'
  /** the provider answered 200 but the body was not usable */
  | 'parse';

export class AiError extends Error {
  readonly kind: AiErrorKind;
  /** HTTP status when kind is 'provider' */
  readonly status?: number;

  constructor(kind: AiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'AiError';
    this.kind = kind;
    this.status = status;
  }
}

export interface AiProvider {
  id: ProviderId;
  /** Sends the reflection prompt and returns the model's raw text response. */
  complete(
    prompt: string,
    apiKey: string,
    signal: AbortSignal,
  ): Promise<string>;
  /** Cheapest possible call to confirm the key works (Appendix E test button). */
  testConnection(apiKey: string, signal: AbortSignal): Promise<boolean>;
}
