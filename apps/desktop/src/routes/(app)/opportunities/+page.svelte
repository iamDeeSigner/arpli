<script lang="ts">
  import TopBar from '$lib/components/layout/TopBar.svelte';
  import EmptyState from '$lib/components/layout/EmptyState.svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<TopBar title="Opportunities" subtitle="Scholarships, grants, fellowships, accelerators, jobs">
  {#snippet actions()}
    <Button size="sm" disabled>Add opportunity</Button>
  {/snippet}
</TopBar>

<div class="flex-1 overflow-auto p-6">
  <EmptyState
    title="Find an opportunity and paste it here"
    description="Arpli will parse it, understand the deadline and requirements, and surface which parts of your profile fit."
  >
    {#snippet actions()}
      <Button disabled>Add opportunity</Button>
    {/snippet}
  </EmptyState>
</div>
