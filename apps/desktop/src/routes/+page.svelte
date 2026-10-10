<script lang="ts">
  import { onMount } from 'svelte';
  import type { DaemonHealth } from '@arpli/shared';
  import Card from '$lib/components/ui/Card.svelte';

  let health: DaemonHealth | null = null;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('http://127.0.0.1:4848/health');
      health = (await res.json()) as DaemonHealth;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  });
</script>

<main class="min-h-screen p-xl">
  <header class="mb-xl">
    <h1 class="text-3xl font-semibold">Arpli</h1>
    <p class="text-muted">Local-first application intelligence hub.</p>
  </header>

  <Card>
    <h2 class="text-lg font-medium mb-sm">Daemon</h2>
    {#if health}
      <dl class="grid grid-cols-2 gap-sm text-sm">
        <dt class="text-muted">Status</dt>
        <dd>{health.ok ? 'ok' : 'down'}</dd>
        <dt class="text-muted">Version</dt>
        <dd>{health.version}</dd>
        <dt class="text-muted">Database</dt>
        <dd>{health.dbReady ? 'ready' : 'initializing'}</dd>
      </dl>
    {:else if error}
      <p class="text-sm text-muted">Daemon not reachable: {error}</p>
    {:else}
      <p class="text-sm text-muted">Checking daemon…</p>
    {/if}
  </Card>
</main>
