<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import { ErrorState, LoadingState, ScreenBody } from '$lib/components/patterns/screen';
  import { Badge, type BadgeColor } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { fade, fly } from '$lib/motion';
  import { applicationApi, opportunityApi } from '$lib/ipc/client';
  import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
  import FileTextIcon from 'phosphor-svelte/lib/FileTextIcon';
  import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
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

  const STATUS_COLOR: Record<ApplicationStatus, BadgeColor> = {
    discovered: 'gray',
    qualifying: 'gray',
    drafting: 'blue',
    reviewing: 'violet',
    submitted: 'teal',
    awaiting: 'amber',
    won: 'green',
    rejected: 'red',
    waitlisted: 'orange',
    withdrew: 'gray',
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

<ScreenBody>
  {#if loading}
    <LoadingState recipe="card-grid" label="Loading applications" />
  {:else if loadError}
    {#snippet errorMessage()}
      Could not reach the daemon: {loadError}
    {/snippet}
    <ErrorState message={errorMessage} retryLabel="Try again" onRetry={load} />
  {:else if applications.length === 0}
    <div in:fade>
      <EmptyState
        title="Start an application to track it here"
        description="Pick an opportunity and Arpli will draft its questions grounded in your profile."
        icon={FileTextIcon}
      >
        {#snippet actions()}
          <Button href="/opportunities" variant="primary">Pick an opportunity</Button>
        {/snippet}
      </EmptyState>
    </div>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" in:fade>
      {#each applications as app (app.id)}
        {@const opp = opportunitiesById[app.opportunityId]}
        <div in:fly={{ tier: 'moderate' }} out:fade={{ tier: 'fast' }}>
          <Card.Root class="h-full">
            <button
              type="button"
              class="flex flex-1 flex-col gap-2 px-4 pt-4 pb-3 text-left transition-colors duration-spring-fast hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
              onclick={() => openApplication(app.id)}
            >
              <div class="flex items-start justify-between gap-2">
                <Badge color={STATUS_COLOR[app.status]} size="compact">
                  {STATUS_LABEL[app.status]}
                </Badge>
                {#if opp?.deadline}
                  <span class="type-caption text-muted-foreground">Due {opp.deadline}</span>
                {/if}
              </div>
              <Card.Title class="mt-1">
                {opp?.title ?? '(opportunity not found)'}
              </Card.Title>
              {#if opp?.organization}
                <p class="type-body text-muted-foreground">{opp.organization}</p>
              {/if}
              {#if app.notes}
                <p class="type-caption line-clamp-3 text-muted-foreground">{app.notes}</p>
              {/if}
            </button>
            <Card.Footer class="flex items-center justify-between gap-2 border-t border-border py-2">
              <span class="type-caption text-muted-foreground">
                Started {new Date(app.createdAt).toLocaleDateString()}
              </span>
              <div class="flex gap-1">
                <Button size="sm" variant="ghost" onclick={() => openApplication(app.id)}>
                  {#snippet trailingIcon()}<ArrowRightIcon />{/snippet}
                  Open
                </Button>
                <Button size="sm" variant="ghost" onclick={() => deleteApplication(app.id)}>
                  {#snippet leadingIcon()}<TrashIcon />{/snippet}
                  Delete
                </Button>
              </div>
            </Card.Footer>
          </Card.Root>
        </div>
      {/each}
    </div>
  {/if}
</ScreenBody>
