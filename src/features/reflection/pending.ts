import { ReflectionResult } from './validate';

/**
 * In-memory handoff of a successful reflection from Review to the
 * Reflection screen, where Save persists it. Same one-shot pattern as
 * the recording draft.
 */

export type PendingReflection = {
  rawTranscript: string;
  editedTranscript: string;
  result: ReflectionResult;
};

let pending: PendingReflection | null = null;

export function setPendingReflection(value: PendingReflection): void {
  pending = value;
}

export function takePendingReflection(): PendingReflection | null {
  const value = pending;
  pending = null;
  return value;
}
