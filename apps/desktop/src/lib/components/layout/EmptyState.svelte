<!--
  EmptyState — centered illustration + copy + optional CTA cluster.
  Consumers pass actions as a snippet:
    <EmptyState title="..." description="...">
      {#snippet actions()}<Button>...</Button>{/snippet}
    </EmptyState>
-->
<script lang="ts">
  let {
    title,
    description = null,
    actions,
  }: {
    title: string;
    description?: string | null;
    actions?: import('svelte').Snippet;
  } = $props();
</script>

<div
  class="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-lg border border-border bg-card p-10 text-center"
>
  <!-- Icon placeholder — designer swaps the illustration later. -->
  <div
    class="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M7 12h10" />
    </svg>
  </div>

  <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold">{title}</h2>
    {#if description}
      <p class="text-sm text-muted-foreground">{description}</p>
    {/if}
  </div>

  {#if actions}
    <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
      {@render actions()}
    </div>
  {/if}
</div>
