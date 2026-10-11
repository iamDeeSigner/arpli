<!--
  Empty state. Wraps the EmptyState pattern from Intent's kit with Arpli's string API:
    <EmptyState title="..." description="..." icon={SomePhosphorIcon}>
      {#snippet actions()}<Button>...</Button>{/snippet}
    </EmptyState>
-->
<script lang="ts">
  import { EmptyState } from '$lib/components/patterns/screen';
  import PlusCircleIcon from 'phosphor-svelte/lib/PlusCircleIcon';
  import type { Component, Snippet } from 'svelte';

  let {
    title,
    description = null,
    icon: Icon = PlusCircleIcon,
    actions,
  }: {
    title: string;
    description?: string | null;
    icon?: Component;
    actions?: Snippet;
  } = $props();
</script>

{#snippet titleSnippet()}{title}{/snippet}
{#snippet descriptionSnippet()}{description}{/snippet}
{#snippet iconSnippet()}<Icon class="size-6" aria-hidden="true" />{/snippet}

<EmptyState
  title={titleSnippet}
  description={description ? descriptionSnippet : undefined}
  icon={iconSnippet}
  {actions}
  emphasis="prominent"
/>
