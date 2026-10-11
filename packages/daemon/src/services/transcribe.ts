/**
 * Audio transcription service.
 *
 * Thin wrapper around the OpenAI-compatible `/audio/transcriptions` endpoint
 * exposed by Groq (and by OpenAI itself). The user's configured provider
 * supplies the API key; audio is never written to disk and never persisted —
 * it is streamed to the provider and the response text is returned.
 *
 * Only Groq is wired as the preferred provider — it offers Whisper for
 * free on its free tier. OpenAI is listed as a fallthrough so the same
 * code reuses when a paid-tier user wants higher accuracy later.
 */

import type { ArpliDb } from '@arpli/db';
import { getProvider } from './settings.js';
import type { AiProvider } from '../ai/types.js';

const TRANSCRIPTION_PROVIDERS: readonly AiProvider[] = ['groq', 'openai'];

export interface TranscribeInput {
  /** Raw audio bytes. */
  audio: Buffer;
  /** MIME type, e.g. 'audio/webm', 'audio/mp4', 'audio/wav'. */
  mimeType: string;
  /** Filename to send to the provider — some providers use it to pick a decoder. */
  filename: string;
  /** Optional model override. Defaults to a sensible per-provider pick. */
  model?: string;
  /** Optional language hint (ISO-639-1), e.g. 'en'. */
  language?: string;
}

export interface TranscribeResult {
  /** Transcribed text, trimmed. */
  text: string;
  /** Provider used, so the UI can label the result. */
  provider: AiProvider;
  /** Model that produced the transcription. */
  model: string;
  /** Duration in seconds, if the provider returned it. */
  durationSeconds?: number;
}

export class TranscribeError extends Error {
  constructor(
    message: string,
    readonly code: 'no-provider' | 'provider-error' | 'bad-request' | 'network',
  ) {
    super(message);
    this.name = 'TranscribeError';
  }
}

const DEFAULT_MODEL: Partial<Record<AiProvider, string>> = {
  groq: 'whisper-large-v3-turbo',
  openai: 'whisper-1',
};

const DEFAULT_BASE_URL: Partial<Record<AiProvider, string>> = {
  groq: 'https://api.groq.com/openai/v1',
  openai: 'https://api.openai.com/v1',
};

/**
 * Pick the best configured provider for Whisper-style transcription.
 * Prefers Groq (free tier) over OpenAI (paid). Returns null if neither
 * is configured with an API key.
 */
export function pickTranscriptionProvider(db: ArpliDb): {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
} | null {
  for (const kind of TRANSCRIPTION_PROVIDERS) {
    const row = getProvider(db, kind);
    if (!row || !row.apiKey) continue;
    const baseUrl = row.baseUrl ?? DEFAULT_BASE_URL[kind];
    if (!baseUrl) continue;
    return { provider: kind, apiKey: row.apiKey, baseUrl };
  }
  return null;
}

/**
 * Transcribe `input.audio` using the user's configured transcription
 * provider. Streams the audio as multipart/form-data; audio is never
 * written to disk and never persisted in the daemon.
 */
export async function transcribeAudio(
  db: ArpliDb,
  input: TranscribeInput,
): Promise<TranscribeResult> {
  if (!input.audio || input.audio.length === 0) {
    throw new TranscribeError('audio payload is empty', 'bad-request');
  }
  if (!input.mimeType) {
    throw new TranscribeError('mimeType is required', 'bad-request');
  }

  const pick = pickTranscriptionProvider(db);
  if (!pick) {
    throw new TranscribeError(
      'no transcription-capable provider is configured — add a Groq API key under Settings → AI Providers',
      'no-provider',
    );
  }

  const model = input.model ?? DEFAULT_MODEL[pick.provider] ?? 'whisper-large-v3-turbo';
  const endpoint = `${pick.baseUrl.replace(/\/+$/, '')}/audio/transcriptions`;

  // Node 20+ has native FormData / Blob — no extra deps.
  const form = new FormData();
  const blob = new Blob([new Uint8Array(input.audio)], { type: input.mimeType });
  form.append('file', blob, input.filename || 'recording.webm');
  form.append('model', model);
  form.append('response_format', 'verbose_json');
  if (input.language) form.append('language', input.language);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${pick.apiKey}` },
      body: form,
    });
  } catch (err) {
    throw new TranscribeError(
      `transcription request failed: ${(err as Error).message}`,
      'network',
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new TranscribeError(
      `transcription provider returned ${res.status}: ${text || res.statusText}`,
      'provider-error',
    );
  }

  const payload = (await res.json()) as {
    text?: string;
    duration?: number;
  };

  const text = typeof payload.text === 'string' ? payload.text.trim() : '';
  return {
    text,
    provider: pick.provider,
    model,
    durationSeconds: typeof payload.duration === 'number' ? payload.duration : undefined,
  };
}
