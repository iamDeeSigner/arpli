<script lang="ts">
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import { theme, type ThemeMode } from '$lib/stores/theme';
  import { ai } from '$lib/ipc/client';
  import { voiceSettings } from '$lib/voice/settings';
  import { checkWhisperAvailability, isSpeechRecognitionSupported } from '$lib/voice';
  import { onMount } from 'svelte';

  let providers = $state<{ id: string; displayName: string; model: string; tier: string }[]>([]);
  let whisperAvailable = $state(false);
  let speechSupported = $state(false);

  onMount(async () => {
    speechSupported = isSpeechRecognitionSupported();
    try {
      const { providers: list } = await ai.listProviders();
      providers = list.map((p) => ({
        id: p.kind,
        displayName: p.kind.charAt(0).toUpperCase() + p.kind.slice(1),
        model: p.model,
        tier: p.tier,
      }));
    } catch {
      // Daemon may not be available yet — graceful fallback.
    }
    const { available } = await checkWhisperAvailability();
    whisperAvailable = available;
  });

  const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];
</script>

<TopBar title="Settings" subtitle="Preferences and integrations" />

<div class="flex-1 overflow-auto p-6">
  <div class="grid max-w-2xl grid-cols-1 gap-4">

    <!-- Appearance -->
    <Card>
      <h2 class="text-base font-semibold">Appearance</h2>
      <p class="mt-1 text-sm text-muted-foreground">Choose how Arpli looks on this device.</p>

      <div class="mt-4 flex gap-2">
        {#each themes as t}
          <button
            class="flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
            class:bg-primary={$theme === t.value}
            class:text-primary-foreground={$theme === t.value}
            class:border-primary={$theme === t.value}
            class:border-border={$theme !== t.value}
            class:hover:bg-muted={$theme !== t.value}
            onclick={() => theme.set(t.value)}
          >
            {t.label}
          </button>
        {/each}
      </div>
    </Card>

    <!-- AI providers -->
    <Card>
      <h2 class="text-base font-semibold">AI Providers</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        Providers configured in the Arpli daemon. Manage API keys in your environment or
        through the onboarding flow.
      </p>

      {#if providers.length === 0}
        <p class="mt-4 text-sm text-muted-foreground">No providers detected — is the daemon running?</p>
      {:else}
        <ul class="mt-4 flex flex-col gap-2">
          {#each providers as p}
            <li class="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-primary" aria-hidden="true"></span>
                <span class="font-medium">{p.displayName}</span>
                <span class="text-muted-foreground">{p.model}</span>
              </div>
              <span class="text-xs text-muted-foreground">{p.tier}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </Card>

    <!-- Voice input -->
    <Card>
      <h2 class="text-base font-semibold">Voice Input</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        Dictate into profile fields and answer boxes using your microphone.
      </p>

      {#if !speechSupported && !whisperAvailable}
        <p class="mt-3 text-sm text-muted-foreground">
          Speech recognition is not available in this environment.
        </p>
      {:else}
        <!-- Master toggle -->
        <label class="mt-4 flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium">Enable voice input</p>
            <p class="text-xs text-muted-foreground">
              Show the mic button in profile and answer fields.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-label="Enable voice input"
            aria-checked={$voiceSettings.enabled}
            class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            class:bg-primary={$voiceSettings.enabled}
            class:bg-muted={!$voiceSettings.enabled}
            onclick={() => voiceSettings.toggle()}
          >
            <span
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform"
              class:translate-x-4={$voiceSettings.enabled}
              class:translate-x-0={!$voiceSettings.enabled}
            ></span>
          </button>
        </label>

        <!-- Whisper sub-option -->
        {#if $voiceSettings.enabled}
          <label
            class="mt-3 flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2"
            class:opacity-50={!whisperAvailable}
          >
            <div>
              <p class="text-sm font-medium">
                Use Groq Whisper for higher accuracy
              </p>
              <p class="text-xs text-muted-foreground">
                {#if whisperAvailable}
                  Records audio and sends it to Groq for transcription. More accurate than
                  browser speech recognition.
                {:else}
                  Add a Groq API key under AI Providers to enable this option.
                {/if}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="Use Groq Whisper for higher accuracy"
              aria-checked={$voiceSettings.useWhisper && whisperAvailable}
              disabled={!whisperAvailable}
              class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
              class:bg-primary={$voiceSettings.useWhisper && whisperAvailable}
              class:bg-muted={!($voiceSettings.useWhisper && whisperAvailable)}
              onclick={() => voiceSettings.toggleWhisper()}
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform"
                class:translate-x-4={$voiceSettings.useWhisper && whisperAvailable}
                class:translate-x-0={!($voiceSettings.useWhisper && whisperAvailable)}
              ></span>
            </button>
          </label>
        {/if}
      {/if}
    </Card>

    <!-- Data -->
    <Card>
      <h2 class="text-base font-semibold">Data</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        All data is stored locally on this machine. No account required.
      </p>
      <dl class="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt class="text-muted-foreground">Storage</dt>
        <dd>~/.arpli/</dd>
        <dt class="text-muted-foreground">Version</dt>
        <dd>v0.1.0 (Phase 1)</dd>
      </dl>
    </Card>

  </div>
</div>
