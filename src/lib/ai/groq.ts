import { AiError, AiProvider } from '@/lib/ai/provider';

/**
 * Groq free tier — documented fallback provider (spec Section 5).
 * No UI to switch providers in MVP; used only when no Gemini key is stored.
 */

const MODEL = 'llama-3.1-8b-instant';
const URL = 'https://api.groq.com/openai/v1/chat/completions';

type GroqResponse = {
  choices?: { message?: { content?: string } }[];
};

async function callGroq(
  prompt: string,
  apiKey: string,
  signal: AbortSignal,
  maxTokens: number,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
      signal,
    });
  } catch {
    throw new AiError('network', 'Could not reach Groq.');
  }

  if (!response.ok) {
    throw new AiError(
      'provider',
      `Groq returned ${response.status}.`,
      response.status,
    );
  }

  const body = (await response.json()) as GroqResponse;
  const text = body.choices?.[0]?.message?.content;
  if (!text) {
    throw new AiError('parse', 'Groq response had no text.');
  }
  return text;
}

export const groq: AiProvider = {
  id: 'groq',

  complete(prompt, apiKey, signal) {
    return callGroq(prompt, apiKey, signal, 1024);
  },

  async testConnection(apiKey, signal) {
    try {
      let response: Response;
      try {
        response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
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
