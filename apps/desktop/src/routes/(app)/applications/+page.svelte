<script lang="ts">
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<TopBar title="Applications" subtitle="What you've started, what you've sent">
  {#snippet actions()}
    <Button size="sm" disabled>Start an application</Button>
  {/snippet}
</TopBar>

<div class="flex-1 overflow-auto p-6">
  <EmptyState
    title="Start an application to track it here"
    description="Each application links back to its opportunity and keeps your drafts, versions, and status."
  >
    {#snippet actions()}
      <Button href="/opportunities" variant="secondary">Pick an opportunity</Button>
    {/snippet}
  </EmptyState>
</div>
