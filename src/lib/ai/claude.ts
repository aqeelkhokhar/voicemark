import { AiError, AiProvider } from '@/lib/ai/provider';

/**
 * Anthropic Claude through the Messages API. Primary provider: the user brings
 * their own key, and the transcript goes straight from the phone to Anthropic.
 */

const MODEL = 'claude-haiku-5-5';
const URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

type ClaudeResponse = {
  content?: { type?: string; text?: string }[];
};

function headers(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': API_VERSION,
  };
}

async function callClaude(
  prompt: string,
  apiKey: string,
  signal: AbortSignal,
  maxTokens: number,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(URL, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal,
    });
  } catch {
    throw new AiError('network', 'Could not reach Claude.');
  }

  if (!response.ok) {
    throw new AiError(
      'provider',
      `Claude returned ${response.status}.`,
      response.status,
    );
  }

  const body = (await response.json()) as ClaudeResponse;
  const text = body.content?.find((block) => block.type === 'text')?.text;
  if (!text) {
    throw new AiError('parse', 'Claude response had no text.');
  }
  return text;
}

export const claude: AiProvider = {
  id: 'claude',

  complete(prompt, apiKey, signal) {
    return callClaude(prompt, apiKey, signal, 1024);
  },

  async testConnection(apiKey, signal) {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
        signal,
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
