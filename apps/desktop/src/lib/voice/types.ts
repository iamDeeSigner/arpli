/**
 * Shared types for the voice-input layer.
 *
 * The renderer has two transcription paths:
 *   - "web-speech" — in-browser `SpeechRecognition`, free, offline (or
 *     browser-dependent streaming), no API key required.
 *   - "whisper"    — record audio with `MediaRecorder`, upload to the
 *     daemon's `/ai/transcribe` route, which routes to Groq Whisper.
 *
 * Both paths produce the same shape so the mic button is interchangeable.
 */

export type VoiceEngine = 'web-speech' | 'whisper';

/** Phase in the voice capture lifecycle. */
export type VoiceStatus =
  /** Nothing happening. */
  | 'idle'
  /** Waiting for permission or starting the recognizer / recorder. */
  | 'starting'
  /** Actively capturing audio / receiving interim results. */
  | 'recording'
  /** Audio captured; running transcription (Whisper only). */
  | 'transcribing'
  /** Transcript delivered successfully. */
  | 'done'
  /** Capture or transcription failed; `error` holds the reason. */
  | 'error';

/** A single update emitted while voice capture is active. */
export interface VoiceUpdate {
  /** Finalized transcript so far (concatenation of final chunks). */
  final: string;
  /** Latest unconfirmed partial — appears for Web Speech live mode. */
  interim: string;
  /**
   * Confidence of the latest final chunk, 0..1. Web Speech returns this
   * natively. Whisper does not — we leave it `undefined` for that path.
   */
  confidence?: number;
}

/** Terminal result after a capture finishes. */
export interface VoiceResult {
  text: string;
  engine: VoiceEngine;
  /** Average confidence across final chunks, 0..1 (Web Speech only). */
  confidence?: number;
  /** Duration of captured audio, if the engine reports it. */
  durationSeconds?: number;
}

export interface VoiceError {
  code:
    | 'unsupported'
    | 'permission-denied'
    | 'not-configured'
    | 'network'
    | 'aborted'
    | 'empty'
    | 'unknown';
  message: string;
}
