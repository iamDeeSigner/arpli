/**
 * Web Speech API wrapper — Svelte 5 reactive class.
 *
 * Wraps the browser's built-in `SpeechRecognition` / `webkitSpeechRecognition`
 * with Svelte 5 runes so components can bind directly to `status`, `update`,
 * and `error` without any extra store wiring.
 *
 * Usage:
 *   const rec = new WebSpeechRecognizer();
 *   rec.start();          // begins listening
 *   rec.stop();           // stops and finalises
 *   rec.result            // VoiceResult | null after 'done'
 *   rec.update            // VoiceUpdate | null (live interim)
 *   rec.status            // VoiceStatus
 *   rec.error             // VoiceError | null
 */

import type { VoiceStatus, VoiceUpdate, VoiceResult, VoiceError } from './types';

// ── Minimal Web Speech API shims ────────────────────────────────────────────────
// TypeScript's lib.dom declares the SpeechRecognition *interface* but not a
// constructable global. We define a minimal constructor interface and use
// window-level casting so the code compiles regardless of TS version.

interface SpeechRecognitionAlternativeShim {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultShim {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternativeShim;
  [index: number]: SpeechRecognitionAlternativeShim;
}

interface SpeechRecognitionResultListShim {
  readonly length: number;
  item(index: number): SpeechRecognitionResultShim;
  [index: number]: SpeechRecognitionResultShim;
}

interface SpeechRecognitionEventShim extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultListShim;
}

interface SpeechRecognitionErrorEventShim extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onstart: ((ev: Event) => unknown) | null;
  onresult: ((ev: SpeechRecognitionEventShim) => unknown) | null;
  onerror: ((ev: SpeechRecognitionErrorEventShim) => unknown) | null;
  onend: ((ev: Event) => unknown) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionCtor {
  new (): SpeechRecognitionInstance;
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w['SpeechRecognition'] as SpeechRecognitionCtor | undefined) ??
    (w['webkitSpeechRecognition'] as SpeechRecognitionCtor | undefined) ??
    null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

// ── Reactive class ──────────────────────────────────────────────────────────────

export class WebSpeechRecognizer {
  // Public reactive state — read-only from outside.
  status = $state<VoiceStatus>('idle');
  update = $state<VoiceUpdate | null>(null);
  result = $state<VoiceResult | null>(null);
  error = $state<VoiceError | null>(null);

  // Derived convenience.
  readonly isActive = $derived(this.status === 'recording' || this.status === 'starting');

  // Internals.
  #rec: SpeechRecognitionInstance | null = null;
  /** Accumulated final transcript across all `result` events. */
  #finalAccum = '';
  /** Sum of (confidence * 1) for averaging — Web Speech returns per-chunk confidence. */
  #confidenceSum = 0;
  /** Number of final chunks received. */
  #chunkCount = 0;
  /** Resolve handle for the promise returned by start(). */
  #resolve: ((r: VoiceResult) => void) | null = null;
  #reject: ((e: VoiceError) => void) | null = null;

  /**
   * Start listening. Returns a promise that resolves with the final
   * `VoiceResult` when the utterance ends, or rejects with a `VoiceError`.
   *
   * Calling `stop()` before the utterance ends forces finalisation.
   */
  start(lang?: string): Promise<VoiceResult> {
    if (this.isActive) this.#teardown();

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      const err: VoiceError = {
        code: 'unsupported',
        message: 'SpeechRecognition is not supported in this environment.',
      };
      this.status = 'error';
      this.error = err;
      return Promise.reject(err);
    }

    this.#reset();
    this.status = 'starting';

    return new Promise<VoiceResult>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;

      const rec = new Ctor();
      this.#rec = rec;

      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      if (lang) rec.lang = lang;

      rec.onstart = () => {
        this.status = 'recording';
      };

      rec.onresult = (event: SpeechRecognitionEventShim) => {
        let latestInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          const text = r[0].transcript;
          if (r.isFinal) {
            this.#finalAccum += text;
            const conf = r[0].confidence;
            if (typeof conf === 'number' && conf >= 0) {
              this.#confidenceSum += conf;
              this.#chunkCount++;
            }
          } else {
            latestInterim = text;
          }
        }
        this.update = {
          final: this.#finalAccum,
          interim: latestInterim,
          confidence:
            this.#chunkCount > 0 ? this.#confidenceSum / this.#chunkCount : undefined,
        };
      };

      rec.onerror = (event: SpeechRecognitionErrorEventShim) => {
        const code = this.#mapErrorCode(event.error);
        const err: VoiceError = { code, message: event.message || event.error };
        this.status = 'error';
        this.error = err;
        this.#rec = null;
        this.#reject?.(err);
        this.#resolve = null;
        this.#reject = null;
      };

      rec.onend = () => {
        if (this.status === 'error') return; // already handled in onerror
        const text = this.#finalAccum.trim();
        if (!text) {
          const err: VoiceError = { code: 'empty', message: 'No speech was detected.' };
          this.status = 'error';
          this.error = err;
          this.#reject?.(err);
        } else {
          const voiceResult: VoiceResult = {
            text,
            engine: 'web-speech',
            confidence:
              this.#chunkCount > 0 ? this.#confidenceSum / this.#chunkCount : undefined,
          };
          this.result = voiceResult;
          this.status = 'done';
          this.#resolve?.(voiceResult);
        }
        this.#resolve = null;
        this.#reject = null;
        this.#rec = null;
      };

      try {
        rec.start();
      } catch (err) {
        const voiceErr: VoiceError = {
          code: 'unknown',
          message: err instanceof Error ? err.message : String(err),
        };
        this.status = 'error';
        this.error = voiceErr;
        this.#rec = null;
        reject(voiceErr);
        this.#resolve = null;
        this.#reject = null;
      }
    });
  }

  /**
   * Stop the active session. `onend` fires asynchronously and will settle
   * the promise returned by `start()`.
   */
  stop() {
    this.#rec?.stop();
  }

  /**
   * Abort without returning a result (e.g. user cancelled mid-session).
   */
  abort() {
    if (!this.#rec) return;
    this.#rec.onend = null; // suppress onend so we don't get a spurious 'empty' error
    this.#rec.abort();
    this.#rec = null;
    const err: VoiceError = { code: 'aborted', message: 'Voice input cancelled.' };
    this.status = 'error';
    this.error = err;
    this.#reject?.(err);
    this.#resolve = null;
    this.#reject = null;
  }

  /** Reset reactive state back to idle (call before a new session). */
  reset() {
    this.#teardown();
    this.#reset();
    this.status = 'idle';
  }

  // ── Internals ──────────────────────────────────────────────────────────────────

  #teardown() {
    if (this.#rec) {
      this.#rec.onend = null;
      this.#rec.onerror = null;
      this.#rec.onresult = null;
      try {
        this.#rec.abort();
      } catch {
        // Ignore — may already be stopped.
      }
      this.#rec = null;
    }
    this.#resolve = null;
    this.#reject = null;
  }

  #reset() {
    this.#finalAccum = '';
    this.#confidenceSum = 0;
    this.#chunkCount = 0;
    this.update = null;
    this.result = null;
    this.error = null;
  }

  #mapErrorCode(code: string): VoiceError['code'] {
    switch (code) {
      case 'not-allowed':
      case 'service-not-allowed':
        return 'permission-denied';
      case 'network':
        return 'network';
      case 'aborted':
        return 'aborted';
      case 'audio-capture':
        return 'unsupported';
      case 'no-speech':
        return 'empty';
      default:
        return 'unknown';
    }
  }
}
