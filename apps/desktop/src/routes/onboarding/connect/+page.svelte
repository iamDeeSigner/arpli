<!--
  Onboarding Step 2: Connect AI.
  Detects a local Ollama instance; also lets users enter an API key for cloud providers.
  Persists the chosen provider + model to the onboarding store, then routes to Profile.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { ai } from '$lib/ipc/client';
  import { onboarding } from '$lib/stores/onboarding';
  import type { OllamaProbe } from '$lib/ipc/client';

  type Step = 'detecting' | 'ollama' | 'api-key' | 'manual';

  let step = $state<Step>('detecting');
  let ollamaProbe = $state<OllamaProbe | null>(null);
  let selectedModel = $state('');
  let apiKeyProvider = $state<'groq' | 'openai' | 'anthropic' | 'google'>('groq');
  let apiKey = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  const API_PROVIDERS = [
    { id: 'groq' as const, name: 'Groq (fast, free tier)' },
    { id: 'openai' as const, name: 'OpenAI' },
    { id: 'anthropic' as const, name: 'Anthropic' },
    { id: 'google' as const, name: 'Google Gemini' },
  ];

  onMount(async () => {
    try {
      const probe = await ai.probeOllama();
      ollamaProbe = probe;
      if (probe.available && probe.models.length > 0) {
        selectedModel = probe.models[0].name;
        step = 'ollama';
      } else {
        step = 'api-key';
      }
    } catch {
      step = 'api-key';
    }
  });

  async function continueWithOllama() {
    saving = true;
    error = null;
    try {
      onboarding.patch({ aiProvider: 'ollama', aiModel: selectedModel });
      await goto('/onboarding/profile');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      saving = false;
    }
  }

  async function continueWithApiKey() {
    if (!apiKey.trim()) {
      error = 'Enter an API key to continue.';
      return;
    }
    saving = true;
    error = null;
    try {
      // In Phase 1 we store provider intent locally; the daemon will read it
      // via env vars in a later phase. For now just record the selection.
      onboarding.patch({ aiProvider: apiKeyProvider, aiModel: null });
      await goto('/onboarding/profile');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      saving = false;
    }
  }

  function skip() {
    onboarding.patch({ aiProvider: null, aiModel: null });
    goto('/onboarding/profile');
  }
</script>

<div class="flex flex-col gap-6">
  <div class="text-center">
    <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step 2 of 4</p>
    <h1 class="mt-2 text-2xl font-semibold tracking-tight">Connect your AI</h1>
    <p class="mt-1 text-sm text-muted-foreground">
      Arpli uses a local or API-backed model to help draft and refine applications.
    </p>
  </div>

  {#if step === 'detecting'}
    <div class="flex items-center justify-center gap-2 rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
      <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      Checking for Ollama…
    </div>

  {:else if step === 'ollama'}
    <div class="flex flex-col gap-4">
      <div class="rounded-md border border-border bg-card p-4">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-primary" aria-hidden="true"></span>
          <p class="text-sm font-medium">Ollama detected</p>
        </div>
        <p class="mt-1 text-xs text-muted-foreground">{ollamaProbe?.endpoint}</p>
      </div>

      {#if ollamaProbe && ollamaProbe.models.length > 0}
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium" for="model-select">Model</label>
          <select
            id="model-select"
            bind:value={selectedModel}
            class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {#each ollamaProbe.models as model}
              <option value={model.name}>{model.name}</option>
            {/each}
          </select>
        </div>
      {/if}

      <Button onclick={continueWithOllama} disabled={saving} size="lg" class="w-full">
        {saving ? 'Saving…' : 'Use Ollama'}
      </Button>

      <button
        class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        onclick={() => (step = 'api-key')}
      >
        Use a cloud provider instead
      </button>
    </div>

  {:else if step === 'api-key'}
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" for="provider-select">Provider</label>
        <select
          id="provider-select"
          bind:value={apiKeyProvider}
          class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {#each API_PROVIDERS as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium" for="api-key-input">API key</label>
        <Input
          id="api-key-input"
          type="password"
          bind:value={apiKey}
          placeholder="sk-..."
          autocomplete="off"
        />
        <p class="text-xs text-muted-foreground">
          Stored only in this device's process environment — never sent anywhere.
        </p>
      </div>

      {#if ollamaProbe?.available}
        <button
          class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors text-left"
          onclick={() => (step = 'ollama')}
        >
          ← Back to Ollama
        </button>
      {/if}

      <Button onclick={continueWithApiKey} disabled={saving} size="lg" class="w-full">
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  {/if}

  {#if error}
    <p class="text-sm text-danger">{error}</p>
  {/if}

  <button
    class="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
    onclick={skip}
  >
    Skip for now — I'll add a provider later
  </button>
</div>
