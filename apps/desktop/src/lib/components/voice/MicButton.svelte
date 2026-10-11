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
  import { Button } from '$lib/components/ui/button';
  import { fade, slide } from '$lib/motion';
  import MicrophoneIcon from 'phosphor-svelte/lib/MicrophoneIcon';
  import StopIcon from 'phosphor-svelte/lib/StopIcon';
  import CircleNotchIcon from 'phosphor-svelte/lib/CircleNotchIcon';
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
      class="pointer-events-none absolute inset-0 animate-ping rounded-full bg-danger/30"
      style:opacity={0.3 + audioLevel * 0.7}
      aria-hidden="true"
      transition:fade={{ tier: 'fast' }}
    ></span>
  {/if}

  <Button
    variant={isRecording ? 'destructive' : isTranscribing ? 'ghost' : 'secondary'}
    size="icon-sm"
    iconOnly
    {disabled}
    aria-label={ariaLabel}
    aria-pressed={isRecording}
    tooltip={ariaLabel}
    class={cn('relative rounded-full', isTranscribing && 'cursor-wait text-muted-foreground', className)}
    onclick={handleClick}
  >
    {#if isTranscribing}
      <CircleNotchIcon class="animate-spin" aria-hidden="true" />
    {:else if isRecording}
      <StopIcon weight="fill" aria-hidden="true" />
    {:else}
      <MicrophoneIcon aria-hidden="true" />
    {/if}
  </Button>
</div>

<!-- Live transcript overlay -->
{#if (isRecording || isTranscribing) && (finalText || interimText)}
  <div
    class="type-body mt-1 rounded-(--radius-medium) border border-border bg-muted px-3 py-2"
    aria-live="polite"
    aria-atomic="false"
    transition:slide={{ tier: 'fast' }}
  >
    {#if finalText}
      <span class="text-foreground">{finalText}</span>
    {/if}
    {#if interimText}
      <span class="italic text-muted-foreground"> {interimText}</span>
    {/if}
  </div>
{/if}

<!-- Review-before-saving prompt -->
{#if showReview}
  <p class="type-caption mt-1 text-warning-ink" role="alert" transition:fade={{ tier: 'fast' }}>
    Low-confidence transcript — review before saving.
  </p>
{/if}

<!-- Error message -->
{#if status === 'error' && errorMsg}
  <p class="type-caption mt-1 text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
    {errorMsg}
  </p>
{/if}
