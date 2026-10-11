<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShortcutChip } from '$lib/components/ui/kbd';

  const { Story } = defineMeta({
    title: 'Primitives/ShortcutChip',
    component: ShortcutChip,
    tags: ['autodocs'],
  });
</script>

<Story name="Playground">
  <ShortcutChip>⌘K</ShortcutChip>
</Story>

<Story name="In context">
  <div class="flex w-72 flex-col gap-2">
    {#each [['Search opportunities', '⌘K'], ['New application', '⌘N'], ['Save draft', '⌘S'], ['Toggle sidebar', '⌘\\']] as [label, keys] (label)}
      <div class="flex items-center justify-between rounded-(--radius-medium) bg-card px-3 py-2">
        <span class="type-body">{label}</span>
        <ShortcutChip>{keys}</ShortcutChip>
      </div>
    {/each}
  </div>
</Story>
