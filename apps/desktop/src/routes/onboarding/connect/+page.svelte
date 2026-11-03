<!--
  Onboarding step 2: connect AI.
  Looks first, asks second: shows what is already on this Mac (a signed-in
  Claude Code, a running Ollama), says plainly where text goes for each
  option, and saves the choice in the engine so drafting works straight away.
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
  import { ai, type AiDetectResult, type OllamaModelInfo } from '$lib/ipc/client';
  import { onboarding, type OnboardingState } from '$lib/stores/onboarding';

  type KeyProvider = 'groq' | 'openai' | 'anthropic' | 'google';

  // Defaults mirror the engine's provider registry (packages/daemon/src/ai/providers/registry.ts).
  const KEY_PROVIDERS: { value: KeyProvider; label: string; model: string; company: string }[] = [
    { value: 'groq', label: 'Groq (has a free tier)', model: 'llama-3.1-8b-instant', company: 'Groq' },
    { value: 'openai', label: 'OpenAI', model: 'gpt-4o-mini', company: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic', model: 'claude-3-5-sonnet-latest', company: 'Anthropic' },
    { value: 'google', label: 'Google AI Studio', model: 'gemini-1.5-flash', company: 'Google' },
  ];

  let detecting = $state(true);
  let detected = $state<AiDetectResult | null>(null);
  let ollamaModels = $state<OllamaModelInfo[]>([]);
  let ollamaModel = $state('');
  let showKey = $state(false);
  let keyProvider = $state<KeyProvider>('groq');
  let apiKey = $state('');
  let saving = $state<string | null>(null);
  let error = $state<string | null>(null);

  const claude = $derived(detected?.claudeCode ?? null);
  const ollamaRunning = $derived(
    (detected?.runners ?? []).some((runner) => runner.kind === 'ollama' && runner.running),
  );
  const modelItems = $derived(
    ollamaModels.map((m) => ({ value: m.name, label: `${m.name} · ${formatSize(m.size)}` })),
  );
  const keyCompany = $derived(KEY_PROVIDERS.find((p) => p.value === keyProvider)?.company ?? '');

  function formatSize(bytes?: number): string {
    if (!bytes) return 'size unknown';
    return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  }

  async function detect() {
    detecting = true;
    error = null;
    try {
      detected = await ai.detect();
      if (detected.runners.some((r) => r.kind === 'ollama' && r.running)) {
        const models = await ai.ollamaModels();
        // Smallest first. Very large models can be too slow for this Mac,
        // so preselect the smallest one that is likely to write well (3 GB+).
        ollamaModels = [...models].sort((a, b) => (a.size ?? 0) - (b.size ?? 0));
        ollamaModel =
          ollamaModels.find((m) => (m.size ?? 0) >= 3_000_000_000)?.name ?? ollamaModels[0]?.name ?? '';
      }
    } catch (e) {
      error = `Arpli's engine isn't answering yet. Make sure Arpli is running, then check again. (${
        e instanceof Error ? e.message : String(e)
      })`;
    } finally {
      detecting = false;
    }
  }

  onMount(detect);

  async function connect(
    kind: NonNullable<OnboardingState['aiProvider']>,
    model: string,
    apiKeyValue: string | null = null,
  ) {
    saving = kind;
    error = null;
    try {
      await ai.saveProvider({ kind, model, apiKey: apiKeyValue, setActive: true });
      onboarding.patch({ aiProvider: kind, aiModel: model });
      await goto('/onboarding/profile');
    } catch (e) {
      error = `That didn't save. ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      saving = null;
    }
  }

  function connectKey() {
    if (!apiKey.trim()) {
      error = 'Paste your key to continue.';
      return;
    }
    const provider = KEY_PROVIDERS.find((p) => p.value === keyProvider);
    if (provider) void connect(provider.value, provider.model, apiKey.trim());
  }

  function skip() {
    onboarding.patch({ aiProvider: null, aiModel: null });
    void goto('/onboarding/profile');
  }
</script>

<div class="flex flex-col gap-6" in:fly={{ tier: 'moderate' }}>
  <div class="flex flex-col gap-2 text-center">
    <p class="type-caption text-muted-foreground">Step 2 of 4</p>
    <h1 class="type-display">Connect your AI</h1>
    <p class="type-body text-muted-foreground">
      Arpli drafts with an AI you already have. Pick one. You can change it later in Settings.
    </p>
  </div>

  {#if detecting}
    <Card.Root>
      <Card.Content
        class="type-caption flex items-center justify-center gap-2 py-6 text-muted-foreground"
      >
        <Spinner size={16} />
        Looking at what's on this Mac…
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="flex flex-col gap-3" in:fade={{ tier: 'fast' }}>
      {#if claude?.loggedIn}
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="type-body">Use your Claude</Card.Title>
            <Card.Description>
              Claude Code is signed in on this Mac{claude.plan ? ` (${claude.plan} plan)` : ''}.
              Your drafts go to Anthropic under your own account and use your plan's allowance.
              Arpli runs Claude with its tools switched off, so it can't touch your files.
            </Card.Description>
          </Card.Header>
          <Card.Content class="pt-0">
            <Button
              variant="primary"
              class="w-full"
              loading={saving === 'claude-code'}
              disabled={saving !== null}
              onclick={() => connect('claude-code', 'default')}
            >
              Use Claude
            </Button>
          </Card.Content>
        </Card.Root>
      {:else if claude?.found}
        <Card.Root>
          <Card.Header>
            <Card.Title class="type-body">Claude Code isn't signed in</Card.Title>
            <Card.Description>
              Open Terminal, type <span class="type-code">claude</span>, sign in, then check again.
            </Card.Description>
          </Card.Header>
          <Card.Content class="pt-0">
            <Button variant="secondary" size="sm" onclick={detect}>Check again</Button>
          </Card.Content>
        </Card.Root>
      {/if}

      {#if ollamaRunning && ollamaModels.length > 0}
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="type-body">Keep it on this Mac</Card.Title>
            <Card.Description>
              Ollama is running. Nothing leaves your Mac. Bigger models write better but can be
              very slow; if a draft takes more than a minute, pick a smaller one.
            </Card.Description>
          </Card.Header>
          <Card.Content class="flex flex-col gap-3 pt-0">
            <div class="flex flex-col gap-1.5">
              <Label for="ollama-model">Model</Label>
              <Select.Root bind:value={ollamaModel} items={modelItems}>
                <Select.Trigger id="ollama-model">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {#each modelItems as item (item.value)}
                    <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
            <Button
              variant={claude?.loggedIn ? 'secondary' : 'primary'}
              class="w-full"
              loading={saving === 'ollama'}
              disabled={saving !== null || !ollamaModel}
              onclick={() => connect('ollama', ollamaModel)}
            >
              Use this model
            </Button>
          </Card.Content>
        </Card.Root>
      {/if}

      {#if !claude?.loggedIn && !(ollamaRunning && ollamaModels.length > 0)}
        <p class="type-body text-muted-foreground">
          No AI was found on this Mac. You can use a key from an AI company below, or install
          Ollama from ollama.com for a free, private option.
        </p>
      {/if}

      {#if showKey}
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="type-body">Use an API key</Card.Title>
          </Card.Header>
          <Card.Content class="flex flex-col gap-3 pt-0">
            <div class="flex flex-col gap-1.5">
              <Label for="key-provider">Company</Label>
              <Select.Root
                bind:value={
                  () => keyProvider,
                  (value: string) => {
                    const match = KEY_PROVIDERS.find((p) => p.value === value);
                    if (match) keyProvider = match.value;
                  }
                }
                items={KEY_PROVIDERS.map((p) => ({ value: p.value, label: p.label }))}
              >
                <Select.Trigger id="key-provider">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {#each KEY_PROVIDERS as p (p.value)}
                    <Select.Item value={p.value} label={p.label}>{p.label}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="api-key">Key</Label>
              <Input
                id="api-key"
                type="password"
                bind:value={apiKey}
                autocomplete="off"
                message={`Saved in Arpli on this Mac. It's only sent to ${keyCompany} when you draft.`}
              />
            </div>
            <Button
              variant="secondary"
              class="w-full"
              loading={saving === keyProvider}
              disabled={saving !== null}
              onclick={connectKey}
            >
              Save key
            </Button>
          </Card.Content>
        </Card.Root>
      {:else}
        <Button variant="underline" size="sm" class="self-center" onclick={() => (showKey = true)}>
          Use an API key instead
        </Button>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="type-caption text-danger" role="alert" transition:fade={{ tier: 'fast' }}>
      {error}
    </p>
  {/if}

  <Button variant="underline" size="sm" class="self-center" onclick={skip}>
    Skip for now. You can connect one later in Settings.
  </Button>
</div>
