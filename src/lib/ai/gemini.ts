import { AiError, AiProvider } from '@/lib/ai/provider';

/**
 * Google Gemini free tier — primary provider (spec Section 5).
 * Free input/output verified on the decisions log; model id re-checked there.
 */

const MODEL = 'gemini-3.5-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
};

async function callGemini(
  prompt: string,
  apiKey: string,
  signal: AbortSignal,
  maxOutputTokens: number,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/${MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens,
          // gemini-3.x flash defaults to a thinking budget that would
          // consume the whole token cap before any answer is written.
          // Reflection is a structured task that needs no reasoning budget.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal,
    });
  } catch {
    throw new AiError('network', 'Could not reach Gemini.');
  }

  if (!response.ok) {
    throw new AiError(
      'provider',
      `Gemini returned ${response.status}.`,
      response.status,
    );
  }

  const body = (await response.json()) as GeminiResponse;
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new AiError('parse', 'Gemini response had no text.');
  }
  return text;
}

export const gemini: AiProvider = {
  id: 'gemini',

  complete(prompt, apiKey, signal) {
    return callGemini(prompt, apiKey, signal, 2048);
  },

  async testConnection(apiKey, signal) {
    try {
      let response: Response;
      try {
        response = await fetch(`${BASE_URL}/${MODEL}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
            generationConfig: {
              maxOutputTokens: 1,
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
          signal,
        });
      } catch {
        return false;
      }
      return response.ok;
    } catch {
      return false;
    }
  },
};
