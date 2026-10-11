<!--
  MicButton — a self-contained mic toggle that manages its own voice session.

  Props:
    bind:value        — the string the transcript should be inserted/appended to.
                        When a session finishes the transcript replaces this value
                        if `appendToValue` is false (default), or appends to it if
                        `appendToValue` is true.
    appendToValue     — append rather than replace.  Default: false.
    disabled          — disable the button externally.
    class             — extra Tailwind classes on the button.
    onresult          — optional callback with the final VoiceResult.

  The component shows a live transcript overlay while recording. On completion
  a confidence badge appears when confidence < 0.75 ("Review before saving").

  Engine selection follows $voiceSettings: when `useWhisper` is true and a
  Whisper provider is available the audio path is used; otherwise falls back
  to Web Speech.
-->
<script lang="ts">
  import { cn } from '$lib/utils';
  import { voiceSettings } from '$lib/voice/settings';
  import {
    WebSpeechRecognizer,
    isSpeechRecognitionSupported,
    startWhisperSession,
    checkWhisperAvailability,
  } from '$lib/voice';
  import type { VoiceResult, VoiceStatus } from '$lib/voice';
  import { onMount } from 'svelte';

  // ── Props ────────────────────────────────────────────────────────────────────

  let {
    value = $bindable(''),
    appendToValue = false,
    disabled = false,
    class: className = '',
    onresult = undefined as ((r: VoiceResult) => void) | undefined,
  }: {
    value?: string;
    appendToValue?: boolean;
    disabled?: boolean;
    class?: string;
    onresult?: (r: VoiceResult) => void;
  } = $props();

  // ── State ────────────────────────────────────────────────────────────────────

  let status = $state<VoiceStatus>('idle');
  let interimText = $state('');
  let finalText = $state('');
  let confidence = $state<number | undefined>(undefined);
  let errorMsg = $state<string | null>(null);
  /** true if Whisper is configured on the daemon */
  let whisperAvailable = $state(false);
  /** audio level 0..1 for the pulsing ring (Whisper only) */
  let audioLevel = $state(0);

  // Web Speech recognizer instance — re-created per session.
  let recognizer: WebSpeechRecognizer | null = null;
  // Whisper session abort/stop handles.
  let whisperSession: ReturnType<typeof startWhisperSession> | null = null;

  // ── Derived ──────────────────────────────────────────────────────────────────

  const isRecording = $derived(status === 'recording' || status === 'starting');
  const isTranscribing = $derived(status === 'transcribing');
  const showReview = $derived(
    status === 'done' && typeof confidence === 'number' && confidence < 0.75,
  );

  // Use Whisper when: settings say so AND Whisper is available.
  const useWhisper = $derived($voiceSettings.useWhisper && whisperAvailable);

  // ── Setup ────────────────────────────────────────────────────────────────────

  onMount(async () => {
    const { available } = await checkWhisperAvailability();
    whisperAvailable = available;
  });

  // ── Click handler ─────────────────────────────────────────────────────────────

  async function handleClick() {
    if (disabled || !$voiceSettings.enabled) return;

    // If already recording → stop.
    if (isRecording) {
      stopSession();
      return;
    }

    // Reset display state.
    status = 'starting';
    interimText = '';
    finalText = '';
    confidence = undefined;
    errorMsg = null;
    audioLevel = 0;

    if (useWhisper) {
      await runWhisper();
    } else {
      await runWebSpeech();
    }
  }

  // ── Web Speech path ───────────────────────────────────────────────────────────

  async function runWebSpeech() {
    if (!isSpeechRecognitionSupported()) {
      status = 'error';
      errorMsg = 'Speech recognition is not available in this browser.';
      return;
    }

    recognizer = new WebSpeechRecognizer();

    // Mirror reactive state from the recognizer.
    $effect(() => {
      if (recognizer) status = recognizer.status;
    });
    $effect(() => {
      if (recognizer?.update) {
        interimText = recognizer.update.interim;
        finalText = recognizer.update.final;
        confidence = recognizer.update.confidence;
      }
    });

    try {
      const result = await recognizer.start();
      status = 'done';
      confidence = result.confidence;
      insertTranscript(result.text);
      onresult?.(result);
    } catch (err) {
      if (recognizer?.error) {
        errorMsg = recognizer.error.message;
      } else {
        errorMsg = err instanceof Error ? err.message : String(err);
      }
      status = 'error';
    }
  }

  // ── Whisper path ──────────────────────────────────────────────────────────────

  async function runWhisper() {
    status = 'recording';

    whisperSession = startWhisperSession({
      onLevel: (lvl) => {
        audioLevel = lvl;
      },
    });

    try {
      const result = await whisperSession.promise;
      status = 'done';
      insertTranscript(result.text);
      onresult?.(result);
    } catch (err) {
      const voiceErr = err as { code?: string; message?: string };
      if (voiceErr?.code === 'aborted') {
        status = 'idle';
      } else {
        errorMsg = voiceErr?.message ?? String(err);
        status = 'error';
      }
    } finally {
      whisperSession = null;
      audioLevel = 0;
    }
  }

  // ── Stop ─────────────────────────────────────────────────────────────────────

  function stopSession() {
    if (recognizer) {
      recognizer.stop();
    } else if (whisperSession) {
      status = 'transcribing';
      whisperSession.stop();
    }
  }

  // ── Transcript insertion ──────────────────────────────────────────────────────

  function insertTranscript(text: string) {
    if (!text) return;
    if (appendToValue) {
      value = value ? `${value.trimEnd()} ${text}` : text;
    } else {
      value = text;
    }
  }

  // ── ARIA label ────────────────────────────────────────────────────────────────

  const ariaLabel = $derived(
    isRecording
      ? 'Stop recording'
      : isTranscribing
        ? 'Transcribing…'
        : 'Start voice input',
  );
</script>

<div class="relative inline-flex items-center">
  <!-- Pulsing ring (recording indicator) -->
  {#if isRecording}
    <span
      class="pointer-events-none absolute inset-0 rounded-full animate-ping bg-destructive/30"
      style:opacity={0.3 + audioLevel * 0.7}
      aria-hidden="true"
    ></span>
  {/if}

  <button
    type="button"
    {disabled}
    aria-label={ariaLabel}
    aria-pressed={isRecording}
    class={cn(
      'relative flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
      isRecording
        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        : isTranscribing
          ? 'bg-muted text-muted-foreground cursor-wait'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
      className,
    )}
    onclick={handleClick}
  >
    {#if isTranscribing}
      <!-- Spinner -->
      <svg
        class="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    {:else if isRecording}
      <!-- Stop square -->
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    {:else}
      <!-- Mic icon -->
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    {/if}
  </button>
</div>

<!-- Live transcript overlay -->
{#if (isRecording || isTranscribing) && (finalText || interimText)}
  <div
    class="mt-1 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm leading-relaxed"
    aria-live="polite"
    aria-atomic="false"
  >
    {#if finalText}
      <span class="text-foreground">{finalText}</span>
    {/if}
    {#if interimText}
      <span class="text-muted-foreground italic"> {interimText}</span>
    {/if}
  </div>
{/if}

<!-- Review-before-saving prompt -->
{#if showReview}
  <p class="mt-1 text-xs text-amber-600 dark:text-amber-400" role="alert">
    Low-confidence transcript — review before saving.
  </p>
{/if}

<!-- Error message -->
{#if status === 'error' && errorMsg}
  <p class="mt-1 text-xs text-destructive" role="alert">{errorMsg}</p>
{/if}
