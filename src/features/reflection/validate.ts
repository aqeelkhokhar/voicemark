/**
 * Response validation rules from spec Appendix F.
 */

export const MOOD_VOCABULARY = [
  'calm',
  'anxious',
  'energized',
  'drained',
  'grateful',
  'frustrated',
  'hopeful',
  'neutral',
  'sad',
  'content',
] as const;

export type MoodTag = (typeof MOOD_VOCABULARY)[number];

export type ReflectionResult = {
  summary: [string, string, string];
  followUp: string;
  mood: MoodTag;
};

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/** Strips markdown code fences some models wrap around JSON. */
function stripFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/, '')
    .trim();
}

/**
 * Parses and validates a raw model response.
 * Returns null on any violation outside mood coercion — the caller maps
 * that to the "Could not parse the AI response. Try again." copy.
 */
export function validateReflection(raw: string): ReflectionResult | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripFences(raw));
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  const candidate = parsed as Record<string, unknown>;

  const summary = candidate.summary;
  if (
    !Array.isArray(summary) ||
    summary.length !== 3 ||
    !summary.every(
      (item): item is string =>
        typeof item === 'string' &&
        item.trim().length > 0 &&
        wordCount(item) <= 30,
    )
  ) {
    return null;
  }

  const followUp = candidate.followUp;
  if (
    typeof followUp !== 'string' ||
    followUp.trim().length === 0 ||
    wordCount(followUp) > 40
  ) {
    return null;
  }

  const moodRaw = candidate.mood;
  const mood: MoodTag = MOOD_VOCABULARY.includes(moodRaw as MoodTag)
    ? (moodRaw as MoodTag)
    : 'neutral';

  return {
    summary: [summary[0].trim(), summary[1].trim(), summary[2].trim()],
    followUp: followUp.trim(),
    mood,
  };
}
