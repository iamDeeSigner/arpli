<!--
  Page header. Thin wrapper over the ScreenHeader pattern from Intent's kit so pages
  keep the simple string API:
    <TopBar title="..." subtitle="...">
      {#snippet actions()}<Button>...</Button>{/snippet}
    </TopBar>
-->
<script lang="ts">
  import { ScreenHeader } from '$lib/components/patterns/screen';
  import type { Snippet } from 'svelte';

  let {
    title,
    subtitle = null,
    actions,
  }: {
    title: string;
    subtitle?: string | null;
    actions?: Snippet;
  } = $props();
</script>

{#snippet titleSnippet()}{title}{/snippet}
{#snippet descriptionSnippet()}{subtitle}{/snippet}

<ScreenHeader
  class="app-drag-region"
  title={titleSnippet}
  description={subtitle ? descriptionSnippet : undefined}
  {actions}
/>
