<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import {
    applicationApi,
    opportunityApi,
  } from '$lib/ipc/client';
  import type { Application, ApplicationStatus, Opportunity } from '@arpli/shared';

  let applications = $state<Application[]>([]);
  let opportunitiesById = $state<Record<string, Opportunity>>({});
  let loading = $state(true);
  let loadError = $state<string | null>(null);

  async function load() {
    loading = true;
    loadError = null;
    try {
      const [appsRes, oppsRes] = await Promise.all([
        applicationApi.list(),
        opportunityApi.list(),
      ]);
      applications = appsRes.applications;
      opportunitiesById = Object.fromEntries(oppsRes.opportunities.map((o) => [o.id, o]));
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  onMount(load);

  const STATUS_LABEL: Record<ApplicationStatus, string> = {
    discovered: 'Discovered',
    qualifying: 'Qualifying',
    drafting: 'Drafting',
    reviewing: 'Reviewing',
    submitted: 'Submitted',
    awaiting: 'Awaiting',
    won: 'Won',
    rejected: 'Rejected',
    waitlisted: 'Waitlisted',
    withdrew: 'Withdrew',
  };

  async function openApplication(id: string) {
    await goto(`/applications/${id}`);
  }

  async function deleteApplication(id: string) {
    if (!confirm('Delete this application and all its drafts? This cannot be undone.')) return;
    try {
      await applicationApi.delete(id);
      await load();
    } catch {
      // retryable — ignore
    }
  }
</script>

<TopBar title="Applications" subtitle="What you've started, what you've sent">
  {#snippet actions()}
    <Button size="sm" href="/opportunities" variant="secondary">Pick an opportunity</Button>
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
        <Button variant="secondary" size="sm" onclick={load}>Try again</Button>
      </div>
    </Card>
  {:else if applications.length === 0}
    <EmptyState
      title="Start an application to track it here"
      description="Pick an opportunity and Arpli will draft its questions grounded in your profile."
    >
      {#snippet actions()}
        <Button href="/opportunities" variant="secondary">Pick an opportunity</Button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each applications as app (app.id)}
        {@const opp = opportunitiesById[app.opportunityId]}
        <Card padded={false} class="flex flex-col gap-0 overflow-hidden">
          <button
            class="flex-1 p-5 text-left transition hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
            onclick={() => openApplication(app.id)}
          >
            <div class="flex items-start justify-between gap-2">
              <span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {STATUS_LABEL[app.status]}
              </span>
              {#if opp?.deadline}
                <span class="text-xs text-muted-foreground">Due {opp.deadline}</span>
              {/if}
            </div>
            <h3 class="mt-3 text-sm font-semibold leading-snug">
              {opp?.title ?? '(opportunity not found)'}
            </h3>
            {#if opp?.organization}
              <p class="mt-1 text-sm text-muted-foreground">{opp.organization}</p>
            {/if}
            {#if app.notes}
              <p class="mt-2 line-clamp-3 text-xs text-muted-foreground">{app.notes}</p>
            {/if}
          </button>
          <div class="flex items-center justify-between gap-2 border-t px-5 py-3">
            <span class="text-xs text-muted-foreground">
              Started {new Date(app.createdAt).toLocaleDateString()}
            </span>
            <div class="flex gap-2">
              <Button size="sm" variant="ghost" onclick={() => openApplication(app.id)}>Open</Button>
              <Button size="sm" variant="ghost" onclick={() => deleteApplication(app.id)}>Delete</Button>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>
