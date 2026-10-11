<!--
  Onboarding Step 2: Connect AI.
  Detects a local Ollama instance; also lets users enter an API key for cloud providers.
  Persists the chosen provider + model to the onboarding store, then routes to Profile.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select } from '$lib/components/ui/select';
  import { Spinner } from '$lib/components/ui/indicators';
  import { fade, fly } from '$lib/motion';
  import { ai } from '$lib/ipc/client';
  import { onboarding } from '$lib/stores/onboarding';
  import type { OllamaProbe } from '$lib/ipc/client';
  import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';

  type Step = 'detecting' | 'ollama' | 'api-key' | 'manual';
  type ApiProvider = 'groq' | 'openai' | 'anthropic' | 'google';

  let step = $state<Step>('detecting');
  let ollamaProbe = $state<OllamaProbe | null>(null);
  let selectedModel = $state('');
  let apiKeyProvider = $state<ApiProvider>('groq');
  let apiKey = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  const API_PROVIDERS = [
    { id: 'groq' as const, name: 'Groq (fast, free tier)' },
    { id: 'openai' as const, name: 'OpenAI' },
    { id: 'anthropic' as const, name: 'Anthropic' },
    { id: 'google' as const, name: 'Google Gemini' },
  ];

  const providerItems = API_PROVIDERS.map((p) => ({ value: p.id, label: p.name }));
  const modelItems = $derived(
    (ollamaProbe?.models ?? []).map((model) => ({ value: model.name, label: model.name })),
  );

  function isApiProvider(value: string): value is ApiProvider {
    return API_PROVIDERS.some((p) => p.id === value);
  }

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

<div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
  <div class="flex flex-col gap-2 text-center">
    <p class="type-caption text-muted-foreground">Step 2 of 4</p>
    <h1 class="type-display">Connect your AI</h1>
    <p class="type-body text-muted-foreground">
      Arpli uses a local or API-backed model to help draft and refine applications.
    </p>
  </div>

  {#if step === 'detecting'}
    <Card.Root>
      <Card.Content
        class="type-caption flex items-center justify-center gap-2 py-6 text-muted-foreground"
      >
        <Spinner size={16} />
        Checking for Ollama…
      </Card.Content>
    </Card.Root>
  {:else if step === 'ollama'}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <Card.Root>
        <Card.Header class="pb-4">
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-primary" aria-hidden="true"></span>
            <Card.Title class="type-body">Ollama detected</Card.Title>
          </div>
          <Card.Description>{ollamaProbe?.endpoint}</Card.Description>
        </Card.Header>
      </Card.Root>

      {#if ollamaProbe && ollamaProbe.models.length > 0}
        <div class="flex flex-col gap-1.5">
          <Label for="model-select">Model</Label>
          <Select.Root bind:value={selectedModel} items={modelItems}>
            <Select.Trigger id="model-select">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {#each modelItems as model (model.value)}
                <Select.Item value={model.value} label={model.label}>{model.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      {/if}

      <Button
        variant="primary"
        onclick={continueWithOllama}
        disabled={saving}
        loading={saving}
        size="lg"
        class="w-full"
      >
        {saving ? 'Saving…' : 'Use Ollama'}
      </Button>

      <Button variant="underline" size="sm" class="self-center" onclick={() => (step = 'api-key')}>
        Use a cloud provider instead
      </Button>
    </div>
  {:else if step === 'api-key'}
    <div class="flex flex-col gap-4" in:fly={{ tier: 'moderate' }}>
      <div class="flex flex-col gap-1.5">
        <Label for="provider-select">Provider</Label>
        <Select.Root
          bind:value={
            () => apiKeyProvider,
            (value: string) => {
              if (isApiProvider(value)) apiKeyProvider = value;
            }
          }
          items={providerItems}
        >
          <Select.Trigger id="provider-select">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {#each providerItems as p (p.value)}
              <Select.Item value={p.value} label={p.label}>{p.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="api-key-input">API key</Label>
        <Input
          id="api-key-input"
          type="password"
          bind:value={apiKey}
          placeholder="sk-..."
          autocomplete="off"
          message="Stored only in this device's process environment — never sent anywhere."
        />
      </div>

      {#if ollamaProbe?.available}
        <Button variant="ghost" size="sm" class="self-start" onclick={() => (step = 'ollama')}>
          {#snippet leadingIcon()}<ArrowLeftIcon />{/snippet}
          Back to Ollama
        </Button>
      {/if}

      <Button
        variant="primary"
        onclick={continueWithApiKey}
        disabled={saving}
        loading={saving}
        size="lg"
        class="w-full"
      >
        {saving ? 'Saving…' : 'Continue'}
      </Button>
    </div>
  {/if}

  {#if error}
    <p class="type-caption text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
      {error}
    </p>
  {/if}

  <Button variant="underline" size="sm" class="self-center" onclick={skip}>
    Skip for now — I'll add a provider later
  </Button>
</div>
