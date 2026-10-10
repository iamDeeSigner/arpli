<script lang="ts">
  import { onMount } from 'svelte';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { profileApi } from '$lib/ipc/client';
  import type { Profile } from '@arpli/shared';

  let profile = $state<Profile | null>(null);
  let loading = $state(true);
  let loadError = $state<string | null>(null);

  async function loadProfile() {
    loading = true;
    loadError = null;
    try {
      profile = await profileApi.get();
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  onMount(loadProfile);
</script>

<TopBar title="Profile" subtitle="Your permanent, growing knowledge base">
  {#snippet actions()}
    {#if profile}
      <Button variant="secondary" size="sm" onclick={loadProfile}>Refresh</Button>
    {/if}
  {/snippet}
</TopBar>

<div class="flex-1 overflow-auto p-6">
  {#if loading}
    <p class="text-sm text-muted-foreground">Loading…</p>
  {:else if loadError}
    <Card>
      <h2 class="text-base font-semibold">Could not reach the daemon</h2>
      <p class="mt-2 text-sm text-muted-foreground">{loadError}</p>
      <div class="mt-4">
        <Button variant="secondary" size="sm" onclick={loadProfile}>Try again</Button>
      </div>
    </Card>
  {:else if !profile}
    <EmptyState
      title="Your story starts here"
      description="Import a resume or LinkedIn export, or talk Arpli through your background. Everything stays on this machine."
    >
      {#snippet actions()}
        <Button href="/onboarding/profile">Import resume</Button>
        <Button href="/onboarding/profile" variant="secondary">Tell me about yourself</Button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <h2 class="text-base font-semibold">Overview</h2>
        <dl class="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt class="text-muted-foreground">Mode</dt>
          <dd>{profile.mode}</dd>
          <dt class="text-muted-foreground">Updated</dt>
          <dd>{new Date(profile.updatedAt).toLocaleDateString()}</dd>
        </dl>
        {#if profile.bio}
          <p class="mt-4 text-sm leading-relaxed">{profile.bio}</p>
        {:else}
          <p class="mt-4 text-sm text-muted-foreground">No bio yet.</p>
        {/if}
      </Card>

      <Card>
        <h2 class="text-base font-semibold">Sections</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Education, work, projects, accomplishments, and essays will land here as other
          Phase 1 features ship.
        </p>
      </Card>
    </div>
  {/if}
</div>
