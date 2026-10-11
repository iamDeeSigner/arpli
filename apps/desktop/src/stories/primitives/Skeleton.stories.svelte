<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Skeleton } from '$lib/components/ui/skeleton';

  const { Story } = defineMeta({
    title: 'Primitives/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
  });
</script>

<Story name="Playground">
  {#snippet template()}
    <Skeleton class="h-4 w-48" />
  {/snippet}
</Story>

<Story name="Opportunity card">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-3 rounded-(--radius-large) border border-border bg-card p-4">
      <div class="flex items-center gap-3">
        <Skeleton class="size-10 rounded-full" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton class="h-3 w-full" />
      <Skeleton class="h-3 w-5/6" />
      <div class="flex gap-2">
        <Skeleton class="h-6 w-20" />
        <Skeleton class="h-6 w-16" />
      </div>
    </div>
  {/snippet}
</Story>

<Story name="List">
  {#snippet template()}
    <div class="flex w-80 flex-col gap-2">
      {#each [1, 2, 3, 4] as row (row)}
        <div class="flex items-center justify-between gap-4">
          <Skeleton class="h-4 flex-1" />
          <Skeleton class="h-4 w-14" />
        </div>
      {/each}
    </div>
  {/snippet}
</Story>
