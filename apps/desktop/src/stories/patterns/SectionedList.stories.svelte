<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ListRow, SectionedList } from '$lib/components/patterns/collection';
  import { sections } from './collection-fixtures';

  const { Story } = defineMeta({
    title: 'Patterns/SectionedList',
    component: SectionedList,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  });
</script>

<Story name="Deadlines by week">
  {#snippet template()}
    <div class="h-[360px] w-[520px] overflow-y-auto rounded-(--radius-large) border border-border bg-background">
      <SectionedList {sections} getKey={(section) => section.id}>
        {#snippet header(section)}{section.label} · {section.items.length}{/snippet}
        {#snippet children(section)}
          {#each section.items as item (item.id)}
            <ListRow>
              {#snippet title()}{item.name}{/snippet}
              {#snippet meta()}Due {item.deadline}{/snippet}
              {#snippet description()}{item.funder} · {item.amount}{/snippet}
            </ListRow>
          {/each}
        {/snippet}
      </SectionedList>
    </div>
  {/snippet}
</Story>
