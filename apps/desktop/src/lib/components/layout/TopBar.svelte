<!--
  TopBar — persistent page header with title, optional subtitle, and action slot.
  Consumers pass actions using the Svelte 5 snippet API:
    <TopBar title="..." subtitle="...">
      {#snippet actions()}<Button>...</Button>{/snippet}
    </TopBar>
-->
<script lang="ts">
  let {
    title,
    subtitle = null,
    actions,
  }: {
    title: string;
    subtitle?: string | null;
    actions?: import('svelte').Snippet;
  } = $props();
</script>

<header class="flex h-topbar items-center justify-between border-b border-border bg-background px-6">
  <div class="flex flex-col">
    <h1 class="text-lg font-semibold leading-tight">{title}</h1>
    {#if subtitle}
      <p class="text-xs text-muted-foreground">{subtitle}</p>
    {/if}
  </div>

  {#if actions}
    <div class="flex items-center gap-2">
      {@render actions()}
    </div>
  {/if}
</header>
