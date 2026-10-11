/**
 * Groq Whisper client for the renderer.
 *
 * Records audio with `MediaRecorder`, converts the blob to base64, then sends
 * it through the Electron IPC bridge → daemon → Groq `/audio/transcriptions`.
 * The renderer never touches the daemon directly (sandboxed) and never opens
 * a raw fetch to an external API.
 *
 * The audio is streamed in a single pass: start → stop → encode → transcribe.
 * No intermediate audio is persisted.
 */

import type { VoiceResult, VoiceError } from './types';

// Narrow cast helper — avoids re-declaring Window (already typed in ipc/client.ts).
function getArpliInvoke(): ((channel: string, payload?: unknown) => Promise<unknown>) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  const arpli = w['arpli'] as { invoke?: (ch: string, p?: unknown) => Promise<unknown> } | undefined;
  return arpli?.invoke ?? null;
}

export interface WhisperTranscribeResult {
  text: string;
  provider: string;
  model: string;
  durationSeconds?: number;
}

/**
 * Kick off a Whisper recording session.
 *
 * Returns a controller with:
 *   - `stop()`  — stop recording and begin transcription (resolves the promise)
 *   - `abort()` — cancel without transcribing
 *   - `promise` — resolves to a `VoiceResult` or rejects with a `VoiceError`
 *
 * Optionally pass `onLevel` to receive real-time audio level updates (0..1)
 * so the mic button can animate while recording.
 */
export function startWhisperSession(opts?: {
  mimeType?: string;
  language?: string;
  model?: string;
  onLevel?: (level: number) => void;
}): {
  stop: () => void;
  abort: () => void;
  promise: Promise<VoiceResult>;
} {
  let resolvePromise!: (r: VoiceResult) => void;
  let rejectPromise!: (e: VoiceError) => void;
  const promise = new Promise<VoiceResult>((res, rej) => {
    resolvePromise = res;
    rejectPromise = rej;
  });

  let aborted = false;
  let recorder: MediaRecorder | null = null;
  let analyser: AnalyserNode | null = null;
  let audioCtx: AudioContext | null = null;
  let levelFrameId: number | null = null;
  const chunks: BlobEvent['data'][] = [];

  // Pick the best supported MIME type for this Electron/Chromium version.
  const preferredMime = opts?.mimeType ?? pickMimeType();

  function pickMimeType(): string {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'];
    for (const mime of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return 'audio/webm';
  }

  function stopLevel() {
    if (levelFrameId !== null) {
      cancelAnimationFrame(levelFrameId);
      levelFrameId = null;
    }
    analyser = null;
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
  }

  function startLevelLoop(stream: MediaStream) {
    if (!opts?.onLevel) return;
    try {
      audioCtx = new AudioContext();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const src = audioCtx.createMediaStreamSource(stream);
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyser || aborted) return;
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
        opts?.onLevel?.(Math.min(1, avg / 128));
        levelFrameId = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Non-fatal — level animation just won't run.
    }
  }

  // getUserMedia → MediaRecorder → accumulate chunks → on stop → base64 → IPC
  (async () => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const code: VoiceError['code'] =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
          ? 'permission-denied'
          : 'unknown';
      rejectPromise({ code, message: msg });
      return;
    }

    if (aborted) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    startLevelLoop(stream);

    try {
      recorder = new MediaRecorder(stream, { mimeType: preferredMime });
    } catch {
      // Fallback with no explicit type.
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      stopLevel();
      stream.getTracks().forEach((t) => t.stop());
      if (aborted) return;

      const blob = new Blob(chunks, { type: recorder?.mimeType || preferredMime });
      if (blob.size === 0) {
        rejectPromise({ code: 'empty', message: 'No audio was recorded.' });
        return;
      }

      // Encode as base64 for IPC transport.
      let base64: string;
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        base64 = btoa(binary);
      } catch (err) {
        rejectPromise({
          code: 'unknown',
          message: `Failed to encode audio: ${err instanceof Error ? err.message : String(err)}`,
        });
        return;
      }

      const mimeType = blob.type || preferredMime;
      const filename = `recording.${mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm'}`;

      try {
        const payload = {
          audio: base64,
          mimeType,
          filename,
          ...(opts?.language ? { language: opts.language } : {}),
          ...(opts?.model ? { model: opts.model } : {}),
        };

        let raw: unknown;
        const invoke = getArpliInvoke();
        if (invoke) {
          raw = await invoke('ai:transcribe', payload);
        } else {
          // Dev-server fallback: call daemon directly.
          const res = await fetch('http://127.0.0.1:4848/ai/transcribe', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
          }
          raw = await res.json();
        }

        if (raw && typeof raw === 'object' && 'error' in raw) {
          throw new Error((raw as { error: string }).error);
        }

        const result = raw as WhisperTranscribeResult;
        resolvePromise({
          text: result.text,
          engine: 'whisper',
          durationSeconds: result.durationSeconds,
        });
      } catch (err) {
        rejectPromise({
          code: 'network',
          message: `Transcription failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    };

    recorder.onerror = () => {
      stopLevel();
      stream.getTracks().forEach((t) => t.stop());
      rejectPromise({ code: 'unknown', message: 'MediaRecorder error.' });
    };

    recorder.start(250); // collect in 250 ms chunks
  })().catch((err) => {
    rejectPromise({ code: 'unknown', message: String(err) });
  });

  return {
    stop() {
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
    },
    abort() {
      aborted = true;
      stopLevel();
      if (recorder && recorder.state !== 'inactive') {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      }
      rejectPromise({ code: 'aborted', message: 'Voice input cancelled.' });
    },
    promise,
  };
}

/**
 * Check whether the daemon has a Whisper-capable provider configured.
 * Used to gate the Whisper toggle in settings.
 */
export async function checkWhisperAvailability(): Promise<{
  available: boolean;
  provider: string | null;
}> {
  try {
    let raw: unknown;
    const invoke = getArpliInvoke();
    if (invoke) {
      raw = await invoke('ai:transcribe:status');
    } else {
      const res = await fetch('http://127.0.0.1:4848/ai/transcribe/status');
      if (!res.ok) return { available: false, provider: null };
      raw = await res.json();
    }
    if (raw && typeof raw === 'object' && 'available' in raw) {
      const r = raw as { available: boolean; provider: string | null };
      return { available: r.available, provider: r.provider };
    }
  } catch {
    // Daemon not running — treat as unavailable.
  }
  return { available: false, provider: null };
}
