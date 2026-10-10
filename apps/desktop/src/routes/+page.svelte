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

<main class="min-h-screen bg-background text-foreground p-10">
  <header class="mb-10">
    <h1 class="text-3xl font-semibold">Arpli</h1>
    <p class="text-muted-foreground">Local-first application intelligence hub.</p>
  </header>

  <Card>
    <h2 class="text-lg font-medium mb-2">Daemon</h2>
    {#if health}
      <dl class="grid grid-cols-2 gap-2 text-sm">
        <dt class="text-muted-foreground">Status</dt>
        <dd>{health.ok ? 'ok' : 'down'}</dd>
        <dt class="text-muted-foreground">Version</dt>
        <dd>{health.version}</dd>
        <dt class="text-muted-foreground">Database</dt>
        <dd>{health.dbReady ? 'ready' : 'initializing'}</dd>
      </dl>
    {:else if error}
      <p class="text-sm text-muted-foreground">Daemon not reachable: {error}</p>
    {:else}
      <p class="text-sm text-muted-foreground">Checking daemon…</p>
    {/if}
  </Card>
</main>
