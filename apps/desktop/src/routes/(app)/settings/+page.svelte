<script lang="ts">
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import { ScreenBody } from '$lib/components/patterns/screen';
  import { SettingsSection } from '$lib/components/ui/settings-section';
  import { SettingsFieldRow } from '$lib/components/ui/settings-field-row';
  import { Switch } from '$lib/components/ui/switch';
  import { Badge } from '$lib/components/ui/badge';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { slide } from '$lib/motion';
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

  function setTheme(value: string) {
    // Single-select toggle groups emit '' when the active item is clicked again;
    // keep the current theme in that case.
    if (themes.some((t) => t.value === value)) theme.set(value as ThemeMode);
  }
</script>

<TopBar title="Settings" subtitle="Preferences and integrations" />

<ScreenBody>
  <div class="flex max-w-2xl flex-col gap-8">
    <!-- Appearance -->
    <SettingsSection
      id="settings-appearance"
      title="Appearance"
      description="Choose how Arpli looks on this device."
    >
      <SettingsFieldRow id="settings-theme" label="Theme">
        {#snippet control({ labelId })}
          <ToggleGroup.Root
            type="single"
            value={$theme}
            onValueChange={setTheme}
            aria-labelledby={labelId}
          >
            {#each themes as t (t.value)}
              <ToggleGroup.Item value={t.value}>{t.label}</ToggleGroup.Item>
            {/each}
          </ToggleGroup.Root>
        {/snippet}
      </SettingsFieldRow>
    </SettingsSection>

    <!-- AI providers -->
    <SettingsSection
      id="settings-providers"
      title="AI Providers"
      description="Providers configured in the Arpli daemon. Manage API keys in your environment or through the onboarding flow."
    >
      {#if providers.length === 0}
        <p class="type-body py-3 text-muted-foreground">
          No providers detected — is the daemon running?
        </p>
      {:else}
        {#each providers as p (p.id)}
          <SettingsFieldRow id={`settings-provider-${p.id}`} label={p.displayName} description={p.model}>
            {#snippet control()}
              <Badge variant="dot" color="green">{p.tier}</Badge>
            {/snippet}
          </SettingsFieldRow>
        {/each}
      {/if}
    </SettingsSection>

    <!-- Voice input -->
    <SettingsSection
      id="settings-voice"
      title="Voice Input"
      description="Dictate into profile fields and answer boxes using your microphone."
    >
      {#if !speechSupported && !whisperAvailable}
        <p class="type-body py-3 text-muted-foreground">
          Speech recognition is not available in this environment.
        </p>
      {:else}
        <SettingsFieldRow
          id="settings-voice-enabled"
          label="Enable voice input"
          description="Show the mic button in profile and answer fields."
          htmlFor="settings-voice-enabled-switch"
        >
          {#snippet control({ descriptionId })}
            <Switch
              id="settings-voice-enabled-switch"
              ariaLabel="Enable voice input"
              ariaDescribedby={descriptionId}
              checked={$voiceSettings.enabled}
              onCheckedChange={() => voiceSettings.toggle()}
            />
          {/snippet}
        </SettingsFieldRow>

        {#if $voiceSettings.enabled}
          <div transition:slide={{ tier: 'fast' }}>
            <SettingsFieldRow
              id="settings-voice-whisper"
              label="Use Groq Whisper for higher accuracy"
              htmlFor="settings-voice-whisper-switch"
              disabled={!whisperAvailable}
            >
              {#snippet descriptionContent()}
                {#if whisperAvailable}
                  Records audio and sends it to Groq for transcription. More accurate than
                  browser speech recognition.
                {:else}
                  Add a Groq API key under AI Providers to enable this option.
                {/if}
              {/snippet}
              {#snippet control({ descriptionId })}
                <Switch
                  id="settings-voice-whisper-switch"
                  ariaLabel="Use Groq Whisper for higher accuracy"
                  ariaDescribedby={descriptionId}
                  checked={$voiceSettings.useWhisper && whisperAvailable}
                  disabled={!whisperAvailable}
                  onCheckedChange={() => voiceSettings.toggleWhisper()}
                />
              {/snippet}
            </SettingsFieldRow>
          </div>
        {/if}
      {/if}
    </SettingsSection>

    <!-- Data -->
    <SettingsSection
      id="settings-data"
      title="Data"
      description="All data is stored locally on this machine. No account required."
    >
      <SettingsFieldRow id="settings-data-storage" label="Storage">
        <span class="type-code text-foreground">~/.arpli/</span>
      </SettingsFieldRow>
      <SettingsFieldRow id="settings-data-version" label="Version">
        <span class="type-body text-foreground">v0.1.0 (Phase 1)</span>
      </SettingsFieldRow>
    </SettingsSection>
  </div>
</ScreenBody>
