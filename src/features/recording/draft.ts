/**
 * In-memory handoff of the finished transcript from Record to Review.
 * Deliberately not persisted: a draft only lives for one navigation hop.
 */

let draftTranscript: string | null = null;

export function setDraftTranscript(transcript: string): void {
  draftTranscript = transcript;
}

export function takeDraftTranscript(): string | null {
  const value = draftTranscript;
  draftTranscript = null;
  return value;
}
