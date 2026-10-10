<script lang="ts">
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import { theme, type ThemeMode } from '$lib/stores/theme';
  import { ai } from '$lib/ipc/client';
  import { onMount } from 'svelte';

  let providers = $state<{ id: string; displayName: string; model: string; tier: string }[]>([]);

  onMount(async () => {
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
